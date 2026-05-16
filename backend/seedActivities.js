const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Activity = require('./models/Activity');

dotenv.config();

const activities = [
  // UJJAIN
  {
    name: "Bhasma Aarti",
    destination: "Ujjain",
    category: "Spiritual",
    description: "Witness the divine Bhasma Aarti at Mahakaleshwar Temple. A unique spiritual experience.",
    price: 500,
    duration: "2 hours",
    location: { type: "Point", coordinates: [75.7682, 23.1829] },
    images: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800"],
    guidePrice: 300,
    transportPrice: 200,
    foodAvailable: true,
    foodPrice: 150
  },
  {
    name: "Mahakal VIP Darshan",
    destination: "Ujjain",
    category: "Spiritual",
    description: "Direct entry and specialized darshan at the Mahakal Corridor.",
    price: 1500,
    duration: "1 hour",
    location: { type: "Point", coordinates: [75.7685, 23.1832] },
    images: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800"],
    guidePrice: 500,
    transportPrice: 300
  },
  {
    name: "Kaal Bhairav Temple Visit",
    destination: "Ujjain",
    category: "Spiritual",
    description: "Visit the legendary temple where the deity is offered alcohol.",
    price: 300,
    duration: "1.5 hours",
    location: { type: "Point", coordinates: [75.7833, 23.2167] },
    images: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800"],
    guidePrice: 200,
    transportPrice: 400
  },
  
  // GOA
  {
    name: "Scuba Diving at Grande Island",
    destination: "Goa",
    category: "Adventure",
    description: "Explore the underwater world of the Arabian Sea with expert instructors.",
    price: 2500,
    duration: "Half Day",
    location: { type: "Point", coordinates: [73.7800, 15.3500] },
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"],
    guidePrice: 1000,
    transportPrice: 800,
    foodAvailable: true,
    foodPrice: 500
  },
  {
    name: "Beach Party - Anjuna",
    destination: "Goa",
    category: "Nightlife",
    description: "The classic Goa nightlife experience with world-class DJs and vibes.",
    price: 1500,
    duration: "Full Night",
    location: { type: "Point", coordinates: [73.7423, 15.5828] },
    images: ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800"],
    transportPrice: 600
  },
  
  // MANALI
  {
    name: "River Rafting in Beas",
    destination: "Manali",
    category: "Adventure",
    description: "Tame the rapids of the Beas River. Thrilling adventure for all.",
    price: 1200,
    duration: "2 hours",
    location: { type: "Point", coordinates: [77.1887, 32.2432] },
    images: ["https://images.unsplash.com/photo-1530866495547-08497ff13ee2?w=800"],
    guidePrice: 400,
    transportPrice: 500
  },
  
  // RISHIKESH
  {
    name: "Bungee Jumping",
    destination: "Rishikesh",
    category: "Adventure",
    description: "India's highest fixed platform bungee jump.",
    price: 3500,
    duration: "1 hour",
    location: { type: "Point", coordinates: [78.3900, 30.0700] },
    images: ["https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800"],
    transportPrice: 600
  },
  
  // JAIPUR
  {
    name: "Amer Fort Heritage Tour",
    destination: "Jaipur",
    category: "Historical",
    description: "Explore the majestic Amber Fort with a certified heritage guide.",
    price: 800,
    duration: "3 hours",
    location: { type: "Point", coordinates: [75.8513, 26.9855] },
    images: ["https://images.unsplash.com/photo-1599661046289-e31887846eac?w=800"],
    guidePrice: 500,
    transportPrice: 400,
    foodAvailable: true,
    foodPrice: 400
  }
];

const seedActivities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding activities...");
    
    await Activity.deleteMany({});
    console.log("Cleared old activities.");
    
    await Activity.insertMany(activities);
    console.log(`Successfully seeded ${activities.length} activities!`);
    
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedActivities();
