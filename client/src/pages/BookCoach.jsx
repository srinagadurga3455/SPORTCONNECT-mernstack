import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const BookCoach = () => {
  const { user } = useContext(AuthContext);
  const [coaches, setCoaches] = useState([]);
  const [allCoaches, setAllCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    date: '', 
    time: '',
    duration: '1',
    sessionType: 'individual'
  });
  const [filters, setFilters] = useState({
    location: '',
    sport: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const timeSlots = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
    '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const sessionTypes = [
    { value: 'individual', label: 'Individual Session', price: 500, icon: '👤' },
    { value: 'group', label: 'Group Session (2-5)', price: 300, icon: '👥' },
    { value: 'team', label: 'Team Training', price: 200, icon: '🏆' }
  ];

  useEffect(() => {
    fetchCoaches();
  }, []);

  useEffect(() => {
    filterCoaches();
  }, [filters, allCoaches]);

  const fetchCoaches = async () => {
    try {
      const { data } = await API.get('/users/coaches');
      setAllCoaches(data);
      setCoaches(data); // Show all coaches initially
      
      // Auto-set location filter but don't apply it yet
      if (user?.location) {
        setFilters(prev => ({ ...prev, location: user.location }));
      }
    } catch (error) {
      console.error('Failed to fetch coaches', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCoaches = () => {
    let filtered = [...allCoaches];

    // Filter for verified coaches only
    filtered = filtered.filter(coach => 
      coach.isVerified === true && coach.verificationStatus === 'approved'
    );

    if (filters.location) {
      filtered = filtered.filter(coach => 
        coach.coach_location?.toLowerCase().includes(filters.location.toLowerCase()) ||
        coach.email?.toLowerCase().includes(filters.location.toLowerCase()) ||
        coach.specialization?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.sport) {
      filtered = filtered.filter(coach =>
        coach.specialization?.toLowerCase().includes(filters.sport.toLowerCase())
      );
    }

    setCoaches(filtered);
  };

  const calculatePrice = () => {
    const sessionPrice = sessionTypes.find(s => s.value === formData.sessionType)?.price || 500;
    return sessionPrice * parseInt(formData.duration);
  };

  const handleBooking = async () => {
    try {
      const response = await API.post('/bookings/create', {
        targetId: selectedCoach._id,
        bookingType: 'coach',
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        sessionType: formData.sessionType,
        amount: calculatePrice()
      });
      setMessage('Booking request submitted successfully. Awaiting coach approval.');
      setTimeout(() => navigate('/my-bookings'), 2500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to process booking request. Please try again.');
    }
  };

  const handlePayment = () => {
    setMessage('Processing your booking request...');
    setTimeout(() => {
      handleBooking();
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-gray-600">Loading coaches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book a Coach</h1>
          <p className="text-gray-600">Find the perfect coach to improve your skills</p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-semibold hidden sm:inline">Select Coach</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-semibold hidden sm:inline">Choose Time</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 font-semibold hidden sm:inline">Payment</span>
            </div>
          </div>
        </div>

        {message && (
          <div className={`max-w-3xl mx-auto mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {message}
          </div>
        )}

        {/* Step 1: Select Coach */}
        {step === 1 && (
          <>
            {/* Filters */}
            <div className="max-w-4xl mx-auto mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold gradient-text">🔍 Find Your Perfect Coach</h3>
                  {user?.location && filters.location && (
                    <span className="text-sm badge-primary">
                      📍 Near {user.location}
                    </span>
                  )}
                </div>
                {user?.location && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      💡 <strong>Tip:</strong> Showing all coaches. Use filters below to find coaches near you!
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Search by Location/Area
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g., Mumbai, Delhi, Bangalore"
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="w-full px-4 py-2 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (user?.location) {
                            setFilters({ ...filters, location: user.location });
                          }
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Use my location"
                      >
                        📍
                      </button>
                    </div>
                    {user?.location && (
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Click 📍 to use your location: {user.location}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Search by Sport
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Football, Cricket, Tennis"
                      value={filters.sport}
                      onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
                {(filters.location || filters.sport) && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Found <span className="font-bold text-blue-600">{coaches.length}</span> coach(es)
                    </p>
                    <button
                      onClick={() => setFilters({ location: '', sport: '' })}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {coaches.length === 0 ? (
              <div className="max-w-2xl mx-auto text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No coaches found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={() => setFilters({ location: '', sport: '' })}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Show All Coaches
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map((coach) => (
              <div key={coach._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white text-center">
                  <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 mb-3">
                    {coach.firstName.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-bold">{coach.firstName} {coach.lastName}</h3>
                  <p className="opacity-90">{coach.specialization}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <i className="bi bi-award-fill text-yellow-500 mr-2"></i>
                      <span className="text-sm">{coach.certification}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <i className="bi bi-calendar-check text-blue-500 mr-2"></i>
                      <span className="text-sm">{coach.experience} years experience</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <i className="bi bi-telephone-fill text-green-500 mr-2"></i>
                      <span className="text-sm">{coach.business_phone}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <i className="bi bi-star-fill text-yellow-500 mr-2"></i>
                      <span className="text-sm font-semibold">4.8 Rating</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCoach(coach);
                      setStep(2);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Select Coach
                  </button>
                </div>
              </div>
            ))}
              </div>
            )}
          </>
        )}

        {/* Step 2: Choose Time & Session */}
        {step === 2 && selectedCoach && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Schedule Your Session</h2>
                <button onClick={() => setStep(1)} className="text-blue-600 hover:text-blue-700">
                  ← Change Coach
                </button>
              </div>

              {/* Selected Coach Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {selectedCoach.firstName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedCoach.firstName} {selectedCoach.lastName}</h3>
                    <p className="text-gray-600">{selectedCoach.specialization}</p>
                  </div>
                </div>
              </div>

              {/* Session Type */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">Session Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sessionTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, sessionType: type.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.sessionType === type.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className="font-semibold">{type.label}</div>
                      <div className="text-blue-600 font-bold">₹{type.price}/hr</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">Select Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              {/* Time Slots */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">Select Time Slot</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setFormData({ ...formData, time: slot })}
                      className={`py-3 px-2 rounded-lg font-semibold transition-all ${
                        formData.time === slot
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">Duration (Hours)</label>
                <div className="flex gap-3">
                  {['1', '2', '3', '4'].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setFormData({ ...formData, duration: dur })}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                        formData.duration === dur
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {dur} {dur === '1' ? 'Hour' : 'Hours'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">₹{calculatePrice()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{formData.duration} hour(s)</p>
                    <p className="text-sm text-gray-600">{sessionTypes.find(s => s.value === formData.sessionType)?.label}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={!formData.date || !formData.time}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm Booking */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Confirm Booking</h2>
                <button onClick={() => setStep(2)} className="text-blue-600 hover:text-blue-700">
                  ← Back
                </button>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">ℹ️</div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Payment Process</h4>
                    <p className="text-sm text-blue-800">
                      Your booking request will be sent to the coach. Payment will be required only after the coach approves your booking request.
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coach</span>
                    <span className="font-semibold">{selectedCoach.firstName} {selectedCoach.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold">{new Date(formData.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-semibold">{formData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{formData.duration} hour(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Type</span>
                    <span className="font-semibold">{sessionTypes.find(s => s.value === formData.sessionType)?.label}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-bold">Total Amount</span>
                    <span className="font-bold text-blue-600">₹{calculatePrice()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Submit Booking Request
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                💡 You'll be notified once the coach approves your request. Payment link will be sent after approval.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCoach;
