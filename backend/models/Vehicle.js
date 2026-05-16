const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Bike', 'Scooty', 'Car', 'Cycle'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  hourlyPrice: {
    type: Number,
    required: true
  },
  dailyDiscount: {
    type: Number,
    default: 20 // 20% discount
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Needs Maintenance'],
    default: 'Excellent'
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'None'],
    default: 'Petrol'
  },
  transmissionType: {
    type: String,
    enum: ['Manual', 'Automatic', 'None'],
    default: 'Manual'
  },
  pickupLocation: {
    type: String,
    required: true
  },
  helmetIncluded: {
    type: Boolean,
    default: true
  },
  mileage: {
    type: String
  },
  seatingCapacity: {
    type: Number,
    default: 2
  },
  images: [{
    type: String
  }],
  availabilityStatus: {
    type: Boolean,
    default: true
  },
  vehicleDocuments: {
    rcNumber: String,
    rcImage: String,
    expiryDate: Date
  },
  ratings: {
    type: Number,
    default: 4.5
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  isApproved: { // Legacy field support
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });


vehicleSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Vehicle', vehicleSchema);
