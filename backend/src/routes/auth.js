const express = require('express');
const {
  registerStudent,
  registerAdmin,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  verifyToken
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
  validateStudentRegistration,
  validateAdminRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateStudentRegistration, registerStudent);
router.post('/admin-register', validateAdminRegistration, registerAdmin);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/verify', protect, verifyToken);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/change-password', protect, validatePasswordChange, changePassword);
router.post('/logout', protect, logout);

module.exports = router;