const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Trip = require('../models/Trip');

class SubscriptionService {
  // Activate subscription after successful payment
  async activateSubscription(userPhone, paymentDetails) {
    const {
      plan = 'TRIP_PACKAGE',
      plan_name = 'Trip Package',
      amount_paid,
      payment_id,
      razorpay_order_id,
      razorpay_payment_id,
      trip_id,
      destination,
      check_in_date,
      check_out_date,
      duration_days = 7 // Default trip duration
    } = paymentDetails;

    const phone = userPhone.startsWith('whatsapp:') ? userPhone.replace('whatsapp:', '') : userPhone;
    const user = await User.findOne({ phone_number: phone });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate expiry date
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + duration_days);

    // Update user subscription fields
    user.subscription = {
      is_active: true,
      plan: plan,
      start_date: startDate,
      expiry_date: expiryDate,
      payment_id: payment_id
    };
    await user.save();

    // Create subscription record
    const subscription = await Subscription.create({
      user_id: user._id,
      plan: plan,
      plan_name: plan_name,
      status: 'ACTIVE',
      start_date: startDate,
      expiry_date: expiryDate,
      amount_paid: amount_paid || 0,
      payment_id: payment_id,
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      trip_id: trip_id,
      destination: destination,
      trip_start_date: check_in_date ? new Date(check_in_date) : startDate,
      trip_end_date: check_out_date ? new Date(check_out_date) : expiryDate,
      activated_at: startDate,
      message_limit: this.getPlanMessageLimit(plan)
    });

    console.log(`✅ Subscription activated for ${phone}: ${plan} plan`);

    return {
      success: true,
      subscription: subscription,
      user: user
    };
  }

  // Get message limit based on plan
  getPlanMessageLimit(plan) {
    const limits = {
      'FREE': 10,
      'BASIC': 30,
      'PREMIUM': 100,
      'VIP': -1, // Unlimited
      'TRIP_PACKAGE': 50 // Daily limit during trip
    };
    return limits[plan] || 10;
  }

  // Validate user subscription before allowing access
  async validateSubscription(phoneNumber) {
    const phone = phoneNumber.startsWith('whatsapp:') ? phoneNumber.replace('whatsapp:', '') : phoneNumber;
    const user = await User.findOne({ phone_number: phone });

    if (!user) {
      return {
        valid: false,
        reason: 'NO_ACCOUNT',
        message: 'No account found. Please book a trip through our website first!'
      };
    }

    // Check subscription status
    if (!user.subscription.is_active) {
      return {
        valid: false,
        reason: 'NO_SUBSCRIPTION',
        message: 'No active subscription. Please complete a payment to activate your travel assistant!'
      };
    }

    // Check expiry
    if (user.subscription.expiry_date) {
      const now = new Date();
      const expiry = new Date(user.subscription.expiry_date);
      if (now > expiry) {
        // Auto-expire subscription
        user.subscription.is_active = false;
        await user.save();

        // Also expire in Subscription collection
        await Subscription.findOneAndUpdate(
          { user_id: user._id, status: 'ACTIVE' },
          { status: 'EXPIRED', cancelled_at: now }
        );

        return {
          valid: false,
          reason: 'EXPIRED',
          message: 'Your subscription has expired. Please renew to continue using the travel assistant!'
        };
      }
    }

    // Check daily message limit
    const today = new Date().toDateString();
    if (user.limits.last_message_date?.toDateString() === today) {
      const planLimit = this.getPlanMessageLimit(user.subscription.plan);
      if (planLimit > 0 && user.limits.daily_messages >= planLimit) {
        return {
          valid: false,
          reason: 'DAILY_LIMIT_REACHED',
          message: `You've reached your daily message limit (${planLimit} messages). Try again tomorrow!`
        };
      }
    }

    return {
      valid: true,
      user: user,
      subscription: user.subscription
    };
  }

  // Track message usage
  async trackMessageUsage(phoneNumber) {
    const phone = phoneNumber.startsWith('whatsapp:') ? phoneNumber.replace('whatsapp:', '') : phoneNumber;
    const user = await User.findOne({ phone_number: phone });

    if (!user) return;

    const today = new Date().toDateString();
    const lastDate = user.limits.last_message_date?.toDateString();

    if (lastDate === today) {
      // Same day - increment counter
      user.limits.daily_messages += 1;
    } else {
      // New day - reset counter
      user.limits.daily_messages = 1;
      user.limits.last_message_date = new Date();
    }

    user.limits.total_conversations += 1;
    await user.save();

    // Also update Subscription collection
    await Subscription.findOneAndUpdate(
      {
        user_id: user._id,
        status: 'ACTIVE',
        $or: [{ is_lifetime: true }, { expiry_date: { $gt: new Date() } }]
      },
      {
        $inc: { total_messages_used: 1 }
      }
    );
  }

  // Get user subscription details
  async getSubscriptionDetails(phoneNumber) {
    const phone = phoneNumber.startsWith('whatsapp:') ? phoneNumber.replace('whatsapp:', '') : phoneNumber;
    const user = await User.findOne({ phone_number: phone });

    if (!user) return null;

    const activeSub = await Subscription.getActiveForUser(user._id);

    return {
      user: {
        name: user.name,
        phone: user.phone_number
      },
      subscription: user.subscription,
      active_subscription: activeSub,
      usage: user.limits
    };
  }

  // Deactivate subscription
  async deactivateSubscription(phoneNumber, reason = 'USER_REQUEST') {
    const phone = phoneNumber.startsWith('whatsapp:') ? phoneNumber.replace('whatsapp:', '') : phoneNumber;
    const user = await User.findOne({ phone_number: phone });

    if (!user) {
      throw new Error('User not found');
    }

    // Deactivate user subscription
    user.subscription.is_active = false;
    await user.save();

    // Deactivate all active subscriptions
    await Subscription.updateMany(
      { user_id: user._id, status: 'ACTIVE' },
      { status: 'CANCELLED', cancelled_at: new Date() }
    );

    console.log(`❌ Subscription deactivated for ${phone}: ${reason}`);

    return { success: true };
  }
}

module.exports = new SubscriptionService();