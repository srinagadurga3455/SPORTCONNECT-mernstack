import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const ViewBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = (booking) => {
    // Open payment modal when "Pay Now" is clicked
    setPaymentModal(booking);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (bookingId, paymentMethod) => {
    if (!paymentMethod) {
      setMessage('Please select a payment method');
      return;
    }

    setProcessing(true);
    setMessage('Initializing payment gateway...');
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order
      const orderResponse = await API.post(`/bookings/${bookingId}/create-order`);
      
      if (!orderResponse.data) {
        throw new Error('Failed to create payment order');
      }
      
      const { orderId, amount, currency, key } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'SportConnect',
        description: `Booking Payment - ${paymentModal.bookingType === 'coach' ? 'Coach' : 'Turf'}`,
        order_id: orderId,
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#4361ee'
        },
        handler: async function (response) {
          // Payment successful - verify on backend
          setMessage('Verifying payment...');
          try {
            await API.post(`/bookings/${bookingId}/payment`, {
              paymentMethod,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });
            
            setMessage('✅ Payment successful! Booking confirmed. Refreshing...');
            setPaymentModal(null);
            
            setTimeout(async () => {
              await fetchBookings();
              setMessage('');
              setProcessing(false);
            }, 1500);
          } catch (error) {
            setMessage('Payment verification failed. Please contact support.');
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setMessage('Payment cancelled');
            setProcessing(false);
          }
        }
      };

      // Open Razorpay payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      // Reset processing state as Razorpay modal is now open
      setProcessing(false);
      setMessage('');
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Payment initialization failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">My Bookings</h1>
          <p className="text-gray-600">Track and manage all your bookings in one place</p>
        </div>

        {message && (
          <div className={`max-w-3xl mx-auto mb-6 p-4 rounded-lg ${
            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
        
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {booking.bookingType === 'coach' 
                        ? `${booking.targetId?.firstName} ${booking.targetId?.lastName}` 
                        : booking.targetId?.turf_name}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-600">
                        <strong>Type:</strong> {booking.bookingType === 'coach' ? 'Coach' : 'Turf'}
                      </p>
                      {booking.bookingType === 'coach' && (
                        <p className="text-gray-600">
                          <strong>Specialization:</strong> {booking.targetId?.specialization}
                        </p>
                      )}
                      <p className="text-gray-600">
                        <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        <strong>Time:</strong> {booking.time}
                      </p>
                      {booking.duration && (
                        <p className="text-gray-600">
                          <strong>Duration:</strong> {booking.duration} hour(s)
                        </p>
                      )}
                      {booking.amount && (
                        <p className="text-gray-600">
                          <strong>Amount:</strong> ₹{booking.amount}
                        </p>
                      )}
                      <p className="text-gray-600">
                        <strong>Booked on:</strong> {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                      {booking.paymentStatus && (
                        <p className="text-gray-600">
                          <strong>Payment:</strong> <span className={`font-semibold ${
                            booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
                          }`}>{booking.paymentStatus.toUpperCase()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-2 rounded font-semibold ${
                      booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                      booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                    
                    {booking.status === 'approved' && booking.paymentStatus === 'pending' && booking.amount > 0 && (
                      <button
                        onClick={() => setPaymentModal(booking)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
                      >
                        💳 Pay Now
                      </button>
                    )}
                    
                    {booking.status === 'approved' && (!booking.amount || booking.amount === 0) && (
                      <span className="text-sm text-orange-600 font-semibold">
                        ⚠️ Old booking - amount not set
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Modal */}
        {paymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Complete Payment</h2>
                <button 
                  onClick={() => setPaymentModal(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-bold mb-2">Booking Details</h3>
                <p className="text-sm text-gray-600">
                  <strong>{paymentModal.bookingType === 'coach' ? 'Coach' : 'Turf'}:</strong> {
                    paymentModal.bookingType === 'coach' 
                      ? `${paymentModal.targetId?.firstName} ${paymentModal.targetId?.lastName}`
                      : paymentModal.targetId?.turf_name
                  }
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {new Date(paymentModal.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> {paymentModal.time}
                </p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  Amount: ₹{paymentModal.amount}
                </p>
              </div>

              <h3 className="font-bold mb-3">Select Payment Method</h3>
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handlePayment(paymentModal._id, 'UPI')}
                  disabled={processing}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-all flex items-center gap-4 disabled:opacity-50"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xl">
                    📱
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">UPI</div>
                    <div className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</div>
                  </div>
                </button>

                <button
                  onClick={() => handlePayment(paymentModal._id, 'Card')}
                  disabled={processing}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-all flex items-center gap-4 disabled:opacity-50"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl">
                    💳
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, Rupay</div>
                  </div>
                </button>

                <button
                  onClick={() => handlePayment(paymentModal._id, 'NetBanking')}
                  disabled={processing}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-all flex items-center gap-4 disabled:opacity-50"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xl">
                    🏦
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Net Banking</div>
                    <div className="text-sm text-gray-600">All major banks</div>
                  </div>
                </button>
              </div>

              {processing && (
                <div className="text-center text-blue-600 font-semibold">
                  Processing payment...
                </div>
              )}

              <p className="text-center text-xs text-gray-500 mt-4">
                🔒 Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBookings;
