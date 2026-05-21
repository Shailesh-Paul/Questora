import axios from "axios";
import { API_BASE_URL } from "../config";

// ─── Weather API ─────────────────────────────────────────────────────────────
export const fetchWeather = async (city) => {
  try {
    return { temp: 22, condition: "Clear", icon: "☀️" };
  } catch (err) {
    return null;
  }
};

// ─── Destination & Activities ────────────────────────────────────────────────
export const fetchDestinations = async () => {
  const res = await axios.get(`${API_BASE_URL}/destinations`);
  const data = Array.isArray(res.data) ? res.data : [];
  if (data.length === 0) {
    console.warn('[DEBUG] fetchDestinations: empty response, using static DESTINATIONS fallback');
    return DESTINATIONS;
  }
  console.log(`[DEBUG] fetchDestinations: loaded ${data.length} from API`);
  return data;
};

export const fetchDestinationInfo = async (city) => {
  const res = await axios.get(`${API_BASE_URL}/destinations/budget/${city}`);
  return res.data;
};

export const fetchActivitiesByDestination = async (destination) => {
  const res = await axios.get(`${API_BASE_URL}/activities/${destination}`);
  return res.data;
};

export const fetchNearbyActivities = async (destination, lng, lat, maxDistance = 5000) => {
  const res = await axios.get(`${API_BASE_URL}/activities/nearby/${destination}?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`);
  return res.data;
};

export const getAIRecommendations = async (destination, budget, lat, lng) => {
  const params = new URLSearchParams();
  if (budget) params.append('budget', budget);
  if (lat) params.append('lat', lat);
  if (lng) params.append('lng', lng);
  
  const res = await axios.get(`${API_BASE_URL}/activities/recommendations/${destination}?${params.toString()}`);
  return res.data;
};

export const fetchRecommendedStays = async (destination, role = "user") => {
  const res = await axios.get(`${API_BASE_URL}/recommendations/${destination}?role=${role}`);
  return res.data;
};

export const getAIBundle = async (context) => {
  const res = await axios.post(`${API_BASE_URL}/ai/bundle`, context);
  return res.data;
};

// ─── Vehicle & Rental APIs ────────────────────────────────────────────────────
export const fetchVehicles = async (params = {}) => {
  const res = await axios.get(`${API_BASE_URL}/vehicles`, { params });
  return res.data;
};

export const registerProvider = async (providerData, token) => {
  const res = await axios.post(`${API_BASE_URL}/providers/register`, providerData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getProviderStatus = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/providers/status`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createVehicle = async (vehicleData, token) => {
  const res = await axios.post(`${API_BASE_URL}/vehicles`, vehicleData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateVehicleStatus = async (vehicleId, status, token) => {
  const res = await axios.patch(`${API_BASE_URL}/vehicles/status/${vehicleId}`, { availabilityStatus: status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const mapDbToVehicle = (v) => ({
  id: v._id,
  name: v.name,
  category: v.category,
  pricePerHour: v.hourlyPrice || v.pricePerHour,
  image: v.images?.[0] || v.image || "https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=800",
  ratings: v.ratings || 4.5,
  availability: v.availabilityStatus ? "available" : "paused",
  location: v.pickupLocation || v.location,
  features: v.features || ["Automatic", "GPS Included", "Insured"],
  dailyDiscount: v.dailyDiscount || 15
});

// ─── Admin API Functions ─────────────────────────────────────────────────────
export const fetchPlatformStats = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const fetchAllUsers = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updatePlatformUser = async (userId, status, token) => {
  const res = await axios.patch(`${API_BASE_URL}/admin/users/${userId}`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const fetchPendingProviders = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/admin/providers/pending`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const verifyProviderAdmin = async (requestId, status, remarks, token) => {
  const res = await axios.patch(`${API_BASE_URL}/admin/providers/verify/${requestId}`, { status, remarks }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const fetchPendingVehicles = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/admin/vehicles/pending`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const verifyVehicleAdmin = async (vehicleId, status, token) => {
  const res = await axios.patch(`${API_BASE_URL}/admin/vehicles/verify/${vehicleId}`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const fetchItineraryBookings = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/admin/bookings/itinerary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// ─── Mock Data for Development ─────────────────────────────────────────────
export const DESTINATIONS = [
  { id: "goa", name: "Goa", state: "Goa", image: "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "Sun, Sand, and Soul.", crowdLevel: "high", tag: "Trending", trendingScore: 98 },
  { id: "rishikesh", name: "Rishikesh", state: "Uttarakhand", image: "https://images.pexels.com/photos/1032156/pexels-photo-1032156.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "The Yoga Capital of the World.", crowdLevel: "medium", tag: "Adventure", trendingScore: 95 },
  { id: "ujjain", name: "Ujjain", state: "Madhya Pradesh", image: "https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "The City of Mahakal.", crowdLevel: "medium", tag: "Spiritual", trendingScore: 92 },
  { id: "manali", name: "Manali", state: "Himachal Pradesh", image: "https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "Gateway to Adventure.", crowdLevel: "high", tag: "Snow", trendingScore: 90 },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", image: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "The Pink City.", crowdLevel: "high", tag: "Heritage", trendingScore: 88 },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", image: "https://images.pexels.com/photos/8112571/pexels-photo-8112571.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "The Spiritual Capital of India.", crowdLevel: "high", tag: "Spiritual", trendingScore: 96 }
];

export const MOCK_ACTIVITIES = [
  // Goa
  {
    id: "goa-scuba",
    name: "Scuba Diving at Grand Island",
    category: "Adventure",
    price: 3500,
    duration: "4 Hours",
    slots: 12,
    rating: 4.8,
    destination: "goa",
    shortDesc: "Explore underwater coral reefs and marine life of the Arabian Sea with certified PADI instructors.",
    image: "https://images.pexels.com/photos/248159/pexels-photo-248159.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "goa-beach-party",
    name: "Anjuna Beach Sundowner & Party",
    category: "Nightlife",
    price: 2000,
    duration: "5 Hours",
    slots: 50,
    rating: 4.6,
    destination: "goa",
    shortDesc: "Dance the night away on the beaches of Goa with elite international DJs, bonfires, and amazing sea views.",
    image: "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "goa-water-sports",
    name: "Parasailing & Jet Skiing at Calangute",
    category: "Water Sports",
    price: 1800,
    duration: "2 Hours",
    slots: 15,
    rating: 4.7,
    destination: "goa",
    shortDesc: "Get your adrenaline pumping with parasailing, banana boat rides, and jet skiing over the warm ocean waves.",
    image: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "goa-dudhsagar",
    name: "Dudhsagar Waterfalls Guided Trek",
    category: "Nature",
    price: 1500,
    duration: "6 Hours",
    slots: 20,
    rating: 4.9,
    destination: "goa",
    shortDesc: "Trek through the lush Western Ghats to witness the spectacular four-tiered milky-white Dudhsagar waterfall.",
    image: "https://images.pexels.com/photos/15286/pexels-photo-15286.jpeg?auto=compress&cs=tinysrgb&w=800"
  },

  // Rishikesh
  {
    id: "rishikesh-rafting",
    name: "White Water River Rafting",
    category: "Adventure",
    price: 1800,
    duration: "3 Hours",
    slots: 16,
    rating: 4.9,
    destination: "rishikesh",
    shortDesc: "Conquer the thrilling grade III & IV rapids of the holy Ganges from Shivpuri to Rishikesh with safety guides.",
    image: "https://images.pexels.com/photos/1032156/pexels-photo-1032156.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "rishikesh-bungee",
    name: "Mohan Chatti Bungee Jumping",
    category: "Adventure",
    price: 3700,
    duration: "2 Hours",
    slots: 8,
    rating: 4.8,
    destination: "rishikesh",
    shortDesc: "Leap from India's highest fixed cantilever platform standing at a jaw-dropping height of 83 meters.",
    image: "https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "rishikesh-aarti",
    name: "Ganga Aarti at Triveni Ghat",
    category: "Spiritual",
    price: 300,
    duration: "1.5 Hours",
    slots: 100,
    rating: 4.9,
    destination: "rishikesh",
    shortDesc: "Immerse in the sacred evening ritual of Vedic chants, giant brass lamps, and flower offerings by the holy river.",
    image: "https://images.pexels.com/photos/1005486/pexels-photo-1005486.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "rishikesh-yoga",
    name: "Sunrise Yoga & Meditation Session",
    category: "Wellness",
    price: 600,
    duration: "2 Hours",
    slots: 25,
    rating: 4.7,
    destination: "rishikesh",
    shortDesc: "Align your mind, body, and soul in the absolute peace of the foothills of the Himalayas, guided by yoga gurus.",
    image: "https://images.pexels.com/photos/5386864/pexels-photo-5386864.jpeg?auto=compress&cs=tinysrgb&w=800"
  },

  // Ujjain
  {
    id: "ujjain-bhasma-aarti",
    name: "Mahakaleshwar Bhasma Aarti",
    category: "Spiritual",
    price: 500,
    duration: "3 Hours",
    slots: 30,
    rating: 5.0,
    destination: "ujjain",
    shortDesc: "Witness the legendary and ancient daily ash ritual of Lord Shiva in the early morning at Mahakaleshwar Jyotirlinga.",
    image: "https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "ujjain-shipra-dip",
    name: "Ram Ghat Walk & Shipra River Dip",
    category: "Spiritual",
    price: 150,
    duration: "2 Hours",
    slots: 100,
    rating: 4.5,
    destination: "ujjain",
    shortDesc: "Walk along the ancient Ram Ghat and experience the spiritual essence of a holy dip in the sacred Shipra River.",
    image: "https://images.pexels.com/photos/8112571/pexels-photo-8112571.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "ujjain-observatory",
    name: "Jantar Mantar Astronomical Tour",
    category: "Historical",
    price: 250,
    duration: "1.5 Hours",
    slots: 40,
    rating: 4.4,
    destination: "ujjain",
    shortDesc: "Explore the ancient stone observatory built by Maharaja Sawai Jai Singh II to measure time and celestial movements.",
    image: "https://images.pexels.com/photos/2245436/pexels-photo-2245436.jpeg?auto=compress&cs=tinysrgb&w=800"
  },

  // Manali
  {
    id: "manali-paragliding",
    name: "Tandem Paragliding in Solang Valley",
    category: "Adventure",
    price: 3200,
    duration: "1 Hour",
    slots: 10,
    rating: 4.8,
    destination: "manali",
    shortDesc: "Soar high in the blue sky and capture panoramic bird's-eye views of the snow-capped Himalayan peaks.",
    image: "https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "manali-skiing",
    name: "Snow Skiing Lessons in Solang",
    category: "Adventure",
    price: 2500,
    duration: "3 Hours",
    slots: 8,
    rating: 4.6,
    destination: "manali",
    shortDesc: "Learn how to glide, turn, and brake on smooth snowy slopes under the strict supervision of ski experts.",
    image: "https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "manali-hadimba",
    name: "Hadimba Temple Forest Stroll",
    category: "Historical",
    price: 100,
    duration: "2 Hours",
    slots: 50,
    rating: 4.7,
    destination: "manali",
    shortDesc: "Visit the iconic 16th-century wooden temple dedicated to Goddess Hadimba, nestled in thick pine forests.",
    image: "https://images.pexels.com/photos/9754/pexels-photo-9754.jpeg?auto=compress&cs=tinysrgb&w=800"
  },

  // Jaipur
  {
    id: "jaipur-amer-fort",
    name: "Amer Fort Historical Jeep Tour",
    category: "Historical",
    price: 800,
    duration: "3 Hours",
    slots: 20,
    rating: 4.8,
    destination: "jaipur",
    shortDesc: "Ride up to the hilltop fortress of Amer Fort and explore its grand courtyards, palaces, and detailed glasswork.",
    image: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "jaipur-chokhi-dhani",
    name: "Chokhi Dhani Cultural Feast",
    category: "Food",
    price: 1200,
    duration: "4 Hours",
    slots: 60,
    rating: 4.7,
    destination: "jaipur",
    shortDesc: "Indulge in a classic Rajasthani buffet meal combined with vibrant puppet shows, camel rides, and folk dances.",
    image: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "jaipur-balloon",
    name: "Pink City Hot Air Balloon Ride",
    category: "Adventure",
    price: 8500,
    duration: "3 Hours",
    slots: 6,
    rating: 4.9,
    destination: "jaipur",
    shortDesc: "Float gently in the breeze over magnificent royal palaces, serene lakes, and traditional Rajasthani villages.",
    image: "https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=800"
  },

  // Varanasi
  {
    id: "varanasi-ganga-aarti",
    name: "Dasaswamedh Ghat Evening Ganga Aarti",
    category: "Spiritual",
    price: 300,
    duration: "1.5 Hours",
    slots: 100,
    rating: 5.0,
    destination: "varanasi",
    shortDesc: "Experience the incredibly powerful evening ritual of rhythmic hymns, oil lamps, and divine energy on the riverbank.",
    image: "https://images.pexels.com/photos/8112571/pexels-photo-8112571.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "varanasi-boat-ride",
    name: "Subah-e-Banaras Morning Boat Tour",
    category: "Spiritual",
    price: 500,
    duration: "2 Hours",
    slots: 20,
    rating: 4.9,
    destination: "varanasi",
    shortDesc: "Take a scenic sunrise row-boat ride along Varanasi's active ghats as pilgrims perform morning prayers.",
    image: "https://images.pexels.com/photos/8112571/pexels-photo-8112571.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "varanasi-sarnath",
    name: "Sarnath Buddhist Monasteries Tour",
    category: "Historical",
    price: 400,
    duration: "3 Hours",
    slots: 30,
    rating: 4.7,
    destination: "varanasi",
    shortDesc: "Visit Sarnath, where Lord Buddha gave his first sermon. Explore ancient ruins, Stupas, and temples.",
    image: "https://images.pexels.com/photos/2245436/pexels-photo-2245436.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

export const MOCK_HOTELS = [
  { id: "hotel-1", name: "Luxury Beach Resort", price: 8500, rating: 4.8, image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "hotel-2", name: "Heritage Palace Hotel", price: 12000, rating: 4.9, image: "https://images.pexels.com/photos/1684004/pexels-photo-1684004.jpeg?auto=compress&cs=tinysrgb&w=800" }
];

export const generateAIInsights = async (dest) => ({
  weather: "Perfect",
  crowd: "Moderate",
  tip: "Book activities in advance."
});

export const fetchListings = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/listings`);
    return res.data;
  } catch (err) {
    console.error("fetchListings error:", err);
    return [];
  }
};

export const mapDbToHotel = (db) => db;

const ACTIVITY_FALLBACK_IMAGES = {
  Adventure: "https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=800",
  Spiritual: "https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg?auto=compress&cs=tinysrgb&w=800",
  Nightlife: "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=800",
  Nature: "https://images.pexels.com/photos/15286/pexels-photo-15286.jpeg?auto=compress&cs=tinysrgb&w=800",
  Historical: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Water Sports": "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
  Wellness: "https://images.pexels.com/photos/5386864/pexels-photo-5386864.jpeg?auto=compress&cs=tinysrgb&w=800",
  Food: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800",
};

export const mapDbToActivity = (db) => {
  if (!db) return db;
  const category = db.category || "Adventure";
  const image =
    db.image ||
    db.images?.[0] ||
    ACTIVITY_FALLBACK_IMAGES[category] ||
    ACTIVITY_FALLBACK_IMAGES.Adventure;

  return {
    id: db._id || db.id,
    name: db.activityName || db.name || db.title,
    category,
    price: db.estimatedPrice ?? db.price ?? 0,
    duration: db.duration || "2 Hours",
    slots: db.slots || 10,
    rating: db.ratings ?? db.rating ?? (db.popularityScore ? (db.popularityScore / 20).toFixed(1) : 4.5),
    shortDesc: db.description || db.shortDesc || "",
    image,
    destination: (db.destination || db.city || "").toString(),
    tags: db.tags || [],
  };
};

export const mapDbToRental = (db) => db;
