const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Stay', 'Transport', 'Activities', 'Food'] 
  },
  images: [{ type: String }],
  contact: { type: String, required: true },
  ownerName: { type: String, required: true },
  
  // New Features
  facilities: [{ type: String }], // e.g., ['WiFi', 'AC', 'Kitchen']
  hasParking: { type: Boolean, default: false },
  maxGuests: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);
