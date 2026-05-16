const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('./models/Destination');
const Activity = require('./models/Activity');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/weekendwander';

const destinations = [
  {
    city: "Goa",
    tags: ["beach", "nightlife", "adventure"],
    popularCategories: ["Water Sports", "Nightlife"],
    averageStayCost: 3500,
    averageFoodCost: 1500,
    averageTransportCost: 1000,
    coordinates: { type: "Point", coordinates: [73.8567, 15.2993] }
  },
  {
    city: "Rishikesh",
    tags: ["rafting", "spiritual", "camping"],
    popularCategories: ["Adventure", "Wellness"],
    averageStayCost: 2000,
    averageFoodCost: 800,
    averageTransportCost: 500,
    coordinates: { type: "Point", coordinates: [78.2676, 30.0869] }
  },
  {
    city: "Ujjain",
    tags: ["spiritual", "temple", "heritage"],
    popularCategories: ["Spiritual"],
    averageStayCost: 1500,
    averageFoodCost: 600,
    averageTransportCost: 400,
    coordinates: { type: "Point", coordinates: [75.7789, 23.1760] }
  },
  {
    city: "Manali",
    tags: ["snow", "mountains", "adventure"],
    popularCategories: ["Adventure", "Nature"],
    averageStayCost: 2500,
    averageFoodCost: 1000,
    averageTransportCost: 800,
    coordinates: { type: "Point", coordinates: [77.1892, 32.2432] }
  },
  {
    city: "Jaipur",
    tags: ["heritage", "culture", "food"],
    popularCategories: ["Historical", "Food"],
    averageStayCost: 3000,
    averageFoodCost: 1200,
    averageTransportCost: 600,
    coordinates: { type: "Point", coordinates: [75.7873, 26.9124] }
  },
  {
    city: "Varanasi",
    tags: ["spiritual", "ghats", "heritage"],
    popularCategories: ["Spiritual", "Historical"],
    averageStayCost: 1800,
    averageFoodCost: 700,
    averageTransportCost: 500,
    coordinates: { type: "Point", coordinates: [82.9739, 25.3176] }
  }
];

const activities = [
  {
    name: "Scuba Diving",
    destination: "Goa",
    category: "Water Sports",
    estimatedPrice: 3500,
    minimumPrice: 2500,
    premiumPrice: 6000,
    duration: "2 Hours",
    popularityScore: 95,
    description: "Explore the underwater world of the Arabian Sea with expert instructors.",
    location: { type: "Point", coordinates: [73.7333, 15.5494] },
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"]
  },
  {
    name: "Beach Party",
    destination: "Goa",
    category: "Nightlife",
    estimatedPrice: 2000,
    minimumPrice: 1000,
    premiumPrice: 5000,
    duration: "5 Hours",
    popularityScore: 90,
    description: "Enjoy the vibrant nightlife of Goa with music, drinks, and dance on the sand.",
    location: { type: "Point", coordinates: [73.7410, 15.5667] },
    images: ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800"]
  },
  {
    name: "River Rafting",
    destination: "Rishikesh",
    category: "Adventure",
    estimatedPrice: 1800,
    minimumPrice: 1200,
    premiumPrice: 3500,
    duration: "3 Hours",
    popularityScore: 96,
    description: "Navigate the thrilling rapids of the Ganges in Rishikesh.",
    location: { type: "Point", coordinates: [78.3300, 30.1300] },
    images: ["https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800"]
  },
  {
    name: "Bhasma Aarti",
    destination: "Ujjain",
    category: "Spiritual",
    estimatedPrice: 500,
    minimumPrice: 200,
    premiumPrice: 1500,
    duration: "2 Hours",
    popularityScore: 98,
    description: "Witness the divine and ancient fire ritual at the Mahakaleshwar Temple.",
    location: { type: "Point", coordinates: [75.7682, 23.1827] },
    images: ["https://upload.wikimedia.org/wikipedia/commons/b/b3/Mahakaleshwar_Temple_Ujjain.jpg"]
  },
  {
    name: "Paragliding",
    destination: "Manali",
    category: "Adventure",
    estimatedPrice: 3000,
    minimumPrice: 2000,
    premiumPrice: 5500,
    duration: "1 Hour",
    popularityScore: 94,
    description: "Fly over the snow-capped peaks of the Himalayas in Solang Valley.",
    location: { type: "Point", coordinates: [77.1585, 32.3210] },
    images: ["https://images.unsplash.com/photo-1522044810620-3e28ce194ddc?w=800"]
  },
  {
    name: "Amer Fort Tour",
    destination: "Jaipur",
    category: "Historical",
    estimatedPrice: 1000,
    minimumPrice: 500,
    premiumPrice: 3000,
    duration: "4 Hours",
    popularityScore: 89,
    description: "Explore the majestic Amer Fort with its stunning Rajput architecture.",
    location: { type: "Point", coordinates: [75.8513, 26.9855] },
    images: ["https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800"]
  },
  {
    name: "Ganga Aarti",
    destination: "Varanasi",
    category: "Spiritual",
    estimatedPrice: 300,
    minimumPrice: 100,
    premiumPrice: 1200,
    duration: "1 Hour",
    popularityScore: 97,
    description: "A mesmerizing evening fire ceremony on the banks of the holy Ganges.",
    location: { type: "Point", coordinates: [83.0100, 25.3100] },
    images: ["https://upload.wikimedia.org/wikipedia/commons/4/4c/Aarti_raised_up_during_evening_Ganga_aarti%2C_Varanasi.jpg"]
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Destination.deleteMany({});
    await Activity.deleteMany({});

    await Destination.insertMany(destinations);
    await Activity.insertMany(activities);

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seed();
