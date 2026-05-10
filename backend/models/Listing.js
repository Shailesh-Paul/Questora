const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // Made optional
  location: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Stay', 'Transport', 'Activities', 'Food', 'Bikes', 'Cars', 'Scooters'] 
  },
  images: [{ type: String }],
  contact: { type: String, required: true },
  ownerName: { type: String, required: true },
  
  // Vehicle specific
  vehicleNumber: { type: String },
  vehicleModel: { type: String },
  
  // Pricing details
  pricingType: { type: String, enum: ['hourly', 'daily', 'both'], default: 'hourly' },
  hourlyPrice: { type: Number },
  dailyPrice: { type: Number },
  
  // New Features
  facilities: [{ type: String }], // e.g., ['WiFi', 'AC', 'Kitchen']
  hasParking: { type: Boolean, default: false },
  maxGuests: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);
