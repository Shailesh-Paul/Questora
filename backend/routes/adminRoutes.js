const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const VehicleProvider = require('../models/VehicleProvider');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Activity = require('../models/Activity');
const { protect, authorize } = require('../middleware/auth');

// All routes here are protected and require Admin role
router.use(protect);
router.use(authorize('admin'));

// --- USER & PROVIDER MANAGEMENT ---

// @desc    Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Deactivate/Ban user
router.patch('/users/:id/status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.role = req.body.status === 'banned' ? 'none' : user.role; // Simple ban logic
    await user.save();
    res.json({ message: `User status updated to ${req.body.status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all pending provider applications
router.get('/providers/pending', async (req, res) => {
  try {
    const pending = await VehicleProvider.find({ verificationStatus: 'Pending' }).populate('userId', 'name email');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Verify/Reject Provider
router.patch('/providers/verify/:id', async (req, res) => {
  const { status, adminRemarks } = req.body;
  try {
    const provider = await VehicleProvider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider application not found' });

    provider.verificationStatus = status;
    provider.adminRemarks = adminRemarks || '';
    provider.approvedByAdmin = req.user._id;
    await provider.save();

    // Update User Role if approved
    if (status === 'Approved') {
      await User.findByIdAndUpdate(provider.userId, { 
        role: 'verifiedProvider',
        verificationStatus: 'Approved'
      });
    } else {
      await User.findByIdAndUpdate(provider.userId, { 
        verificationStatus: status 
      });
    }

    // Emit Socket Notification (Implemented in server.js/routes)
    const io = req.app.get('socketio');
    if (io) {
      io.emit('notification', {
        userId: provider.userId,
        message: `Your provider verification was ${status.toLowerCase()}. ${adminRemarks ? 'Remarks: ' + adminRemarks : ''}`,
        type: status === 'Approved' ? 'success' : 'error'
      });
    }

    res.json({ message: `Provider application ${status.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- VEHICLE MANAGEMENT ---

// @desc    Get all pending vehicle listings
router.get('/vehicles/pending', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ approvalStatus: 'Pending' }).populate('ownerId', 'name email');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Approve/Reject Vehicle
router.patch('/vehicles/verify/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    vehicle.approvalStatus = status;
    vehicle.isApproved = status === 'Approved';
    await vehicle.save();

    res.json({ message: `Vehicle listing ${status.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- CONTENT MANAGEMENT (EDITING) ---

// @desc    Edit vehicle details
router.patch('/vehicles/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Edit activity details
router.patch('/activities/:id', async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ANALYTICS ---

// @desc    Get platform stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalVehicles = await Vehicle.countDocuments({ approvalStatus: 'Approved' });
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'fully_paid' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      totalUsers,
      totalBookings,
      totalVehicles,
      revenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
