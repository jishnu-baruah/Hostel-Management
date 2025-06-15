const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const noticeController = require('../controllers/noticeController');

const router = express.Router();

// Placeholder routes for notice functionality
// These will be implemented in future iterations

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
router.get('/', protect, noticeController.getAllNotices);

// @desc    Create new notice (Admin only)
// @route   POST /api/notices
// @access  Private/Admin
router.post('/', protect, adminOnly, noticeController.createNotice);

// @desc    Update notice (Admin only)
// @route   PUT /api/notices/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, noticeController.updateNotice);

// @desc    Delete notice (Admin only)
// @route   DELETE /api/notices/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, noticeController.deleteNotice);

// @desc    Mark notice as read
// @route   PUT /api/notices/:id/read
// @access  Private
router.put('/:id/read', protect, noticeController.markNoticeRead);

// @desc    Get unread notices count
// @route   GET /api/notices/unread-count
// @access  Private
router.get('/unread-count', protect, noticeController.getUnreadNoticesCount);

module.exports = router;