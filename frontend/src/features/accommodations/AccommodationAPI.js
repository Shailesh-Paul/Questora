const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchAccommodations = async (destination, role) => {
  try {
    const res = await fetch(`${API_URL}/recommendations/${destination}?role=${role}`);
    if (!res.ok) throw new Error('Failed to fetch accommodations');
    const data = await res.json();
    return data.map(prop => ({
      _id: prop._id,
      title: prop.title,
      destination: prop.location,
      type: (prop.type || '').toLowerCase(),
      description: prop.description,
      images: prop.images,
      pricePerNight: prop.price,
      ratings: prop.rating,
      amenities: prop.amenities,
      bookingPlatform: prop.source || 'MakeMyTrip',
      externalBookingLink: prop.externalBookingUrl,
      recommendationScore: prop.recommendationScore
    }));
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    return [];
  }
};

export const logExternalBooking = async (bookingData) => {
  try {
    const res = await fetch(`${API_URL}/bookings/external`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) throw new Error('Failed to log booking');
    return await res.json();
  } catch (error) {
    console.error('Error logging external booking:', error);
    return { success: false };
  }
};
