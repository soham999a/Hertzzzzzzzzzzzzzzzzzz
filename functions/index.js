const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');

admin.initializeApp();

const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret,
});

exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be signed in');
  }

  const { amount, currency } = data;

  if (!amount || !currency) {
    throw new functions.https.HttpsError('invalid-argument', 'Amount and currency are required');
  }

  try {
    const order = await razorpay.orders.create({
      amount, // in paise (e.g., 9900 paise = ₹99)
      currency,
      receipt: `receipt_${context.auth.uid}_${Date.now()}`,
      notes: {
        userId: context.auth.uid,
      },
    });

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create payment order');
  }
});

exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be signed in');
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = data;

  const crypto = require('crypto');
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', functions.config().razorpay.key_secret)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    throw new functions.https.HttpsError('permission-denied', 'Invalid payment signature');
  }

  // Update user premium status in Firestore
  await admin.firestore().collection('users').doc(userId).set({
    isPremium: true,
    premiumSince: admin.firestore.FieldValue.serverTimestamp(),
    razorpayPaymentId: razorpay_payment_id,
  }, { merge: true });

  return { success: true };
});
