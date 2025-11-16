import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const VerificationSubmit = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [formData, setFormData] = useState({
    googleBusinessUrl: '',
    googleMapsUrl: '',
    websiteUrl: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    businessRegistration: '',
    additionalInfo: ''
  });

  useEffect(() => {
    if (user?.role === 'player') {
      navigate('/player-dashboard');
      return;
    }
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const { data } = await API.get('/verification/status');
      setVerificationStatus(data);
      
      if (data.verificationData) {
        setFormData({
          googleBusinessUrl: data.verificationData.googleBusinessUrl || '',
          googleMapsUrl: data.verificationData.googleMapsUrl || '',
          websiteUrl: data.verificationData.websiteUrl || '',
          facebook: data.verificationData.socialMediaLinks?.facebook || '',
          instagram: data.verificationData.socialMediaLinks?.instagram || '',
          twitter: data.verificationData.socialMediaLinks?.twitter || '',
          linkedin: data.verificationData.socialMediaLinks?.linkedin || '',
          businessRegistration: data.verificationData.businessRegistration || '',
          additionalInfo: data.verificationData.additionalInfo || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch verification status', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const submitData = {
        googleBusinessUrl: formData.googleBusinessUrl,
        googleMapsUrl: formData.googleMapsUrl,
        websiteUrl: formData.websiteUrl,
        socialMediaLinks: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
          linkedin: formData.linkedin
        },
        businessRegistration: formData.businessRegistration,
        additionalInfo: formData.additionalInfo
      };

      const { data } = await API.post('/verification/submit', submitData);
      setMessage(data.message);
      
      if (data.autoApproved) {
        // Auto-approved - redirect immediately with success message
        setTimeout(() => {
          navigate(user.role === 'coach' ? '/coach-dashboard' : '/turf-dashboard');
        }, 3000);
      } else {
        // Manual review required
        setTimeout(() => {
          navigate(user.role === 'coach' ? '/coach-dashboard' : '/turf-dashboard');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to submit verification request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (verificationStatus?.verificationStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">Verified!</h2>
            <p className="text-gray-600 mb-6">
              Your account has been verified and approved.
            </p>
            {verificationStatus.verifiedAt && (
              <p className="text-sm text-gray-500">
                Verified on: {new Date(verificationStatus.verifiedAt).toLocaleDateString()}
              </p>
            )}
            <button
              onClick={() => navigate(user.role === 'coach' ? '/coach-dashboard' : '/turf-dashboard')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus?.verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-3xl font-bold text-orange-600 mb-4">Verification Pending</h2>
            <p className="text-gray-600 mb-6">
              Your verification request is under review. We'll notify you once it's processed.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This usually takes 24-48 hours.
            </p>
            {verificationStatus.verificationNotes && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> {verificationStatus.verificationNotes}
                </p>
              </div>
            )}
            <button
              onClick={() => navigate(user.role === 'coach' ? '/coach-dashboard' : '/turf-dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus?.verificationStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Verification Rejected</h2>
            <p className="text-gray-600 mb-6">
              Unfortunately, your verification request was not approved.
            </p>
            {verificationStatus.verificationNotes && (
              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Reason:</strong> {verificationStatus.verificationNotes}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600 mb-6">
              You can resubmit your verification request with updated information.
            </p>
            <button
              onClick={() => setVerificationStatus({ ...verificationStatus, verificationStatus: 'resubmit' })}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Resubmit Verification
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Get Verified</h1>
            <p className="text-gray-600">
              Verify your {user?.role === 'coach' ? 'coaching business' : 'turf facility'} to build trust with customers
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
              <h3 className="font-bold text-blue-900 mb-2">📍 Google Verification (Recommended)</h3>
              <p className="text-sm text-blue-800">
                Having a Google Business Profile or Google Maps listing significantly increases your chances of approval.
                It helps us verify that your business is legitimate and operational.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Google Business Profile */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Google Business Profile URL ⭐ (Highly Recommended)
                </label>
                <input
                  type="url"
                  name="googleBusinessUrl"
                  value={formData.googleBusinessUrl}
                  onChange={handleChange}
                  placeholder="https://business.google.com/..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your Google Business Profile link (if you have one)
                </p>
              </div>

              {/* Google Maps */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Google Maps Listing URL ⭐ (Highly Recommended)
                </label>
                <input
                  type="url"
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your location on Google Maps
                </p>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* Social Media */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Social Media Links (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="Facebook URL"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="Instagram URL"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="Twitter URL"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Business Registration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Registration Number (Optional)
                </label>
                <input
                  type="text"
                  name="businessRegistration"
                  value={formData.businessRegistration}
                  onChange={handleChange}
                  placeholder="GST Number, Business License, etc."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any additional information that helps verify your business..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Tip:</strong> Providing your Google Business Profile or Google Maps listing will significantly speed up the verification process!
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationSubmit;
