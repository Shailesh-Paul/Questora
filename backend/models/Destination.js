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
