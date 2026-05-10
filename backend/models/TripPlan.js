const mongoose = require('mongoose');

const tripPlanSchema = new mongoose.Schema({
  tripName: { type: String, default: '' },
  destination: {
    id: { type: String },
    name: { type: String, required: true },
    state: { type: String },
    tagline: { type: String },
    image: { type: String },
    color: { type: String },
    tag: { type: String },
    crowdLevel: { type: String }
  },
  members: { type: Number, default: 2 },
  budget: { type: Number, default: 15000 },
  budgetType: { type: String, enum: ['per_person', 'total'], default: 'per_person' },
  dateRange: {
    start: { type: Date },
    end: { type: Date }
  },
  nights: { type: Number, default: 0 },

  // Hotel Data
  hotel: {
    id: { type: String },
    name: { type: String },
    image: { type: String },
    price: { type: Number }
  },

  // Activities Data
  activities: [{
    id: { type: String },
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    duration: { type: String }
  }],

  // Pricing
  totalBudget: { type: Number },
  perPersonBudget: { type: Number },
  activitiesCost: { type: Number },
  hotelCost: { type: Number },
  grandTotal: { type: Number },

  // Payment Info
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: { type: String },
  orderId: { type: String },

  // Status
  status: {
    type: String,
    enum: ['pending', 'verified', 'confirmed', 'rejected'],
    default: 'pending'
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TripPlan', tripPlanSchema);