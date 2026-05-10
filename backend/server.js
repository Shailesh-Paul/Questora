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

// Routes
app.use('/api/listings', require('./routes/listingRoutes'));
const Booking = require('./models/Booking');

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WeekendWander API is running' });
});

// Mock Data for Destinations (to replace frontend static data eventually)
app.get('/api/destinations', (req, res) => {
  res.json([
    {
      id: "manali",
      name: "Manali",
      state: "Himachal Pradesh",
      tagline: "Adventure & Peace",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      color: "#F28C28",
      tag: "Mountain Retreat",
      crowdLevel: "high" // red
    },
    {
      id: "goa",
      name: "Goa",
      state: "Goa",
      tagline: "Beaches & Vibes",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      color: "#28B463",
      tag: "Coastal Vibe",
      crowdLevel: "medium" // yellow
    },
    {
      id: "rishikesh",
      name: "Rishikesh",
      state: "Uttarakhand",
      tagline: "Yoga & Rafting",
      image: "https://images.unsplash.com/photo-1594801121008-0113c4c8d197?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      color: "#3498DB",
      tag: "Spiritual Action",
      crowdLevel: "low" // green
    }
  ]);
});

const Razorpay = require('razorpay');

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_SnQQo0BjlwDtYq',
  key_secret: '5XgMc16NhLrylNgxIsoxFFrN'
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
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

// Real-Time Availability Routes (File-based Persistence for Zero Setup)
const fs = require('fs').promises;
const path = require('path');
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
    const { items, destinationId, startDate, endDate, quantity } = req.body;
    
    if (!items || !destinationId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bookings = await loadBookings();
    
    const newBookings = items.map(item => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      itemId: item.id,
      type: item.type || 'activity',
      destinationId,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      quantityBooked: quantity || 1
    }));
    
    bookings.push(...newBookings);
    await saveBookings(bookings);
    
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

// Remove MongoDB connection attempt since we are using file storage
console.log('Using file-based storage for bookings.');


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
