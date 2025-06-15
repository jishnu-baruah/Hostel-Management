const express = require('express');
const { protect, adminOnly, studentOnly } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Student endpoints
router.get('/student/:id', protect, paymentController.getStudentPayments);
router.post('/create', protect, studentOnly, paymentController.createPaymentOrder);
router.post('/verify', protect, studentOnly, paymentController.verifyPayment);
router.get('/receipt/:id', protect, paymentController.getPaymentReceipt);

// Admin endpoints
router.get('/', protect, adminOnly, paymentController.getAllPayments);
router.put('/:id/status', protect, adminOnly, paymentController.updatePaymentStatus);
router.post('/generate-bills', protect, adminOnly, paymentController.generateMonthlyBills);

module.exports = router;