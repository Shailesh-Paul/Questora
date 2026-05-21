const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'questora_secret_key_2024';

// Route: Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role, preferences } = req.body;

    const query = [{ email }];
    if (phoneNumber) query.push({ phoneNumber });

    const existingUser = await User.findOne({ $or: query });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || undefined,
      role: role || 'user',
      preferences: preferences || {},
      isVerified: true // Manual registration bypasses OTP for now
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      preferences: user.preferences
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route: Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Twilio Config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Route: Send OTP
router.post('/send-otp', async (req, res) => {
  let { phoneNumber } = req.body;

  // Clean phone number - remove any non-digit characters except +
  if (phoneNumber) {
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    // Ensure it starts with +
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber;
    }
  }

  if (!phoneNumber || phoneNumber.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid phone number' });
  }

  try {
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update or create user
    await User.findOneAndUpdate(
      { phoneNumber },
      { otp, otpExpires, isVerified: false },
      { upsert: true, new: true }
    );

    console.log(`OTP for ${phoneNumber}: ${otp}`);

    if (client && twilioPhone) {
      await client.messages.create({
        body: `Your WeekendWander verification code is: ${otp}`,
        from: twilioPhone,
        to: phoneNumber
      });
      res.json({ message: 'OTP sent successfully' });
    } else {
      // For development when keys are missing
      res.json({
        message: 'OTP generated (Dev Mode)',
        otp: otp, // Sending back OTP only for dev mode if keys are missing
        warning: 'Twilio keys missing, OTP logged to console.'
      });
    }
  } catch (error) {
    console.error('Send OTP Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to send OTP' });
  }
});

// Route: Verify OTP
router.post('/verify-otp', async (req, res) => {
  let { phoneNumber, otp } = req.body;

  // Clean phone number - remove any non-digit characters except +
  if (phoneNumber) {
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    // Ensure it starts with +
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber;
    }
  }

  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { phoneNumber: user.phoneNumber }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
