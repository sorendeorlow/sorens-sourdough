// Vercel Serverless Function
// Creates a Stripe Checkout Session for Communion Breads orders

const Stripe = require('stripe');

// IMPORTANT: Set these in Vercel Environment Variables:
// - STRIPE_SECRET_KEY = sk_live_... (or sk_test_...)
// - (Optional) STRIPE_PUBLISHABLE_KEY for reference

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      phone,
      pickup_date,
      country_full = 0,
      country_half = 0,
      heritage_full = 0,
      heritage_half = 0,
      ezekiel_full = 0,
      ezekiel_half = 0,
      notes = '',
    } = req.body;

    // Basic validation
    if (!email || (!country_full && !country_half && !heritage_full && !heritage_half && !ezekiel_full && !ezekiel_half)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Build line items for Stripe
    const lineItems = [];

    // Country Levain - Full ($16)
    if (parseInt(country_full) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Country Levain (Full)',
            description: '≈1kg loaf • Baked fresh the morning of pickup',
            metadata: {
              sku: 'country-levain-full',
            },
          },
          unit_amount: 1600, // $16.00 in cents
        },
        quantity: parseInt(country_full),
      });
    }

    // Country Levain - Half ($9)
    if (parseInt(country_half) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Country Levain (Half)',
            description: '≈500g loaf • Baked fresh the morning of pickup',
            metadata: {
              sku: 'country-levain-half',
            },
          },
          unit_amount: 900, // $9.00 in cents
        },
        quantity: parseInt(country_half),
      });
    }

    // Heritage Wheat & Wildflower Raw Honey - Full ($18)
    if (parseInt(heritage_full) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Heritage Wheat & Wildflower Raw Honey (Full)',
            description: '≈1kg loaf • Baked fresh the morning of pickup',
            metadata: {
              sku: 'heritage-wheat-full',
            },
          },
          unit_amount: 1800, // $18.00 in cents
        },
        quantity: parseInt(heritage_full),
      });
    }

    // Heritage Wheat & Wildflower Raw Honey - Half ($10)
    if (parseInt(heritage_half) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Heritage Wheat & Wildflower Raw Honey (Half)',
            description: '≈500g loaf • Baked fresh the morning of pickup',
            metadata: {
              sku: 'heritage-wheat-half',
            },
          },
          unit_amount: 1000, // $10.00 in cents
        },
        quantity: parseInt(heritage_half),
      });
    }

    // Ezekiel High-Protein Bread - Full ($18)
    if (parseInt(ezekiel_full) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Ezekiel High-Protein Bread (Full)',
            description: '≈1kg loaf • Baked fresh the morning of pickup',
            metadata: {
              sku: 'ezekiel-high-protein-full',
            },
          },
          unit_amount: 1800, // $18.00 in cents
        },
        quantity: parseInt(ezekiel_full),
      });
    }

    // Ezekiel High-Protein Bread - Half ($10)
    if (parseInt(ezekiel_half) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Ezekiel High-Protein Bread (Half)',
            description: '≈500g loaf • Baked fresh the morning of pickup',
            metadata: {
              sku: 'ezekiel-high-protein-half',
            },
          },
          unit_amount: 1000, // $10.00 in cents
        },
        quantity: parseInt(ezekiel_half),
      });
    }

    // Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: lineItems,
      success_url: `${req.headers.origin || 'https://your-domain.com'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://your-domain.com'}/order.html?canceled=true`,
      metadata: {
        customer_name: name || '',
        phone: phone || '',
        pickup_date: pickup_date || '',
        country_full: String(country_full || 0),
        country_half: String(country_half || 0),
        heritage_full: String(heritage_full || 0),
        heritage_half: String(heritage_half || 0),
        ezekiel_full: String(ezekiel_full || 0),
        ezekiel_half: String(ezekiel_half || 0),
        notes: notes || '',
        source: 'website-order',
      },
      // Optional: Add a nice statement descriptor
      payment_intent_data: {
        statement_descriptor: 'COMMUNION BREADS',
      },
    });

    // Return the session URL so the frontend can redirect
    res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Stripe Checkout error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
    });
  }
};
