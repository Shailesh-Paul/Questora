const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['hotel', 'hostel', 'dormitory', 'homestay', 'villa', 'apartment', 'pg'],
    required: true 
  },
  description: { type: String },
  images: [{ type: String }],
  pricePerNight: { type: Number, required: true },
  ratings: { type: Number, default: 0 },
  amenities: [{ type: String }],
  bookingPlatform: { type: String, required: true }, // e.g. MakeMyTrip, Airbnb, Booking.com
  externalBookingLink: { type: String, required: true },
  popularityScore: { type: Number, default: 0 },
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  }
}, { timestamps: true });

accommodationSchema.index({ coordinates: '2dsphere' });
// Index for destination filtering
accommodationSchema.index({ destination: 1 });

module.exports = mongoose.model('Accommodation', accommodationSchema);
