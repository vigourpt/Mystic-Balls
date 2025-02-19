import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe';

export const createCheckoutSession = async (priceId: string, userId: string, userEmail: string) => {
  if (!priceId || !userId) {
    throw new Error('Missing required parameters for checkout');
  }

  try {
    // Initialize Stripe with error handling
    const stripe = await loadStripe(STRIPE_CONFIG.publishableKey);
    if (!stripe) {
      throw new Error('Failed to initialize Stripe. Please try again later.');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      throw new Error('Invalid email address');
    }

    // Create checkout session with enhanced error handling
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        priceId,
        customerId: userId,
        customerEmail: userEmail 
      })
    });

    const session = await response.json();
    if (session.error) {
      throw new Error(session.error);
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (error) {
      console.error('Stripe checkout error:', error);
      throw new Error(error.message || 'Failed to initiate checkout. Please try again.');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred');
  }
};