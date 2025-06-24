import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    amount, 
    currency = 'usd', 
    description, 
    customerEmail,
    projectId,
    paymentType, // 'deposit', 'final', 'full'
    metadata = {}
  } = req.body;

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ 
      error: 'Payment system not configured',
      message: 'Please add STRIPE_SECRET_KEY to your environment variables'
    });
  }

  try {
    // Create or retrieve customer
    let customer;
    if (customerEmail) {
      const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          metadata: {
            source: 'app-suite',
            ...metadata
          }
        });
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description,
      customer: customer?.id,
      metadata: {
        projectId: projectId?.toString(),
        paymentType,
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Log payment initiation
    const { db } = await import('@/lib/db');
    await db.query(
      `INSERT INTO invoices (
        project_id, 
        amount, 
        status, 
        payment_intent_id,
        payment_type,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        projectId || null,
        amount,
        'pending',
        paymentIntent.id,
        paymentType
      ]
    );

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ 
      error: 'Failed to create payment', 
      details: error.message 
    });
  }
}