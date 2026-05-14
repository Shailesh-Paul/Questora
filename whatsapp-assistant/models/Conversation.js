const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  intent: { type: String }, // Classified intent if applicable
  metadata: { type: mongoose.Schema.Types.Mixed }, // Additional data
  created_at: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },

  // Session tracking
  session_id: { type: String },
  started_at: { type: Date, default: Date.now },
  last_message_at: { type: Date, default: Date.now },
  ended_at: { type: Date },

  // Statistics
  message_count: { type: Number, default: 0 },
  tokens_used: { type: Number, default: 0 },

  // Status
  status: { type: String, enum: ['ACTIVE', 'ENDED'], default: 'ACTIVE' },

  // Messages
  messages: [messageSchema]
});

// Index for quick lookups
conversationSchema.index({ user_id: 1, started_at: -1 });
conversationSchema.index({ trip_id: 1 });

// Pre-save middleware to update last_message_at
conversationSchema.pre('save', function(next) {
  this.last_message_at = new Date();
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema);