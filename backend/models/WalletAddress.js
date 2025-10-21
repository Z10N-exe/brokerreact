const mongoose = require('mongoose');

const walletAddressSchema = new mongoose.Schema({
  currency: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  network: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WalletAddress', walletAddressSchema);
