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
  itemId: { type: String },
  type: { type: String },
  destinationId: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  quantityBooked: { type: Number, default: 1 },
  userPhoneNumber: { type: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);