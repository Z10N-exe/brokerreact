const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        phone: user.phone,
        balance: user.balance,
        profit: user.profit,
        withdrawalsPending: user.withdrawalsPending
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createDeposit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { amount } = req.body;

    const transaction = new Transaction({
      userId: req.user._id,
      type: 'deposit',
      amount,
      status: 'pending'
    });

    await transaction.save();

    res.status(201).json({
      message: 'Deposit request created successfully',
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    console.error('Create deposit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createWithdrawal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { amount } = req.body;

    // Check if user has sufficient balance
    if (req.user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const transaction = new Transaction({
      userId: req.user._id,
      type: 'withdrawal',
      amount,
      status: 'pending'
    });

    await transaction.save();

    // Update user's pending withdrawals
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { withdrawalsPending: amount }
    });

    res.status(201).json({
      message: 'Withdrawal request created successfully',
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMe, createDeposit, createWithdrawal, getTransactions };
