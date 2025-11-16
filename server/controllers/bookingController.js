const Booking = require('../models/Booking');
const User = require('../models/User');
const { 
  sendBookingApprovalEmail, 
  sendPaymentConfirmationEmail,
  sendBookingNotificationToProvider 
} = require('../utils/emailService');
const { createRazorpayOrder, verifyRazorpayPayment } = require('../utils/razorpayService');

// @desc    Create a new booking (without payment)
// @route   POST /api/bookings/create
// @access  Private (Players only)
const createBooking = async (req, res) => {
  try {
    const { targetId, bookingType, date, time, duration, sport, sessionType, amount } = req.body;

    if (!targetId || !bookingType || !date || !time) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid amount' });
    }

    // Get target user for email notification
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Coach/Turf not found' });
    }

    // Verification check - ENABLED
    if (!targetUser.isVerified || targetUser.verificationStatus !== 'approved') {
      return res.status(403).json({ 
        message: 'This coach/turf is not verified yet. For your safety, you can only book verified providers.',
        verificationRequired: true
      });
    }

    // Check for slot conflicts
    const existingBooking = await Booking.findOne({
      targetId,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      targetId,
      bookingType,
      date,
      time,
      duration: duration || 1,
      sport,
      sessionType,
      amount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('targetId', 'firstName lastName specialization turf_name turf_address email')
      .populate('userId', 'firstName lastName email');

    // Send notification email to coach/turf owner (reuse targetUser from verification check)
    const playerUser = await User.findById(req.user._id);
    
    if (targetUser && playerUser) {
      await sendBookingNotificationToProvider(
        booking,
        targetUser.email,
        `${targetUser.firstName} ${targetUser.lastName}`,
        `${playerUser.firstName} ${playerUser.lastName}`
      );
    }

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Razorpay order for booking
// @route   POST /api/bookings/:id/create-order
// @access  Private
const createPaymentOrder = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'approved') {
      return res.status(400).json({ message: 'Booking must be approved before payment' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Create Razorpay order
    const orderData = await createRazorpayOrder(booking.amount, booking._id);
    
    if (!orderData.success) {
      return res.status(500).json({ message: 'Failed to create payment order' });
    }

    res.json({
      orderId: orderData.orderId,
      amount: orderData.amount,
      currency: orderData.currency,
      key: orderData.key,
      bookingId: booking._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process payment for approved booking
// @route   POST /api/bookings/:id/payment
// @access  Private
const processPayment = async (req, res) => {
  try {
    const { paymentMethod, paymentId, orderId, signature } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'approved') {
      return res.status(400).json({ message: 'Booking must be approved before payment' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Verify payment if Razorpay details provided
    if (orderId && signature) {
      const verification = await verifyRazorpayPayment(orderId, paymentId, signature);
      if (!verification.verified) {
        return res.status(400).json({ message: 'Payment verification failed' });
      }
    }

    // Simulate payment processing (in production, integrate with Razorpay/Stripe)
    booking.paymentStatus = 'paid';
    booking.paymentMethod = paymentMethod;
    booking.paymentId = paymentId || `PAY_${Date.now()}`;
    booking.paidAt = new Date();
    booking.status = 'completed';

    await booking.save();

    // Send confirmation emails
    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'firstName lastName email')
      .populate('targetId', 'firstName lastName turf_name email');
    
    if (populatedBooking.userId) {
      const targetName = booking.bookingType === 'coach' 
        ? `${populatedBooking.targetId.firstName} ${populatedBooking.targetId.lastName}`
        : populatedBooking.targetId.turf_name;
      
      // Send to player
      await sendPaymentConfirmationEmail(
        booking,
        populatedBooking.userId.email,
        `${populatedBooking.userId.firstName} ${populatedBooking.userId.lastName}`,
        targetName
      );
      
      // Send to coach/turf owner
      await sendPaymentConfirmationEmail(
        booking,
        populatedBooking.targetId.email,
        `${populatedBooking.targetId.firstName || 'Turf'} ${populatedBooking.targetId.lastName || 'Owner'}`,
        `${populatedBooking.userId.firstName} ${populatedBooking.userId.lastName}`
      );
    }

    res.json({ 
      message: 'Payment successful. Confirmation emails sent.',
      booking 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings created by current user
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('targetId', 'firstName lastName specialization turf_name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings assigned to current user (coach/turf)
// @route   GET /api/bookings/assigned
// @access  Private
const getAssignedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ targetId: req.user._id })
      .populate('userId', 'firstName lastName email phone sport')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for a specific turf
// @route   GET /api/bookings/turf/:turfId
// @access  Private (Turf owner only)
const getTurfBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      targetId: req.params.turfId,
      bookingType: 'turf'
    })
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Coach/Turf owner only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Please provide status' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.targetId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    // Send email notification if booking is approved
    if (status === 'approved') {
      const populatedBooking = await Booking.findById(booking._id)
        .populate('userId', 'firstName lastName email');
      
      if (populatedBooking.userId) {
        await sendBookingApprovalEmail(
          booking,
          populatedBooking.userId.email,
          `${populatedBooking.userId.firstName} ${populatedBooking.userId.lastName}`
        );
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check slot availability
// @route   GET /api/bookings/check-availability
// @access  Private
const checkAvailability = async (req, res) => {
  try {
    const { targetId, date, time } = req.query;

    if (!targetId || !date || !time) {
      return res.status(400).json({ message: 'Please provide targetId, date, and time' });
    }

    const existingBooking = await Booking.findOne({
      targetId,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'approved', 'completed'] }
    });

    res.json({ 
      available: !existingBooking,
      message: existingBooking ? 'Slot already booked' : 'Slot available'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAssignedBookings,
  getTurfBookings,
  updateBookingStatus,
  createPaymentOrder,
  processPayment,
  checkAvailability
};
