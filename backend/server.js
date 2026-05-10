const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WeekendWander API is running' });
});

// Mock Data for Destinations
app.get('/api/destinations', (req, res) => {
  res.json([
    { id: "manali", name: "Manali", state: "Himachal Pradesh", tagline: "Adventure & Peace", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800", color: "#F28C28", tag: "Mountain Retreat", crowdLevel: "high" },
    { id: "goa", name: "Goa", state: "Goa", tagline: "Beaches & Vibes", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800", color: "#28B463", tag: "Coastal Vibe", crowdLevel: "medium" },
    { id: "rishikesh", name: "Rishikesh", state: "Uttarakhand", tagline: "Yoga & Rafting", image: "https://images.unsplash.com/photo-1594801121008-0113c4c8d197?w=800", color: "#3498DB", tag: "Spiritual Action", crowdLevel: "low" }
  ]);
});

const Razorpay = require('razorpay');

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
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected!');

    // Load tripPlanRoutes FIRST (before other routes)
    app.use('/api/tripplans', require('./routes/tripPlanRoutes'));
    console.log('TripPlan routes loaded');

    // Load other routes
    app.use('/api/listings', require('./routes/listingRoutes'));
    app.use('/api/bookings', require('./routes/bookingRoutes'));
    console.log('All routes loaded');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB Connection Error: ', err);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (DB not connected)`);
    });
  });