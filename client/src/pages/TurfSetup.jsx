import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const TurfSetup = () => {
  const [formData, setFormData] = useState({
    turf_name: '',
    turf_address: '',
    pin_code: '',
    available_sports: ''
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
          
          const address = data.display_name;
          const pinCode = data.address.postcode || '';
          
          setFormData({ 
            ...formData, 
            turf_address: address,
            pin_code: pinCode
          });
          setLoadingLocation(false);
        } catch (err) {
          setError('Failed to get location. Please enter manually.');
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
      const sportsArray = formData.available_sports.split(',').map(s => s.trim());
      const { data } = await API.post('/auth/setup-profile', {
        ...formData,
        available_sports: sportsArray
      });
      updateUser(data);
      navigate('/turf-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Setup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Complete Your Turf Profile</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Turf Name</label>
            <input
              type="text"
              name="turf_name"
              value={formData.turf_name}
              onChange={handleChange}
              placeholder="e.g., Green Valley Sports Arena"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address</label>
            <div className="flex gap-2 items-start">
              <textarea
                name="turf_address"
                value={formData.turf_address}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
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
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">PIN Code</label>
            <input
              type="text"
              name="pin_code"
              value={formData.pin_code}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Available Sports (comma-separated)</label>
            <input
              type="text"
              name="available_sports"
              value={formData.available_sports}
              onChange={handleChange}
              placeholder="e.g., Football, Cricket, Basketball"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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

export default TurfSetup;
