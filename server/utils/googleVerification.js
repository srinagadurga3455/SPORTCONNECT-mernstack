const axios = require('axios');

/**
 * Verify if a URL is a valid Google Business or Maps URL
 */
const isValidGoogleUrl = (url) => {
  if (!url) return false;
  
  const googleDomains = [
    'google.com/maps',
    'maps.google.com',
    'goo.gl/maps',
    'business.google.com',
    'g.page'
  ];
  
  return googleDomains.some(domain => url.toLowerCase().includes(domain));
};

/**
 * Check if a URL is accessible (returns 200 status)
 */
const checkUrlAccessible = async (url) => {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      maxRedirects: 5,
      validateStatus: (status) => status < 400
    });
    return response.status === 200;
  } catch (error) {
    // Try GET if HEAD fails
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: (status) => status < 400
      });
      return response.status === 200;
    } catch (getError) {
      return false;
    }
  }
};

/**
 * Verify Google Business/Maps URL
 */
const verifyGooglePresence = async (googleBusinessUrl, googleMapsUrl) => {
  const results = {
    hasGoogleBusiness: false,
    hasGoogleMaps: false,
    googleBusinessValid: false,
    googleMapsValid: false,
    errors: []
  };

  // Check Google Business URL
  if (googleBusinessUrl) {
    results.hasGoogleBusiness = true;
    
    if (!isValidGoogleUrl(googleBusinessUrl)) {
      results.errors.push('Google Business URL is not a valid Google domain');
    } else {
      const isAccessible = await checkUrlAccessible(googleBusinessUrl);
      if (isAccessible) {
        results.googleBusinessValid = true;
      } else {
        results.errors.push('Google Business URL is not accessible or does not exist');
      }
    }
  }

  // Check Google Maps URL
  if (googleMapsUrl) {
    results.hasGoogleMaps = true;
    
    if (!isValidGoogleUrl(googleMapsUrl)) {
      results.errors.push('Google Maps URL is not a valid Google domain');
    } else {
      const isAccessible = await checkUrlAccessible(googleMapsUrl);
      if (isAccessible) {
        results.googleMapsValid = true;
      } else {
        results.errors.push('Google Maps URL is not accessible or does not exist');
      }
    }
  }

  return results;
};

/**
 * Calculate verification score based on provided information
 */
const calculateVerificationScore = (verificationData) => {
  let score = 0;
  const details = [];

  // Google Business Profile (40 points)
  if (verificationData.googleBusinessUrl) {
    if (isValidGoogleUrl(verificationData.googleBusinessUrl)) {
      score += 40;
      details.push('✅ Google Business Profile provided (+40)');
    } else {
      details.push('❌ Invalid Google Business URL (0)');
    }
  } else {
    details.push('⚠️ No Google Business Profile (0)');
  }

  // Google Maps Listing (40 points)
  if (verificationData.googleMapsUrl) {
    if (isValidGoogleUrl(verificationData.googleMapsUrl)) {
      score += 40;
      details.push('✅ Google Maps listing provided (+40)');
    } else {
      details.push('❌ Invalid Google Maps URL (0)');
    }
  } else {
    details.push('⚠️ No Google Maps listing (0)');
  }

  // Website (10 points)
  if (verificationData.websiteUrl) {
    score += 10;
    details.push('✅ Website provided (+10)');
  }

  // Social Media (5 points total)
  const socialLinks = verificationData.socialMediaLinks || {};
  const socialCount = Object.values(socialLinks).filter(link => link && link.trim()).length;
  if (socialCount > 0) {
    const socialScore = Math.min(socialCount * 2, 5);
    score += socialScore;
    details.push(`✅ ${socialCount} social media link(s) (+${socialScore})`);
  }

  // Business Registration (5 points)
  if (verificationData.businessRegistration) {
    score += 5;
    details.push('✅ Business registration provided (+5)');
  }

  return {
    score,
    maxScore: 100,
    percentage: score,
    details,
    recommendation: score >= 40 ? 'APPROVE' : score >= 20 ? 'REVIEW' : 'REJECT',
    message: 
      score >= 80 ? 'Excellent verification - Strong Google presence' :
      score >= 40 ? 'Good verification - Has Google presence' :
      score >= 20 ? 'Weak verification - Limited information' :
      'Insufficient verification - No Google presence'
  };
};

/**
 * Check if business is registered on popular platforms
 */
const checkBusinessRegistration = async (businessName, location) => {
  const registrations = {
    google: false,
    justdial: false,
    other: false
  };

  // Check if Google Business/Maps URL is valid (already done in verifyGooglePresence)
  // This is a placeholder for future API integration
  
  return registrations;
};

/**
 * Comprehensive verification check
 */
const performVerificationCheck = async (verificationData, businessName, location) => {
  const googleCheck = await verifyGooglePresence(
    verificationData.googleBusinessUrl,
    verificationData.googleMapsUrl
  );

  const score = calculateVerificationScore(verificationData);
  
  // Check for auto-approval eligibility
  const hasValidGoogleBusiness = googleCheck.googleBusinessValid;
  const hasValidGoogleMaps = googleCheck.googleMapsValid;
  const hasHighScore = score.score >= 80;
  
  // Auto-approve if registered on Google with high score
  const autoApproveEligible = (hasValidGoogleBusiness || hasValidGoogleMaps) && hasHighScore;

  return {
    googleVerification: googleCheck,
    verificationScore: score,
    canApprove: googleCheck.googleBusinessValid || googleCheck.googleMapsValid,
    shouldReview: !googleCheck.googleBusinessValid && !googleCheck.googleMapsValid && score.score >= 20,
    shouldReject: !googleCheck.googleBusinessValid && !googleCheck.googleMapsValid && score.score < 20,
    autoApproveEligible: autoApproveEligible,
    autoApproveReason: autoApproveEligible ? 'Registered on Google with high verification score' : null
  };
};

module.exports = {
  isValidGoogleUrl,
  checkUrlAccessible,
  verifyGooglePresence,
  calculateVerificationScore,
  performVerificationCheck
};
