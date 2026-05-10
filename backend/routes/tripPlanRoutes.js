const express = require('express');
const router = express.Router();
const TripPlan = require('../models/TripPlan');

// Create or update a trip plan (auto-save)
router.post('/autosave', async (req, res) => {
  try {
    const {
      tripName,
      destination,
      members,
      budget,
      budgetType,
      dateRange,
      nights,
      hotel,
      activities,
      totalBudget,
      perPersonBudget,
      activitiesCost,
      hotelCost,
      grandTotal,
      sessionId
    } = req.body;

    // Try to find existing trip for this session (for auto-save)
    let tripPlan = await TripPlan.findOne({ sessionId, paymentStatus: 'pending' });

    if (tripPlan) {
      // Update existing
      tripPlan = await TripPlan.findOneAndUpdate(
        { sessionId, paymentStatus: 'pending' },
        {
          tripName,
          destination,
          members,
          budget,
          budgetType,
          dateRange: {
            start: dateRange?.start ? new Date(dateRange.start) : null,
            end: dateRange?.end ? new Date(dateRange.end) : null
          },
          nights,
          hotel,
          activities,
          totalBudget,
          perPersonBudget,
          activitiesCost,
          hotelCost,
          grandTotal,
          updatedAt: new Date()
        },
        { new: true }
      );
    } else {
      // Create new
      tripPlan = new TripPlan({
        tripName,
        destination,
        members,
        budget,
        budgetType,
        dateRange: {
          start: dateRange?.start ? new Date(dateRange.start) : null,
          end: dateRange?.end ? new Date(dateRange.end) : null
        },
        nights,
        hotel,
        activities,
        totalBudget,
        perPersonBudget,
        activitiesCost,
        hotelCost,
        grandTotal,
        sessionId: sessionId || Date.now().toString()
      });
      await tripPlan.save();
    }

    res.json({
      success: true,
      message: 'Trip auto-saved successfully',
      data: tripPlan
    });
  } catch (error) {
    console.error('Error auto-saving trip:', error);
    res.status(500).json({ success: false, message: 'Failed to auto-save trip' });
  }
});

// Update payment status
router.patch('/payment-status', async (req, res) => {
  try {
    const { sessionId, paymentStatus, paymentId, orderId } = req.body;

    const tripPlan = await TripPlan.findOneAndUpdate(
      { sessionId },
      {
        paymentStatus,
        paymentId,
        orderId,
        status: paymentStatus === 'completed' ? 'confirmed' : 'pending',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!tripPlan) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({ success: true, data: tripPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update payment status' });
  }
});

// Get all trip plans
router.get('/', async (req, res) => {
  try {
    const tripPlans = await TripPlan.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tripPlans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trip plans' });
  }
});

// Get a single trip plan by ID
router.get('/:id', async (req, res) => {
  try {
    const tripPlan = await TripPlan.findById(req.params.id);
    if (!tripPlan) {
      return res.status(404).json({ success: false, message: 'Trip plan not found' });
    }
    res.json({ success: true, data: tripPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trip plan' });
  }
});

// Update trip plan status (for verification)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const tripPlan = await TripPlan.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!tripPlan) {
      return res.status(404).json({ success: false, message: 'Trip plan not found' });
    }
    res.json({ success: true, data: tripPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

module.exports = router;