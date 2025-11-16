// Admin-only access middleware
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. Admin privileges required.',
      userRole: req.user.role
    });
  }

  next();
};

module.exports = { adminOnly };
