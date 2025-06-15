const express = require('express');
const { protect, adminOnly, studentOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const complaintController = require('../controllers/complaintController');

const router = express.Router();

// Placeholder routes for complaint functionality
// These will be implemented in future iterations

// @desc    Get complaints (filtered by user role)
// @route   GET /api/complaints
// @access  Private
router.get('/', protect, complaintController.getComplaints);

// @desc    Submit new complaint
// @route   POST /api/complaints
// @access  Private/Student
router.post('/', protect, studentOnly, upload.array('photos', 5), complaintController.createComplaint);

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
router.get('/:id', protect, complaintController.getComplaintById);

// @desc    Update complaint status (Admin only)
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, complaintController.updateComplaintStatus);

// @desc    Rate resolved complaint
// @route   POST /api/complaints/:id/rating
// @access  Private/Student
router.post('/:id/rating', protect, studentOnly, complaintController.rateComplaint);

// @desc    Add comment to complaint
// @route   POST /api/complaints/:id/comments
// @access  Private
router.post('/:id/comments', protect, complaintController.addComment);

module.exports = router;