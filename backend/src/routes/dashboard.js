const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

// Admin dashboard stats
router.get('/admin', protect, adminOnly, dashboardController.getAdminDashboard);

// Student dashboard stats
router.get('/student', protect, dashboardController.getStudentDashboard);

module.exports = router; 