const WalletAddress = require('../models/WalletAddress');
const AuditLog = require('../models/AuditLog');
const { validationResult } = require('express-validator');

const getWalletAddresses = async (req, res) => {
  try {
    const wallets = await WalletAddress.find().sort({ currency: 1 });
    res.json({ wallets });
  } catch (error) {
    console.error('Get wallet addresses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateWalletAddress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { currency, network, address, adminName } = req.body;

    const wallet = await WalletAddress.findOneAndUpdate(
      { currency: currency.toUpperCase() },
      { 
        network, 
        address, 
        updatedBy: adminName, 
        updatedAt: new Date() 
      },
      { upsert: true, new: true }
    );

    // Log admin action
    await AuditLog.create({
      adminName,
      action: `Updated ${currency.toUpperCase()} wallet address`,
      details: `Network: ${network}, Address: ${address}`,
      targetUser: null,
      createdAt: new Date()
    });

    res.json({ 
      message: 'Wallet address updated successfully',
      wallet 
    });
  } catch (error) {
    console.error('Update wallet address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWalletAddresses, updateWalletAddress };
