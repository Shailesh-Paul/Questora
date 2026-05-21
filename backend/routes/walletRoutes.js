const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const { protect } = require('../middleware/auth');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SnQQo0BjlwDtYq',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '5XgMc16NhLrylNgxIsoxFFrN'
});

// @desc    Get active user's wallet & transaction history
// @route   GET /api/wallet
router.get('/', protect, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = new Wallet({ userId: req.user._id, balance: 0, transactions: [] });
      await wallet.save();
    }
    res.json(wallet);
  } catch (error) {
    console.error('Fetch wallet error:', error);
    res.status(500).json({ message: 'Server error fetching wallet balance' });
  }
});

// @desc    Initialize wallet top-up using Razorpay
// @route   POST /api/wallet/topup
router.post('/topup', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please specify a positive top-up amount' });
    }

    const options = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `topup_receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error('Razorpay top-up order error:', error);
    res.status(500).json({ message: 'Failed to initialize payment gateway' });
  }
});

// @desc    Confirm wallet top-up and credit balance
// @route   POST /api/wallet/confirm-topup
router.post('/confirm-topup', protect, async (req, res) => {
  try {
    const { amount, paymentId, orderId } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment details' });
    }

    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = new Wallet({ userId: req.user._id, balance: 0, transactions: [] });
    }

    wallet.balance += Number(amount);
    wallet.transactions.unshift({
      type: 'deposit',
      amount: Number(amount),
      description: `Loaded money via Razorpay`,
      referenceId: paymentId || orderId || `tx_${Date.now()}`
    });

    await wallet.save();
    res.json({ success: true, balance: wallet.balance, transactions: wallet.transactions });
  } catch (error) {
    console.error('Confirm topup error:', error);
    res.status(500).json({ message: 'Server error processing topup verification' });
  }
});

// @desc    Debug direct wallet credit (Skip Razorpay for seamless local testing)
// @route   POST /api/wallet/direct-credit
router.post('/direct-credit', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid credit amount' });
    }

    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = new Wallet({ userId: req.user._id, balance: 0, transactions: [] });
    }

    wallet.balance += Number(amount);
    wallet.transactions.unshift({
      type: 'deposit',
      amount: Number(amount),
      description: 'Quick top-up simulation',
      referenceId: `direct_${Date.now()}`
    });

    await wallet.save();
    res.json({ success: true, balance: wallet.balance, transactions: wallet.transactions });
  } catch (error) {
    console.error('Direct credit error:', error);
    res.status(500).json({ message: 'Server error handling instant topup simulation' });
  }
});

module.exports = router;
