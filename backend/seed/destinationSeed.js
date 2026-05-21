const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Destination = require('../models/Destination');

dotenv.config({ path: path.join(__dirname, '../.env') });

const destinations = [
  {
    city: "Goa",
    tags: ["beach", "nightlife", "adventure"],
    popularCategories: ["Water Sports", "Nightlife"],
    averageStayCost: 4000,
    averageFoodCost: 1500,
    averageTransportCost: 1000,
    coordinates: { type: "Point", coordinates: [73.8278, 15.4989] }
  },
  {
    city: "Rishikesh",
    tags: ["rafting", "spiritual", "camping"],
    popularCategories: ["Adventure", "Wellness"],
    averageStayCost: 2500,
    averageFoodCost: 1000,
    averageTransportCost: 700,
    coordinates: { type: "Point", coordinates: [78.2676, 30.0869] }
  },
  {
    city: "Ujjain",
    tags: ["spiritual", "temple", "heritage"],
    popularCategories: ["Spiritual"],
    averageStayCost: 2000,
    averageFoodCost: 800,
    averageTransportCost: 500,
    coordinates: { type: "Point", coordinates: [75.7885, 23.1765] }
  },
  {
    city: "Manali",
    tags: ["snow", "mountains", "adventure"],
    popularCategories: ["Adventure", "Nature"],
    averageStayCost: 3500,
    averageFoodCost: 1200,
    averageTransportCost: 900,
    coordinates: { type: "Point", coordinates: [77.1892, 32.2432] }
  },
  {
    city: "Jaipur",
    tags: ["heritage", "culture", "food"],
    popularCategories: ["Historical", "Food"],
    averageStayCost: 3000,
    averageFoodCost: 1300,
    averageTransportCost: 800,
    coordinates: { type: "Point", coordinates: [75.7873, 26.9124] }
  },
  {
    city: "Varanasi",
    tags: ["spiritual", "ghats", "heritage"],
    popularCategories: ["Spiritual", "Historical"],
    averageStayCost: 2500,
    averageFoodCost: 900,
    averageTransportCost: 600,
    coordinates: { type: "Point", coordinates: [82.9739, 25.3176] }
  }
];

const seedDestinations = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/weekendwander';
    await mongoose.connect(MONGO_URI);
    console.log('📡 Connected to MongoDB for Destination seeding...');

    // Duplicate prevention: Clear existing or use updateUpsert
    await Destination.deleteMany({});
    
    const created = await Destination.insertMany(destinations);
    console.log(`✅ ${created.length} Destinations seeded successfully!`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Destination Seeding Error:', err);
    process.exit(1);
  }
};

seedDestinations();
