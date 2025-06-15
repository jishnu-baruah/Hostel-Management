const Payment = require('../models/Payment');
const { isMockPaymentMode } = require('../services/paymentService');
const mongoose = require('mongoose');

// Helper: Calculate late fee
function calculateLateFee(dueDate, paidAt, baseAmount) {
  if (!dueDate || !paidAt) return 0;
  const lateDays = Math.ceil((paidAt - dueDate) / (1000 * 60 * 60 * 24));
  if (lateDays > 0) {
    return Math.round(baseAmount * 0.02 * lateDays); // 2% per day late fee
  }
  return 0;
}

// GET /api/payments/student/:id
exports.getStudentPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.params.id }).sort({ dueDate: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/create
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { userId, roomId, amount, type, month, dueDate } = req.body;
    if (isMockPaymentMode()) {
      // Create mock payment order in DB
      const payment = await Payment.create({
        userId,
        roomId,
        amount,
        type,
        month,
        dueDate,
        status: 'pending',
      });
      return res.json({ success: true, order: { id: payment._id, amount, currency: 'INR', status: 'created' }, mode: 'mock' });
    } else {
      // TODO: Razorpay integration
      return res.status(501).json({ success: false, message: 'Razorpay integration not implemented yet.' });
    }
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, razorpayPaymentId } = req.body;
    if (isMockPaymentMode()) {
      // Mark payment as completed, calculate late fee
      const payment = await Payment.findById(paymentId);
      if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
      if (payment.status === 'completed') return res.json({ success: true, message: 'Already paid' });
      const paidAt = new Date();
      const lateFee = calculateLateFee(payment.dueDate, paidAt, payment.amount);
      payment.status = 'completed';
      payment.paidAt = paidAt;
      payment.lateFee = lateFee;
      payment.razorpayPaymentId = razorpayPaymentId || 'mock_payment_' + Date.now();
      await payment.save();
      return res.json({ success: true, message: 'Mock payment verified', payment });
    } else {
      // TODO: Razorpay verification
      return res.status(501).json({ success: false, message: 'Razorpay integration not implemented yet.' });
    }
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/receipt/:id
exports.getPaymentReceipt = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('userId', 'name email');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    // For mock, just return payment info; for real, return/download PDF
    res.json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};

// GET /api/payments (admin)
exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().populate('userId', 'name email').sort({ dueDate: -1 });
    // Add studentName/email for admin UI
    const paymentsWithUser = payments.map(p => ({
      ...p.toObject(),
      studentName: p.userId?.name,
      studentEmail: p.userId?.email,
    }));
    res.json({ success: true, payments: paymentsWithUser });
  } catch (err) {
    next(err);
  }
};

// PUT /api/payments/:id/status (admin)
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    payment.status = status;
    if (status === 'completed' && !payment.paidAt) {
      payment.paidAt = new Date();
      payment.lateFee = calculateLateFee(payment.dueDate, payment.paidAt, payment.amount);
    }
    await payment.save();
    res.json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/generate-bills (admin, mock)
exports.generateMonthlyBills = async (req, res, next) => {
  try {
    // For all students, create a rent payment for the current month if not exists
    const User = mongoose.model('User');
    const Room = mongoose.model('Room');
    const students = await User.find({ role: 'student', isApproved: true });
    const now = new Date();
    const month = now.toISOString().slice(0, 7); // 'YYYY-MM'
    let created = 0;
    for (const student of students) {
      if (!student.roomId) continue;
      const room = await Room.findById(student.roomId);
      if (!room) continue;
      const exists = await Payment.findOne({ userId: student._id, type: 'rent', month });
      if (!exists) {
        await Payment.create({
          userId: student._id,
          roomId: room._id,
          amount: room.monthlyRent,
          type: 'rent',
          month,
          dueDate: new Date(now.getFullYear(), now.getMonth(), 5), // e.g., 5th of month
          status: 'pending',
        });
        created++;
      }
    }
    res.json({ success: true, message: `Generated ${created} rent bills for ${month}` });
  } catch (err) {
    next(err);
  }
}; 