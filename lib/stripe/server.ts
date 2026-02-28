import Stripe from 'stripe';

// Use a dummy key for build time if not set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
});

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession({
  familyId,
  userId,
  priceId,
}: {
  familyId: string;
  userId: string;
  priceId: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?payment=cancelled`,
    metadata: {
      family_id: familyId,
      user_id: userId,
    },
    client_reference_id: familyId,
  });

  return session;
}

/**
 * Create a Stripe Customer Portal session for subscription management
 */
export async function createPortalSession({
  customerId,
}: {
  customerId: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings/billing`,
  });

  return session;
}
