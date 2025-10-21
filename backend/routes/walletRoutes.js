const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');
const { getWalletAddresses, updateWalletAddress } = require('../controllers/walletController');

const router = express.Router();

// Validation rules
const updateWalletValidation = [
  body('currency').trim().notEmpty().withMessage('Currency is required'),
  body('network').trim().notEmpty().withMessage('Network is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('adminName').trim().notEmpty().withMessage('Admin name is required')
];

// Public route - get wallet addresses (for users to see deposit addresses)
router.get('/', getWalletAddresses);

// Admin route - update wallet addresses
router.post('/update', adminAuth, updateWalletValidation, updateWalletAddress);

module.exports = router;
