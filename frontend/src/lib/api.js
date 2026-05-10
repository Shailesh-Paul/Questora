import axios from "axios";

const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const WEATHER_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// ─── Unsplash: Destination Images ────────────────────────────────────────────
export const fetchDestinationImage = async (query) => {
  try {
    const res = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, per_page: 1, orientation: "landscape" },
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    });
    return res.data.results[0]?.urls?.regular || null;
  } catch {
    return null;
  }
};

// ─── OpenWeatherMap: Weekend Forecast ────────────────────────────────────────
export const fetchWeather = async (city) => {
  try {
    const res = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: { q: city + ",IN", appid: WEATHER_KEY, units: "metric", cnt: 8 },
      }
    );
    const list = res.data.list;
    return {
      temp: Math.round(list[0]?.main?.temp),
      description: list[0]?.weather[0]?.description,
      icon: list[0]?.weather[0]?.icon,
      humidity: list[0]?.main?.humidity,
      weekend: list.slice(0, 6).map((item) => ({
        time: item.dt_txt,
        temp: Math.round(item.main.temp),
        desc: item.weather[0].description,
      })),
    };
  } catch {
    return null;
  }
};

// ─── Amadeus: Hotel Search ────────────────────────────────────────────────────
let amadeusToken = null;
let tokenExpiry = 0;

const getAmadeusToken = async () => {
  if (amadeusToken && Date.now() < tokenExpiry) return amadeusToken;
  const res = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.REACT_APP_AMADEUS_CLIENT_ID,
      client_secret: process.env.REACT_APP_AMADEUS_CLIENT_SECRET,
    })
  );
  amadeusToken = res.data.access_token;
  tokenExpiry = Date.now() + res.data.expires_in * 1000 - 60000;
  return amadeusToken;
};

export const fetchHotels = async ({ cityCode, checkIn, checkOut, adults }) => {
  try {
    const token = await getAmadeusToken();
    const listRes = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city",
      { params: { cityCode }, headers: { Authorization: `Bearer ${token}` } }
    );
    const hotelIds = listRes.data.data
      .slice(0, 5)
      .map((h) => h.hotelId)
      .join(",");
    const offersRes = await axios.get(
      "https://test.api.amadeus.com/v3/shopping/hotel-offers",
      {
        params: { hotelIds, checkInDate: checkIn, checkOutDate: checkOut, adults },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return offersRes.data.data || [];
  } catch {
    return MOCK_HOTELS;
  }
};

// ─── Viator: Activities ───────────────────────────────────────────────────────
export const fetchActivities = async (destination) => {
  try {
    const res = await axios.post(
      "https://api.viator.com/partner/products/search",
      { text: destination, currency: "INR", count: 6 },
      {
        headers: {
          "exp-api-key": process.env.REACT_APP_VIATOR_API_KEY,
          "Accept-Language": "en-US",
        },
      }
    );
    return res.data.products || MOCK_ACTIVITIES;
  } catch {
    return MOCK_ACTIVITIES;
  }
};

// ─── Gemini: AI Itinerary ─────────────────────────────────────────────────────
export const generateAIItinerary = async ({ destination, members, budget, activities, days }) => {
  try {
    const prompt = `Create a premium ${days}-day group travel itinerary for ${destination}, India.
Group: ${members} corporate professionals.
Budget: ₹${budget} per person total.
Must-do: ${activities.join(", ")}.
Return JSON with: { overview, days: [{date, morning, afternoon, evening, hotel, estimatedCost}] }
Keep it luxury, concise, executive-level.`;

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    const text = res.data.candidates[0].content.parts[0].text;
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
};

// ─── OpenAI: AI Insights ───────────────────────────────────────────────────────
const OPENAI_KEY = process.env.REACT_APP_OPENAI_API_KEY || "";

export const generateAIInsights = async (itemName, type, userProfile) => {
  try {
    const prompt = `As a luxury travel advisor, write a 2-sentence highly personalized pitch on why the ${type} "${itemName}" is a perfect fit for a group of ${userProfile.members} travelers visiting ${userProfile.destination} with a budget of ₹${userProfile.budget}. Make it sound exclusive and enticing.`;
    
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60,
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return res.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI Error:", error);
    return `An excellent choice for your stay in ${userProfile.destination}, offering great amenities and comfort tailored to your group.`;
  }
};

// ─── Mock fallbacks (so UI never breaks without API keys) ────────────────────
export const MOCK_HOTELS = [
  // Hotels and Villas
  { id: "h1", name: "Aloha on the Ganges", type: "hotel", stars: 5, price: 8500, currency: "INR", amenities: ["Pool", "Spa", "Yoga", "River View"], image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600" },
  { id: "h2", name: "The Glasshouse on the Ganges", type: "hotel", stars: 5, price: 12000, currency: "INR", amenities: ["Heritage", "Private Beach", "Butler", "Gourmet"], image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600" },
  { id: "v1", name: "Himalayan Sunrise Villa", type: "hotel", stars: 4, price: 15000, currency: "INR", amenities: ["Private Chef", "4 Bedrooms", "Mountain View", "Fireplace"], image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600" },
  
  // Hostels and Dormitory
  { id: "ho1", name: "Zostel Rishikesh", type: "hostel", stars: 4, price: 800, currency: "INR", amenities: ["Bunk Beds", "Cafe", "WiFi", "Social Events"], image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600" },
  { id: "ho2", name: "The Hosteller", type: "hostel", stars: 4, price: 900, currency: "INR", amenities: ["AC Dorms", "Library", "Terrace", "Lockers"], image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600" },

  // Local Staying Homes
  { id: "lh1", name: "Sharma Family Homestay", type: "home", stars: 5, price: 2500, currency: "INR", amenities: ["Home Cooked Meals", "Local Guide", "Garden", "Authentic"], image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600" },
  { id: "lh2", name: "Riverside Cottage", type: "home", stars: 4, price: 3200, currency: "INR", amenities: ["Private Access", "Pet Friendly", "Kitchen", "Quiet"], image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600" }
];

export const fetchListings = async () => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    const res = await axios.get(`${apiUrl}/listings`);
    return res.data || [];
  } catch (err) {
    console.error("Failed to fetch listings:", err);
    return [];
  }
};

export const mapDbToRental = (listing) => ({
  id: listing._id,
  name: listing.title,
  category: listing.subCategory || 'cars',
  pricePerHour: listing.price,
  rushHourPrice: Math.round(listing.price * 1.2),
  image: listing.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600',
  features: listing.facilities || [],
  budgetTier: listing.price < 800 ? "ECONOMY TIER" : (listing.price < 2500 ? "PREMIUM TIER" : "LUXURY TIER")
});

export const mapDbToHotel = (listing) => ({
  id: listing._id,
  name: listing.title,
  type: listing.subCategory || 'hotel',
  stars: 4,
  price: listing.price,
  currency: 'INR',
  amenities: listing.facilities || [],
  image: listing.images?.[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600'
});

export const mapDbToActivity = (listing) => ({
  id: listing._id,
  name: listing.title,
  duration: '2 hrs',
  price: listing.price,
  category: listing.subCategory || 'Adventure',
  rating: 4.5,
  slots: listing.maxGuests || 10,
  shortDesc: listing.description,
  thumb1: listing.images?.[0] || 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=300',
  thumb2: listing.images?.[1] || listing.images?.[0] || 'https://images.unsplash.com/photo-1544627255-75e11a2f1ab6?w=300'
});

export const MOCK_ACTIVITIES = [
  { id: "a1", name: "White Water Rafting — Grade 4", duration: "3 hrs", price: 1200, category: "Adventure", rating: 4.8, slots: 20, shortDesc: "Thrilling rapids experience", thumb1: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=300", thumb2: "https://images.unsplash.com/photo-1544627255-75e11a2f1ab6?w=300" },
  { id: "a2", name: "Bungee Jumping at Mohan Chatti", duration: "2 hrs", price: 3500, category: "Extreme", rating: 4.9, slots: 8, shortDesc: "India's highest bungee", thumb1: "https://images.unsplash.com/photo-1522030299830-16b8d3d049f5?w=300", thumb2: "https://images.unsplash.com/photo-1523490977239-65d1d6a666e4?w=300" },
  { id: "a3", name: "Sunset Kayaking on Ganges", duration: "1.5 hrs", price: 900, category: "Adventure", rating: 4.7, slots: 15, shortDesc: "Peaceful evening paddle", thumb1: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300", thumb2: "https://images.unsplash.com/photo-1527845347291-a1e127de69dc?w=300" },
  { id: "a4", name: "Beatles Ashram Yoga Retreat", duration: "Half day", price: 1500, category: "Wellness", rating: 4.6, slots: 30, shortDesc: "Spiritual morning session", thumb1: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=300", thumb2: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300" },
  { id: "a5", name: "Camping & Bonfire at Shivpuri", duration: "Overnight", price: 2800, category: "Adventure", rating: 4.8, slots: 25, shortDesc: "Riverside tent stay", thumb1: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=300", thumb2: "https://images.unsplash.com/photo-1504280327387-5c328e18bc89?w=300" },
  { id: "a6", name: "Ganga Aarti & Local Walk", duration: "2 hrs", price: 500, category: "Culture", rating: 4.9, slots: 50, shortDesc: "Iconic evening ritual", thumb1: "https://images.unsplash.com/photo-1582298538104-e59e13b8650d?w=300", thumb2: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=300" },
  { id: "a7", name: "Himalayan Mountain Biking", duration: "4 hrs", price: 1800, category: "Extreme", rating: 4.7, slots: 10, shortDesc: "Mountain trails", thumb1: "https://images.unsplash.com/photo-1544627255-75e11a2f1ab6?w=300", thumb2: "https://images.unsplash.com/photo-1527845347291-a1e127de69dc?w=300" },
  { id: "a8", name: "Pottery Class with Locals", duration: "2 hrs", price: 600, category: "Culture", rating: 4.5, slots: 12, shortDesc: "Learn local arts", thumb1: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300", thumb2: "https://images.unsplash.com/photo-1523490977239-65d1d6a666e4?w=300" }
];

export const MOCK_RENTALS = [
  { id: "r1", name: "Hyundai Creta", category: "cars", pricePerHour: 500, rushHourPrice: 750, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600", features: ["AC", "Automatic", "5 Seats"], budgetTier: "PREMIUM TIER" },
  { id: "r2", name: "Maruti Swift", category: "cars", pricePerHour: 300, rushHourPrice: 450, image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600", features: ["AC", "Manual", "5 Seats"], budgetTier: "ECONOMY TIER" },
  { id: "r3", name: "Mercedes C-Class", category: "cars", pricePerHour: 1500, rushHourPrice: 2200, image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600", features: ["Luxury", "Sunroof", "5 Seats"], budgetTier: "LUXURY TIER" },
  { id: "r4", name: "Royal Enfield Classic 350", category: "bikes", pricePerHour: 150, rushHourPrice: 250, image: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=600", features: ["Cruiser", "Retro", "2 Seats"], budgetTier: "ECONOMY TIER" },
  { id: "r5", name: "KTM Duke 390", category: "bikes", pricePerHour: 200, rushHourPrice: 300, image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600", features: ["Sport", "Fast", "2 Seats"], budgetTier: "PREMIUM TIER" },
  { id: "r6", name: "Activa 6G", category: "scooty", pricePerHour: 80, rushHourPrice: 130, image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600", features: ["Easy to ride", "Storage", "2 Seats"], budgetTier: "ECONOMY TIER" },
  { id: "r7", name: "Vespa Elegante", category: "scooty", pricePerHour: 120, rushHourPrice: 180, image: "https://images.unsplash.com/photo-1597813583279-2479f649887f?w=600", features: ["Stylish", "Smooth", "2 Seats"], budgetTier: "PREMIUM TIER" },
  { id: "r8", name: "Mountain MTB Cycle", category: "cycles", pricePerHour: 30, rushHourPrice: 50, image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600", features: ["Off-road", "Geared", "1 Seat"], budgetTier: "ECONOMY TIER" }
];

export const DESTINATIONS = [
  { id: "manali", name: "Manali", tagline: "Adventure & Peace", state: "Himachal Pradesh", tag: "Mountain", color: "#3b82f6", crowdLevel: "high", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800" },
  { id: "goa", name: "Goa", tagline: "Beaches & Vibes", state: "Goa", tag: "Coastal", color: "#f97316", crowdLevel: "medium", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800" },
  { id: "rishikesh", name: "Rishikesh", tagline: "Yoga & Rafting", state: "Uttarakhand", tag: "Spiritual", color: "#22c55e", crowdLevel: "low", image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800" },
  { id: "shimla", name: "Shimla", tagline: "Hills & Heritage", state: "Himachal Pradesh", tag: "Scenic", color: "#3b82f6", crowdLevel: "high", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800" },
  { id: "varanasi", name: "Varanasi", tagline: "Culture & Ghats", state: "Uttar Pradesh", tag: "Heritage", color: "#f97316", crowdLevel: "medium", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800" },
  { id: "coorg", name: "Coorg", tagline: "Mist & Coffee", state: "Karnataka", tag: "Nature", color: "#22c55e", crowdLevel: "low", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800" },
];
