import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  successUrl: `${window.location.origin}/payment-success`,
  cancelUrl: `${window.location.origin}/payment-cancel`,
};

// Price IDs for subscription plans (you'll get these from Stripe dashboard)
export const SUBSCRIPTION_PRICE_IDS = {
  essential_monthly: 'price_essential_monthly_aed',
  essential_annual: 'price_essential_annual_aed',
  premium_monthly: 'price_premium_monthly_aed',
  premium_annual: 'price_premium_annual_aed',
};
