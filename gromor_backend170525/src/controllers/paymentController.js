// const Stripe = require('stripe');
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// const asyncHandler = require('../utils/asyncHandler');

// exports.createPaymentIntent = asyncHandler(async (req, res) => {
//   const { amount, currency = 'usd' } = req.body;
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount,
//     currency,
//   });
//   res.json({ clientSecret: paymentIntent.client_secret });
// });
