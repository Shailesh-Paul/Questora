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

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/weekendwander')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error: ', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
