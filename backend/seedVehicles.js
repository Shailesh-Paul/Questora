const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('./models/Vehicle');

dotenv.config();

const vehicles = [
  {
    name: "Beach Scooter Pro",
    category: "Scooty",
    location: "Goa",
    geometry: { type: "Point", coordinates: [73.8124, 15.5494] },
    hourlyPrice: 120,
    images: ["https://images.unsplash.com/photo-1594142429108-596289ff97ea?q=80&w=2000&auto=format&fit=crop"],
    isApproved: true,
    ownerId: "663de0d01f92e0001bcdef01" // Mock ID
  },
  {
    name: "Royal Enfield Classic",
    category: "Bike",
    location: "Ujjain",
    geometry: { type: "Point", coordinates: [75.7819, 23.1765] },
    hourlyPrice: 200,
    images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2000&auto=format&fit=crop"],
    isApproved: true,
    ownerId: "663de0d01f92e0001bcdef01"
  },
  {
    name: "Mountain Thar 4x4",
    category: "Car",
    location: "Manali",
    geometry: { type: "Point", coordinates: [77.1887, 32.2396] },
    hourlyPrice: 600,
    images: ["https://images.unsplash.com/photo-1710225358761-4f5891df657d?q=80&w=764&auto=format&fit=crop"],
    isApproved: true,
    ownerId: "663de0d01f92e0001bcdef01"
  },
  {
    name: "City Cycle X",
    category: "Cycle",
    location: "Rishikesh",
    geometry: { type: "Point", coordinates: [78.2676, 30.0869] },
    hourlyPrice: 50,
    images: ["https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2000&auto=format&fit=crop"],
    isApproved: true,
    ownerId: "663de0d01f92e0001bcdef01"
  },
  {
    name: "Jaipur Jeep Explorer",
    category: "Car",
    location: "Jaipur",
    geometry: { type: "Point", coordinates: [75.7873, 26.9124] },
    hourlyPrice: 500,
    images: ["https://images.unsplash.com/photo-1670054953044-2605dbd0d747?q=80&w=1171&auto=format&fit=crop"],
    isApproved: true,
    ownerId: "663de0d01f92e0001bcdef01"
  }
];

const seedVehicles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/weekendwander');
    console.log("Connected for seeding...");
    
    await Vehicle.deleteMany({ ownerId: "663de0d01f92e0001bcdef01" });
    await Vehicle.insertMany(vehicles);
    
    console.log("✅ Seeded vehicles successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedVehicles();
