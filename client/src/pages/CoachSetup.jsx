import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const CoachSetup = () => {
  const [formData, setFormData] = useState({
    specialization: '',
    certification: '',
    experience: '',
    business_phone: '',
    coach_location: ''
  });
  const [error, setError] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoadingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const city = data.address.city || data.address.town || data.address.village || data.address.state;
          const suburb = data.address.suburb || data.address.neighbourhood || '';
          const location = suburb ? `${city}, ${suburb}` : city;
          
          setFormData({ ...formData, coach_location: location });
          setLoadingLocation(false);
        } catch (err) {
          setError('Failed to get location name. Please enter manually.');
          setLoadingLocation(false);
        }
      },
      (error) => {
        setError('Unable to retrieve location. Please enter manually.');
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await API.post('/auth/setup-profile', formData);
      updateUser(data);
      navigate('/coach-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Setup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Complete Your Coach Profile</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g., Football Coach, Tennis Instructor"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Certification</label>
            <input
              type="text"
              name="certification"
              value={formData.certification}
              onChange={handleChange}
              placeholder="e.g., Level 2 FA Coaching Badge"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Years of Experience</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Business Phone</label>
            <input
              type="tel"
              name="business_phone"
              value={formData.business_phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="coach_location"
                value={formData.coach_location}
                onChange={handleChange}
                placeholder="e.g., Mumbai, Andheri"
                className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={getLocation}
                disabled={loadingLocation}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400 flex items-center gap-2"
                title="Get current location"
              >
                {loadingLocation ? (
                  <span className="animate-spin">⌛</span>
                ) : (
                  <span>📍</span>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Click 📍 to auto-detect or type manually</p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
};

export default CoachSetup;
