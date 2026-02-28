import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/stripe/server';

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

    // 2. Get user's family_id from Supabase
    const { data: familyData, error: familyError } = await supabase
      .from('families')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle() as { data: { id: string } | null; error: any };

    if (familyError || !familyData) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    // 3. Get price ID from environment or request body
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price not configured' },
        { status: 500 }
      );
    }

    // 4. Create Stripe checkout session
    const session = await createCheckoutSession({
      familyId: familyData.id,
      userId: user.id,
      priceId,
    });

    // 5. Return checkout URL
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
