const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SnQQo0BjlwDtYq',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '5XgMc16NhLrylNgxIsoxFFrN'
});

// @route   POST api/bookings/create-order
// @desc    Create a Razorpay order for vehicle rental
router.post('/create-order', async (req, res) => {
  try {
    const { amount, listingId, ownerName, ownerContact, userName, userContact, duration, durationType } = req.body;

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const newBooking = new Booking({
      listingId,
      ownerName,
      ownerContact,
      userName,
      userContact,
      amount,
      duration,
      durationType,
      razorpayOrderId: order.id,
      paymentStatus: 'pending'
    });

    await newBooking.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: newBooking._id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/bookings/verify
// @desc    Verify payment and update booking status
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    booking.razorpayPaymentId = razorpay_payment_id;
    booking.paymentStatus = 'completed';
    await booking.save();

    res.json({ msg: 'Payment verified and booking completed', booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
