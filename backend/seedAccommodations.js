const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Accommodation = require('./models/Accommodation');

dotenv.config();

const accommodations = [
  // Goa
  {
    title: "Zostel Goa",
    destination: "Goa",
    type: "hostel",
    description: "Vibrant social hostel perfect for students and solo travelers near Anjuna beach.",
    images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"],
    pricePerNight: 800,
    ratings: 4.5,
    amenities: ["Free WiFi", "Bar", "Pool", "Events"],
    bookingPlatform: "MakeMyTrip",
    externalBookingLink: "https://www.makemytrip.com/hotels/zostel_goa-details-goa.html",
    popularityScore: 90,
    coordinates: { type: "Point", coordinates: [73.743, 15.5819] }
  },
  {
    title: "Taj Resort & Convention Centre",
    destination: "Goa",
    type: "hotel",
    description: "Luxurious 5-star property overlooking the Arabian Sea, ideal for premium corporate stays.",
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"],
    pricePerNight: 12000,
    ratings: 4.8,
    amenities: ["Spa", "Private Beach Access", "Fine Dining", "Gym"],
    bookingPlatform: "Booking.com",
    externalBookingLink: "https://www.booking.com/hotel/in/taj-resort-goa.html",
    popularityScore: 95,
    coordinates: { type: "Point", coordinates: [73.805, 15.454] }
  },
  {
    title: "Casa Baga Villa",
    destination: "Goa",
    type: "villa",
    description: "Private luxury villa with pool for group stays near Baga.",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600"],
    pricePerNight: 25000,
    ratings: 4.9,
    amenities: ["Private Pool", "Chef", "4 Bedrooms", "WiFi"],
    bookingPlatform: "Airbnb",
    externalBookingLink: "https://www.airbnb.co.in/rooms/goa-villa",
    popularityScore: 88,
    coordinates: { type: "Point", coordinates: [73.755, 15.555] }
  },
  {
    title: "Seaside Homestay",
    destination: "Goa",
    type: "homestay",
    description: "Authentic Goan home experience with home-cooked seafood.",
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"],
    pricePerNight: 2000,
    ratings: 4.7,
    amenities: ["Home Food", "Beachfront", "AC"],
    bookingPlatform: "Agoda",
    externalBookingLink: "https://www.agoda.com/seaside-homestay/hotel/goa-in.html",
    popularityScore: 85,
    coordinates: { type: "Point", coordinates: [73.750, 15.600] }
  },
  {
    title: "Sun Kissed Budget Hotel",
    destination: "Goa",
    type: "hotel",
    description: "Clean, affordable, and vibrant hotel close to the nightlife of Tito's Lane.",
    images: ["https://images.unsplash.com/photo-1574643033182-53b750cb39b6?w=600"],
    pricePerNight: 1500,
    ratings: 4.2,
    amenities: ["AC", "WiFi", "Bar", "Pool"],
    bookingPlatform: "MakeMyTrip",
    externalBookingLink: "https://www.makemytrip.com/hotels/sunkissed-goa.html",
    popularityScore: 80,
    coordinates: { type: "Point", coordinates: [73.750, 15.550] }
  },

  // Rishikesh
  {
    title: "Madpackers Rishikesh",
    destination: "Rishikesh",
    type: "hostel",
    description: "Backpacker haven offering yoga and trekking tours.",
    images: ["https://images.unsplash.com/photo-1522798514323-e2457150aed9?w=600"],
    pricePerNight: 600,
    ratings: 4.6,
    amenities: ["Rooftop Cafe", "Yoga Mats", "WiFi"],
    bookingPlatform: "MakeMyTrip",
    externalBookingLink: "https://www.makemytrip.com/hotels/madpackers-rishikesh.html",
    popularityScore: 92,
    coordinates: { type: "Point", coordinates: [78.328, 30.128] }
  },
  {
    title: "Aloha On The Ganges",
    destination: "Rishikesh",
    type: "hotel",
    description: "Luxury resort on the banks of River Ganga.",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"],
    pricePerNight: 8000,
    ratings: 4.8,
    amenities: ["Pool", "Spa", "River View", "Fine Dining"],
    bookingPlatform: "Booking.com",
    externalBookingLink: "https://www.booking.com/hotel/in/aloha-on-the-ganges.html",
    popularityScore: 96,
    coordinates: { type: "Point", coordinates: [78.312, 30.112] }
  },
  {
    title: "Ganga View Inn",
    destination: "Rishikesh",
    type: "hotel",
    description: "Budget-friendly hotel near the main ghats, perfect for spiritual travelers.",
    images: ["https://images.unsplash.com/photo-1594801121008-0113c4c8d197?w=600"],
    pricePerNight: 1800,
    ratings: 4.1,
    amenities: ["AC", "WiFi", "Temple View"],
    bookingPlatform: "Agoda",
    externalBookingLink: "https://www.agoda.com/ganga-view-inn/hotel/rishikesh-in.html",
    popularityScore: 82,
    coordinates: { type: "Point", coordinates: [78.315, 30.120] }
  },

  // Ujjain
  {
    title: "Mahakal Ashraya",
    destination: "Ujjain",
    type: "homestay",
    description: "Comfortable homestay just 10 mins from Mahakaleshwar Temple.",
    images: ["https://images.unsplash.com/photo-1501183638710-841dd1904471?w=600"],
    pricePerNight: 1500,
    ratings: 4.4,
    amenities: ["AC", "Vegetarian Meals", "Temple Guide"],
    bookingPlatform: "MakeMyTrip",
    externalBookingLink: "https://www.makemytrip.com/hotels/mahakal-ashraya.html",
    popularityScore: 88,
    coordinates: { type: "Point", coordinates: [75.768, 23.182] }
  },
  {
    title: "Hotel Anjushree",
    destination: "Ujjain",
    type: "hotel",
    description: "Premium hotel offering top-class amenities in the holy city.",
    images: ["https://images.unsplash.com/photo-1542314831-c6a4d1421044?w=600"],
    pricePerNight: 5500,
    ratings: 4.6,
    amenities: ["Pool", "Gym", "Restaurant", "Parking"],
    bookingPlatform: "Agoda",
    externalBookingLink: "https://www.agoda.com/anjushree-ujjain/hotel/ujjain-in.html",
    popularityScore: 90,
    coordinates: { type: "Point", coordinates: [75.780, 23.170] }
  },
  {
    title: "Shri Ram Lodge",
    destination: "Ujjain",
    type: "hotel",
    description: "Basic, clean, and highly affordable budget lodge for pilgrims.",
    images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600"],
    pricePerNight: 900,
    ratings: 3.9,
    amenities: ["Fan", "Clean Washrooms", "24x7 Check-in"],
    bookingPlatform: "MakeMyTrip",
    externalBookingLink: "https://www.makemytrip.com/hotels/shri-ram-lodge.html",
    popularityScore: 78,
    coordinates: { type: "Point", coordinates: [75.770, 23.180] }
  },

  // Jaipur
  {
    title: "Moustache Jaipur",
    destination: "Jaipur",
    type: "hostel",
    description: "Award-winning hostel with a rooftop pool and fort views.",
    images: ["https://images.unsplash.com/photo-1590490359683-658d34c8f18c?w=600"],
    pricePerNight: 700,
    ratings: 4.7,
    amenities: ["Rooftop Pool", "Bar", "Tour Desk", "WiFi"],
    bookingPlatform: "MakeMyTrip",
    externalBookingLink: "https://www.makemytrip.com/hotels/moustache-jaipur.html",
    popularityScore: 94,
    coordinates: { type: "Point", coordinates: [75.787, 26.912] }
  },
  {
    title: "Rambagh Palace",
    destination: "Jaipur",
    type: "hotel",
    description: "Heritage luxury hotel offering a royal Rajasthani experience.",
    images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600"],
    pricePerNight: 35000,
    ratings: 4.9,
    amenities: ["Spa", "Royal Dining", "Gardens", "Pool"],
    bookingPlatform: "Booking.com",
    externalBookingLink: "https://www.booking.com/hotel/in/rambagh-palace.html",
    popularityScore: 99,
    coordinates: { type: "Point", coordinates: [75.805, 26.897] }
  },

  // Manali
  {
    title: "Alt Life - Manali",
    destination: "Manali",
    type: "dormitory",
    description: "Cozy dorms with spectacular mountain views, perfect for backpackers and digital nomads.",
    images: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600"],
    pricePerNight: 500,
    ratings: 4.5,
    amenities: ["Cafe", "Bonfire", "WiFi", "Work Desks"],
    bookingPlatform: "MakeMyTrip",
    externalBookingLink: "https://www.makemytrip.com/hotels/alt_life_manali.html",
    popularityScore: 89,
    coordinates: { type: "Point", coordinates: [77.182, 32.243] }
  },
  {
    title: "The Himalayan",
    destination: "Manali",
    type: "hotel",
    description: "Gothic style luxury resort surrounded by apple orchards.",
    images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600"],
    pricePerNight: 11000,
    ratings: 4.8,
    amenities: ["Pool", "Spa", "Castle Architecture", "Restaurant"],
    bookingPlatform: "Booking.com",
    externalBookingLink: "https://www.booking.com/hotel/in/the-himalayan.html",
    popularityScore: 93,
    coordinates: { type: "Point", coordinates: [77.189, 32.239] }
  },
  
  // Varanasi
  {
    title: "GoStops Varanasi",
    destination: "Varanasi",
    type: "hostel",
    description: "Fun and safe hostel located near the famous Ghats.",
    images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600"], // Reusing image for placeholder
    pricePerNight: 550,
    ratings: 4.4,
    amenities: ["AC", "Common Room", "City Tours", "WiFi"],
    bookingPlatform: "MakeMyTrip",
    externalBookingLink: "https://www.makemytrip.com/hotels/gostops-varanasi.html",
    popularityScore: 87,
    coordinates: { type: "Point", coordinates: [83.006, 25.317] }
  },
  {
    title: "BrijRama Palace",
    destination: "Varanasi",
    type: "hotel",
    description: "Heritage hotel right on the Darbhanga Ghat offering breathtaking river views.",
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"], // Reusing image for placeholder
    pricePerNight: 18000,
    ratings: 4.9,
    amenities: ["River View", "Fine Dining", "Spa", "Boat Tours"],
    bookingPlatform: "Booking.com",
    externalBookingLink: "https://www.booking.com/hotel/in/brijrama-palace.html",
    popularityScore: 97,
    coordinates: { type: "Point", coordinates: [83.010, 25.308] }
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/weekendwander')
  .then(async () => {
    console.log("Connected to MongoDB");
    // We only wipe Accommodations, not other tables
    await Accommodation.deleteMany({});
    await Accommodation.insertMany(accommodations);
    console.log("Accommodations Seeded Successfully");
    process.exit(0);
  })
  .catch(err => {
    console.error("Seeding Error:", err);
    process.exit(1);
  });
