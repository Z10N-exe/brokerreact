const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');
const {
  createWithdrawal,
  getUserWithdrawals,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
} = require('../controllers/withdrawalController');

const router = express.Router();

// Validation rules
const createWithdrawalValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0')
];

const withdrawalActionValidation = [
  body('note').optional().trim()
];

// User routes (require authentication)
router.post('/', authMiddleware, createWithdrawalValidation, createWithdrawal);
router.get('/my', authMiddleware, getUserWithdrawals);

// Admin routes (require admin key)
router.get('/all', adminAuth, getAllWithdrawals);
router.post('/:id/approve', adminAuth, withdrawalActionValidation, approveWithdrawal);
router.post('/:id/reject', adminAuth, withdrawalActionValidation, rejectWithdrawal);

module.exports = router;
