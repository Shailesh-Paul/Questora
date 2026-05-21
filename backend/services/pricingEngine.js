/**
 * Pricing Engine Service
 * Centralizes all cost and discount calculations.
 */

class PricingEngine {
  /**
   * Calculates the total price for a vehicle rental.
   * Applies a 20% discount if the booking is for 24 hours or more.
   * 
   * @param {Number} hourlyRate - The hourly price of the vehicle
   * @param {Number} hours - Number of hours booked
   * @returns {Object} - Object containing subtotal, discount, and final total
   */
  static calculateRentalPrice(hourlyRate, hours) {
    if (!hourlyRate || !hours) {
      return { subtotal: 0, discount: 0, total: 0 };
    }

    const subtotal = hourlyRate * hours;
    let discount = 0;

    // Apply 20% discount for daily bookings (24+ hours)
    if (hours >= 24) {
      discount = subtotal * 0.20;
    }

    return {
      subtotal,
      discount,
      total: subtotal - discount
    };
  }

  /**
   * Calculates the total price for an activity based on members.
   * 
   * @param {Number} pricePerPerson - The price per person
   * @param {Number} members - Number of people
   * @returns {Number} - Total activity cost
   */
  static calculateActivityPrice(pricePerPerson, members = 1) {
    return (pricePerPerson || 0) * members;
  }

  /**
   * Calculates the total price for a hotel stay.
   * 
   * @param {Number} pricePerNight - The price per night
   * @param {Number} nights - Number of nights
   * @returns {Number} - Total stay cost
   */
  static calculateStayPrice(pricePerNight, nights = 1) {
    return (pricePerNight || 0) * nights;
  }
}

module.exports = PricingEngine;
