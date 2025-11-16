const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users/coaches
// @desc    Get all coaches (with optional location filter)
// @access  Private
router.get('/coaches', protect, async (req, res) => {
  try {
    const { location, sport, showAll } = req.query;
    let query = { role: 'coach', profileCompleted: true };
    
    // Show all coaches for now (verification system can be enabled later)
    // Uncomment below lines to enable verification filter:
    // if (!showAll) {
    //   query.isVerified = true;
    //   query.verificationStatus = 'approved';
    // }
    
    // Filter by location if provided
    if (location) {
      query.$or = [
        { coach_location: { $regex: location, $options: 'i' } },
        { email: { $regex: location, $options: 'i' } },
        { specialization: { $regex: location, $options: 'i' } }
      ];
    }
    
    // Filter by sport/specialization if provided
    if (sport) {
      query.specialization = { $regex: sport, $options: 'i' };
    }
    
    const coaches = await User.find(query).select('-password').sort({ isVerified: -1, createdAt: -1 });
    res.json(coaches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/turfs
// @desc    Get all turfs (with optional location filter)
// @access  Private
router.get('/turfs', protect, async (req, res) => {
  try {
    const { location, sport, showAll } = req.query;
    let query = { role: 'turf', profileCompleted: true };
    
    // Show all turfs for now (verification system can be enabled later)
    // Uncomment below lines to enable verification filter:
    // if (!showAll) {
    //   query.isVerified = true;
    //   query.verificationStatus = 'approved';
    // }
    
    // Filter by location if provided
    if (location) {
      query.$or = [
        { turf_address: { $regex: location, $options: 'i' } },
        { pin_code: { $regex: location, $options: 'i' } }
      ];
    }
    
    // Filter by sport if provided
    if (sport) {
      query.available_sports = { $in: [new RegExp(sport, 'i')] };
    }
    
    const turfs = await User.find(query).select('-password').sort({ isVerified: -1, createdAt: -1 });
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
