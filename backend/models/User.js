const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  password: { type: String },
  phoneNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'verifiedProvider', 'student', 'employee'],
    default: 'user'
  },
  preferences: {
    type: Object,
    default: {}
  },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
