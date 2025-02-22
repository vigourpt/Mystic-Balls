import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe';

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

    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancel_url: `${window.location.origin}/`,
        line_items: [{
          price: priceId,
          quantity: 1
        }],
        mode: 'subscription',
        payment_method_types: ['card'],
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

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