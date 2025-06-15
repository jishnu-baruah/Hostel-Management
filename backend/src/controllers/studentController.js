const User = require('../models/User');
const Room = require('../models/Room');
const { validationResult } = require('express-validator');

// @desc    Get all students (Admin only)
// @route   GET /api/students
// @access  Private/Admin
const getAllStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { role: 'student' };
    
    // Filter by approval status
    if (req.query.approved !== undefined) {
      query.isApproved = req.query.approved === 'true';
    }
    
    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const students = await User.find(query)
      .populate('roomId', 'roomNumber floor capacity')
      .select('-password')
      .sort({ registrationDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      students
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private/Student
const getStudentProfile = async (req, res, next) => {
  try {
    const student = await User.findById(req.user.id)
      .populate('roomId')
      .select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      student
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get student by ID (Admin only)
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudentById = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id)
      .populate('roomId')
      .select('-password');

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      student
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Approve student registration (Admin only)
// @route   PUT /api/students/:id/approve
// @access  Private/Admin
const approveStudent = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Student is already approved'
      });
    }

    student.isApproved = true;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student approved successfully',
      student: student.getPublicProfile()
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Reject student registration (Admin only)
// @route   PUT /api/students/:id/reject
// @access  Private/Admin
const rejectStudent = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // For now, we'll just delete the student record
    // In production, you might want to keep a record with rejection reason
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student registration rejected and removed',
      reason
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Assign room to student (Admin only)
// @route   PUT /api/students/:id/assign-room
// @access  Private/Admin
const assignRoom = async (req, res, next) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID is required'
      });
    }

    const student = await User.findById(req.params.id);
    const room = await Room.findById(roomId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (!student.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign room to unapproved student'
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

    // Assign student to new room
    await room.addOccupant(student._id);
    student.roomId = roomId;
    await student.save();

    // Populate room details for response
    await student.populate('roomId');

    res.status(200).json({
      success: true,
      message: 'Room assigned successfully',
      student: student.getPublicProfile()
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Remove student from room (Admin only)
// @route   PUT /api/students/:id/remove-room
// @access  Private/Admin
const removeFromRoom = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!student.roomId) {
      return res.status(400).json({
        success: false,
        message: 'Student is not assigned to any room'
      });
    }

    const room = await Room.findById(student.roomId);
    if (room) {
      await room.removeOccupant(student._id);
    }

    student.roomId = null;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student removed from room successfully',
      student: student.getPublicProfile()
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Upload student documents
// @route   POST /api/students/documents
// @access  Private/Student
const uploadDocuments = async (req, res, next) => {
  try {
    // This will be implemented when we add file upload middleware
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      message: 'Document upload endpoint - to be implemented with file upload middleware'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get pending approvals count (Admin only)
// @route   GET /api/students/pending-count
// @access  Private/Admin
const getPendingApprovalsCount = async (req, res, next) => {
  try {
    const count = await User.countDocuments({
      role: 'student',
      isApproved: false
    });

    res.status(200).json({
      success: true,
      pendingCount: count
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get student statistics (Admin only)
// @route   GET /api/students/stats
// @access  Private/Admin
const getStudentStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          approvedStudents: {
            $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
          },
          pendingStudents: {
            $sum: { $cond: [{ $eq: ['$isApproved', false] }, 1, 0] }
          },
          studentsWithRooms: {
            $sum: { $cond: [{ $ne: ['$roomId', null] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalStudents: 0,
      approvedStudents: 0,
      pendingStudents: 0,
      studentsWithRooms: 0
    };

    res.status(200).json({
      success: true,
      stats: result
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Save Expo push token for notifications
// @route   POST /api/students/push-token
// @access  Private/Student
const saveExpoPushToken = async (req, res, next) => {
  try {
    const { expoPushToken } = req.body;
    if (!expoPushToken) {
      return res.status(400).json({ success: false, message: 'expoPushToken is required' });
    }
    req.user.expoPushToken = expoPushToken;
    await req.user.save();
    res.status(200).json({ success: true, message: 'Expo push token saved' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student (Admin only)
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
  deleteStudent,
};