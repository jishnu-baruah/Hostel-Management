const User = require('../models/User');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');
const Notice = require('../models/Notice');
const Payment = require('../models/Payment');

// GET /api/dashboard/admin
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const [students, rooms, complaints, notices, payments] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Room.countDocuments(),
      Complaint.countDocuments(),
      Notice.countDocuments(),
      Payment.countDocuments(),
    ]);
    res.json({
      success: true,
      data: { students, rooms, complaints, notices, payments }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/student
exports.getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('roomId');
    const complaints = await Complaint.find({ userId });
    const notices = await Notice.find({}); // or filter for relevant notices
    const payments = await Payment.find({ userId });

    res.json({
      success: true,
      data: {
        room: user.roomId,
        complaints,
        notices,
        payments,
      }
    });
  } catch (err) {
    next(err);
  }
}; 