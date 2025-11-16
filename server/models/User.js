const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['player', 'coach', 'turf', 'admin']
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationData: {
    googleBusinessUrl: String,
    googleMapsUrl: String,
    websiteUrl: String,
    socialMediaLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String
    },
    businessRegistration: String,
    additionalInfo: String,
    submittedAt: Date
  },
  verificationDocuments: {
    idProof: String,
    certificationProof: String,
    addressProof: String
  },
  verificationNotes: String,
  verifiedAt: Date,
  verifiedBy: String,
  // Player specific fields
  sport: {
    type: String,
    required: function() { return this.role === 'player' && this.profileCompleted; }
  },
  skill_level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: function() { return this.role === 'player' && this.profileCompleted; }
  },
  location: {
    type: String,
    required: function() { return this.role === 'player' && this.profileCompleted; }
  },
  // Coach specific fields
  specialization: {
    type: String,
    required: function() { return this.role === 'coach' && this.profileCompleted; }
  },
  certification: {
    type: String,
    required: function() { return this.role === 'coach' && this.profileCompleted; }
  },
  experience: {
    type: Number,
    required: function() { return this.role === 'coach' && this.profileCompleted; }
  },
  business_phone: {
    type: String,
    required: function() { return this.role === 'coach' && this.profileCompleted; }
  },
  coach_location: {
    type: String
  },
  // Turf specific fields
  turf_name: {
    type: String,
    required: function() { return this.role === 'turf' && this.profileCompleted; }
  },
  turf_address: {
    type: String,
    required: function() { return this.role === 'turf' && this.profileCompleted; }
  },
  pin_code: {
    type: String,
    required: function() { return this.role === 'turf' && this.profileCompleted; }
  },
  available_sports: {
    type: [String],
    required: function() { return this.role === 'turf' && this.profileCompleted; }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
