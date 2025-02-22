import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe';

// Ensure single instance of Stripe client
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publicKey);
  }
  return stripePromise;
};

export const createCheckoutSession = async (priceId: string) => {
  try {
    if (!priceId) {
      throw new Error('Price ID is required');
    }

    console.log('Creating checkout session with priceId:', priceId);

    // Use absolute URLs for success and cancel paths
    const successUrl = new URL('/success', window.location.origin).toString();
    const cancelUrl = new URL('/', window.location.origin).toString();

    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        priceId,
        successUrl,
        cancelUrl
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const data = await response.json();

    if (!data.sessionId) {
      throw new Error('No session ID returned from server');
    }

    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    return stripe.redirectToCheckout({ sessionId: data.sessionId });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
};