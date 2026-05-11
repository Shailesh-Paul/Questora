const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },

  // Location Details
  location: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String },
  state: { type: String, required: true },
  pincode: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },

  // Search optimization fields
  lowercaseLocation: { type: String },
  lowercaseCity: { type: String },

  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Stay', 'Transport', 'Activities', 'Food', 'Bikes', 'Cars', 'Scooters', 'Homestay']
  },
  subCategory: { type: String },

  contact: { type: String, required: true },
  ownerName: { type: String, required: true },

  // Vehicle specific
  vehicleNumber: { type: String },
  vehicleModel: { type: String },

  // Pricing details
  pricingType: { type: String, enum: ['hourly', 'daily', 'both'], default: 'hourly' },
  hourlyPrice: { type: Number },
  dailyPrice: { type: Number },

  // Features
  facilities: [{ type: String }],
  hasParking: { type: Boolean, default: false },
  maxGuests: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number },

  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);