const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/authMiddleware');
const { getMe, createDeposit, createWithdrawal, getTransactions } = require('../controllers/userController');

const router = express.Router();

// Validation rules
const depositValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 1 }).withMessage('Amount must be greater than 0')
];

const withdrawalValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 1 }).withMessage('Amount must be greater than 0')
];

// Protected routes
router.get('/me', authMiddleware, getMe);
router.post('/deposit', authMiddleware, depositValidation, createDeposit);
router.post('/withdraw', authMiddleware, withdrawalValidation, createWithdrawal);
router.get('/transactions', authMiddleware, getTransactions);

module.exports = router;
