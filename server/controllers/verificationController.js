const User = require('../models/User');
const { performVerificationCheck } = require('../utils/googleVerification');

// @desc    Submit verification request with documents
// @route   POST /api/verification/submit
// @access  Private (Coach/Turf only)
const submitVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'player') {
      return res.status(403).json({ message: 'Players do not require verification' });
    }

    const { 
      googleBusinessUrl, 
      googleMapsUrl, 
      websiteUrl,
      socialMediaLinks,
      businessRegistration,
      additionalInfo 
    } = req.body;

    // Update verification information
    user.verificationData = {
      googleBusinessUrl: googleBusinessUrl || '',
      googleMapsUrl: googleMapsUrl || '',
      websiteUrl: websiteUrl || '',
      socialMediaLinks: socialMediaLinks || {},
      businessRegistration: businessRegistration || '',
      additionalInfo: additionalInfo || '',
      submittedAt: new Date()
    };

    // Check for auto-approval eligibility
    const businessName = user.role === 'turf' ? user.turf_name : `${user.firstName} ${user.lastName}`;
    const location = user.role === 'turf' ? user.turf_address : user.coach_location;
    
    const verificationCheck = await performVerificationCheck(
      user.verificationData,
      businessName,
      location
    );

    // Auto-approve if eligible
    if (verificationCheck.autoApproveEligible) {
      user.verificationStatus = 'approved';
      user.isVerified = true;
      user.verifiedAt = new Date();
      user.verifiedBy = 'System (Auto-approved)';
      user.verificationNotes = verificationCheck.autoApproveReason;
      user.verificationCheckResults = verificationCheck;
      
      await user.save();

      return res.json({ 
        message: '✅ Verification approved automatically! Your business is registered on Google.',
        verificationStatus: user.verificationStatus,
        autoApproved: true
      });
    }

    // Manual review required
    user.verificationStatus = 'pending';
    user.verificationCheckResults = verificationCheck;
    await user.save();

    res.json({ 
      message: 'Verification request submitted successfully. Admin will review within 24-48 hours.',
      verificationStatus: user.verificationStatus,
      autoApproved: false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending verifications (Admin only)
// @route   GET /api/verification/pending
// @access  Private (Admin only)
const getPendingVerifications = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      role: { $in: ['coach', 'turf'] },
      verificationStatus: 'pending'
    }).select('-password').sort({ createdAt: -1 });

    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all verifications (Admin only)
// @route   GET /api/verification/all
// @access  Private (Admin only)
const getAllVerifications = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {
      role: { $in: ['coach', 'turf'] }
    };

    if (status) {
      filter.verificationStatus = status;
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve verification (Admin only)
// @route   PUT /api/verification/:id/approve
// @access  Private (Admin only)
const approveVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Perform automatic verification check
    if (user.verificationData) {
      const verificationCheck = await performVerificationCheck(user.verificationData);
      
      // Block approval if no valid Google presence
      if (!verificationCheck.canApprove) {
        return res.status(400).json({ 
          message: 'Cannot approve: No valid Google Business or Maps URL found',
          details: verificationCheck.googleVerification.errors,
          score: verificationCheck.verificationScore,
          suggestion: 'Please ask the user to provide a valid Google Business Profile or Google Maps listing'
        });
      }

      // Store verification check results
      user.verificationCheckResults = verificationCheck;
    } else {
      return res.status(400).json({ 
        message: 'Cannot approve: No verification data submitted'
      });
    }

    const { notes } = req.body;

    user.verificationStatus = 'approved';
    user.isVerified = true;
    user.verifiedAt = new Date();
    user.verifiedBy = req.user._id;
    user.verificationNotes = notes || 'Verified by admin - Google presence confirmed';

    await user.save();

    // Send approval email to user
    const { sendEmail } = require('../utils/emailService');
    const userName = user.role === 'turf' ? user.turf_name : `${user.firstName} ${user.lastName}`;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    
    await sendEmail({
      to: user.email,
      subject: '✅ Verification Approved - SportConnect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #06d6a0;">Verification Approved! ✅</h2>
          <p>Dear ${userName},</p>
          <p>Congratulations! Your verification has been approved by our admin team.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Status:</strong> Verified ✓</p>
            <p><strong>Verified At:</strong> ${new Date().toLocaleString()}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
          
          <p>You can now receive booking requests from players on SportConnect!</p>
          
          <a href="${clientUrl}/login" style="display: inline-block; background: #06d6a0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Go to Dashboard
          </a>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Thank you for choosing SportConnect!
          </p>
        </div>
      `
    });

    res.json({ 
      message: 'User verified successfully',
      user: {
        _id: user._id,
        name: user.role === 'turf' ? user.turf_name : `${user.firstName} ${user.lastName}`,
        role: user.role,
        verificationStatus: user.verificationStatus,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject verification (Admin only)
// @route   PUT /api/verification/:id/reject
// @access  Private (Admin only)
const rejectVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Please provide rejection reason' });
    }

    user.verificationStatus = 'rejected';
    user.isVerified = false;
    user.verificationNotes = reason;

    await user.save();

    // Send rejection email to user with reason
    const { sendEmail } = require('../utils/emailService');
    const userName = user.role === 'turf' ? user.turf_name : `${user.firstName} ${user.lastName}`;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    
    await sendEmail({
      to: user.email,
      subject: 'Verification Update - SportConnect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef476f;">Verification Update</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for submitting your verification request. After careful review, we need additional information.</p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p><strong>Reason:</strong></p>
            <p>${reason}</p>
          </div>
          
          <p>Please update your verification details and resubmit:</p>
          <ul>
            <li>Ensure your Google Business Profile or Google Maps listing is active</li>
            <li>Provide accurate business information</li>
            <li>Include valid contact details</li>
          </ul>
          
          <a href="${clientUrl}/verification-submit" style="display: inline-block; background: #4361ee; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Resubmit Verification
          </a>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have questions, please contact our support team.
          </p>
        </div>
      `
    });

    res.json({ 
      message: 'Verification rejected',
      user: {
        _id: user._id,
        name: user.role === 'turf' ? user.turf_name : `${user.firstName} ${user.lastName}`,
        role: user.role,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get verification status
// @route   GET /api/verification/status
// @access  Private
const getVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      verificationStatus: user.verificationStatus,
      isVerified: user.isVerified,
      verificationData: user.verificationData,
      verificationNotes: user.verificationNotes,
      verifiedAt: user.verifiedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check verification validity (Admin only)
// @route   POST /api/verification/:id/check
// @access  Private (Admin only)
const checkVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.verificationData) {
      return res.status(400).json({ 
        message: 'No verification data submitted',
        canApprove: false
      });
    }

    const verificationCheck = await performVerificationCheck(user.verificationData);

    res.json({
      userName: user.role === 'turf' ? user.turf_name : `${user.firstName} ${user.lastName}`,
      verificationCheck,
      canApprove: verificationCheck.canApprove,
      recommendation: verificationCheck.verificationScore.recommendation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitVerification,
  getPendingVerifications,
  getAllVerifications,
  approveVerification,
  rejectVerification,
  getVerificationStatus,
  checkVerification
};
