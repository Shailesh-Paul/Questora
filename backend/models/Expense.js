const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  isSettled: {
    type: Boolean,
    default: false
  }
});

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['travel', 'hotel', 'activity', 'rentals', 'food', 'shopping', 'transport'],
    required: true
  },
  type: {
    type: String,
    enum: ['online', 'cash'],
    default: 'cash'
  },
  description: {
    type: String,
    required: true
  },
  paidBy: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  receiptUrl: {
    type: String
  },
  isSplit: {
    type: Boolean,
    default: false
  },
  splits: [splitSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expense', expenseSchema);
