const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// 1. Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Static Files (For local image storage if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. API Routes
app.use('/api/listings', require('./routes/listingRoutes'));

// 5. Health Check & Root Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date() });
});

// 6. Razorpay Integration
const Razorpay = require('razorpay');
app.post('/api/create-order', async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SnQQo0BjlwDtYq',
      key_secret: process.env.RAZORPAY_SECRET || 'your_secret',
    });
    const options = {
      amount: req.body.amount * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).send("Error creating payment order");
  }
});

// 7. MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/weekendwander';
mongoose.connect(MONGO_URI)
  .then((conn) => {
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// 8. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
});
