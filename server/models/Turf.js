const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  turfName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  availableSports: {
    type: [String],
    required: true
  },
  amenities: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Turf', turfSchema);
