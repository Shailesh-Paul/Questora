const mongoose = require('mongoose');
const Property = require('./models/Property');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });



const properties = [
  // Student Stays (Affordable: Hostels, Dorms, Homestays)
  {
    title: 'The Zostel Backpacker Hub',
    type: 'Hostel',
    price: 499,
    location: 'Anjuna, Goa',
    targetAudience: 'student',
    amenities: ['WiFi', 'Community Kitchen', 'Social Area', 'Bunk Beds'],
    images: ['https://images.unsplash.com/photo-1555854817-5b27381b4f8d?auto=format&fit=crop&q=80&w=800'],
    description: 'Affordable and social stay for backpackers and students.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.makemytrip.com/hotels/zostel_goa-details-goa.html',

    source: 'MakeMyTrip'
  },
  {
    title: 'Nomads Local Homestay',
    type: 'Homestay',
    price: 850,
    location: 'Palolem, Goa',
    targetAudience: 'student',
    amenities: ['Home Cooked Food', 'WiFi', 'Garden', 'Cycle Rental'],
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'],
    description: 'Experience true Goan culture with a local family.',
    maxGuests: 4,
    externalBookingUrl: 'https://www.airbnb.co.in/rooms/local-homestay-goa',

    source: 'Airbnb'
  },
  {
    title: 'University Square Dorms',
    type: 'Dormitory',
    price: 350,
    location: 'Panjim, Goa',
    targetAudience: 'student',
    amenities: ['Locker', 'Shared Bath', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'],
    description: 'The most budget-friendly option for solo student travelers.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.goibibo.com/hotels/dorms-panjim-goa/',

    source: 'Goibibo'
  },
  // Employee Stays (Premium: Hotels, Villas)
  {
    title: 'The Taj Exotica Resort',
    type: 'Hotel',
    price: 12500,
    location: 'Benaulim, Goa',
    targetAudience: 'employee',
    amenities: ['Gym', 'Private Beach', 'Fine Dining', 'Pool'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'],
    description: 'A luxurious retreat for corporate executives.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.makemytrip.com/hotels/taj_exotica_resort_spa_goa-details-goa.html',

    source: 'MakeMyTrip'
  },
  {
    title: 'Azure Premium Villa',
    type: 'Villa',
    price: 25000,
    location: 'Assagao, Goa',
    targetAudience: 'employee',
    amenities: ['Private Pool', 'Chef on Call', 'Smart Home', 'Bar'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'],
    description: 'Exclusive villa experience for business groups.',
    maxGuests: 8,
    externalBookingUrl: 'https://www.airbnb.co.in/rooms/azure-villa-goa',

    source: 'Airbnb'
  },
  {
    title: 'Radisson Blu Corporate Suites',
    type: 'Hotel',
    price: 8500,
    location: 'Cavelossim, Goa',
    targetAudience: 'employee',
    amenities: ['Business Center', 'High Speed Internet', 'Meeting Rooms'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'],
    description: 'Perfectly designed for the traveling professional.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.goibibo.com/hotels/radisson-blu-resort-goa-hotel-in-goa/',

    source: 'Goibibo'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    await Property.deleteMany({ targetAudience: { $in: ['student', 'employee'] } });
    await Property.insertMany(properties);
    
    console.log('Seed successful');
    process.exit();
  } catch (error) {
    console.error('Seed failed', error);
    process.exit(1);
  }
};

seedDB();
