const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const VehicleProvider = require('../models/VehicleProvider');
const { protect } = require('../middleware/auth');

// @desc    Get all vehicles with filters
// @route   GET /api/vehicles
router.get('/', async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice } = req.query;
    let query = { isApproved: true, availabilityStatus: true };

    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (minPrice || maxPrice) {
      query.hourlyPrice = {};
      if (minPrice) query.hourlyPrice.$gte = Number(minPrice);
      if (maxPrice) query.hourlyPrice.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(query).sort({ ratings: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get nearby vehicles
// @route   GET /api/vehicles/nearby
router.get('/nearby', async (req, res) => {
  const { lng, lat, maxDistance = 5000 } = req.query; // maxDistance in meters
  
  if (!lng || !lat) {
    return res.status(400).json({ message: "Longitude and latitude are required" });
  }

  try {
    const vehicles = await Vehicle.find({
      isApproved: true,
      availabilityStatus: true,
      geometry: {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(maxDistance)
        }
      }
    });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Add a new vehicle (Approved Providers only)
// @route   POST /api/vehicles
router.post('/', protect, async (req, res) => {
  try {
    // Check if user is an approved provider
    const provider = await VehicleProvider.findOne({ userId: req.user._id, verificationStatus: 'Approved' });
    
    if (!provider) {
      return res.status(403).json({ message: "Only approved local providers can list vehicles." });
    }

    const vehicle = new Vehicle({
      ...req.body,
      ownerId: req.user._id,
      approvalStatus: 'Pending',
      isApproved: false 
    });

    const savedVehicle = await vehicle.save();

    // Notify Admin via Socket.io
    const io = req.app.get('socketio');
    if (io) {
      io.emit('admin_notification', {
        type: 'new_vehicle_listing',
        message: `New vehicle listing '${savedVehicle.name}' awaiting approval`,
        vehicleId: savedVehicle._id
      });
    }

    res.status(201).json(savedVehicle);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Update vehicle availability
// @route   PATCH /api/vehicles/:id/status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    if (vehicle.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    vehicle.availabilityStatus = req.body.status;
    await vehicle.save();
    
    // Emit socket event for real-time update
    const io = req.app.get('socketio');
    if (io) {
      io.emit('vehicle_status_updated', { vehicleId: vehicle._id, status: vehicle.availabilityStatus });
    }

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
