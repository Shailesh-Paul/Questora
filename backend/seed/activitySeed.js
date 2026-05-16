const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Activity = require('../models/Activity');

dotenv.config({ path: path.join(__dirname, '../.env') });

const activities = [
  {
    activityName: "Scuba Diving",
    destination: "Goa",
    category: "Water Sports",
    description: "Professional scuba diving experience in Goa beaches",
    tags: ["water", "adventure", "beach"],
    estimatedPrice: 3500,
    minimumPrice: 2500,
    premiumPrice: 6000,
    duration: "2 Hours",
    ratings: 4.8,
    popularityScore: 95,
    nearbyActivities: ["Beach Party", "Parasailing"],
    coordinates: { type: "Point", coordinates: [73.8278, 15.4989] }
  },
  {
    activityName: "Beach Party",
    destination: "Goa",
    category: "Nightlife",
    description: "Night beach party experience with music and food",
    tags: ["party", "nightlife", "music"],
    estimatedPrice: 2000,
    minimumPrice: 1000,
    premiumPrice: 5000,
    duration: "5 Hours",
    ratings: 4.7,
    popularityScore: 90,
    nearbyActivities: ["Pubbing", "Cafe Hopping"],
    coordinates: { type: "Point", coordinates: [73.8057, 15.5439] }
  },
  {
    activityName: "River Rafting",
    destination: "Rishikesh",
    category: "Adventure",
    description: "White water rafting in Rishikesh",
    tags: ["rafting", "water", "adventure"],
    estimatedPrice: 1800,
    minimumPrice: 1200,
    premiumPrice: 3500,
    duration: "3 Hours",
    ratings: 4.9,
    popularityScore: 96,
    nearbyActivities: ["Camping", "Bungee Jumping"],
    coordinates: { type: "Point", coordinates: [78.2676, 30.0869] }
  },
  {
    activityName: "Bhasma Aarti",
    destination: "Ujjain",
    category: "Spiritual",
    description: "Sacred Bhasma Aarti at Mahakaleshwar Temple",
    tags: ["temple", "spiritual", "heritage"],
    estimatedPrice: 500,
    minimumPrice: 200,
    premiumPrice: 1500,
    duration: "2 Hours",
    ratings: 5.0,
    popularityScore: 98,
    nearbyActivities: ["Mahakal Darshan", "Kaal Bhairav Temple"],
    coordinates: { type: "Point", coordinates: [75.7682, 23.1828] }
  }
];

const seedActivities = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/weekendwander';
    await mongoose.connect(MONGO_URI);
    console.log('📡 Connected to MongoDB for Activity seeding...');

    // Duplicate prevention
    await Activity.deleteMany({});
    
    const created = await Activity.insertMany(activities);
    console.log(`✅ ${created.length} Activities seeded successfully!`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Activity Seeding Error:', err);
    process.exit(1);
  }
};

seedActivities();
