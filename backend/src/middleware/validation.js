const { body } = require('express-validator');

// Student registration validation
const validateStudentRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('college')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('College name must be between 2 and 100 characters'),
  
  body('course')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Course name must be between 2 and 50 characters'),
  
  body('year')
    .isInt({ min: 1, max: 6 })
    .withMessage('Year must be between 1 and 6'),
  
  body('emergencyContact.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Emergency contact name must be between 2 and 50 characters'),
  
  body('emergencyContact.phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Emergency contact phone must be a valid 10-digit number'),
  
  body('emergencyContact.relation')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Relation must be between 2 and 30 characters')
];

// Admin registration validation
const validateAdminRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Admin password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('adminCode')
    .notEmpty()
    .withMessage('Admin registration code is required')
];

// Login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  
  body('college')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('College name must be between 2 and 100 characters'),
  
  body('course')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Course name must be between 2 and 50 characters'),
  
  body('year')
    .optional()
    .isInt({ min: 1, max: 6 })
    .withMessage('Year must be between 1 and 6')
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Room creation validation
const validateRoomCreation = [
  body('roomNumber')
    .trim()
    .notEmpty()
    .withMessage('Room number is required')
    .isLength({ min: 1, max: 10 })
    .withMessage('Room number must be between 1 and 10 characters'),
  
  body('floor')
    .isInt({ min: 0 })
    .withMessage('Floor must be a non-negative integer'),
  
  body('capacity')
    .isInt({ min: 1, max: 6 })
    .withMessage('Capacity must be between 1 and 6'),
  
  body('monthlyRent')
    .isFloat({ min: 0 })
    .withMessage('Monthly rent must be a positive number'),
  
  body('securityDeposit')
    .isFloat({ min: 0 })
    .withMessage('Security deposit must be a positive number'),
  
  body('roomType')
    .isIn(['single', 'double', 'triple', 'quad', 'dormitory'])
    .withMessage('Invalid room type'),
  
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

// Room update validation
const validateRoomUpdate = [
  body('roomNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Room number cannot be empty')
    .isLength({ min: 1, max: 10 })
    .withMessage('Room number must be between 1 and 10 characters'),
  
  body('floor')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Floor must be a non-negative integer'),
  
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 6 })
    .withMessage('Capacity must be between 1 and 6'),
  
  body('monthlyRent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly rent must be a positive number'),
  
  body('securityDeposit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Security deposit must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['available', 'occupied', 'maintenance', 'blocked'])
    .withMessage('Invalid room status'),
  
  body('roomType')
    .optional()
    .isIn(['single', 'double', 'triple', 'quad', 'dormitory'])
    .withMessage('Invalid room type'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

// Complaint creation validation
const validateComplaintCreation = [
  body('category')
    .isIn(['electrical', 'plumbing', 'cleanliness', 'security', 'other'])
    .withMessage('Invalid complaint category'),
  
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level')
];

// Notice creation validation
const validateNoticeCreation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Content must be between 10 and 2000 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  
  body('category')
    .optional()
    .isIn(['general', 'maintenance', 'events', 'urgent'])
    .withMessage('Invalid category'),
  
  body('scheduledFor')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date')
];

module.exports = {
  validateStudentRegistration,
  validateAdminRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateRoomCreation,
  validateRoomUpdate,
  validateComplaintCreation,
  validateNoticeCreation
};