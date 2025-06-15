const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: false,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: ['rent', 'security_deposit', 'maintenance'],
    required: true,
  },
  month: {
    type: String, // 'YYYY-MM'
    required: false,
  },
  razorpayOrderId: {
    type: String,
    default: '',
  },
  razorpayPaymentId: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  dueDate: {
    type: Date,
    required: false,
  },
  paidAt: {
    type: Date,
    required: false,
  },
  lateFee: {
    type: Number,
    default: 0,
  },
  receiptUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema); 