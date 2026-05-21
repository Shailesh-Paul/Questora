const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  city: { 
    type: String, 
    required: [true, 'City name is required'], 
    unique: true,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  popularCategories: {
    type: [String],
    default: []
  },
  averageStayCost: { 
    type: Number, 
    required: [true, 'Average stay cost is required'],
    default: 2000 
  },
  averageFoodCost: { 
    type: Number, 
    required: [true, 'Average food cost is required'],
    default: 1000 
  },
  averageTransportCost: { 
    type: Number, 
    required: [true, 'Average transport cost is required'],
    default: 500 
  },
  heroImage: {
    type: String,
    default: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  tagline: {
    type: String,
    default: 'A beautiful escape'
  },
  crowdLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    required: true,
    enum: ['Spiritual', 'Adventure', 'Beach', 'Nature', 'Historical', 'City']
  },
  bestSeason: {
    type: String,
    default: 'October to March'
  },
  state: {
    type: String,
    default: 'India'
  },
  rating: {
    type: Number,
    default: 4.5
  },
  trendingScore: {
    type: Number,
    default: 80
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Coordinates are required']
    }
  }
}, { 
  timestamps: true 
});

// Create 2dsphere index for spatial queries
destinationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Destination', destinationSchema);
