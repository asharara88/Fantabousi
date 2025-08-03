# Stripe Integration Environment Variables

## Required Environment Variables

Add these variables to your `.env` file:

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase Configuration (if not already set)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Stripe Keys

1. **Sign up for Stripe**: Go to https://stripe.com and create an account
2. **Get Publishable Key**: In your Stripe dashboard, go to Developers > API keys
3. **Get Secret Key**: Same location as publishable key (keep this secret!)
4. **Get Webhook Secret**: After setting up webhooks endpoint

## Setting up Stripe Products

In your Stripe dashboard, create products for each subscription plan:

### Essential Plan
- **Monthly**: Create product "Essential Monthly" with price AED 199/month
- **Annual**: Create product "Essential Annual" with price AED 2,029/year

### Premium Plan
- **Monthly**: Create product "Premium Monthly" with price AED 299/month  
- **Annual**: Create product "Premium Annual" with price AED 3,049/year

### Update Price IDs

After creating products, update the price IDs in `src/lib/stripe.ts`:

```typescript
export const SUBSCRIPTION_PRICE_IDS = {
  essential_monthly: 'price_your_essential_monthly_id',
  essential_annual: 'price_your_essential_annual_id',
  premium_monthly: 'price_your_premium_monthly_id',
  premium_annual: 'price_your_premium_annual_id',
};
```

## Supabase Edge Functions

You'll need to create these Supabase Edge Functions:

1. **create-checkout-session**: Handles Stripe checkout session creation
2. **create-portal-session**: Handles customer portal sessions
3. **webhook-handler**: Processes Stripe webhooks

## Security Notes

- Never expose your secret key in frontend code
- Use environment variables for all sensitive data
- Set up proper webhook endpoints for production
- Enable Stripe's built-in fraud detection
