const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { validationResult } = require('express-validator');

const createWithdrawal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { amount, method, ...details } = req.body;

    // Check if user has sufficient balance
    if (req.user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const withdrawalData = {
      userId: req.user._id,
      amount,
      method: method || 'bank'
    };

    // Add method-specific details
    if (method === 'bank' && details.accountName) {
      withdrawalData.bankDetails = {
        accountName: details.accountName,
        accountNumber: details.accountNumber,
        bankName: details.bankName,
        routingNumber: details.routingNumber
      };
    } else if (method === 'crypto' && details.walletAddress) {
      withdrawalData.cryptoDetails = {
        walletAddress: details.walletAddress,
        network: details.network
      };
    } else if (method === 'paypal' && details.email) {
      withdrawalData.paypalDetails = {
        email: details.email
      };
    }

    const withdrawal = new Withdrawal(withdrawalData);

    await withdrawal.save();

    // Update user's pending withdrawals
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { withdrawalsPending: amount }
    });

    res.status(201).json({
      message: 'Withdrawal request created successfully',
      withdrawal: {
        id: withdrawal._id,
        amount: withdrawal.amount,
        status: withdrawal.status,
        createdAt: withdrawal.createdAt
      }
    });
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ withdrawals });
  } catch (error) {
    console.error('Get user withdrawals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate('userId', 'firstName lastName phone')
      .sort({ createdAt: -1 });

    res.json({ withdrawals });
  } catch (error) {
    console.error('Get all withdrawals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const approveWithdrawal = async (req, res) => {
  try {
    const withdrawalId = req.params.id;
    const { note } = req.body;

    const withdrawal = await Withdrawal.findById(withdrawalId).populate('userId');
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    // Update withdrawal status
    withdrawal.status = 'approved';
    withdrawal.adminNote = note;
    await withdrawal.save();

    // Update user balance and pending withdrawals
    await User.findByIdAndUpdate(withdrawal.userId._id, {
      $inc: { 
        balance: -withdrawal.amount,
        withdrawalsPending: -withdrawal.amount
      }
    });

    // Log admin action
    await AuditLog.create({
      adminName: 'Admin',
      action: 'approve_withdrawal',
      details: `Approved withdrawal of ${withdrawal.amount}`,
      targetUser: withdrawal.userId._id,
      amount: withdrawal.amount,
      createdAt: new Date()
    });

    res.json({ message: 'Withdrawal approved successfully' });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const rejectWithdrawal = async (req, res) => {
  try {
    const withdrawalId = req.params.id;
    const { note } = req.body;

    const withdrawal = await Withdrawal.findById(withdrawalId).populate('userId');
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    // Update withdrawal status
    withdrawal.status = 'rejected';
    withdrawal.adminNote = note;
    await withdrawal.save();

    // Update user's pending withdrawals
    await User.findByIdAndUpdate(withdrawal.userId._id, {
      $inc: { withdrawalsPending: -withdrawal.amount }
    });

    // Log admin action
    await AuditLog.create({
      adminName: 'Admin',
      action: 'reject_withdrawal',
      details: `Rejected withdrawal of ${withdrawal.amount}`,
      targetUser: withdrawal.userId._id,
      amount: withdrawal.amount,
      createdAt: new Date()
    });

    res.json({ message: 'Withdrawal rejected successfully' });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createWithdrawal,
  getUserWithdrawals,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
};
