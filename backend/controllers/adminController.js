const User = require('../models/User');
const Transaction = require('../models/Transaction');
const AuditLog = require('../models/AuditLog');
const { validationResult } = require('express-validator');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ user, transactions });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const adjustBalance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { amount, type, note } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const adjustment = type === 'credit' ? amount : -amount;
    const newBalance = user.balance + adjustment;

    if (newBalance < 0) {
      return res.status(400).json({ message: 'Balance cannot be negative' });
    }

    await User.findByIdAndUpdate(userId, { balance: newBalance });

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'adjustment',
      amount: Math.abs(adjustment),
      status: 'approved',
      adminNote: note
    });
    await transaction.save();

    // Log admin action
    const auditLog = new AuditLog({
      action: 'adjust_balance',
      adminName: 'Admin',
      targetUser: userId,
      note: note,
      amount: Math.abs(adjustment)
    });
    await auditLog.save();

    res.json({ message: 'Balance adjusted successfully', newBalance });
  } catch (error) {
    console.error('Adjust balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addProfit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { amount, note } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newProfit = user.profit + amount;
    const newBalance = user.balance + amount;

    await User.findByIdAndUpdate(userId, {
      profit: newProfit,
      balance: newBalance
    });

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'profit',
      amount,
      status: 'approved',
      adminNote: note
    });
    await transaction.save();

    // Log admin action
    const auditLog = new AuditLog({
      action: 'add_profit',
      adminName: 'Admin',
      targetUser: userId,
      note: note,
      amount
    });
    await auditLog.save();

    res.json({ message: 'Profit added successfully', newProfit, newBalance });
  } catch (error) {
    console.error('Add profit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const approveWithdrawal = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { note } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    const user = await User.findById(transaction.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update transaction status
    transaction.status = 'approved';
    transaction.adminNote = note;
    await transaction.save();

    // Update user balance and pending withdrawals
    await User.findByIdAndUpdate(transaction.userId, {
      $inc: { 
        balance: -transaction.amount,
        withdrawalsPending: -transaction.amount
      }
    });

    // Log admin action
    const auditLog = new AuditLog({
      action: 'approve_withdrawal',
      adminName: 'Admin',
      targetUser: transaction.userId,
      note: note,
      amount: transaction.amount
    });
    await auditLog.save();

    res.json({ message: 'Withdrawal approved successfully' });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const rejectWithdrawal = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { note } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    // Update transaction status
    transaction.status = 'rejected';
    transaction.adminNote = note;
    await transaction.save();

    // Update user's pending withdrawals
    await User.findByIdAndUpdate(transaction.userId, {
      $inc: { withdrawalsPending: -transaction.amount }
    });

    // Log admin action
    const auditLog = new AuditLog({
      action: 'reject_withdrawal',
      adminName: 'Admin',
      targetUser: transaction.userId,
      note: note,
      amount: transaction.amount
    });
    await auditLog.save();

    res.json({ message: 'Withdrawal rejected successfully' });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const approveDeposit = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { note } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    // Update transaction status
    transaction.status = 'approved';
    transaction.adminNote = note;
    await transaction.save();

    // Update user balance
    await User.findByIdAndUpdate(transaction.userId, {
      $inc: { balance: transaction.amount }
    });

    // Log admin action
    const auditLog = new AuditLog({
      action: 'approve_deposit',
      adminName: 'Admin',
      targetUser: transaction.userId,
      note: note,
      amount: transaction.amount
    });
    await auditLog.save();

    res.json({ message: 'Deposit approved successfully' });
  } catch (error) {
    console.error('Approve deposit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const rejectDeposit = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { note } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    // Update transaction status
    transaction.status = 'rejected';
    transaction.adminNote = note;
    await transaction.save();

    // Log admin action
    const auditLog = new AuditLog({
      action: 'reject_deposit',
      adminName: 'Admin',
      targetUser: transaction.userId,
      note: note,
      amount: transaction.amount
    });
    await auditLog.save();

    res.json({ message: 'Deposit rejected successfully' });
  } catch (error) {
    console.error('Reject deposit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const impersonateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log admin action
    const auditLog = new AuditLog({
      action: 'impersonate_user',
      adminName: 'Admin',
      targetUser: userId,
      note: 'Admin impersonated user'
    });
    await auditLog.save();

    res.json({
      message: 'User data retrieved for impersonation',
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
    console.error('Impersonate user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('targetUser', 'firstName lastName phone')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ logs });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPendingTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'pending' })
      .populate('userId', 'firstName lastName phone')
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error) {
    console.error('Get pending transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
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
};
