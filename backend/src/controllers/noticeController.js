const Notice = require('../models/Notice');
const mongoose = require('mongoose');
const User = require('../models/User');
const { sendExpoPushNotification } = require('../services/notificationService');

// GET /api/notices
exports.getAllNotices = async (req, res, next) => {
  try {
    const { category, priority, search, isActive } = req.query;
    const query = {};
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    // Only show scheduled notices if scheduledFor <= now
    query.$or = query.$or || [];
    query.$or.push({ scheduledFor: { $exists: false } });
    query.$or.push({ scheduledFor: { $lte: new Date() } });
    const notices = await Notice.find(query)
      .sort({ scheduledFor: -1, createdAt: -1 })
      .populate('createdBy', 'name email');
    res.json({ success: true, notices });
  } catch (err) {
    next(err);
  }
};

// POST /api/notices (admin)
exports.createNotice = async (req, res, next) => {
  try {
    const { title, content, priority, category, scheduledFor } = req.body;
    const createdBy = req.user._id;
    const notice = await Notice.create({
      title,
      content,
      priority,
      category,
      createdBy,
      scheduledFor,
    });
    // Send push notification to all students with expoPushToken
    try {
      const students = await User.find({ role: 'student', expoPushToken: { $ne: null } }).select('expoPushToken');
      const tokens = students.map(s => s.expoPushToken).filter(Boolean);
      if (tokens.length > 0) {
        await sendExpoPushNotification(
          tokens,
          `New Notice: ${title}`,
          content.length > 80 ? content.slice(0, 77) + '...' : content,
          { noticeId: notice._id }
        );
      }
    } catch (err) {
      console.error('Failed to send push notifications:', err);
    }
    res.status(201).json({ success: true, notice });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notices/:id (admin)
exports.updateNotice = async (req, res, next) => {
  try {
    const { title, content, priority, category, isActive, scheduledFor } = req.body;
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    if (title !== undefined) notice.title = title;
    if (content !== undefined) notice.content = content;
    if (priority !== undefined) notice.priority = priority;
    if (category !== undefined) notice.category = category;
    if (isActive !== undefined) notice.isActive = isActive;
    if (scheduledFor !== undefined) notice.scheduledFor = scheduledFor;
    await notice.save();
    res.json({ success: true, notice });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notices/:id (admin)
exports.deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, message: 'Notice deleted' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notices/:id/read (student)
exports.markNoticeRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    if (!notice.readBy.some(rb => rb.userId.equals(userId))) {
      notice.readBy.push({ userId, readAt: new Date() });
      await notice.save();
    }
    res.json({ success: true, message: 'Notice marked as read' });
  } catch (err) {
    next(err);
  }
};

// GET /api/notices/unread-count
exports.getUnreadNoticesCount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // Only count notices that are active, scheduled for now or earlier, and not read by this user
    const now = new Date();
    const count = await Notice.countDocuments({
      isActive: true,
      $or: [
        { scheduledFor: { $exists: false } },
        { scheduledFor: { $lte: now } }
      ],
      'readBy.userId': { $ne: userId },
    });
    res.json({ success: true, count });
  } catch (err) {
    next(err);
  }
}; 