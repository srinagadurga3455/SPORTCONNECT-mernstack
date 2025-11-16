import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const BookTurf = () => {
  const { user } = useContext(AuthContext);
  const [turfs, setTurfs] = useState([]);
  const [allTurfs, setAllTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    date: '', 
    time: '',
    duration: '1',
    sport: ''
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
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
    '09:00 PM', '10:00 PM'
  ];

  const pricePerHour = 1000;

  useEffect(() => {
    fetchTurfs();
  }, []);

  useEffect(() => {
    filterTurfs();
  }, [filters, allTurfs]);

  const fetchTurfs = async () => {
    try {
      const { data } = await API.get('/users/turfs');
      setAllTurfs(data);
      setTurfs(data); // Show all turfs initially
      
      // Auto-set location filter but don't apply it yet
      if (user?.location) {
        setFilters(prev => ({ ...prev, location: user.location }));
      }
    } catch (error) {
      console.error('Failed to fetch turfs', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTurfs = () => {
    let filtered = [...allTurfs];

    // Filter for verified turfs only
    filtered = filtered.filter(turf => 
      turf.isVerified === true && turf.verificationStatus === 'approved'
    );

    if (filters.location) {
      filtered = filtered.filter(turf =>
        turf.turf_address?.toLowerCase().includes(filters.location.toLowerCase()) ||
        turf.pin_code?.toLowerCase().includes(filters.location.toLowerCase()) ||
        turf.turf_name?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.sport) {
      filtered = filtered.filter(turf =>
        turf.available_sports?.some(sport =>
          sport.toLowerCase().includes(filters.sport.toLowerCase())
        )
      );
    }

    setTurfs(filtered);
  };

  const calculatePrice = () => {
    return pricePerHour * parseInt(formData.duration);
  };

  const handleBooking = async () => {
    try {
      const response = await API.post('/bookings/create', {
        targetId: selectedTurf._id,
        bookingType: 'turf',
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        sport: formData.sport,
        amount: calculatePrice()
      });
      setMessage('Booking request submitted successfully. Awaiting facility approval.');
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
          <p className="mt-3 text-gray-600">Loading turfs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book a Turf</h1>
          <p className="text-gray-600">Reserve premium sports facilities for your games</p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-semibold hidden sm:inline">Select Turf</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-semibold hidden sm:inline">Choose Time</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
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

        {/* Step 1: Select Turf */}
        {step === 1 && (
          <>
            {/* Filters */}
            <div className="max-w-4xl mx-auto mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold gradient-text">🔍 Find Your Perfect Turf</h3>
                  {user?.location && filters.location && (
                    <span className="text-sm badge-success">
                      📍 Near {user.location}
                    </span>
                  )}
                </div>
                {user?.location && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      💡 <strong>Tip:</strong> Showing all turfs. Use filters below to find turfs near you!
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Search by Location/PIN
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Andheri, Bandra, 400001"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                    />
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
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                    />
                  </div>
                </div>
                {(filters.location || filters.sport) && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Found <span className="font-bold text-green-600">{turfs.length}</span> turf(s)
                    </p>
                    <button
                      onClick={() => setFilters({ location: '', sport: '' })}
                      className="text-sm text-green-600 hover:text-green-700 font-semibold"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {turfs.length === 0 ? (
              <div className="max-w-2xl mx-auto text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No turfs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={() => setFilters({ location: '', sport: '' })}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Show All Turfs
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {turfs.map((turf) => (
              <div key={turf._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                  <div className="text-5xl mb-3 text-center">🏟️</div>
                  <h3 className="text-2xl font-bold text-center">{turf.turf_name}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <i className="bi bi-geo-alt-fill text-red-500 mr-2"></i>
                      <span className="text-sm">{turf.turf_address}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <i className="bi bi-pin-map-fill text-blue-500 mr-2"></i>
                      <span className="text-sm">PIN: {turf.pin_code}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <i className="bi bi-star-fill text-yellow-500 mr-2"></i>
                      <span className="text-sm font-semibold">4.7 Rating</span>
                    </div>
                  </div>

                  {/* Available Sports */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Available Sports:</p>
                    <div className="flex flex-wrap gap-2">
                      {(turf.available_sports || []).map((sport, i) => (
                        <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-center text-2xl font-bold text-green-600">₹{pricePerHour}/hr</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTurf(turf);
                      setStep(2);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
                  >
                    Select Turf
                  </button>
                </div>
              </div>
            ))}
              </div>
            )}
          </>
        )}

        {/* Step 2: Choose Time & Sport */}
        {step === 2 && selectedTurf && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Schedule Your Game</h2>
                <button onClick={() => setStep(1)} className="text-green-600 hover:text-green-700">
                  ← Change Turf
                </button>
              </div>

              {/* Selected Turf Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">🏟️</div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedTurf.turf_name}</h3>
                    <p className="text-gray-600">{selectedTurf.turf_address}</p>
                  </div>
                </div>
              </div>

              {/* Select Sport */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">Select Sport</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(selectedTurf.available_sports || []).map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setFormData({ ...formData, sport })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.sport === sport
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {sport === 'Football' ? '⚽' : sport === 'Cricket' ? '🏏' : sport === 'Basketball' ? '🏀' : '🎾'}
                      </div>
                      <div className="font-semibold text-sm">{sport}</div>
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
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
                          ? 'bg-green-600 text-white'
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
                <div className="grid grid-cols-4 gap-3">
                  {['1', '2', '3', '4'].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setFormData({ ...formData, duration: dur })}
                      className={`py-3 rounded-lg font-semibold transition-all ${
                        formData.duration === dur
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {dur} {dur === '1' ? 'Hour' : 'Hours'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">₹{calculatePrice()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{formData.duration} hour(s)</p>
                    <p className="text-sm text-gray-600">{formData.sport || 'Select sport'}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={!formData.date || !formData.time || !formData.sport}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
                <button onClick={() => setStep(2)} className="text-green-600 hover:text-green-700">
                  ← Back
                </button>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Turf</span>
                    <span className="font-semibold">{selectedTurf.turf_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sport</span>
                    <span className="font-semibold">{formData.sport}</span>
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
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-bold">Total Amount</span>
                    <span className="font-bold text-green-600">₹{calculatePrice()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Select Payment Method</h3>
                <div className="space-y-3">
                  <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-600 transition-all flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl">
                      💳
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, Rupay</div>
                    </div>
                  </button>
                  <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-600 transition-all flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xl">
                      📱
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">UPI</div>
                      <div className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</div>
                    </div>
                  </button>
                  <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-600 transition-all flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xl">
                      🏦
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Net Banking</div>
                      <div className="text-sm text-gray-600">All major banks</div>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Pay ₹{calculatePrice()} & Confirm Booking
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                🔒 Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTurf;
