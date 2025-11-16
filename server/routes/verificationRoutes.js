const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  submitVerification,
  getPendingVerifications,
  getAllVerifications,
  approveVerification,
  rejectVerification,
  getVerificationStatus,
  checkVerification
} = require('../controllers/verificationController');

// Coach/Turf routes
router.post('/submit', protect, authorize('coach', 'turf'), submitVerification);
router.get('/status', protect, getVerificationStatus);

// Admin routes - Protected with adminOnly middleware
router.get('/pending', protect, adminOnly, getPendingVerifications);
router.get('/all', protect, adminOnly, getAllVerifications);
router.post('/:id/check', protect, adminOnly, checkVerification);
router.put('/:id/approve', protect, adminOnly, approveVerification);
router.put('/:id/reject', protect, adminOnly, rejectVerification);

module.exports = router;
