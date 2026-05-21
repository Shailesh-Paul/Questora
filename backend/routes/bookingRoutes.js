const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Razorpay = require('razorpay');
const { protect } = require('../middleware/auth');
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

const WhatsAppService = require('../services/whatsappService');

// @route   POST api/bookings/external
// @desc    Log external accommodation booking redirect and send WhatsApp notification
router.post('/external', async (req, res) => {
  try {
    const { 
      accommodationId, 
      destination, 
      bookingPlatform, 
      estimatedPrice, 
      userPhoneNumber, 
      accommodationName 
    } = req.body;

    const externalBookingId = 'EXT-' + Date.now() + Math.floor(Math.random() * 1000);

    const newBooking = new Booking({
      accommodationId,
      destinationId: destination,
      bookingPlatform,
      estimatedPrice,
      userPhoneNumber,
      externalBookingId,
      bookingStatus: 'initiated',
      type: 'accommodation'
    });

    await newBooking.save();

    // Send WhatsApp confirmation
    if (userPhoneNumber) {
      await WhatsAppService.sendBookingConfirmation(userPhoneNumber, {
        accommodationName,
        destination,
        bookingPlatform,
        estimatedPrice,
        externalBookingId
      });
    }

    res.json({
      success: true,
      bookingId: newBooking._id,
      externalBookingId,
      msg: 'Booking tracked and WhatsApp notification sent.'
    });
  } catch (err) {
    console.error('External Booking Error:', err.message);
    res.status(500).json({ error: 'Failed to process external booking log.' });
  }
});

// @route   POST api/bookings
// @desc    Create new itinerary bookings (Activities)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, destinationId, startDate, endDate, quantity, userPhoneNumber, customerName, aadharNumber, age, customRequirements, travelers } = req.body;

    if (!items || !destinationId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bookingPromises = items.map(item => {
      return new Booking({
        userId: req.user._id,
        itemId: item.id || item._id,
        itemName: item.name,
        price: item.price,
        type: item.type || 'activity',
        destinationId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        quantityBooked: quantity || 1,
        userPhoneNumber,
        customerName,
        aadharNumber,
        age,
        customRequirements,
        travelers,
        paymentStatus: 'completed'
      }).save();
    });

    await Promise.all(bookingPromises);

    // 2. Automatically record expenses in Expense ledger
    try {
      const Expense = require('../models/Expense');
      const expensePromises = items.map(item => {
        const isHotel = item.type === 'hotel' || item.type === 'accommodation';
        return new Expense({
          userId: req.user._id,
          amount: Number(item.price) * (quantity || 1),
          category: isHotel ? 'hotel' : 'activity',
          type: 'online',
          description: `Online Booked: ${item.name}`,
          date: new Date()
        }).save();
      });
      await Promise.all(expensePromises);
      console.log('Automated booking expenses logged successfully');
    } catch (expErr) {
      console.error('Failed to auto-log expenses for bookings', expErr);
    }

    res.status(201).json({ message: 'Bookings successful' });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ error: 'Failed to save bookings' });
  }
});

// @route   GET api/bookings/my
// @desc    Get logged in user's bookings (All types)
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      $or: [
        { userName: req.user.name }, // Rentals use userName string
        { userId: req.user._id }     // Itinerary uses userId Object reference
      ]
    })
    .populate('listingId') // For rentals
    .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error("Fetch My Bookings Error:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET api/bookings/availability
// @desc    Get real-time availability for activities/hotels
router.get('/availability', async (req, res) => {
  try {
    const { destinationId, start, end } = req.query;

    if (!destinationId || !start || !end) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const queryStart = new Date(start);
    const queryEnd = new Date(end);

    const relevantBookings = await Booking.find({
      destinationId,
      startDate: { $lte: queryEnd },
      endDate: { $gte: queryStart }
    });

    const dailyTotals = {};
    relevantBookings.forEach(booking => {
      const bStart = new Date(booking.startDate);
      const bEnd = new Date(booking.endDate);

      let current = new Date(Math.max(bStart, queryStart));
      const finish = new Date(Math.min(bEnd, queryEnd));

      while (current <= finish) {
        const dateStr = current.toISOString().split('T')[0];
        dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + booking.quantityBooked;
        current.setDate(current.getDate() + 1);
      }
    });

    res.json({ dailyTotals });
  } catch (err) {
    console.error("Availability Error:", err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

module.exports = router;
