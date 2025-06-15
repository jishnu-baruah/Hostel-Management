const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Room = require('../models/Room');

// GET /api/complaints - List complaints (admin: all, student: own)
exports.getComplaints = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.userId = req.user._id;
    } else if (req.query.studentId) {
      query.userId = req.query.studentId;
    }
    if (req.query.status) query.status = req.query.status;
    if (req.query.category) query.category = req.query.category;
    if (req.query.priority) query.priority = req.query.priority;
    const complaints = await Complaint.find(query)
      .populate('userId', 'name email')
      .populate('roomId', 'roomNumber')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) {
    next(err);
  }
};

// GET /api/complaints/:id - Get single complaint
exports.getComplaintById = async (req, res, next) => {
  try {
    console.log('getComplaintById called');
    console.log('User:', req.user);
    console.log('Complaint ID:', req.params.id);
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('roomId', 'roomNumber')
      .populate('assignedTo', 'name email');
    console.log('Complaint found:', complaint);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    if (req.user.role === 'student' && !complaint.userId.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, complaint });
  } catch (err) {
    console.error('Error in getComplaintById:', err);
    next(err);
  }
};

// POST /api/complaints - Student submits complaint
exports.createComplaint = async (req, res, next) => {
  try {
    const { category, title, description, priority, roomId } = req.body;
    let photos = [];
    if (req.files && req.files.length > 0) {
      photos = req.files.map(f => f.path.replace('uploads/', '/uploads/'));
    }
    const complaint = await Complaint.create({
      userId: req.user._id,
      roomId: roomId || null,
      category,
      title,
      description,
      priority: priority || 'medium',
      photos,
      status: 'open',
    });
    res.status(201).json({ success: true, complaint });
  } catch (err) {
    next(err);
  }
};

// PUT /api/complaints/:id/status - Admin updates status, priority, assignedTo, resolution
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, priority, assignedTo, resolution } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    if (status) {
      if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      complaint.status = status;
      if (status === 'resolved') {
        complaint.resolvedAt = new Date();
      }
    }
    if (priority) complaint.priority = priority;
    if (assignedTo) complaint.assignedTo = assignedTo;
    if (resolution !== undefined) complaint.resolution = resolution;
    complaint.updatedAt = new Date();
    await complaint.save();
    res.json({ success: true, complaint });
  } catch (err) {
    next(err);
  }
};

// POST /api/complaints/:id/rating - Student rates resolved complaint
exports.rateComplaint = async (req, res, next) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be 1-5' });
    }
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    if (!complaint.userId.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (complaint.status !== 'resolved' && complaint.status !== 'closed') {
      return res.status(400).json({ success: false, message: 'Can only rate resolved/closed complaints' });
    }
    complaint.rating = rating;
    await complaint.save();
    res.json({ success: true, complaint });
  } catch (err) {
    next(err);
  }
};

// (Optional) POST /api/complaints/:id/comments - Add comment to complaint (future)
exports.addComment = async (req, res, next) => {
  res.status(501).json({ success: false, message: 'Comments not implemented yet' });
}; 