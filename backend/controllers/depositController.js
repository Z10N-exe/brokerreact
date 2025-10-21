const Deposit = require('../models/Deposit');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { validationResult } = require('express-validator');

const createDeposit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { amount, currency, transactionHash } = req.body;

    const deposit = new Deposit({
      userId: req.user._id,
      amount,
      currency: currency.toUpperCase(),
      transactionHash: transactionHash || ''
    });

    await deposit.save();

    res.status(201).json({
      message: 'Deposit request created successfully',
      deposit: {
        id: deposit._id,
        amount: deposit.amount,
        currency: deposit.currency,
        status: deposit.status,
        transactionHash: deposit.transactionHash,
        createdAt: deposit.createdAt
      }
    });
  } catch (error) {
    console.error('Create deposit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ deposits });
  } catch (error) {
    console.error('Get user deposits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find()
      .populate('userId', 'firstName lastName phone')
      .sort({ createdAt: -1 });

    res.json({ deposits });
  } catch (error) {
    console.error('Get all deposits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const approveDeposit = async (req, res) => {
  try {
    const depositId = req.params.id;
    const { note } = req.body;

    const deposit = await Deposit.findById(depositId).populate('userId');
    if (!deposit) {
      return res.status(404).json({ message: 'Deposit not found' });
    }

    if (deposit.status !== 'pending') {
      return res.status(400).json({ message: 'Deposit already processed' });
    }

    // Update deposit status
    deposit.status = 'approved';
    deposit.adminNote = note;
    await deposit.save();

    // Update user balance
    await User.findByIdAndUpdate(deposit.userId._id, {
      $inc: { balance: deposit.amount }
    });

    // Log admin action
    await AuditLog.create({
      adminName: 'Admin',
      action: 'approve_deposit',
      details: `Approved deposit of ${deposit.amount} ${deposit.currency}`,
      targetUser: deposit.userId._id,
      amount: deposit.amount,
      createdAt: new Date()
    });

    res.json({ message: 'Deposit approved successfully' });
  } catch (error) {
    console.error('Approve deposit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const rejectDeposit = async (req, res) => {
  try {
    const depositId = req.params.id;
    const { note } = req.body;

    const deposit = await Deposit.findById(depositId).populate('userId');
    if (!deposit) {
      return res.status(404).json({ message: 'Deposit not found' });
    }

    if (deposit.status !== 'pending') {
      return res.status(400).json({ message: 'Deposit already processed' });
    }

    // Update deposit status
    deposit.status = 'rejected';
    deposit.adminNote = note;
    await deposit.save();

    // Log admin action
    await AuditLog.create({
      adminName: 'Admin',
      action: 'reject_deposit',
      details: `Rejected deposit of ${deposit.amount} ${deposit.currency}`,
      targetUser: deposit.userId._id,
      amount: deposit.amount,
      createdAt: new Date()
    });

    res.json({ message: 'Deposit rejected successfully' });
  } catch (error) {
    console.error('Reject deposit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createDeposit,
  getUserDeposits,
  getAllDeposits,
  approveDeposit,
  rejectDeposit
};
