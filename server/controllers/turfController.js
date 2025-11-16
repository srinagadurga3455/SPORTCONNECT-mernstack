const Turf = require('../models/Turf');
const User = require('../models/User');

// @desc    Create new turf
// @route   POST /api/turfs
// @access  Private (Turf owners only)
const createTurf = async (req, res) => {
  try {
    const { turfName, location, pricePerHour, availableSports, amenities, images } = req.body;

    if (!turfName || !location || !pricePerHour || !availableSports) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const turf = await Turf.create({
      owner: req.user._id,
      turfName,
      location,
      pricePerHour,
      availableSports,
      amenities: amenities || [],
      images: images || []
    });

    res.status(201).json(turf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all turfs
// @route   GET /api/turfs
// @access  Public
const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find({ isActive: true })
      .populate('owner', 'firstName lastName email phone')
      .sort({ createdAt: -1 });
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single turf
// @route   GET /api/turfs/:id
// @access  Public
const getTurfById = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone');
    
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    res.json(turf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update turf
// @route   PUT /api/turfs/:id
// @access  Private (Owner only)
const updateTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    if (turf.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this turf' });
    }

    const updatedTurf = await Turf.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTurf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete turf
// @route   DELETE /api/turfs/:id
// @access  Private (Owner only)
const deleteTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    if (turf.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this turf' });
    }

    await Turf.findByIdAndDelete(req.params.id);
    res.json({ message: 'Turf removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get turfs by owner
// @route   GET /api/turfs/my-turfs
// @access  Private (Turf owners only)
const getMyTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTurf,
  getAllTurfs,
  getTurfById,
  updateTurf,
  deleteTurf,
  getMyTurfs
};
