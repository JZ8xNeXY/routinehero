import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Disable body parsing for webhook
export const runtime = 'nodejs';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key-for-build'
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const familyId = session.metadata?.family_id;

        if (!familyId) {
          console.error('No family_id in session metadata');
          break;
        }

        // Update family to premium plan
        const { error: updateError } = await supabaseAdmin
          .from('families')
          .update({
            plan: 'premium',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            plan_status: 'active',
          })
          .eq('id', familyId);

        if (updateError) {
          console.error('Failed to update family plan:', updateError);
        } else {
          console.log('Family upgraded to premium:', familyId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const periodEnd = (subscription as any).current_period_end;

        // Update subscription status
        const { error: updateError } = await supabaseAdmin
          .from('families')
          .update({
            plan_status: subscription.status,
            subscription_end_date: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
          })
          .eq('stripe_customer_id', customerId);

        if (updateError) {
          console.error('Failed to update subscription status:', updateError);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Downgrade to free plan
        const { error: updateError } = await supabaseAdmin
          .from('families')
          .update({
            plan: 'free',
            plan_status: 'canceled',
            subscription_end_date: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        if (updateError) {
          console.error('Failed to downgrade family:', updateError);
        } else {
          console.log('Family downgraded to free:', customerId);
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
