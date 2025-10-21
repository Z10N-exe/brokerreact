const express = require('express');
const { body } = require('express-validator');
const { adminAuth } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  adjustBalance,
  addProfit,
  approveWithdrawal,
  rejectWithdrawal,
  approveDeposit,
  rejectDeposit,
  impersonateUser,
  getAuditLogs,
  getPendingTransactions
} = require('../controllers/adminController');

const router = express.Router();

// Validation rules
const adjustBalanceValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type').isIn(['credit', 'debit']).withMessage('Type must be credit or debit'),
  body('note').optional().trim()
];

const addProfitValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('note').optional().trim()
];

const transactionActionValidation = [
  body('note').optional().trim()
];

// All admin routes require admin authentication
router.use(adminAuth);

// User management
router.get('/users', getAllUsers);
router.get('/user/:id', getUserById);
router.post('/user/:id/adjust-balance', adjustBalanceValidation, adjustBalance);
router.post('/user/:id/add-profit', addProfitValidation, addProfit);
router.post('/impersonate/:id', impersonateUser);

// Transaction management
router.get('/transactions/pending', getPendingTransactions);
router.post('/withdraw/:id/approve', transactionActionValidation, approveWithdrawal);
router.post('/withdraw/:id/reject', transactionActionValidation, rejectWithdrawal);
router.post('/deposit/:id/approve', transactionActionValidation, approveDeposit);
router.post('/deposit/:id/reject', transactionActionValidation, rejectDeposit);

// Audit logs
router.get('/logs', getAuditLogs);

module.exports = router;
