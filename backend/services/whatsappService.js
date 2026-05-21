const twilio = require('twilio');

class WhatsAppService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    
    // Fallback logic for sandbox vs production, typically twilio whatsapp numbers look like 'whatsapp:+14155238886'
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

    if (this.accountSid && this.authToken) {
      this.client = twilio(this.accountSid, this.authToken);
    } else {
      this.client = null;
      console.warn("Twilio credentials missing. WhatsApp service disabled.");
    }
  }

  async sendBookingConfirmation(toPhone, bookingDetails) {
    if (!this.client) {
      console.log(`[MOCK WHATSAPP] To: ${toPhone} | Message: Booking confirmed for ${bookingDetails.accommodationName} via ${bookingDetails.bookingPlatform}`);
      return { success: true, mock: true };
    }

    try {
      // Ensure phone number has 'whatsapp:' prefix
      const formattedPhone = toPhone.startsWith('whatsapp:') ? toPhone : `whatsapp:${toPhone.startsWith('+') ? toPhone : '+' + toPhone}`;

      const message = await this.client.messages.create({
        body: `🎉 Booking Initiated!\n\nYour ${bookingDetails.destination} stay request for *${bookingDetails.accommodationName}* has been successfully initiated through *${bookingDetails.bookingPlatform}*.\n\nBooking Reference: ${bookingDetails.externalBookingId}\nEstimated Price: ₹${bookingDetails.estimatedPrice}\n\nPlease complete your payment on the external platform to confirm your reservation.`,
        from: this.whatsappNumber,
        to: formattedPhone
      });

      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error("Twilio WhatsApp Error:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new WhatsAppService();
