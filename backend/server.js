const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Razorpay = require('razorpay');

// 1. Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware Setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Static Files (For local image storage if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. API Routes
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// 5. Health Check & Root Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date() });
});

// Mock Data for Destinations
app.get('/api/destinations', (req, res) => {
  res.json([
    { id: "manali", name: "Manali", state: "Himachal Pradesh", tagline: "Adventure & Peace", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800", color: "#F28C28", tag: "Mountain Retreat", crowdLevel: "high" },
    { id: "goa", name: "Goa", state: "Goa", tagline: "Beaches & Vibes", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800", color: "#28B463", tag: "Coastal Vibe", crowdLevel: "medium" },
    { id: "rishikesh", name: "Rishikesh", state: "Uttarakhand", tagline: "Yoga & Rafting", image: "https://images.unsplash.com/photo-1594801121008-0113c4c8d197?w=800", color: "#3498DB", tag: "Spiritual Action", crowdLevel: "low" }
  ]);
});

// 6. Razorpay Integration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SnQQo0BjlwDtYq',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '5XgMc16NhLrylNgxIsoxFFrN'
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// 7. MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/weekendwander';
mongoose.connect(MONGO_URI)
  .then(async (conn) => {
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Load tripPlanRoutes FIRST (before other routes)
    app.use('/api/tripplans', require('./routes/tripPlanRoutes'));
    console.log('TripPlan routes loaded');

    // Load other routes
    app.use('/api/listings', require('./routes/listingRoutes'));
    app.use('/api/bookings', require('./routes/bookingRoutes'));
    console.log('All routes loaded');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (DB not connected)`);
    });
  });

// Real-Time Availability Routes
const Booking = require('./models/Booking');

app.post('/api/bookings', async (req, res) => {
  try {
    const { items, destinationId, startDate, endDate, quantity, userPhoneNumber } = req.body;

    if (!items || !destinationId || !startDate || !endDate || !userPhoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bookingPromises = items.map(item => {
      return new Booking({
        itemId: item.id || item._id,
        type: item.type || 'activity',
        destinationId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        quantityBooked: quantity || 1,
        userPhoneNumber
      }).save();
    });

    await Promise.all(bookingPromises);

    res.status(201).json({ message: 'Bookings successful' });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ error: 'Failed to save bookings' });
  }
});

app.get('/api/availability', async (req, res) => {
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

module.exports = app;