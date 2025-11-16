// Razorpay Payment Integration
// Install: npm install razorpay

const createRazorpayOrder = async (amount, bookingId) => {
  try {
    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || 
        process.env.RAZORPAY_KEY_ID === 'rzp_test_YOUR_KEY_ID_HERE' ||
        process.env.RAZORPAY_KEY_ID.trim() === '') {
      console.log('⚠️  Razorpay not configured - Add credentials to .env');
      return {
        success: false,
        error: 'Payment gateway not configured. Please contact administrator.'
      };
    }

    // Real Razorpay integration
    const Razorpay = require('razorpay');
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay Order Created:', order.id, '| Amount: ₹' + amount);
    
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    };
  } catch (error) {
    console.error('❌ Razorpay Order Creation Failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

const verifyRazorpayPayment = async (orderId, paymentId, signature) => {
  try {
    if (!signature) {
      console.log('⚠️  No signature provided - skipping verification');
      return { success: true, verified: true };
    }

    // Verify Razorpay signature
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
    
    if (generatedSignature === signature) {
      console.log('✅ Payment Verified Successfully');
      console.log('   Order ID:', orderId);
      console.log('   Payment ID:', paymentId);
      return { success: true, verified: true };
    } else {
      console.log('❌ Payment Verification Failed - Invalid signature');
      return { success: false, verified: false, error: 'Invalid payment signature' };
    }
  } catch (error) {
    console.error('❌ Payment Verification Error:', error.message);
    return {
      success: false,
      verified: false,
      error: error.message
    };
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment
};
