import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import "./playerDashboard.css";

export default function CoachDashboard() {
  const navigate = useNavigate();
  const { user, logout: contextLogout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/assigned');
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await API.patch('/bookings/update-status', { bookingId, status });
      fetchBookings();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const logout = () => {
    contextLogout();
    navigate("/login");
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const approvedBookings = bookings.filter(b => b.status === 'approved');

  const isVerified = user?.isVerified && user?.verificationStatus === 'approved';
  const isPending = user?.verificationStatus === 'pending';
  const isRejected = user?.verificationStatus === 'rejected';

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-trophy-fill me-2"></i>SportConnect
          </Link>
          <div className="navbar-nav ms-auto">
            <button className="btn btn-logout" onClick={logout}>
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-bg">
        <div className="container py-5">
          {/* Verification Banner */}
          {!isVerified && (
            <div className={`alert ${isPending ? 'alert-warning' : isRejected ? 'alert-danger' : 'alert-info'} alert-dismissible fade show mb-4`} role="alert">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  {!user?.verificationData ? (
                    <>
                      <h5 className="alert-heading mb-2">⚠️ Verification Required</h5>
                      <p className="mb-2">Your account is not verified. Players can only book verified coaches.</p>
                      <p className="mb-0"><strong>Action needed:</strong> Submit your verification to start receiving bookings.</p>
                    </>
                  ) : isPending ? (
                    <>
                      <h5 className="alert-heading mb-2">⏳ Verification Pending</h5>
                      <p className="mb-0">Your verification request is under review. We'll notify you once it's processed (24-48 hours).</p>
                    </>
                  ) : isRejected ? (
                    <>
                      <h5 className="alert-heading mb-2">❌ Verification Rejected</h5>
                      <p className="mb-2">Your verification was not approved. Please resubmit with valid information.</p>
                      {user?.verificationNotes && <p className="mb-0"><strong>Reason:</strong> {user.verificationNotes}</p>}
                    </>
                  ) : (
                    <>
                      <h5 className="alert-heading mb-2">📋 Get Verified</h5>
                      <p className="mb-0">Verify your coaching business to start receiving bookings from players.</p>
                    </>
                  )}
                </div>
                {!isPending && (
                  <Link to="/verification/submit" className="btn btn-primary ms-3">
                    {isRejected ? 'Resubmit Verification' : 'Get Verified Now'}
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Welcome Header */}
          <div className="welcome-header mb-5">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="display-4 fw-bold mb-3">
                  Welcome, Coach {user?.firstName}! 🏆
                </h1>
                <p className="lead text-muted">Inspire the next generation of athletes</p>
              </div>
              <div className="col-md-4 text-end">
                <div className="profile-badge">
                  <div className="profile-icon">{user?.firstName?.charAt(0)}</div>
                  <div className="ms-3">
                    <div className="fw-bold">{user?.firstName} {user?.lastName}</div>
                    <div className="text-muted small">Coach Account</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="stat-card stat-card-blue">
                <div className="stat-icon">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{bookings.length}</h3>
                  <p className="stat-label">Total Requests</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="stat-card stat-card-green">
                <div className="stat-icon">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{approvedBookings.length}</h3>
                  <p className="stat-label">Approved</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="stat-card stat-card-purple">
                <div className="stat-icon">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{pendingBookings.length}</h3>
                  <p className="stat-label">Pending</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="stat-card stat-card-blue">
                <div className="stat-icon">
                  <i className="bi bi-star-fill"></i>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">4.8</h3>
                  <p className="stat-label">Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="action-card action-card-gradient-blue">
                <div className="action-icon">
                  <i className="bi bi-award-fill"></i>
                </div>
                <h3 className="action-title">Specialization</h3>
                <p className="action-description">{user?.specialization || "Not specified"}</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="action-card action-card-gradient-green">
                <div className="action-icon">
                  <i className="bi bi-patch-check-fill"></i>
                </div>
                <h3 className="action-title">Certification</h3>
                <p className="action-description">{user?.certification || "Not specified"}</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="action-card action-card-gradient-purple">
                <div className="action-icon">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h3 className="action-title">Experience</h3>
                <p className="action-description">{user?.experience || 0} years</p>
              </div>
            </div>
          </div>

          {/* Booking Requests */}
          <div className="bookings-card">
            <h3 className="fw-bold mb-4">
              <i className="bi bi-calendar-event me-2 text-primary"></i>
              Booking Requests
            </h3>

            {loading ? (
              <div className="empty-state">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h4>No booking requests yet</h4>
                <p className="text-muted">You'll see booking requests from players here</p>
              </div>
            ) : (
              <div className="row g-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="col-md-6">
                    <div className="booking-request-card">
                      <div className="booking-header">
                        <div className="booking-avatar">
                          {booking.userId?.firstName?.charAt(0)}
                        </div>
                        <div className="booking-info">
                          <h5 className="mb-1">{booking.userId?.firstName} {booking.userId?.lastName}</h5>
                          <p className="text-muted small mb-0">
                            <i className="bi bi-envelope me-1"></i>
                            {booking.userId?.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="booking-details">
                        <div className="detail-item">
                          <i className="bi bi-calendar3"></i>
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-item">
                          <i className="bi bi-clock"></i>
                          <span>{booking.time}</span>
                        </div>
                        <div className="detail-item">
                          <i className="bi bi-trophy"></i>
                          <span>{booking.userId?.sport || 'Sport'}</span>
                        </div>
                      </div>

                      <div className="booking-status">
                        <span className={`status-badge status-${booking.status}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>

                      {booking.status === 'pending' && (
                        <div className="booking-actions">
                          <button
                            onClick={() => updateStatus(booking._id, 'approved')}
                            className="btn-approve"
                          >
                            <i className="bi bi-check-circle me-2"></i>
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(booking._id, 'rejected')}
                            className="btn-reject"
                          >
                            <i className="bi bi-x-circle me-2"></i>
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
