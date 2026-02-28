import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPortalSession } from '@/lib/stripe/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get user's family and Stripe customer ID
    const { data: familyData, error: familyError } = await supabase
      .from('families')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle() as { data: { stripe_customer_id: string | null } | null; error: any };

    if (familyError || !familyData || !familyData.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // 3. Create portal session
    const session = await createPortalSession({
      customerId: familyData.stripe_customer_id,
    });

    // 4. Return portal URL
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
