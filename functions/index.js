const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { priceId } = data;
  const userId = context.auth.uid;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.WEBAPP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.WEBAPP_URL}/cancelled`,
      client_reference_id: userId,
      customer_email: context.auth.token.email,
    });

    return { sessionId: session.id };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed');
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const { type } = event;

  switch (type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.client_reference_id;
      
      const userRef = admin.firestore().collection('users').doc(userId);
      await userRef.update({
        isPremium: true,
        subscriptionId: session.subscription,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const userId = subscription.client_reference_id;
      
      const userRef = admin.firestore().collection('users').doc(userId);
      await userRef.update({
        isPremium: false,
        subscriptionId: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      break;
    }
  }

  res.json({ received: true });
});

exports.createPortalSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { customerId } = data;
  
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.WEBAPP_URL,
    });

    return { url: session.url };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});