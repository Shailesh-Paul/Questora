const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Activity = require('./models/Activity');

dotenv.config();

const activities = [
  // Goa
  {
    activityName: "Scuba Diving at Grand Island",
    destination: "goa",
    category: "Adventure",
    description: "Explore underwater coral reefs and marine life of the Arabian Sea with certified PADI instructors.",
    estimatedPrice: 3500,
    duration: "4 Hours",
    ratings: 4.8,
    popularityScore: 95,
    coordinates: { type: "Point", coordinates: [73.7800, 15.3500] }
  },
  {
    activityName: "Anjuna Beach Sundowner & Party",
    destination: "goa",
    category: "Nightlife",
    description: "Dance the night away on the beaches of Goa with elite international DJs, bonfires, and amazing sea views.",
    estimatedPrice: 2000,
    duration: "5 Hours",
    ratings: 4.6,
    popularityScore: 92,
    coordinates: { type: "Point", coordinates: [73.7423, 15.5828] }
  },
  {
    activityName: "Parasailing & Jet Skiing at Calangute",
    destination: "goa",
    category: "Water Sports",
    description: "Get your adrenaline pumping with parasailing, banana boat rides, and jet skiing over the warm ocean waves.",
    estimatedPrice: 1800,
    duration: "2 Hours",
    ratings: 4.7,
    popularityScore: 90,
    coordinates: { type: "Point", coordinates: [73.7553, 15.5494] }
  },
  {
    activityName: "Dudhsagar Waterfalls Guided Trek",
    destination: "goa",
    category: "Nature",
    description: "Trek through the lush Western Ghats to witness the spectacular four-tiered milky-white Dudhsagar waterfall.",
    estimatedPrice: 1500,
    duration: "6 Hours",
    ratings: 4.9,
    popularityScore: 98,
    coordinates: { type: "Point", coordinates: [74.3137, 15.3184] }
  },

  // Rishikesh
  {
    activityName: "White Water River Rafting",
    destination: "rishikesh",
    category: "Adventure",
    description: "Conquer the thrilling grade III & IV rapids of the holy Ganges from Shivpuri to Rishikesh with safety guides.",
    estimatedPrice: 1800,
    duration: "3 Hours",
    ratings: 4.9,
    popularityScore: 97,
    coordinates: { type: "Point", coordinates: [78.3900, 30.1200] }
  },
  {
    activityName: "Mohan Chatti Bungee Jumping",
    destination: "rishikesh",
    category: "Adventure",
    description: "Leap from India's highest fixed cantilever platform standing at a jaw-dropping height of 83 meters.",
    estimatedPrice: 3700,
    duration: "2 Hours",
    ratings: 4.8,
    popularityScore: 94,
    coordinates: { type: "Point", coordinates: [78.4355, 30.0684] }
  },
  {
    activityName: "Ganga Aarti at Triveni Ghat",
    destination: "rishikesh",
    category: "Spiritual",
    description: "Immerse in the sacred evening ritual of Vedic chants, giant brass lamps, and flower offerings by the holy river.",
    estimatedPrice: 300,
    duration: "1.5 Hours",
    ratings: 4.9,
    popularityScore: 99,
    coordinates: { type: "Point", coordinates: [78.3150, 30.1158] }
  },
  {
    activityName: "Sunrise Yoga & Meditation Session",
    destination: "rishikesh",
    category: "Wellness",
    description: "Align your mind, body, and soul in the absolute peace of the foothills of the Himalayas, guided by yoga gurus.",
    estimatedPrice: 600,
    duration: "2 Hours",
    ratings: 4.7,
    popularityScore: 88,
    coordinates: { type: "Point", coordinates: [78.3250, 30.1250] }
  },

  // Ujjain
  {
    activityName: "Mahakaleshwar Bhasma Aarti",
    destination: "ujjain",
    category: "Spiritual",
    description: "Witness the legendary and ancient daily ash ritual of Lord Shiva in the early morning at Mahakaleshwar Jyotirlinga.",
    estimatedPrice: 500,
    duration: "3 Hours",
    ratings: 5.0,
    popularityScore: 100,
    coordinates: { type: "Point", coordinates: [75.7682, 23.1829] }
  },
  {
    activityName: "Ram Ghat Walk & Shipra River Dip",
    destination: "ujjain",
    category: "Spiritual",
    description: "Walk along the ancient Ram Ghat and experience the spiritual essence of a holy dip in the sacred Shipra River.",
    estimatedPrice: 150,
    duration: "2 Hours",
    ratings: 4.5,
    popularityScore: 85,
    coordinates: { type: "Point", coordinates: [75.7594, 23.1856] }
  },
  {
    activityName: "Jantar Mantar Astronomical Tour",
    destination: "ujjain",
    category: "Historical",
    description: "Explore the ancient stone observatory built by Maharaja Sawai Jai Singh II to measure time and celestial movements.",
    estimatedPrice: 250,
    duration: "1.5 Hours",
    ratings: 4.4,
    popularityScore: 78,
    coordinates: { type: "Point", coordinates: [75.7608, 23.1678] }
  },

  // Manali
  {
    activityName: "Tandem Paragliding in Solang Valley",
    destination: "manali",
    category: "Adventure",
    description: "Soar high in the blue sky and capture panoramic bird's-eye views of the snow-capped Himalayan peaks.",
    estimatedPrice: 3200,
    duration: "1 Hour",
    ratings: 4.8,
    popularityScore: 96,
    coordinates: { type: "Point", coordinates: [77.1567, 32.3217] }
  },
  {
    activityName: "Snow Skiing Lessons in Solang",
    destination: "manali",
    category: "Adventure",
    description: "Learn how to glide, turn, and brake on smooth snowy slopes under the strict supervision of ski experts.",
    estimatedPrice: 2500,
    duration: "3 Hours",
    ratings: 4.6,
    popularityScore: 89,
    coordinates: { type: "Point", coordinates: [77.1567, 32.3217] }
  },
  {
    activityName: "Hadimba Temple Forest Stroll",
    destination: "manali",
    category: "Historical",
    description: "Visit the iconic 16th-century wooden temple dedicated to Goddess Hadimba, nestled in thick pine forests.",
    estimatedPrice: 100,
    duration: "2 Hours",
    ratings: 4.7,
    popularityScore: 91,
    coordinates: { type: "Point", coordinates: [77.1786, 32.2478] }
  },

  // Jaipur
  {
    activityName: "Amer Fort Historical Jeep Tour",
    destination: "jaipur",
    category: "Historical",
    description: "Ride up to the hilltop fortress of Amer Fort and explore its grand courtyards, palaces, and detailed glasswork.",
    estimatedPrice: 800,
    duration: "3 Hours",
    ratings: 4.8,
    popularityScore: 95,
    coordinates: { type: "Point", coordinates: [75.8513, 26.9855] }
  },
  {
    activityName: "Chokhi Dhani Cultural Feast",
    destination: "jaipur",
    category: "Food",
    description: "Indulge in a classic Rajasthani buffet meal combined with vibrant puppet shows, camel rides, and folk dances.",
    estimatedPrice: 1200,
    duration: "4 Hours",
    ratings: 4.7,
    popularityScore: 93,
    coordinates: { type: "Point", coordinates: [75.8456, 26.7725] }
  },
  {
    activityName: "Pink City Hot Air Balloon Ride",
    destination: "jaipur",
    category: "Adventure",
    description: "Float gently in the breeze over magnificent royal palaces, serene lakes, and traditional Rajasthani villages.",
    estimatedPrice: 8500,
    duration: "3 Hours",
    ratings: 4.9,
    popularityScore: 97,
    coordinates: { type: "Point", coordinates: [75.8213, 26.9200] }
  },

  // Varanasi
  {
    activityName: "Dasaswamedh Ghat Evening Ganga Aarti",
    destination: "varanasi",
    category: "Spiritual",
    description: "Experience the incredibly powerful evening ritual of rhythmic hymns, oil lamps, and divine energy on the riverbank.",
    estimatedPrice: 300,
    duration: "1.5 Hours",
    ratings: 5.0,
    popularityScore: 100,
    coordinates: { type: "Point", coordinates: [83.0104, 25.3078] }
  },
  {
    activityName: "Subah-e-Banaras Morning Boat Tour",
    destination: "varanasi",
    category: "Spiritual",
    description: "Take a scenic sunrise row-boat ride along Varanasi's active ghats as pilgrims perform morning prayers.",
    estimatedPrice: 500,
    duration: "2 Hours",
    ratings: 4.9,
    popularityScore: 94,
    coordinates: { type: "Point", coordinates: [83.0078, 25.3040] }
  },
  {
    activityName: "Sarnath Buddhist Monasteries Tour",
    destination: "varanasi",
    category: "Historical",
    description: "Visit Sarnath, where Lord Buddha gave his first sermon. Explore ancient ruins, Stupas, and temples.",
    estimatedPrice: 400,
    duration: "3 Hours",
    ratings: 4.7,
    popularityScore: 89,
    coordinates: { type: "Point", coordinates: [83.0234, 25.3762] }
  }
];

const seedActivities = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/questora';
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding activities...");
    
    await Activity.deleteMany({});
    console.log("Cleared old activities.");
    
    await Activity.insertMany(activities);
    console.log(`Successfully seeded ${activities.length} activities!`);
    
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedActivities();
