const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true, 
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  amenities: {
    type: [String],
    default: [],
  },
  targetAudience: {
    type: String,
    enum: ['student', 'employee'],
    required: true,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  externalBookingUrl: {
    type: String,
    required: true,
    default: 'https://www.makemytrip.com'
  },
  maxGuests: {
    type: Number,
    default: 2
  },
  popularity: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['Stay', 'Activity', 'Rental'],
    default: 'Stay'
  },
  tags: {
    type: [String],
    default: []
  },
  source: {
    type: String,
    enum: ['MakeMyTrip', 'Airbnb', 'Goibibo'],
    default: 'MakeMyTrip'
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('Property', propertySchema);
