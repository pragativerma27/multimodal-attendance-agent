const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'attendance_super_secret_jwt_key_2026'
      );

      // Only query Mongoose if MongoDB connection is established
      if (mongoose.connection.readyState === 1) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (e) {
          // Fall through to fallback
        }
      }

      if (!req.user) {
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'Demo Instructor',
          email: decoded.email || 'teacher@college.edu',
          role: decoded.role || 'teacher',
        };
      }

      return next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin credentials required' });
  }
};

module.exports = { protect, adminOnly };
