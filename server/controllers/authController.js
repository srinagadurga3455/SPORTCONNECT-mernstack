const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validatePasswordStrength } = require('../utils/passwordValidator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      profileCompleted: false
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Setup user profile
// @route   POST /api/auth/setup-profile
// @access  Private
const setupProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'player') {
      const { sport, skill_level, location } = req.body;
      if (!sport || !skill_level || !location) {
        return res.status(400).json({ message: 'Please provide all player fields' });
      }
      user.sport = sport;
      user.skill_level = skill_level;
      user.location = location;
    } else if (user.role === 'coach') {
      const { specialization, certification, experience, business_phone, coach_location } = req.body;
      if (!specialization || !certification || !experience || !business_phone) {
        return res.status(400).json({ message: 'Please provide all coach fields' });
      }
      user.specialization = specialization;
      user.certification = certification;
      user.experience = experience;
      user.business_phone = business_phone;
      if (coach_location) {
        user.coach_location = coach_location;
      }
    } else if (user.role === 'turf') {
      const { turf_name, turf_address, pin_code, available_sports } = req.body;
      if (!turf_name || !turf_address || !pin_code || !available_sports) {
        return res.status(400).json({ message: 'Please provide all turf fields' });
      }
      user.turf_name = turf_name;
      user.turf_address = turf_address;
      user.pin_code = pin_code;
      user.available_sports = available_sports;
    }

    user.profileCompleted = true;
    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  setupProfile
};
