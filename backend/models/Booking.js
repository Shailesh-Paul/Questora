const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Vehicle rental booking fields
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  ownerName: { type: String },
  ownerContact: { type: String },
  userName: { type: String },
  userContact: { type: String },
  amount: { type: Number },
  duration: { type: Number },
  durationType: { type: String, enum: ['hours', 'days'] },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },

  // Hotel/Activity booking fields
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemId: { type: String },
  itemName: { type: String },
  price: { type: Number },
  type: { type: String },
  destinationId: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  quantityBooked: { type: Number, default: 1 },
  userPhoneNumber: { type: String },
  
  // Itinerary specific fields
  customerName: { type: String },
  aadharNumber: { type: String },
  age: { type: Number },
  customRequirements: { type: String },
  travelers: [{
    name: { type: String },
    age: { type: Number },
    aadhar: { type: String }
  }],

  // External Accommodation Booking Tracking
  // userId already defined above
  accommodationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' },
  bookingPlatform: { type: String },
  estimatedPrice: { type: Number },
  bookingStatus: { type: String, enum: ['initiated', 'confirmed', 'cancelled'], default: 'initiated' },
  externalBookingId: { type: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);