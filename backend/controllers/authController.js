const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { firstName, lastName, email, country, phone, password } = req.body;

    // Check if user already exists
    const existingUserByPhone = await User.findByPhone(phone);
    if (existingUserByPhone) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    if (email) {
      const existingUserByEmail = await User.findByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: 'User already exists with this email address' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      country,
      phone,
      passwordHash
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User created successfully',
      token,
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
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { phone, password } = req.body;

    // Find user
    const user = await User.findByPhone(phone);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { register, login };
