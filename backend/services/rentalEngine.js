/**
 * Rental Engine Service
 * Centralizes logic for vehicle rentals.
 */

const Vehicle = require('../models/Vehicle');

class RentalEngine {
  /**
   * Fetches available vehicles for a specific destination.
   * 
   * @param {String} destination - The destination
   * @returns {Promise<Array>} - List of available vehicles
   */
  static async getAvailableVehicles(destination) {
    if (!destination) {
      throw new Error("Destination is required.");
    }

    const regex = new RegExp(`^${destination}$`, "i");

    return await Vehicle.find({
      $or: [
        { pickupLocation: regex },
        { location: regex }
      ],
      availabilityStatus: true
    }).lean();
  }
}

module.exports = RentalEngine;
