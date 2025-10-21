const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');
const {
  createDeposit,
  getUserDeposits,
  getAllDeposits,
  approveDeposit,
  rejectDeposit
} = require('../controllers/depositController');

const router = express.Router();

// Validation rules
const createDepositValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('currency').trim().notEmpty().withMessage('Currency is required'),
  body('transactionHash').optional().trim()
];

const depositActionValidation = [
  body('note').optional().trim()
];

// User routes (require authentication)
router.post('/', authMiddleware, createDepositValidation, createDeposit);
router.get('/my', authMiddleware, getUserDeposits);

// Admin routes (require admin key)
router.get('/all', adminAuth, getAllDeposits);
router.post('/:id/approve', adminAuth, depositActionValidation, approveDeposit);
router.post('/:id/reject', adminAuth, depositActionValidation, rejectDeposit);

module.exports = router;
