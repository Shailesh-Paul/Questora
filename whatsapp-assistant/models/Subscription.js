const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Plan details
  plan: { type: String, enum: ['FREE', 'BASIC', 'PREMIUM', 'VIP', 'TRIP_PACKAGE'], default: 'FREE' },
  plan_name: { type: String },

  // Subscription status
  status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING'], default: 'PENDING' },

  // Validity
  start_date: { type: Date },
  expiry_date: { type: Date },
  is_lifetime: { type: Boolean, default: false },

  // Payment info
  amount_paid: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  payment_id: { type: String },
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },

  // Trip package details (for trip-based subscriptions)
  trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  destination: { type: String },
  trip_start_date: { type: Date },
  trip_end_date: { type: Date },

  // Usage tracking
  total_messages_used: { type: Number, default: 0 },
  message_limit: { type: Number, default: 50 }, // Daily limit
  conversations_count: { type: Number, default: 0 },

  // Metadata
  activated_at: { type: Date },
  cancelled_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Index for quick lookups
subscriptionSchema.index({ user_id: 1, status: 1 });
subscriptionSchema.index({ expiry_date: 1 });

// Method to check if subscription is valid
subscriptionSchema.methods.isValid = function() {
  if (this.status !== 'ACTIVE') return false;
  if (this.is_lifetime) return true;
  if (!this.expiry_date) return true;
  return new Date() < new Date(this.expiry_date);
};

// Static method to get active subscription for user
subscriptionSchema.statics.getActiveForUser = async function(userId) {
  return this.findOne({
    user_id: userId,
    status: 'ACTIVE',
    $or: [
      { is_lifetime: true },
      { expiry_date: { $gt: new Date() } }
    ]
  });
};

module.exports = mongoose.model('Subscription', subscriptionSchema);