const express = require('express');
const router = express.Router();
const VehicleProvider = require('../models/VehicleProvider');
const { protect, authorize } = require('../middleware/auth');

// @desc    Register as a vehicle provider
// @route   POST /api/providers/register
router.post('/register', protect, async (req, res) => {
  console.log("Provider Registration Request Body:", req.body);
  try {

    const existing = await VehicleProvider.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You have already applied for provider status." });
    }

    const provider = new VehicleProvider({
      userId: req.user._id,
      uploadedDocument: req.body.uploadedDocument,
      documentType: req.body.documentType,
      verificationStatus: 'Pending'
    });

    const saved = await provider.save();

    // Notify Admin via Socket.io
    const io = req.app.get('socketio');
    if (io) {
      io.emit('admin_notification', {
        type: 'new_provider_application',
        message: `New provider application from ${req.user.name}`,
        providerId: saved._id
      });
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("Provider Registration Error:", err);
    res.status(400).json({ message: err.message || "Failed to submit application" });
  }

});

// @desc    Get provider status
// @route   GET /api/providers/status
router.get('/status', protect, async (req, res) => {
  try {
    const provider = await VehicleProvider.findOne({ userId: req.user._id });
    if (!provider) return res.json({ verificationStatus: 'Not Applied' });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Admin: Get all pending providers
// @route   GET /api/providers/admin/pending
router.get('/admin/pending', protect, authorize('admin'), async (req, res) => {
  try {
    const pending = await VehicleProvider.find({ verificationStatus: 'Pending' }).populate('userId', 'name email');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Admin: Approve/Reject provider
// @route   PATCH /api/providers/admin/verify/:id
router.patch('/admin/verify/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const provider = await VehicleProvider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider application not found" });

    provider.verificationStatus = req.body.status; // 'Approved' or 'Rejected'
    provider.approvedByAdmin = req.user._id;
    await provider.save();

    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
