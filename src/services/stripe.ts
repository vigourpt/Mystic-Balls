import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

const createCheckoutSession = async (priceId: string, quantity: number, successUrl: string, cancelUrl: string) => {
  try {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        quantity,
        successUrl,
        cancelUrl,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);
    return { error: "Failed to create checkout session" };
  }
};

export { getStripe, createCheckoutSession };
