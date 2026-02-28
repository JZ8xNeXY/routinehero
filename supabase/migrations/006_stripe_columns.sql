-- Add Stripe-related columns to families table
ALTER TABLE public.families
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
ADD COLUMN IF NOT EXISTS plan_status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_end_date timestamptz;

-- Create index on stripe_customer_id for faster webhook lookups
CREATE INDEX IF NOT EXISTS families_stripe_customer_id_idx ON public.families(stripe_customer_id);

-- Add comment
COMMENT ON COLUMN public.families.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN public.families.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN public.families.plan_status IS 'Subscription status: active, canceled, past_due, etc.';
COMMENT ON COLUMN public.families.subscription_end_date IS 'When the current subscription period ends';
