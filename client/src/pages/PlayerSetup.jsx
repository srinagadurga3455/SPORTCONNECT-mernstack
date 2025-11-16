import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const PlayerSetup = () => {
  const [formData, setFormData] = useState({
    sport: '',
    skill_level: 'beginner',
    location: ''
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
          
          // Use OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          // Extract city or town from the address
          const city = data.address.city || data.address.town || data.address.village || data.address.state;
          
          setFormData({ ...formData, location: city });
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
      navigate('/player-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Setup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Complete Your Player Profile</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Favorite Sport</label>
            <input
              type="text"
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              placeholder="e.g., Football, Cricket, Tennis"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Skill Level</label>
            <select
              name="skill_level"
              value={formData.skill_level}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Mumbai, Delhi"
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

export default PlayerSetup;
