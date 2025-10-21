const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['approve_withdrawal', 'reject_withdrawal', 'approve_deposit', 'reject_deposit', 'add_profit', 'adjust_balance', 'impersonate_user'],
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
