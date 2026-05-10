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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Static Files (For local image storage if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. API Routes
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
const Booking = require('./models/Booking');

// 5. Health Check & Root Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date() });
});

// 6. Razorpay Integration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SnQQo0BjlwDtYq',
  key_secret: process.env.RAZORPAY_SECRET || '5XgMc16NhLrylNgxIsoxFFrN',
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
  .then((conn) => {
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Real-Time Availability Routes (Added from YashNN branch)
const fs = require('fs').promises;
const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');

// Helper to load bookings
async function loadBookings() {
  try {
    const data = await fs.readFile(BOOKINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper to save bookings
async function saveBookings(bookings) {
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf8');
}

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
    
    const bookings = await loadBookings();

    const relevantBookings = bookings.filter(b => {
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);
      return b.destinationId === destinationId && bStart <= queryEnd && bEnd >= queryStart;
    });

    const dailyTotals = {};
    
    relevantBookings.forEach(booking => {
      let current = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      current.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      
      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        if (!dailyTotals[dateStr]) dailyTotals[dateStr] = 0;
        dailyTotals[dateStr] += booking.quantityBooked;
        
        current.setDate(current.getDate() + 1);
      }
    });

    res.json({ dailyTotals });
  } catch (err) {
    console.error("Availability Error:", err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// 8. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
});
