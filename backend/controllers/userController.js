const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
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

    const transaction = await Transaction.create({
      userId: req.user.id,
      type: 'deposit',
      amount,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Deposit request created successfully',
      transaction: {
        id: transaction.id,
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

    const transaction = await Transaction.create({
      userId: req.user.id,
      type: 'withdrawal',
      amount,
      status: 'pending'
    });

    // Update user's pending withdrawals
    const user = await User.findById(req.user.id);
    user.withdrawalsPending += amount;
    await user.save();

    res.status(201).json({
      message: 'Withdrawal request created successfully',
      transaction: {
        id: transaction.id,
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
    const transactions = await Transaction.findByUserId(req.user.id, 50);
    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMe, createDeposit, createWithdrawal, getTransactions };
