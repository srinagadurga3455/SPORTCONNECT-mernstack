const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { bookingLimiter } = require('../middleware/rateLimitMiddleware');
const {
  createBooking,
  getUserBookings,
  getAssignedBookings,
  getTurfBookings,
  updateBookingStatus,
  createPaymentOrder,
  processPayment,
  checkAvailability
} = require('../controllers/bookingController');

router.post('/', protect, authorize('player'), bookingLimiter, createBooking);
router.post('/create', protect, authorize('player'), bookingLimiter, createBooking);
router.post('/:id/create-order', protect, createPaymentOrder);
router.post('/:id/payment', protect, processPayment);
router.get('/check-availability', protect, checkAvailability);
router.get('/user', protect, getUserBookings);
router.get('/my', protect, getUserBookings);
router.get('/assigned', protect, authorize('coach', 'turf'), getAssignedBookings);
router.get('/turf/:turfId', protect, authorize('turf'), getTurfBookings);
router.put('/:id/status', protect, authorize('coach', 'turf'), updateBookingStatus);
router.patch('/update-status', protect, authorize('coach', 'turf'), async (req, res) => {
  req.params.id = req.body.bookingId;
  req.body.status = req.body.status;
  const controller = require('../controllers/bookingController');
  return controller.updateBookingStatus(req, res);
});

module.exports = router;
