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
    'Access-Control-Allow-Headers': 'Content-Type',
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

    console.log('Request body:', event.body); // Add this line to see the raw request
    const { plan } = JSON.parse(event.body || '{}');
    console.log('Received plan:', plan);
    console.log('Available price IDs:', PRICE_IDS);
    console.log('Event headers:', event.headers); // Add this line to check headers

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];
    console.log('Selected price ID:', priceId);
    
    if (!priceId) {
      console.error('Invalid plan selected:', plan);
      throw new Error('Invalid plan selected');
    }
    
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