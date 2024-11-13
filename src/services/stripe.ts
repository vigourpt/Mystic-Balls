import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe';

export const createCheckoutSession = async (priceId: string, userId: string) => {
  try {
    const response = await fetch('https://mystic-balls.web.app/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
      }),
    });

    const { sessionId } = await response.json();
    
    const stripe = await loadStripe(STRIPE_CONFIG.publishableKey);
    if (!stripe) throw new Error('Stripe failed to load');

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) throw error;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};