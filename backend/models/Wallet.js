const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deposit', 'expense', 'refund', 'split_receive', 'split_pay'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  referenceId: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  transactions: [transactionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wallet', walletSchema);
