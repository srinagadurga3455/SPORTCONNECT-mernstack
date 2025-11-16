import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PlayerSetup from './pages/PlayerSetup';
import CoachSetup from './pages/CoachSetup';
import TurfSetup from './pages/TurfSetup';
import PlayerDashboard from './pages/PlayerDashboard';
import CoachDashboard from './pages/CoachDashboard';
import TurfDashboard from './pages/TurfDashboard';
import BookCoach from './pages/BookCoach';
import BookTurf from './pages/BookTurf';
import ViewBookings from './pages/ViewBookings';
import LearningHub from './pages/LearningHub';
import QuizGame from './pages/QuizGame';
import VideoPlayer from './pages/VideoPlayer';
import VerificationSubmit from './pages/VerificationSubmit';
import AdminVerification from './pages/AdminVerification';

const DashboardRedirect = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.profileCompleted) {
    return <Navigate to={`/setup-${user.role}`} />;
  }

  return <Navigate to={`/${user.role}-dashboard`} />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/login', '/signup'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Profile Setup Routes */}
            <Route path="/setup-player" element={<ProtectedRoute><PlayerSetup /></ProtectedRoute>} />
            <Route path="/setup-coach" element={<ProtectedRoute><CoachSetup /></ProtectedRoute>} />
            <Route path="/setup-turf" element={<ProtectedRoute><TurfSetup /></ProtectedRoute>} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/player-dashboard" element={<ProtectedRoute><PlayerDashboard /></ProtectedRoute>} />
            <Route path="/coach-dashboard" element={<ProtectedRoute><CoachDashboard /></ProtectedRoute>} />
            <Route path="/turf-dashboard" element={<ProtectedRoute><TurfDashboard /></ProtectedRoute>} />

            {/* Booking Routes */}
            <Route path="/book-coach" element={<ProtectedRoute><BookCoach /></ProtectedRoute>} />
            <Route path="/book-turf" element={<ProtectedRoute><BookTurf /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><ViewBookings /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><BookTurf /></ProtectedRoute>} />
            <Route path="/coachbookings" element={<ProtectedRoute><BookCoach /></ProtectedRoute>} />

            {/* Learning Routes */}
            <Route path="/learning" element={<ProtectedRoute><LearningHub /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<ProtectedRoute><QuizGame /></ProtectedRoute>} />
            <Route path="/video/:id" element={<ProtectedRoute><VideoPlayer /></ProtectedRoute>} />

            {/* Verification Routes */}
            <Route path="/verification/submit" element={<ProtectedRoute><VerificationSubmit /></ProtectedRoute>} />
            <Route path="/admin/verifications" element={<ProtectedRoute><AdminVerification /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
