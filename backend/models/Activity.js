const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activityName: { 
    type: String, 
    required: [true, 'Activity name is required'],
    trim: true
  },
  destination: { 
    type: String, 
    required: [true, 'Destination is required'],
    trim: true
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: ['Spiritual', 'Adventure', 'Nightlife', 'Historical', 'Food', 'Nature', 'Water Sports', 'Wellness', 'Local Exploration']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'] 
  },
  tags: [String],
  estimatedPrice: { 
    type: Number, 
    required: [true, 'Estimated price is required'] 
  },
  minimumPrice: { type: Number },
  premiumPrice: { type: Number },
  duration: { 
    type: String, 
    required: [true, 'Duration is required'] 
  },
  ratings: { 
    type: Number, 
    default: 4.5,
    min: 0,
    max: 5
  },
  popularityScore: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100
  },
  nearbyActivities: [String],
  image: { type: String },
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
activitySchema.index({ coordinates: '2dsphere' });
// Index for destination-based search
activitySchema.index({ destination: 1 });

module.exports = mongoose.model('Activity', activitySchema);
