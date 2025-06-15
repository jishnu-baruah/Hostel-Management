const express = require('express');
const {
  getAllRooms,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  assignStudentToRoom,
  removeStudentFromRoom,
  getRoomStats
} = require('../controllers/roomController');

const { protect, adminOnly } = require('../middleware/auth');
const {
  validateRoomCreation,
  validateRoomUpdate
} = require('../middleware/validation');

const router = express.Router();

// Public/Protected routes (accessible to both students and admins)
router.get('/', protect, getAllRooms);
router.get('/available', protect, getAvailableRooms);
router.get('/:id', protect, getRoomById);

// Admin only routes
router.post('/', protect, adminOnly, validateRoomCreation, createRoom);
router.put('/:id', protect, adminOnly, validateRoomUpdate, updateRoom);
router.delete('/:id', protect, adminOnly, deleteRoom);
router.put('/:id/assign', protect, adminOnly, assignStudentToRoom);
router.put('/:id/remove', protect, adminOnly, removeStudentFromRoom);
router.get('/admin/stats', protect, adminOnly, getRoomStats);

module.exports = router;