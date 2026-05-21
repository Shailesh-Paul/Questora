const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get user expenses (both personal and split with others)
// @route   GET /api/expenses
router.get('/', protect, async (req, res) => {
  try {
    // Find expenses paid by user OR split with user
    const expenses = await Expense.find({
      $or: [
        { userId: req.user._id },
        { 'splits.userId': req.user._id }
      ]
    }).populate('userId', 'name email phoneNumber')
      .populate('splits.userId', 'name email phoneNumber')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Fetch expenses error:', error);
    res.status(500).json({ message: 'Server error retrieving expense dashboard data' });
  }
});

// @desc    Add manual cash expense
// @route   POST /api/expenses/manual
router.post('/manual', protect, async (req, res) => {
  try {
    const { amount, category, description, date, receiptUrl, paidBy } = req.body;
    if (!amount || !category || !description) {
      return res.status(400).json({ message: 'Amount, category, and description are required' });
    }

    const expense = new Expense({
      userId: req.user._id,
      amount: Number(amount),
      category,
      type: 'cash',
      description,
      paidBy: paidBy || req.user.name || 'Me',
      date: date || new Date(),
      receiptUrl
    });

    await expense.save();
    res.json({ success: true, expense });
  } catch (error) {
    console.error('Add manual expense error:', error);
    res.status(500).json({ message: 'Server error recording cash expenditure' });
  }
});

// @desc    Create a group split expense
// @route   POST /api/expenses/split
router.post('/split', protect, async (req, res) => {
  try {
    const { amount, category, description, splitEmails } = req.body;
    if (!amount || !category || !description || !splitEmails || !splitEmails.length) {
      return res.status(400).json({ message: 'Amount, category, description, and participants are required' });
    }

    // Locate participant users in the database
    const participants = await User.find({ email: { $in: splitEmails } });
    if (!participants.length) {
      return res.status(400).json({ message: 'No registered platform users found for the provided emails' });
    }

    // Split amount equally including the creator
    const divisor = participants.length + 1;
    const splitShare = Math.round((amount / divisor) * 100) / 100;

    const splits = participants.map(user => ({
      userId: user._id,
      amount: splitShare,
      isSettled: false
    }));

    const expense = new Expense({
      userId: req.user._id,
      amount: Number(amount),
      category,
      type: 'cash',
      description,
      isSplit: true,
      splits
    });

    await expense.save();

    // Populate user info before sending response
    const populated = await expense.populate('splits.userId', 'name email');
    res.json({ success: true, expense: populated });
  } catch (error) {
    console.error('Create split expense error:', error);
    res.status(500).json({ message: 'Server error processing group split transaction' });
  }
});

// @desc    Settle split expense via Virtual Wallet transfer
// @route   POST /api/expenses/settle
router.post('/settle', protect, async (req, res) => {
  try {
    const { expenseId } = req.body;
    if (!expenseId) {
      return res.status(400).json({ message: 'Expense ID is required' });
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Split record not found' });
    }

    // Find the current user's split share
    const userSplit = expense.splits.find(s => s.userId.toString() === req.user._id.toString());
    if (!userSplit) {
      return res.status(400).json({ message: 'You are not a participant in this split transaction' });
    }

    if (userSplit.isSettled) {
      return res.status(400).json({ message: 'This split share is already settled' });
    }

    const payeeId = expense.userId; // The person who paid up front
    const amountToTransfer = userSplit.amount;

    // Deduct from current user's Wallet
    let payerWallet = await Wallet.findOne({ userId: req.user._id });
    if (!payerWallet || payerWallet.balance < amountToTransfer) {
      return res.status(400).json({ message: 'Insufficient balance in your Virtual Travel Wallet. Please top up.' });
    }

    // Credit payee's Wallet
    let payeeWallet = await Wallet.findOne({ userId: payeeId });
    if (!payeeWallet) {
      payeeWallet = new Wallet({ userId: payeeId, balance: 0, transactions: [] });
    }

    payerWallet.balance -= amountToTransfer;
    payerWallet.transactions.unshift({
      type: 'split_pay',
      amount: amountToTransfer,
      description: `Settled split: "${expense.description}"`,
      referenceId: expense._id
    });

    payeeWallet.balance += amountToTransfer;
    payeeWallet.transactions.unshift({
      type: 'split_receive',
      amount: amountToTransfer,
      description: `Split received from ${req.user.name || req.user.email} for "${expense.description}"`,
      referenceId: expense._id
    });

    userSplit.isSettled = true;

    await payerWallet.save();
    await payeeWallet.save();
    await expense.save();

    res.json({ success: true, message: 'Split transaction successfully settled via wallet balance!', expense });
  } catch (error) {
    console.error('Settle split error:', error);
    res.status(500).json({ message: 'Server error processing split ledger settlement' });
  }
});

module.exports = router;
