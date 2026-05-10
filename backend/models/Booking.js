const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  ownerName: { type: String, required: true },
  ownerContact: { type: String, required: true },
  userName: { type: String, required: true },
  userContact: { type: String, required: true },
  amount: { type: Number, required: true },
  duration: { type: Number, required: true },
  durationType: { type: String, enum: ['hours', 'days'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
