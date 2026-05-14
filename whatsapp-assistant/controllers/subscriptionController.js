const subscriptionService = require('../services/subscriptionService');
const User = require('../models/User');

class SubscriptionController {
  // Activate subscription after payment
  async activateSubscription(req, res) {
    try {
      const {
        phone_number,
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
        duration_days = 7
      } = req.body;

      if (!phone_number) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required'
        });
      }

      const result = await subscriptionService.activateSubscription(phone_number, {
        plan,
        plan_name,
        amount_paid,
        payment_id,
        razorpay_order_id,
        razorpay_payment_id,
        trip_id,
        destination,
        check_in_date,
        check_out_date,
        duration_days
      });

      res.status(200).json({
        success: true,
        message: 'Subscription activated successfully',
        data: {
          user: result.user,
          plan: result.subscription.plan,
          expiry_date: result.subscription.expiry_date
        }
      });
    } catch (error) {
      console.error('Error activating subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to activate subscription',
        error: error.message
      });
    }
  }

  // Get subscription status
  async getSubscriptionStatus(req, res) {
    try {
      const { phone } = req.params;

      const details = await subscriptionService.getSubscriptionDetails(phone);

      if (!details) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: details
      });
    } catch (error) {
      console.error('Error getting subscription status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get subscription status',
        error: error.message
      });
    }
  }

  // Deactivate subscription
  async deactivateSubscription(req, res) {
    try {
      const { phone_number, reason = 'USER_REQUEST' } = req.body;

      if (!phone_number) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required'
        });
      }

      const result = await subscriptionService.deactivateSubscription(phone_number, reason);

      res.status(200).json({
        success: true,
        message: 'Subscription deactivated successfully'
      });
    } catch (error) {
      console.error('Error deactivating subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to deactivate subscription',
        error: error.message
      });
    }
  }
}

module.exports = new SubscriptionController();