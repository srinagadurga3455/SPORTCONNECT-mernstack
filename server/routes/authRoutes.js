const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, signupLimiter } = require('../middleware/rateLimitMiddleware');
const {
  register,
  login,
  getMe,
  setupProfile
} = require('../controllers/authController');

// Apply rate limiting to auth routes
router.post('/register', signupLimiter, register);
router.post('/signup', signupLimiter, register); // Alias for compatibility
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.post('/setup-profile', protect, setupProfile);

module.exports = router;
