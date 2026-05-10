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

export const MOCK_ACTIVITIES = [
  { id: "a1", name: "White Water Rafting — Grade 4", duration: "3 hrs", price: 1200, category: "Extreme", rating: 4.8, slots: 20, image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800", shortDesc: "Navigate the thrilling rapids of the Ganges with expert guides. Experience the ultimate adrenaline rush amidst the breathtaking Himalayan foothills." },
  { id: "a2", name: "Bungee Jumping at Mohan Chatti", duration: "2 hrs", price: 3500, category: "Extreme", rating: 4.9, slots: 8, image: "https://images.unsplash.com/photo-1522044810620-3e28ce194ddc?w=800", shortDesc: "Take a leap of faith from India's highest bungee platform. Feel the wind rush past as you free-fall over the pristine valley." },
  { id: "a3", name: "Sunset Kayaking on Ganges", duration: "1.5 hrs", price: 900, category: "Adventure", rating: 4.7, slots: 15, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", shortDesc: "Paddle along the serene waters of the Ganges as the sun dips below the horizon. Enjoy an intimate, peaceful encounter with the river's evening calm." },
  { id: "a4", name: "Beatles Ashram Yoga Retreat", duration: "Half day", price: 1500, category: "Wellness", rating: 4.6, slots: 30, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800", shortDesc: "Immerse yourself in deep meditation at the historic Chaurasi Kutia ashram. Connect with your inner self in the very place that inspired the legendary band." },
  { id: "a5", name: "Camping & Bonfire at Shivpuri", duration: "Overnight", price: 2800, category: "Adventure", rating: 4.8, slots: 25, image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800", shortDesc: "Spend an unforgettable night under the starry sky on the white sand beaches of the Ganges. Share stories around a crackling bonfire with fellow travelers." },
  { id: "a6", name: "Ganga Aarti & Local Walk", duration: "2 hrs", price: 500, category: "Culture", rating: 4.9, slots: 50, image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Aarti_raised_up_during_evening_Ganga_aarti%2C_Varanasi.jpg", shortDesc: "Witness the mesmerizing evening fire ritual performed by synchronized priests on the ghats. Followed by a guided walk through the ancient, vibrant alleys." },
  { id: "a7", name: "Himalayan Mountain Biking", duration: "4 hrs", price: 1800, category: "Extreme", rating: 4.7, slots: 10, image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800", shortDesc: "Conquer rugged mountain trails with spectacular panoramic views of the Garhwal Himalayas. A challenging and rewarding adventure for cycling enthusiasts." },
  { id: "a8", name: "Pottery Class with Locals", duration: "2 hrs", price: 600, category: "Culture", rating: 4.5, slots: 12, image: "https://images.unsplash.com/photo-1533907650686-70576141c030?w=800", shortDesc: "Learn the traditional art of clay pottery directly from local artisans. Shape your own souvenirs on a classic spinning wheel while hearing village stories." }
];

export const DESTINATIONS = [
  { id: "manali", name: "Manali", tagline: "Adventure & Peace", state: "Himachal Pradesh", tag: "Mountain", color: "#3b82f6", crowdLevel: "high", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800" },
  { id: "goa", name: "Goa", tagline: "Beaches & Vibes", state: "Goa", tag: "Coastal", color: "#f97316", crowdLevel: "medium", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800" },
  { id: "rishikesh", name: "Rishikesh", tagline: "Yoga & Rafting", state: "Uttarakhand", tag: "Spiritual", color: "#22c55e", crowdLevel: "low", image: "https://images.unsplash.com/photo-1594801121008-0113c4c8d197?w=800" },
  { id: "shimla", name: "Shimla", tagline: "Hills & Heritage", state: "Himachal Pradesh", tag: "Scenic", color: "#3b82f6", crowdLevel: "high", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800" },
  { id: "varanasi", name: "Varanasi", tagline: "Culture & Ghats", state: "Uttar Pradesh", tag: "Heritage", color: "#f97316", crowdLevel: "medium", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800" },
  { id: "coorg", name: "Coorg", tagline: "Mist & Coffee", state: "Karnataka", tag: "Nature", color: "#22c55e", crowdLevel: "low", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800" },
];
