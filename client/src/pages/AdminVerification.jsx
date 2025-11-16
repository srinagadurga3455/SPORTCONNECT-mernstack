import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminVerification = () => {
  const [verifications, setVerifications] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [verificationCheck, setVerificationCheck] = useState(null);
  const [checkingUser, setCheckingUser] = useState(null);

  useEffect(() => {
    fetchVerifications();
  }, [filter]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/verification/all?status=${filter}`);
      setVerifications(data);
    } catch (error) {
      console.error('Failed to fetch verifications', error);
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationValidity = async (userId) => {
    setCheckingUser(userId);
    try {
      const { data } = await API.post(`/verification/${userId}/check`);
      setVerificationCheck({ userId, ...data });
      return data;
    } catch (error) {
      setMessage('❌ Failed to check verification');
      return null;
    } finally {
      setCheckingUser(null);
    }
  };

  const handleApprove = async (userId) => {
    setActionLoading(true);
    setMessage('Checking verification validity...');
    
    try {
      // First check if verification is valid
      const checkResult = await checkVerificationValidity(userId);
      
      if (!checkResult) {
        setMessage('❌ Failed to verify. Please try again.');
        setActionLoading(false);
        return;
      }

      if (!checkResult.canApprove) {
        setMessage('❌ Cannot approve: ' + (checkResult.verificationCheck?.googleVerification?.errors?.join(', ') || 'Invalid Google URLs'));
        setActionLoading(false);
        setTimeout(() => setMessage(''), 5000);
        return;
      }

      // Show confirmation with verification details
      const confirmMessage = `Verification Check Results:\n\n` +
        `Score: ${checkResult.verificationCheck.verificationScore.percentage}%\n` +
        `Recommendation: ${checkResult.verificationCheck.verificationScore.recommendation}\n\n` +
        `${checkResult.verificationCheck.verificationScore.details.join('\n')}\n\n` +
        `Approve this verification?`;

      if (!window.confirm(confirmMessage)) {
        setActionLoading(false);
        setMessage('');
        return;
      }

      await API.put(`/verification/${userId}/approve`, {
        notes: 'Verified and approved by admin - Google presence confirmed'
      });
      
      setMessage('✅ Verification approved successfully');
      fetchVerifications();
      setSelectedUser(null);
      setVerificationCheck(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to approve verification';
      setMessage('❌ ' + errorMsg);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (userId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setActionLoading(true);
    try {
      await API.put(`/verification/${userId}/reject`, { reason });
      setMessage('✅ Verification rejected');
      fetchVerifications();
      setSelectedUser(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to reject verification');
    } finally {
      setActionLoading(false);
    }
  };

  const openGoogleSearch = (name, location) => {
    const query = `${name} ${location || ''} site:google.com`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Verification Management</h1>
          <p className="text-gray-600">Review and approve coach/turf verifications</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6 flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              filter === 'pending'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⏳ Pending ({verifications.filter(v => v.verificationStatus === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              filter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✅ Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              filter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ❌ Rejected
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading verifications...</div>
          </div>
        ) : verifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Verifications</h3>
            <p className="text-gray-600">No {filter} verifications at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {verifications.map((user) => (
              <div key={user._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {user.role === 'turf' ? user.turf_name : `${user.firstName} ${user.lastName}`}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === 'coach' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.verificationStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                        user.verificationStatus === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {user.verificationStatus.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
                        <p className="text-gray-600"><strong>Phone:</strong> {user.phone}</p>
                      </div>
                      <div>
                        {user.role === 'coach' && (
                          <>
                            <p className="text-gray-600"><strong>Specialization:</strong> {user.specialization}</p>
                            <p className="text-gray-600"><strong>Experience:</strong> {user.experience} years</p>
                            <p className="text-gray-600"><strong>Location:</strong> {user.coach_location || 'Not provided'}</p>
                          </>
                        )}
                        {user.role === 'turf' && (
                          <>
                            <p className="text-gray-600"><strong>Address:</strong> {user.turf_address}</p>
                            <p className="text-gray-600"><strong>PIN:</strong> {user.pin_code}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Verification Data */}
                    {user.verificationData && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-bold text-gray-900 mb-3">📋 Verification Information</h4>
                        <div className="space-y-2">
                          {user.verificationData.googleBusinessUrl && (
                            <div>
                              <strong className="text-green-600">✅ Google Business:</strong>{' '}
                              <a
                                href={user.verificationData.googleBusinessUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Profile
                              </a>
                            </div>
                          )}
                          {user.verificationData.googleMapsUrl && (
                            <div>
                              <strong className="text-green-600">✅ Google Maps:</strong>{' '}
                              <a
                                href={user.verificationData.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View on Maps
                              </a>
                            </div>
                          )}
                          {user.verificationData.websiteUrl && (
                            <div>
                              <strong>🌐 Website:</strong>{' '}
                              <a
                                href={user.verificationData.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}
                          {user.verificationData.socialMediaLinks && (
                            <div className="flex gap-3 mt-2">
                              {user.verificationData.socialMediaLinks.facebook && (
                                <a href={user.verificationData.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                  Facebook
                                </a>
                              )}
                              {user.verificationData.socialMediaLinks.instagram && (
                                <a href={user.verificationData.socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline text-sm">
                                  Instagram
                                </a>
                              )}
                              {user.verificationData.socialMediaLinks.twitter && (
                                <a href={user.verificationData.socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                                  Twitter
                                </a>
                              )}
                              {user.verificationData.socialMediaLinks.linkedin && (
                                <a href={user.verificationData.socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline text-sm">
                                  LinkedIn
                                </a>
                              )}
                            </div>
                          )}
                          {user.verificationData.businessRegistration && (
                            <div>
                              <strong>📄 Business Registration:</strong> {user.verificationData.businessRegistration}
                            </div>
                          )}
                          {user.verificationData.additionalInfo && (
                            <div>
                              <strong>ℹ️ Additional Info:</strong>
                              <p className="text-gray-600 text-sm mt-1">{user.verificationData.additionalInfo}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {user.verificationNotes && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <strong>📝 Notes:</strong> {user.verificationNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Auto-Approval Eligibility */}
                {user.verificationCheckResults?.autoApproveEligible && (
                  <div className="mb-4 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">✅ Auto-Approval Eligible</h4>
                    <p className="text-sm text-green-700">
                      {user.verificationCheckResults.autoApproveReason}
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      This business is registered on Google with a high verification score and can be auto-approved.
                    </p>
                  </div>
                )}

                {/* Verification Check Results */}
                {verificationCheck && verificationCheck.userId === user._id && (
                  <div className="mb-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2">🔍 Automatic Verification Check</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Score:</span>
                        <span className="font-bold">{verificationCheck.verificationCheck.verificationScore.percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommendation:</span>
                        <span className={`font-bold ${
                          verificationCheck.recommendation === 'APPROVE' ? 'text-green-600' :
                          verificationCheck.recommendation === 'REVIEW' ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {verificationCheck.recommendation}
                        </span>
                      </div>
                      {verificationCheck.verificationCheck.autoApproveEligible && (
                        <div className="mt-2 pt-2 border-t border-green-200 bg-green-50 p-2 rounded">
                          <strong className="text-green-700">✅ Auto-Approval Eligible</strong>
                          <p className="text-xs text-green-600 mt-1">{verificationCheck.verificationCheck.autoApproveReason}</p>
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        {verificationCheck.verificationCheck.verificationScore.details.map((detail, idx) => (
                          <div key={idx} className="text-xs text-gray-700">{detail}</div>
                        ))}
                      </div>
                      {verificationCheck.verificationCheck.googleVerification.errors.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-red-200 bg-red-50 p-2 rounded">
                          <strong className="text-red-700">⚠️ Issues Found:</strong>
                          {verificationCheck.verificationCheck.googleVerification.errors.map((error, idx) => (
                            <div key={idx} className="text-xs text-red-600 mt-1">• {error}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => openGoogleSearch(
                      user.role === 'turf' ? user.turf_name : `${user.firstName} ${user.lastName}`,
                      user.role === 'turf' ? user.turf_address : user.coach_location
                    )}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    🔍 Search on Google
                  </button>
                  
                  {user.verificationStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => checkVerificationValidity(user._id)}
                        disabled={checkingUser === user._id}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                      >
                        {checkingUser === user._id ? '⏳ Checking...' : '🔍 Check Validity'}
                      </button>
                      <button
                        onClick={() => handleApprove(user._id)}
                        disabled={actionLoading}
                        className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleReject(user._id)}
                        disabled={actionLoading}
                        className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerification;
