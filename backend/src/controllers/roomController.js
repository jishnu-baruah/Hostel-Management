const Room = require('../models/Room');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
const getAllRooms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by floor
    if (req.query.floor) {
      query.floor = parseInt(req.query.floor);
    }

    // Filter by capacity
    if (req.query.capacity) {
      query.capacity = parseInt(req.query.capacity);
    }

    // Filter by room type
    if (req.query.roomType) {
      query.roomType = req.query.roomType;
    }

    // Search by room number
    if (req.query.search) {
      query.roomNumber = { $regex: req.query.search, $options: 'i' };
    }

    const rooms = await Room.find(query)
      .populate('occupants', 'name email phone')
      .sort({ floor: 1, roomNumber: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Room.countDocuments(query);

    res.status(200).json({
      success: true,
      count: rooms.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      rooms
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get available rooms
// @route   GET /api/rooms/available
// @access  Private
const getAvailableRooms = async (req, res, next) => {
  try {
    const capacity = req.query.capacity ? parseInt(req.query.capacity) : null;
    
    const rooms = await Room.findAvailableRooms(capacity);

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Private
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('occupants', 'name email phone college course year');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      room
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Create new room (Admin only)
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update room (Admin only)
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if capacity is being reduced below current occupancy
    if (req.body.capacity && req.body.capacity < room.currentOccupancy) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reduce capacity below current occupancy'
      });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('occupants', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      room: updatedRoom
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete room (Admin only)
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room has occupants
    if (room.currentOccupancy > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with occupants. Please reassign students first.'
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Assign student to room (Admin only)
// @route   PUT /api/rooms/:id/assign
// @access  Private/Admin
const assignStudentToRoom = async (req, res, next) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    const room = await Room.findById(req.params.id);
    const student = await User.findById(studentId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!student.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign unapproved student to room'
      });
    }

    if (room.currentOccupancy >= room.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Room is at full capacity'
      });
    }

    if (room.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Room is not available'
      });
    }

    // Remove student from previous room if assigned
    if (student.roomId) {
      const previousRoom = await Room.findById(student.roomId);
      if (previousRoom) {
        await previousRoom.removeOccupant(student._id);
      }
    }

    // Assign student to room
    await room.addOccupant(student._id);
    student.roomId = room._id;
    await student.save();

    // Get updated room with occupants
    const updatedRoom = await Room.findById(req.params.id)
      .populate('occupants', 'name email phone college course year');

    res.status(200).json({
      success: true,
      message: 'Student assigned to room successfully',
      room: updatedRoom
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Remove student from room (Admin only)
// @route   PUT /api/rooms/:id/remove
// @access  Private/Admin
const removeStudentFromRoom = async (req, res, next) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    const room = await Room.findById(req.params.id);
    const student = await User.findById(studentId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!room.occupants.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Student is not assigned to this room'
      });
    }

    // Remove student from room
    await room.removeOccupant(student._id);
    student.roomId = null;
    await student.save();

    // Get updated room with occupants
    const updatedRoom = await Room.findById(req.params.id)
      .populate('occupants', 'name email phone college course year');

    res.status(200).json({
      success: true,
      message: 'Student removed from room successfully',
      room: updatedRoom
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get room occupancy statistics (Admin only)
// @route   GET /api/rooms/stats
// @access  Private/Admin
const getRoomStats = async (req, res, next) => {
  try {
    const stats = await Room.getOccupancyStats();

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRooms,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  assignStudentToRoom,
  removeStudentFromRoom,
  getRoomStats
};