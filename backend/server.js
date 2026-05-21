const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Razorpay = require('razorpay');

const http = require('http');
const { Server } = require('socket.io');

// 1. Load Environment Variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

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
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/accommodations', require('./routes/accommodationRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/tripplans', require('./routes/tripPlanRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/ai-expenses', require('./routes/aiExpenseRoutes'));
app.use('/api/feedbacks', require('./routes/feedbackRoutes'));

// 5. Health Check & Root Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date() });
});

app.get('/api/db-status', (req, res) => {
  res.json({ 
    mongoHost: mongoose.connection.host,
    mongoName: mongoose.connection.name,
    readyState: mongoose.connection.readyState
  });
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

    console.log('All routes loaded');

    // 8. Socket.IO Connection Handling
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
      socket.on('update_package', (data) => {
        io.emit('package_updated', data);
      });
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    // 8. Socket.IO Connection Handling
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
      socket.on('update_package', (data) => {
        io.emit('package_updated', data);
      });
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (DB not connected)`);
    });
  });

// Real-Time Availability Routes (Moved to bookingRoutes.js)

module.exports = app;