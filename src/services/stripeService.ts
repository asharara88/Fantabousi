import { stripePromise } from '../lib/stripe';
import { supabase } from '../lib/supabase';

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface SubscriptionPlan {
  priceId: string;
  planName: string;
  billingCycle: 'monthly' | 'annual';
}

export class StripeService {
  private static instance: StripeService;

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async createSubscriptionCheckout(
    priceId: string, 
    userId: string,
    customerEmail: string
  ): Promise<CheckoutSession> {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId,
          userId,
          customerEmail,
          mode: 'subscription',
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating subscription checkout:', error);
      throw error;
    }
  }

  async createProductCheckout(
    productId: string,
    quantity: number,
    userId: string,
    customerEmail: string,
    isRecurring: boolean = false
  ): Promise<CheckoutSession> {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          productId,
          quantity,
          userId,
          customerEmail,
          mode: isRecurring ? 'subscription' : 'payment',
          isRecurring,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product checkout:', error);
      throw error;
    }
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe not loaded');

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }

  async createCustomerPortalSession(customerId: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { customerId },
      });

      if (error) throw error;
      return data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }
}

export const stripeService = StripeService.getInstance();
