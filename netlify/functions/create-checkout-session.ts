import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia'  // Current API version for 2025
});

const PRICE_IDS = {
  premium: process.env.STRIPE_PRICE_PREMIUM || 'price_1QKja1G3HGXKeksqUqC0edF0',
  basic: process.env.STRIPE_PRICE_BASIC || 'price_1QKjTIG3HGXKeksq3NJSoxfN'
};

export const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-customer-email',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Secret key exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('Secret key prefix:', process.env.STRIPE_SECRET_KEY?.substring(0, 7));
    
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing Stripe secret key');
      throw new Error('Missing Stripe secret key');
    }

    console.log('Raw request body:', event.body);
    console.log('Request body type:', typeof event.body);
    console.log('Request headers:', event.headers);
    
    if (!event.body) {
      throw new Error('Request body is empty');
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
      console.log('Successfully parsed body:', parsedBody);
    } catch (e) {
      console.error('JSON parse error:', e);
      throw new Error('Invalid JSON in request body');
    }

    const { plan } = parsedBody;
    console.log('Extracted plan:', plan, 'Type:', typeof plan);

    if (!plan) {
      console.error('Plan is undefined or null');
      throw new Error('Plan is required');
    }

    if (typeof plan !== 'string') {
      throw new Error('Plan must be a string');
    }

    if (!['basic', 'premium'].includes(plan)) {
      throw new Error('Plan must be either basic or premium');
    }

    if (!PRICE_IDS[plan]) {
      console.error(`No price ID found for plan: ${plan}`);
      throw new Error(`Invalid plan selected: ${plan}`);
    }

    const priceId = PRICE_IDS[plan];
    console.log('Using price ID:', priceId);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/`,
      customer_email: event.headers['x-customer-email'] || undefined,
      customer_creation: 'always',
      payment_method_collection: 'always',
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: {
        plan: plan
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id })
    };

  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to create checkout session'
      })
    };
  }
};