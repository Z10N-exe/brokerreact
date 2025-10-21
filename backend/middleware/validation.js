const { body, param, query, validationResult } = require('express-validator');

// Custom validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('country')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),
  
  body('phone')
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('phone')
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Amount validation
const validateAmount = [
  body('amount')
    .isFloat({ min: 0.01, max: 1000000 })
    .withMessage('Amount must be between $0.01 and $1,000,000'),
  
  handleValidationErrors
];

// Currency validation
const validateCurrency = [
  body('currency')
    .isIn(['BTC', 'ETH', 'USDT', 'USDC', 'LTC', 'BCH'])
    .withMessage('Invalid currency selected'),
  
  handleValidationErrors
];

// Wallet address validation
const validateWalletAddress = [
  body('currency')
    .isIn(['BTC', 'ETH', 'USDT', 'USDC', 'LTC', 'BCH'])
    .withMessage('Invalid currency selected'),
  
  body('network')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Network must be between 2 and 50 characters'),
  
  body('address')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be between 10 and 200 characters'),
  
  body('adminName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Admin name must be between 2 and 50 characters'),
  
  handleValidationErrors
];

// Transaction hash validation
const validateTransactionHash = [
  body('transactionHash')
    .optional()
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage('Transaction hash must be between 10 and 100 characters')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Transaction hash can only contain alphanumeric characters'),
  
  handleValidationErrors
];

// ID parameter validation
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

// Admin note validation
const validateAdminNote = [
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Admin note must be less than 500 characters'),
  
  handleValidationErrors
];

// Query parameter validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateAmount,
  validateCurrency,
  validateWalletAddress,
  validateTransactionHash,
  validateObjectId,
  validateAdminNote,
  validatePagination,
  handleValidationErrors
};
