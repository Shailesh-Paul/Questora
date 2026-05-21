const mongoose = require('mongoose');

const vehicleProviderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  uploadedDocument: {
    type: String, // URL to document
    required: true
  },
  documentType: {
    type: String,
    enum: ['Aadhaar Card', 'Driving License', 'Vehicle RC', 'Local Address Proof', 'Government ID'],
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminRemarks: {
    type: String,
    default: ''
  },
  approvedByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('VehicleProvider', vehicleProviderSchema);
