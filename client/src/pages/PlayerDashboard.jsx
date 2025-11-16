import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./playerDashboard.css";

export default function PlayerDashboard() {
  const navigate = useNavigate();
  const { user, logout: contextLogout } = useContext(AuthContext);

  const logout = () => {
    contextLogout();
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
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

      {/* DASHBOARD CONTENT */}
      <div className="dashboard-bg">
        <div className="container py-5">
          {/* Welcome Header */}
          <div className="welcome-header mb-5">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="display-4 fw-bold mb-3">
                  Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="lead text-muted">Ready to take your game to the next level?</p>
              </div>
              <div className="col-md-4 text-end">
                <div className="profile-badge">
                  <div className="profile-icon">{user?.firstName?.charAt(0)}</div>
                  <div className="ms-3">
                    <div className="fw-bold">{user?.firstName} {user?.lastName}</div>
                    <div className="text-muted small">Player Account</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="stat-card stat-card-blue">
                <div className="stat-icon">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{user?.location || "Not Set"}</h3>
                  <p className="stat-label">Your Location</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="stat-card stat-card-green">
                <div className="stat-icon">
                  <i className="bi bi-trophy-fill"></i>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{user?.sport || "Not Set"}</h3>
                  <p className="stat-label">Favorite Sport</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="stat-card stat-card-purple">
                <div className="stat-icon">
                  <i className="bi bi-star-fill"></i>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{user?.skill_level || "Beginner"}</h3>
                  <p className="stat-label">Skill Level</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="row g-4">
            <div className="col-md-4">
              <div className="action-card action-card-gradient-blue">
                <div className="action-icon">
                  <i className="bi bi-person-video3"></i>
                </div>
                <h3 className="action-title">Book a Coach</h3>
                <p className="action-description">
                  Connect with professional coaches to improve your skills
                </p>
                <Link to="/book-coach" className="action-btn">
                  Find Coaches <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="action-card action-card-gradient-green">
                <div className="action-icon">
                  <i className="bi bi-building"></i>
                </div>
                <h3 className="action-title">Book a Turf</h3>
                <p className="action-description">
                  Reserve premium sports facilities for your games
                </p>
                <Link to="/book-turf" className="action-btn">
                  Browse Turfs <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="action-card action-card-gradient-purple">
                <div className="action-icon">
                  <i className="bi bi-mortarboard-fill"></i>
                </div>
                <h3 className="action-title">Learning Hub</h3>
                <p className="action-description">
                  Watch tutorials & take quizzes to master your game
                </p>
                <Link to="/learning" className="action-btn">
                  Start Learning <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* My Bookings Section */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="bookings-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold mb-0">
                    <i className="bi bi-calendar-check me-2 text-primary"></i>
                    My Bookings
                  </h3>
                  <Link to="/my-bookings" className="btn btn-outline-primary">
                    View All <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                </div>
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h4>No bookings yet</h4>
                  <p className="text-muted">Start by booking a coach or turf to begin your journey!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="row mt-4 g-4">
            <div className="col-md-3">
              <div className="quick-stat">
                <div className="quick-stat-icon bg-primary">
                  <i className="bi bi-calendar-event"></i>
                </div>
                <div className="quick-stat-content">
                  <h4>0</h4>
                  <p>Total Bookings</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="quick-stat">
                <div className="quick-stat-icon bg-success">
                  <i className="bi bi-check-circle"></i>
                </div>
                <div className="quick-stat-content">
                  <h4>0</h4>
                  <p>Completed</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="quick-stat">
                <div className="quick-stat-icon bg-warning">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div className="quick-stat-content">
                  <h4>0</h4>
                  <p>Pending</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="quick-stat">
                <div className="quick-stat-icon bg-info">
                  <i className="bi bi-star-fill"></i>
                </div>
                <div className="quick-stat-content">
                  <h4>0</h4>
                  <p>Points Earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
