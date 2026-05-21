const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Traveler' },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  photoUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
