const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true, index: true },
  trust_score: { type: Number, default: 5.0 },
  whatsapp_opt_in: { type: Boolean, default: true },

  // Subscription fields
  subscription: {
    is_active: { type: Boolean, default: false },
    plan: { type: String, enum: ['FREE', 'BASIC', 'PREMIUM', 'VIP', 'TRIP_PACKAGE'], default: 'FREE' },
    start_date: { type: Date },
    expiry_date: { type: Date },
    payment_id: { type: String },
    razorpay_order_id: { type: String },
  },

  // Usage limits
  limits: {
    daily_messages: { type: Number, default: 0 },
    daily_message_limit: { type: Number, default: 50 },
    total_conversations: { type: Number, default: 0 },
    last_message_date: { type: Date }
  },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Method to check if subscription is valid
userSchema.methods.hasValidSubscription = function() {
  if (!this.subscription.is_active) return false;
  if (!this.subscription.expiry_date) return true; // Lifetime access
  return new Date() < new Date(this.subscription.expiry_date);
};

// Method to check daily message limit
userSchema.methods.canSendMessage = function() {
  const today = new Date().toDateString();
  if (this.limits.last_message_date?.toDateString() === today) {
    return this.limits.daily_messages < this.limits.daily_message_limit;
  }
  return true;
};

module.exports = mongoose.model('User', userSchema);