const express = require('express');
const {
  getAllStudents,
  getStudentProfile,
  getStudentById,
  approveStudent,
  rejectStudent,
  assignRoom,
  removeFromRoom,
  uploadDocuments,
  getPendingApprovalsCount,
  getStudentStats,
  saveExpoPushToken,
  deleteStudent
} = require('../controllers/studentController');

const { protect, adminOnly, studentOnly, ownerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin only routes
router.get('/', protect, adminOnly, getAllStudents);
router.get('/pending-count', protect, adminOnly, getPendingApprovalsCount);
router.get('/stats', protect, adminOnly, getStudentStats);
router.get('/:id', protect, adminOnly, getStudentById);
router.put('/:id/approve', protect, adminOnly, approveStudent);
router.put('/:id/reject', protect, adminOnly, rejectStudent);
router.put('/:id/assign-room', protect, adminOnly, assignRoom);
router.put('/:id/remove-room', protect, adminOnly, removeFromRoom);
router.delete('/:id', protect, adminOnly, deleteStudent);

// Student routes
router.get('/profile/me', protect, studentOnly, getStudentProfile);
router.post('/documents', protect, studentOnly, uploadDocuments);
router.post('/push-token', protect, studentOnly, saveExpoPushToken);

module.exports = router;