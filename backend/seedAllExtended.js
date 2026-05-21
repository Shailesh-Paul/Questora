const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Models
const Destination = require('./models/Destination');
const Activity = require('./models/Activity');
const Property = require('./models/Property');
const Accommodation = require('./models/Accommodation');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/questora';

const cityPexelsMap = {
  'Varanasi': 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Ujjain': 'https://images.unsplash.com/photo-1658730487395-dcc99f5d997c?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Ayodhya': 'https://images.pexels.com/photos/15729783/pexels-photo-15729783.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Vrindavan': 'https://images.unsplash.com/photo-1662376107358-21296a9234f1?q=80&w=1226&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Haridwar': 'https://plus.unsplash.com/premium_photo-1697730398251-40cd8dc57e0b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Kedarnath': 'https://images.unsplash.com/photo-1712733900711-d0b929d0d7cc?q=80&w=677&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Badrinath': 'https://images.unsplash.com/photo-1601821139366-eb14f3628e26?q=80&w=855&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Tirupati': 'https://plus.unsplash.com/premium_photo-1697730420879-dc2a8dbaa31f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Somnath': 'https://images.unsplash.com/photo-1735192683815-d8918aad53dc?q=80&w=524&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Shirdi': 'https://plus.unsplash.com/premium_photo-1676196138129-0f51095eb6f5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Amritsar': 'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  'Rishikesh': 'https://images.unsplash.com/photo-1712510817140-917938f92e5b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Manali': 'https://images.unsplash.com/photo-1637737118663-f1a53ee1d5a7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Leh Ladakh': 'https://images.pexels.com/photos/238622/pexels-photo-238622.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Kasol': 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Spiti Valley': 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Auli': 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Mussoorie': 'https://images.unsplash.com/photo-1679807680867-1f03ec9a8de6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Shimla': 'https://images.pexels.com/photos/1115087/pexels-photo-1115087.jpeg?auto=compress&cs=tinysrgb&w=800',
  
  'Goa': 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Pondicherry': 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Gokarna': 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Alibaug': 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Andaman': 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Lakshadweep': 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Varkala': 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Kovalam': 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=800',

  'Ooty': 'https://plus.unsplash.com/premium_photo-1725408090963-49dd5bfc1baf?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Munnar': 'https://images.unsplash.com/photo-1591089101324-2280d9260000?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Coorg': 'https://images.unsplash.com/photo-1655128633542-b6b7e86e93b4?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Nainital': 'https://images.pexels.com/photos/954029/pexels-photo-954029.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Darjeeling': 'https://images.pexels.com/photos/1519014/pexels-photo-1519014.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Mount Abu': 'https://images.pexels.com/photos/1115087/pexels-photo-1115087.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Kodaikanal': 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Lonavala': 'https://images.unsplash.com/photo-1618805714320-f8825019c1be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

  'Jaipur': 'https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Agra': 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Jodhpur': 'https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Udaipur': 'https://images.pexels.com/photos/1684004/pexels-photo-1684004.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Hampi': 'https://plus.unsplash.com/premium_photo-1697730337612-8bd916249e30?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Mysore': 'https://images.unsplash.com/photo-1579429223126-29d2f6f9c1ac?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Khajuraho': 'https://plus.unsplash.com/premium_photo-1697730370661-51bf72769ff6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Mahabalipuram': 'https://plus.unsplash.com/premium_photo-1697729536647-4e23a32dd324?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

  'Mumbai': 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Bangalore': 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Delhi': 'https://images.pexels.com/photos/1544372/pexels-photo-1544372.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Hyderabad': 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Chandigarh': 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Kolkata': 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Pune': 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Chennai': 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800'
};

const categoryPexelsPools = {
  Spiritual: [
    'https://images.pexels.com/photos/8112571/pexels-photo-8112571.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1005486/pexels-photo-1005486.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2245436/pexels-photo-2245436.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1628086/pexels-photo-1628086.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  Adventure: [
    'https://images.pexels.com/photos/238622/pexels-photo-238622.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1032156/pexels-photo-1032156.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  Beach: [
    'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/248159/pexels-photo-248159.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3845561/pexels-photo-3845561.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/165505/pexels-photo-165505.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  Nature: [
    'https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1519014/pexels-photo-1519014.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1115087/pexels-photo-1115087.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/9754/pexels-photo-9754.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/954029/pexels-photo-954029.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  Historical: [
    'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1684004/pexels-photo-1684004.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/574324/pexels-photo-574324.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2245436/pexels-photo-2245436.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  City: [
    'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1544372/pexels-photo-1544372.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]
};

const categories = {
  Spiritual: {
    name: 'Spiritual',
    tags: ['spiritual', 'temple', 'peace', 'heritage', 'devotion'],
    destinations: [
      { city: 'Varanasi', state: 'Uttar Pradesh', coordinates: [82.9739, 25.3176], tagline: 'The Spiritual Capital of India.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Ujjain', state: 'Madhya Pradesh', coordinates: [75.7789, 23.1760], tagline: 'The City of Mahakal.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1658730487395-dcc99f5d997c?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Ayodhya', state: 'Uttar Pradesh', coordinates: [82.1998, 26.7922], tagline: 'The Sacred Land of Lord Rama.', bestSeason: 'November to February', heroImage: 'https://images.unsplash.com/photo-1707297676648-b4b604e0e5ab?w=800' },
      { city: 'Vrindavan', state: 'Uttar Pradesh', coordinates: [77.6974, 27.5650], tagline: 'The Eternal Playground of Krishna.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1662376107358-21296a9234f1?q=80&w=1226&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Haridwar', state: 'Uttarakhand', coordinates: [78.1642, 29.9457], tagline: 'Gateway to the Gods.', bestSeason: 'October to April', heroImage: 'https://plus.unsplash.com/premium_photo-1697730398251-40cd8dc57e0b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Kedarnath', state: 'Uttarakhand', coordinates: [79.0669, 30.7352], tagline: 'Seek Divine Blessings in the Himalayas.', bestSeason: 'May to June, September to October', heroImage: 'https://images.unsplash.com/photo-1712733900711-d0b929d0d7cc?q=80&w=677&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Badrinath', state: 'Uttarakhand', coordinates: [79.4922, 30.7433], tagline: 'The Sacred Abode of Lord Vishnu.', bestSeason: 'May to November', heroImage: 'https://images.unsplash.com/photo-1601821139366-eb14f3628e26?q=80&w=855&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Tirupati', state: 'Andhra Pradesh', coordinates: [79.4192, 13.6288], tagline: 'Home of the Lord of Seven Hills.', bestSeason: 'September to March', heroImage: 'https://plus.unsplash.com/premium_photo-1697730420879-dc2a8dbaa31f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Somnath', state: 'Gujarat', coordinates: [70.4012, 20.8880], tagline: 'The Shrine Eternal.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1735192683815-d8918aad53dc?q=80&w=524&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Shirdi', state: 'Maharashtra', coordinates: [74.4818, 19.7662], tagline: 'The Land of Sai Baba.', bestSeason: 'October to March', heroImage: 'https://plus.unsplash.com/premium_photo-1676196138129-0f51095eb6f5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Amritsar', state: 'Punjab', coordinates: [74.8723, 31.6340], tagline: 'The Sacred Golden Gateway.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
    ],
    activities: [
      { name: 'Evening Ganga Aarti Ceremony', price: 250, duration: '1.5 Hours', desc: 'Experience the rhythmic Vedic hymns and oil lamps fire ceremony on the sacred banks.', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800' },
      { name: 'Heritage Temple Walking Tour', price: 400, duration: '3 Hours', desc: 'Walk through ancient alleyways to discover old shrines, architecture, and sacred history.', image: 'https://images.unsplash.com/photo-1629814479577-db419cfa8881?w=800' },
      { name: 'Sunrise Boat Ride & Meditation', price: 600, duration: '2 Hours', desc: 'Take a serene rowboat cruise at sunrise, followed by mindfulness meditation by the water.', image: 'https://images.unsplash.com/photo-1598977123418-45f04b61b49e?w=800' },
      { name: 'Vedic Chanting & Ritual Experience', price: 800, duration: '2 Hours', desc: 'Join local scholars to learn divine mantra chanting and witness deep-rooted traditional rituals.', image: 'https://images.unsplash.com/photo-1608958416715-fc9ba840fb28?w=800' },
      { name: 'Spiritual Ashrams & Yoga Session', price: 500, duration: '2.5 Hours', desc: 'Visit peaceful ashrams to experience spiritual lifestyle discourses and classical yoga.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800' },
      { name: 'Traditional Satvik Food Exploration', price: 450, duration: '3 Hours', desc: 'Savor organic, onion-and-garlic-free spiritual meals prepared according to ayurvedic guidelines.', image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800' }
    ]
  },
  Adventure: {
    name: 'Adventure',
    tags: ['adventure', 'trekking', 'mountains', 'camping', 'rafting'],
    destinations: [
      { city: 'Rishikesh', state: 'Uttarakhand', coordinates: [78.2676, 30.0869], tagline: 'The Adventure and Yoga Capital.', bestSeason: 'September to June', heroImage: 'https://images.unsplash.com/photo-1712510817140-917938f92e5b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Manali', state: 'Himachal Pradesh', coordinates: [77.1892, 32.2432], tagline: 'High-Altitude Playground of India.', bestSeason: 'October to June', heroImage: 'https://images.unsplash.com/photo-1637737118663-f1a53ee1d5a7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Leh Ladakh', state: 'Jammu & Kashmir', coordinates: [77.5771, 34.1526], tagline: 'Adventure on the Roof of the World.', bestSeason: 'May to September', heroImage: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800' },
      { city: 'Kasol', state: 'Himachal Pradesh', coordinates: [77.3111, 32.0099], tagline: 'Trekker\'s Dream in the Parvati Valley.', bestSeason: 'April to June, October to November', heroImage: 'https://images.unsplash.com/photo-1618083707368-b3823daa2726?w=800' },
      { city: 'Spiti Valley', state: 'Himachal Pradesh', coordinates: [78.0349, 32.2461], tagline: 'The Breathtaking Cold Desert Escape.', bestSeason: 'May to October', heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800' },
      { city: 'Auli', state: 'Uttarakhand', coordinates: [79.5660, 30.5289], tagline: 'The Ultimate Skiing Destination.', bestSeason: 'December to March', heroImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800' },
      { city: 'Mussoorie', state: 'Uttarakhand', coordinates: [78.0777, 30.4598], tagline: 'The Queen of Hills.', bestSeason: 'April to June, September to November', heroImage: 'https://images.unsplash.com/photo-1679807680867-1f03ec9a8de6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Shimla', state: 'Himachal Pradesh', coordinates: [77.1734, 31.1048], tagline: 'Charming Hills and Snowy Thrills.', bestSeason: 'March to June, November to February', heroImage: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800' }
    ],
    activities: [
      { name: 'White Water River Rafting', price: 1800, duration: '3 Hours', desc: 'Conquer wild rapids on the freezing high-velocity Himalayan rivers with extreme safety gear.', image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800' },
      { name: 'Tandem Sky Paragliding Ride', price: 3200, duration: '1 Hour', desc: 'Soar like a bird over deep pine forests and catch spectacular views of snow peaks.', image: 'https://images.unsplash.com/photo-1522044810620-3e28ce194ddc?w=800' },
      { name: 'Mountain Camping & Bonfire Night', price: 1500, duration: '12 Hours', desc: 'Camp under the pitch-black starry sky with live acoustic music and glowing bonfires.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800' },
      { name: 'Himalayan Ridge Trekking Expedition', price: 2000, duration: '6 Hours', desc: 'Embark on a scenic guided ridge trek passing through beautiful meadows and waterfalls.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800' },
      { name: 'Extreme Ziplining Over Valleys', price: 1200, duration: '2 Hours', desc: 'Zip across massive mountain gorges hanging high above gushing rivers and thick forests.', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800' },
      { name: 'All-Terrain Bike (ATV) Safari', price: 1000, duration: '1.5 Hours', desc: 'Offroad on rugged forest and rocky paths on high-power quad bikes and ATVs.', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800' }
    ]
  },
  Beach: {
    name: 'Beach',
    tags: ['beach', 'nightlife', 'water sports', 'party', 'vacation'],
    destinations: [
      { city: 'Goa', state: 'Goa', coordinates: [73.8567, 15.2993], tagline: 'Sun, Sand, and Electrifying Nightlife.', bestSeason: 'November to February', heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
      { city: 'Pondicherry', state: 'Puducherry', coordinates: [79.8083, 11.9416], tagline: 'The French Riviera of the East.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800' },
      { city: 'Gokarna', state: 'Karnataka', coordinates: [74.3188, 14.5479], tagline: 'Untamed Beaches and Sacred Cliffs.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800' },
      { city: 'Alibaug', state: 'Maharashtra', coordinates: [72.8777, 18.6584], tagline: 'The Coastal Weekend Getaway.', bestSeason: 'November to May', heroImage: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800' },
      { city: 'Andaman', state: 'Andaman & Nicobar', coordinates: [92.7265, 11.6234], tagline: 'Pristine Turquoise Islands and Corals.', bestSeason: 'October to May', heroImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800' },
      { city: 'Lakshadweep', state: 'Lakshadweep', coordinates: [72.6417, 10.5667], tagline: 'Exclusive Tropical Lagoon Paradise.', bestSeason: 'October to May', heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
      { city: 'Varkala', state: 'Kerala', coordinates: [76.7084, 8.7303], tagline: 'Dramatic Red Cliffs and Golden Sands.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800' },
      { city: 'Kovalam', state: 'Kerala', coordinates: [76.9906, 8.4021], tagline: 'The Famous Lighthouse Beach Resort.', bestSeason: 'September to March', heroImage: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800' }
    ],
    activities: [
      { name: 'Premium Scuba Diving & Marine Safari', price: 3800, duration: '4 Hours', desc: 'Dive into brilliant tropical reefs to explore majestic corals, sea turtles, and fish.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
      { name: 'Anjuna Beach Party & Sundowner', price: 2000, duration: '5 Hours', desc: 'Sip cocktails at a premium cliffside beach club while elite DJs play into the starry night.', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800' },
      { name: 'Deep Sea Jet Ski & Speedboat Ride', price: 1500, duration: '1 Hour', desc: 'Race across the waves of the Arabian Sea on high-performance personal watercraft.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
      { name: 'Sunset Catamaran Yacht Cruise', price: 2500, duration: '3 Hours', desc: 'Enjoy high-end luxury with music, snacks, and spectacular sunset ocean views on a private yacht.', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800' },
      { name: 'Guided Snorkeling & Coral Trek', price: 1800, duration: '2 Hours', desc: 'Snorkel in shallow, crystal clear lagoon bays to discover colorful marine ecosystems.', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800' },
      { name: 'Bohemian Beach Cafe & Food Hop', price: 1000, duration: '3 Hours', desc: 'Explore vibrant, neon-lit beach shacks serving local seafood, continental delights, and drinks.', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800' }
    ]
  },
  Nature: {
    name: 'Nature',
    tags: ['nature', 'hills', 'relaxation', 'greenery', 'peaceful'],
    destinations: [
      { city: 'Ooty', state: 'Tamil Nadu', coordinates: [76.6958, 11.4102], tagline: 'Queen of the Southern Hills.', bestSeason: 'October to June', heroImage: 'https://plus.unsplash.com/premium_photo-1725408090963-49dd5bfc1baf?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Munnar', state: 'Kerala', coordinates: [77.0595, 10.0889], tagline: 'Green Tea Carpets and Misty Peaks.', bestSeason: 'September to May', heroImage: 'https://images.unsplash.com/photo-1591089101324-2280d9260000?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Coorg', state: 'Karnataka', coordinates: [75.7378, 12.4244], tagline: 'The Coffee Cup of India.', bestSeason: 'October to April', heroImage: 'https://images.unsplash.com/photo-1655128633542-b6b7e86e93b4?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Nainital', state: 'Uttarakhand', coordinates: [79.4519, 29.3803], tagline: 'The Romantic Lake District.', bestSeason: 'March to June, October to February', heroImage: 'https://images.unsplash.com/photo-1610641818989-c2023799dab1?w=800' },
      { city: 'Darjeeling', state: 'West Bengal', coordinates: [88.2627, 27.0410], tagline: 'Himalayan Stretches of Tea Gardens.', bestSeason: 'October to May', heroImage: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=800' },
      { city: 'Mount Abu', state: 'Rajasthan', coordinates: [72.7107, 24.5926], tagline: 'Oasis in the Arid Sands.', bestSeason: 'November to June', heroImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800' },
      { city: 'Kodaikanal', state: 'Tamil Nadu', coordinates: [77.4940, 10.2381], tagline: 'The Gift of the Forests.', bestSeason: 'September to May', heroImage: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800' },
      { city: 'Lonavala', state: 'Maharashtra', coordinates: [73.4070, 18.7548], tagline: 'The Misty Western Ghats Retreat.', bestSeason: 'June to October, November to March', heroImage: 'https://images.unsplash.com/photo-1618805714320-f8825019c1be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
    ],
    activities: [
      { name: 'Guided Tea & Coffee Estate Stroll', price: 400, duration: '2 Hours', desc: 'Walk through infinite green slopes of tea/coffee estates, learning processing secrets.', image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800' },
      { name: 'Panoramic Lake Wooden Boating', price: 300, duration: '1 Hour', desc: 'Relax and boat on calm, emerald-tinted mountain lakes surrounded by high ridges.', image: 'https://images.unsplash.com/photo-1610641818989-c2023799dab1?w=800' },
      { name: 'Misty Pine Forest Hiking Tour', price: 600, duration: '3.5 Hours', desc: 'Hike into dense, silent pine groves covered in dynamic morning mist with local botanists.', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800' },
      { name: 'Valley View Nature Photography Walk', price: 500, duration: '3 Hours', desc: 'Capture gorgeous valley drops, blooming local flora, and rare birds from high viewpoints.', image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=800' },
      { name: 'Scenic Waterfall Trek & Swim', price: 800, duration: '4 Hours', desc: 'Trek down secret local forest routes to swim in absolute fresh pools of mountain waterfalls.', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800' },
      { name: 'Wild Organic Spice Garden Safari', price: 700, duration: '2.5 Hours', desc: 'Smell fresh vanilla, cardamom, and clove growing naturally in biological spice sanctuaries.', image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800' }
    ]
  },
  Historical: {
    name: 'Historical',
    tags: ['history', 'culture', 'heritage', 'architecture', 'royal'],
    destinations: [
      { city: 'Jaipur', state: 'Rajasthan', coordinates: [75.7873, 26.9124], tagline: 'The Grand Pink Fort City.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800' },
      { city: 'Agra', state: 'Uttar Pradesh', coordinates: [78.0081, 27.1767], tagline: 'The Citadel of the Taj.', bestSeason: 'November to February', heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800' },
      { city: 'Jodhpur', state: 'Rajasthan', coordinates: [73.0243, 26.2389], tagline: 'The Blue City of Mighty Forts.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1600100397608-f010e42ec9fb?w=800' },
      { city: 'Udaipur', state: 'Rajasthan', coordinates: [73.7125, 24.5854], tagline: 'The Romantic City of Floating Lakes.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=800' },
      { city: 'Hampi', state: 'Karnataka', coordinates: [76.4600, 15.3350], tagline: 'The Ruins of the Vijayanagara Empire.', bestSeason: 'October to March', heroImage: 'https://plus.unsplash.com/premium_photo-1697730337612-8bd916249e30?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Mysore', state: 'Karnataka', coordinates: [76.6394, 12.2958], tagline: 'The City of Magnificent Palaces.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1579429223126-29d2f6f9c1ac?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Khajuraho', state: 'Madhya Pradesh', coordinates: [79.9199, 24.8318], tagline: 'Sensational Stone Carvings and Architecture.', bestSeason: 'October to March', heroImage: 'https://plus.unsplash.com/premium_photo-1697730370661-51bf72769ff6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { city: 'Mahabalipuram', state: 'Tamil Nadu', coordinates: [80.1747, 12.6269], tagline: 'The Incredible Rock-Cut Shore Temples.', bestSeason: 'November to February', heroImage: 'https://plus.unsplash.com/premium_photo-1697729536647-4e23a32dd324?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
    ],
    activities: [
      { name: 'Royal Fort & Palace Tour', price: 600, duration: '3.5 Hours', desc: 'Explore historic royal fortresses, private courtyards, and detailed antique weapons storage.', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800' },
      { name: 'Folk Dance & Puppet Evening', price: 800, duration: '3 Hours', desc: 'Indulge in high-energy traditional royal folk dances, music, and colorful live puppet shows.', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800' },
      { name: 'Ancient Heritage Alley Walk', price: 400, duration: '2.5 Hours', desc: 'Walk past centuries-old neighborhoods, historic gateways, and markets with heritage curators.', image: 'https://images.unsplash.com/photo-1600100395420-40aa0e6f1999?w=800' },
      { name: 'Interactive Museum & Art Gallery Tour', price: 350, duration: '2 Hours', desc: 'Discover rare miniature paintings, antique artifacts, and royal costumes inside palaces.', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800' },
      { name: 'Local Gastronomy & Royal Dinner', price: 1200, duration: '3 Hours', desc: 'Feast on dynamic multi-course local recipes served in premium, historic copper dinnerware.', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800' },
      { name: 'Ancient Architecture Sketching Tour', price: 500, duration: '3 Hours', desc: 'Join local artists to sketch high-detail relief sculptures and columns at ancient monuments.', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800' }
    ]
  },
  City: {
    name: 'City',
    tags: ['modern', 'city life', 'nightlife', 'food', 'urban'],
    destinations: [
      { city: 'Mumbai', state: 'Maharashtra', coordinates: [72.8777, 19.0760], tagline: 'The Maximum City of Infinite Dreams.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800' },
      { city: 'Bangalore', state: 'Karnataka', coordinates: [77.5946, 12.9716], tagline: 'The Silicon Valley and Garden City.', bestSeason: 'September to March', heroImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800' },
      { city: 'Delhi', state: 'Delhi', coordinates: [77.2090, 28.6139], tagline: 'The Historic Capital and Modern Hub.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800' },
      { city: 'Hyderabad', state: 'Telangana', coordinates: [78.4867, 17.3850], tagline: 'The Biryani Capital of Pearls and Tech.', bestSeason: 'November to February', heroImage: 'https://images.unsplash.com/photo-1606293926075-69a007f4a20b?w=800' },
      { city: 'Chandigarh', state: 'Chandigarh', coordinates: [76.7794, 30.7333], tagline: 'India\'s Most Beautifully Planned Modern City.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1568849676085-51415703900f?w=800' },
      { city: 'Kolkata', state: 'West Bengal', coordinates: [88.3639, 22.5726], tagline: 'The City of Joy and Sweet Melodies.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800' },
      { city: 'Pune', state: 'Maharashtra', coordinates: [73.8567, 18.5204], tagline: 'The Vibrant Oxford of the East.', bestSeason: 'October to March', heroImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800' },
      { city: 'Chennai', state: 'Tamil Nadu', coordinates: [80.2707, 13.0827], tagline: 'Cultural Heart and Modern Motor City.', bestSeason: 'November to February', heroImage: 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?w=800' }
    ],
    activities: [
      { name: 'Indie Microbrewery & Pub Hop', price: 1500, duration: '4 Hours', desc: 'Sample freshly crafted local craft beers and fusion bar bites in the premium IT districts.', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800' },
      { name: 'Gourmet Specialty Cafe Crawl', price: 700, duration: '3 Hours', desc: 'Taste single-origin coffees and premium artisanal pastries inside modern, award-winning cafes.', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800' },
      { name: 'High-Tech Urban Park Guided Walk', price: 300, duration: '2 Hours', desc: 'Walk under huge green canopies within central green lung spaces of modern IT hubs.', image: 'https://images.unsplash.com/photo-1568849676085-51415703900f?w=800' },
      { name: 'Street Food & Night Bazaar Hop', price: 600, duration: '3 Hours', desc: 'Explore glowing neon street markets, eating authentic local food delicacies with expert guides.', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800' },
      { name: 'Modern City Neon Night Drive', price: 1000, duration: '2.5 Hours', desc: 'Take a midnight drive along iconic coastal paths and modern high-rise skylines.', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800' },
      { name: 'Urban Mall & Luxury Shopping Hop', price: 500, duration: '4 Hours', desc: 'Shop at massive, premium lifestyle entertainment complexes and boutique designers.', image: 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?w=800' }
    ]
  }
};

const amenitiesPool = {
  hostel: ['Free WiFi', 'AC', 'Community Lounge', 'Bunk Beds', 'Kitchen', 'Laundry', 'Locker', 'Gaming Zone', 'Shared Bathroom', 'Social Terrace'],
  homestay: ['Home Food', 'Free WiFi', 'Attached Balcony', 'AC', 'Garden', 'Private Kitchen', 'Geyser', 'Cycle Rental', 'Terrace View', 'Host Family'],
  dormitory: ['Locker', 'Shared Bathroom', 'Free WiFi', 'AC', 'Power Backup', 'Water Dispenser', '24/7 Security'],
  hotel: ['Swimming Pool', 'Luxury Spa', 'AC', 'En-suite Bathroom', 'Fitness Center', 'Room Service', 'Bar & Lounge', 'High Speed WiFi', 'Complimentary Breakfast', 'Mini Bar'],
  villa: ['Private Pool', 'Personal Chef', 'High-end Sound System', 'Private Garden', 'En-suite Luxury Bath', 'Smart Home Controls', 'Ocean View Balcony', 'Outdoor Barbecue', 'Jacuzzi', '24/7 Butler Service']
};

const hotelImagesPool = {
  Hostel: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?w=800',
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'
  ],
  Homestay: [
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c158bf920a6?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
  ],
  Dormitory: [
    'https://images.unsplash.com/photo-1509600110300-21b9d5fedeb7?w=800',
    'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?w=800',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'
  ],
  Hotel: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1542314831-c6a4d14d8373?w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
    'https://images.unsplash.com/photo-1592861176219-5eb82b7fb3f8?w=800',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'
  ],
  Villa: [
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
  ]
};

const staysTemplates = [
  // Hostels
  { title: 'The Zostel Hub', type: 'Hostel', basePrice: 450, targetAudience: 'student', amenities: 'hostel', desc: 'Highly social, premium and incredibly affordable backpacker hub.' },
  { title: 'Nomads Backpackers Lodge', type: 'Hostel', basePrice: 550, targetAudience: 'student', amenities: 'hostel', desc: 'Comfortable bunk beds, daily social events, and a dynamic rooftop cafe.' },
  // Homestays
  { title: 'Local Heritage Homestay', type: 'Homestay', basePrice: 900, targetAudience: 'student', amenities: 'homestay', desc: 'Experience warm local hospitality and delicious family-cooked organic meals.' },
  { title: 'Peaceful Bliss Villa Homestay', type: 'Homestay', basePrice: 1100, targetAudience: 'student', amenities: 'homestay', desc: 'Charming homestay with a green garden and spectacular sunrise balcony views.' },
  // Dormitories
  { title: 'Backpackers Cozy Dorms', type: 'Dormitory', basePrice: 350, targetAudience: 'student', amenities: 'dormitory', desc: 'The most wallet-friendly, safe, and super clean accommodation for travelers.' },
  { title: 'Station Square Smart Dorm', type: 'Dormitory', basePrice: 300, targetAudience: 'student', amenities: 'dormitory', desc: 'Clean lockable bunk pod beds right in the city center.' },
  // Hotels
  { title: 'The Taj Grand Resort', type: 'Hotel', basePrice: 6500, targetAudience: 'employee', amenities: 'hotel', desc: 'Uncompromised five-star premium luxury with ocean/mountain views and elite dining.' },
  { title: 'Radisson Business Hotel', type: 'Hotel', basePrice: 4800, targetAudience: 'employee', amenities: 'hotel', desc: 'Perfect business-friendly suites with super-speed WiFi and working tables.' },
  // Villas
  { title: 'The Azure Premium Private Pool Villa', type: 'Villa', basePrice: 15500, targetAudience: 'employee', amenities: 'villa', desc: 'Spectacular independent villa with private swimming pool, lawn, and personal butler.' },
  { title: 'The Royal Sovereign Panoramic Villa', type: 'Villa', basePrice: 22000, targetAudience: 'employee', amenities: 'villa', desc: 'Ultimate elite luxury featuring chef on call, glowing lights, and a luxury jacuzzi.' }
];

const seed = async () => {
  try {
    console.log(`Connecting to database at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB!');

    // Clear old data
    console.log('Clearing old destinations, activities, properties, and accommodations...');
    await Destination.deleteMany({});
    await Activity.deleteMany({});
    await Property.deleteMany({});
    await Accommodation.deleteMany({});
    console.log('Old collections cleared!');

    const seededDestinations = [];
    const seededActivities = [];
    const seededProperties = [];
    const seededAccommodations = [];

    // Loop through each category
    for (const catKey of Object.keys(categories)) {
      const catConfig = categories[catKey];
      console.log(`\nProcessing category: ${catConfig.name} (${catConfig.destinations.length} destinations)`);

      for (const dest of catConfig.destinations) {
        // 1. Seed Destination
        const averageStayCost = catKey === 'Spiritual' ? 1600 : catKey === 'Adventure' ? 2200 : catKey === 'Beach' ? 3200 : catKey === 'Nature' ? 2500 : catKey === 'Historical' ? 2800 : 3800;
        const averageFoodCost = catKey === 'Spiritual' ? 500 : catKey === 'Adventure' ? 800 : catKey === 'Beach' ? 1200 : catKey === 'Nature' ? 900 : catKey === 'Historical' ? 1000 : 1500;
        const averageTransportCost = catKey === 'Spiritual' ? 400 : catKey === 'Adventure' ? 600 : catKey === 'Beach' ? 800 : catKey === 'Nature' ? 700 : catKey === 'Historical' ? 600 : 1000;

        const newDest = new Destination({
          city: dest.city,
          tags: catConfig.tags,
          popularCategories: [catConfig.name],
          averageStayCost,
          averageFoodCost,
          averageTransportCost,
          heroImage: cityPexelsMap[dest.city] || dest.heroImage,
          tagline: dest.tagline,
          crowdLevel: dest.city === 'Goa' || dest.city === 'Mumbai' || dest.city === 'Varanasi' ? 'high' : dest.city === 'Leh Ladakh' || dest.city === 'Spiti Valley' ? 'low' : 'medium',
          category: catKey,
          bestSeason: dest.bestSeason,
          state: dest.state,
          rating: Number((4.3 + Math.random() * 0.6).toFixed(1)),
          trendingScore: Math.floor(75 + Math.random() * 23),
          coordinates: { type: 'Point', coordinates: dest.coordinates }
        });

        await newDest.save();
        seededDestinations.push(newDest);

        // 2. Seed 6 Activities for this Destination
        for (let i = 0; i < 6; i++) {
          const actTemplate = catConfig.activities[i];
          const offsetLon = (Math.random() - 0.5) * 0.05;
          const offsetLat = (Math.random() - 0.5) * 0.05;

          const newAct = new Activity({
            activityName: actTemplate.name.replace('${city}', dest.city),
            destination: dest.city,
            category: catKey === 'City' ? 'Local Exploration' : 
                      (catKey === 'Beach' ? 
                        (actTemplate.name.includes('Party') ? 'Nightlife' : 
                         (actTemplate.name.includes('Cafe') ? 'Food' : 'Water Sports')) 
                       : catKey),
            description: actTemplate.desc.replace('${city}', dest.city),
            tags: catConfig.tags,
            estimatedPrice: Math.floor(actTemplate.price * (0.85 + Math.random() * 0.3)),
            minimumPrice: Math.floor(actTemplate.price * 0.7),
            premiumPrice: Math.floor(actTemplate.price * 1.6),
            duration: actTemplate.duration,
            ratings: Number((4.2 + Math.random() * 0.8).toFixed(1)),
            popularityScore: Math.floor(70 + Math.random() * 30),
            nearbyActivities: [],
            image: (categoryPexelsPools[catKey] && categoryPexelsPools[catKey][i % categoryPexelsPools[catKey].length]) || actTemplate.image,
            coordinates: {
              type: 'Point',
              coordinates: [dest.coordinates[0] + offsetLon, dest.coordinates[1] + offsetLat]
            }
          });

          await newAct.save();
          seededActivities.push(newAct);
        }

        // 3. Seed 10 Stays (Properties & Accommodations) for this Destination
        for (let j = 0; j < staysTemplates.length; j++) {
          const stayTemp = staysTemplates[j];
          const offsetLon = (Math.random() - 0.5) * 0.06;
          const offsetLat = (Math.random() - 0.5) * 0.06;
          
          const rating = Number((4.1 + Math.random() * 0.9).toFixed(1));
          const price = Math.floor(stayTemp.basePrice * (0.9 + Math.random() * 0.3));

          // Property Model Seeding
          const newProp = new Property({
            title: stayTemp.title.replace('Hub', `${dest.city} Hub`).replace('Lodge', `${dest.city} Lodge`).replace('Homestay', `${dest.city} Homestay`).replace('Dorms', `${dest.city} Dorms`).replace('Dorm', `${dest.city} Dorm`).replace('Resort', `${dest.city} Resort`).replace('Hotel', `${dest.city} Hotel`).replace('Villa', `${dest.city} Villa`),
            type: stayTemp.type,
            price,
            location: `${dest.city}, ${dest.state}`,
            images: [
              (hotelImagesPool[stayTemp.type] && hotelImagesPool[stayTemp.type][j % hotelImagesPool[stayTemp.type].length]) || cityPexelsMap[dest.city] || dest.heroImage,
              'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            amenities: amenitiesPool[stayTemp.amenities],
            targetAudience: stayTemp.targetAudience,
            description: stayTemp.desc,
            rating,
            externalBookingUrl: stayTemp.type === 'Hostel' ? 'https://www.hostelworld.com' : 'https://www.makemytrip.com',
            maxGuests: stayTemp.type === 'Hostel' || stayTemp.type === 'Dormitory' ? 1 : stayTemp.type === 'Villa' ? 8 : 2,
            popularity: Math.floor(60 + Math.random() * 40),
            category: 'Stay',
            tags: [...catConfig.tags, stayTemp.type.toLowerCase()],
            source: 'Questora Verified'
          });

          await newProp.save();
          seededProperties.push(newProp);

          // Accommodation Model Seeding (exact replica to satisfy accommodationRoutes)
          const newAccom = new Accommodation({
            title: newProp.title,
            destination: dest.city,
            type: stayTemp.type.toLowerCase(),
            description: stayTemp.desc,
            images: newProp.images,
            pricePerNight: price,
            ratings: rating,
            amenities: newProp.amenities,
            bookingPlatform: 'Questora Direct',
            externalBookingLink: newProp.externalBookingUrl,
            popularityScore: newProp.popularity,
            coordinates: {
              type: 'Point',
              coordinates: [dest.coordinates[0] + offsetLon, dest.coordinates[1] + offsetLat]
            }
          });

          await newAccom.save();
          seededAccommodations.push(newAccom);
        }
      }
    }

    console.log('\n=======================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`Seeded Destinations   : ${seededDestinations.length}`);
    console.log(`Seeded Activities     : ${seededActivities.length}`);
    console.log(`Seeded Properties     : ${seededProperties.length}`);
    console.log(`Seeded Accommodations : ${seededAccommodations.length}`);
    console.log('=======================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database seeding failed:', err);
    process.exit(1);
  }
};

seed();
