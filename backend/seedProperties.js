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
  },
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
    externalBookingUrl: 'https://www.airbnb.co.in/',
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
    description: 'Budget-friendly stay for solo travelers.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.goibibo.com/',
    source: 'Goibibo'
  },

  {
    title: 'Backpackers Paradise Goa',
    type: 'Hostel',
    price: 650,
    location: 'Vagator, Goa',
    targetAudience: 'student',
    amenities: ['WiFi', 'Cafe', 'Music Nights'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Perfect for party lovers and backpackers.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'The Taj Exotica Resort',
    type: 'Hotel',
    price: 12500,
    location: 'Benaulim, Goa',
    targetAudience: 'employee',
    amenities: ['Gym', 'Private Beach', 'Fine Dining', 'Pool'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'],
    description: 'Luxury retreat for professionals.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.makemytrip.com/',
    source: 'MakeMyTrip'
  },

  {
    title: 'Azure Premium Villa',
    type: 'Villa',
    price: 25000,
    location: 'Assagao, Goa',
    targetAudience: 'employee',
    amenities: ['Private Pool', 'Chef', 'Bar'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'],
    description: 'Premium villa stay for executives.',
    maxGuests: 8,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'Radisson Blu Corporate Suites',
    type: 'Hotel',
    price: 8500,
    location: 'Cavelossim, Goa',
    targetAudience: 'employee',
    amenities: ['Business Center', 'Meeting Rooms', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'],
    description: 'Ideal for workations and corporate stays.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.goibibo.com/',
    source: 'Goibibo'
  },

  {
    title: 'Sea Breeze Resort Goa',
    type: 'Hotel',
    price: 6200,
    location: 'Calangute, Goa',
    targetAudience: 'employee',
    amenities: ['Pool', 'Restaurant', 'Beach Access'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'],
    description: 'Comfortable stay near Goa beaches.',
    maxGuests: 3,
    externalBookingUrl: 'https://www.booking.com/',
    source: 'Booking.com'
  },

  // =========================
  // RISHIKESH PROPERTIES
  // =========================

  {
    title: 'Shiv Shakti Hostel',
    type: 'Hostel',
    price: 450,
    location: 'Tapovan, Rishikesh',
    targetAudience: 'student',
    amenities: ['WiFi', 'Yoga Hall', 'Shared Kitchen'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    description: 'Affordable hostel for adventure travelers.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Ganga View Homestay',
    type: 'Homestay',
    price: 950,
    location: 'Laxman Jhula, Rishikesh',
    targetAudience: 'student',
    amenities: ['River View', 'WiFi', 'Meals Included'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Peaceful riverside homestay.',
    maxGuests: 3,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'Backpackers Cave',
    type: 'Dormitory',
    price: 300,
    location: 'Ram Jhula, Rishikesh',
    targetAudience: 'student',
    amenities: ['Locker', 'Shared Lounge'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'],
    description: 'Best budget stay for solo backpackers.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.goibibo.com/',
    source: 'Goibibo'
  },

  {
    title: 'Aloha on the Ganges',
    type: 'Hotel',
    price: 9800,
    location: 'Tapovan, Rishikesh',
    targetAudience: 'employee',
    amenities: ['Spa', 'Pool', 'Yoga Center'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800'],
    description: 'Luxury riverside hotel experience.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.makemytrip.com/',
    source: 'MakeMyTrip'
  },

  {
    title: 'Himalayan Retreat Villa',
    type: 'Villa',
    price: 15000,
    location: 'Narendra Nagar, Rishikesh',
    targetAudience: 'employee',
    amenities: ['Private Garden', 'Mountain View', 'Chef'],
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'],
    description: 'Premium villa in the Himalayas.',
    maxGuests: 6,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'Riverstone Resort',
    type: 'Hotel',
    price: 7200,
    location: 'Shivpuri, Rishikesh',
    targetAudience: 'employee',
    amenities: ['Adventure Camp', 'Restaurant', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800'],
    description: 'Perfect for rafting and camping lovers.',
    maxGuests: 4,
    externalBookingUrl: 'https://www.booking.com/',
    source: 'Booking.com'
  },
    // =========================
  // UJJAIN PROPERTIES
  // =========================

  {
    title: 'Mahakal Backpackers Hostel',
    type: 'Hostel',
    price: 450,
    location: 'Mahakal Lok, Ujjain',
    targetAudience: 'student',
    amenities: ['WiFi', 'Shared Kitchen', 'Locker', 'Dorm Beds'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    description: 'Affordable hostel near Mahakaleshwar Temple.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Spiritual Homestay Ujjain',
    type: 'Homestay',
    price: 900,
    location: 'Ram Ghat, Ujjain',
    targetAudience: 'student',
    amenities: ['Temple View', 'Meals Included', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Traditional homestay experience near ghats.',
    maxGuests: 3,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'Shree Mahakal Dormitory',
    type: 'Dormitory',
    price: 300,
    location: 'Freeganj, Ujjain',
    targetAudience: 'student',
    amenities: ['Locker', 'Shared Bathroom', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'],
    description: 'Budget stay for spiritual travelers.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.goibibo.com/',
    source: 'Goibibo'
  },

  {
    title: 'Anjushree Resort',
    type: 'Hotel',
    price: 7500,
    location: 'Indore Road, Ujjain',
    targetAudience: 'employee',
    amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'],
    description: 'Luxury stay with modern amenities.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.makemytrip.com/',
    source: 'MakeMyTrip'
  },

  {
    title: 'Heritage Royal Palace',
    type: 'Hotel',
    price: 6200,
    location: 'Dewas Road, Ujjain',
    targetAudience: 'employee',
    amenities: ['Conference Hall', 'WiFi', 'Fine Dining'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'],
    description: 'Premium heritage-style hotel.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.booking.com/',
    source: 'Booking.com'
  },

  // =========================
  // OOTY PROPERTIES
  // =========================

  {
    title: 'Ooty Hill Backpackers',
    type: 'Hostel',
    price: 650,
    location: 'Charring Cross, Ooty',
    targetAudience: 'student',
    amenities: ['WiFi', 'Bonfire', 'Mountain View'],
    images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800'],
    description: 'Backpacker-friendly hostel in Ooty hills.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Tea Garden Homestay',
    type: 'Homestay',
    price: 1200,
    location: 'Coonoor Road, Ooty',
    targetAudience: 'student',
    amenities: ['Tea Garden View', 'Breakfast', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Stay amidst tea plantations.',
    maxGuests: 4,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'Sterling Ooty Fern Hill',
    type: 'Hotel',
    price: 8500,
    location: 'Fern Hill, Ooty',
    targetAudience: 'employee',
    amenities: ['Spa', 'Restaurant', 'Mountain View'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800'],
    description: 'Premium hill resort experience.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.makemytrip.com/',
    source: 'MakeMyTrip'
  },

  {
    title: 'Lake View Luxury Villa',
    type: 'Villa',
    price: 18500,
    location: 'Ooty Lake, Ooty',
    targetAudience: 'employee',
    amenities: ['Private Garden', 'Fireplace', 'Chef'],
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'],
    description: 'Luxury villa overlooking Ooty lake.',
    maxGuests: 6,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  // =========================
  // MUSSOORIE PROPERTIES
  // =========================

  {
    title: 'Mountain Escape Hostel',
    type: 'Hostel',
    price: 550,
    location: 'Mall Road, Mussoorie',
    targetAudience: 'student',
    amenities: ['WiFi', 'Game Zone', 'Cafe'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    description: 'Budget hostel near Mussoorie Mall Road.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Cloud View Homestay',
    type: 'Homestay',
    price: 1400,
    location: 'Landour, Mussoorie',
    targetAudience: 'student',
    amenities: ['Mountain View', 'Breakfast', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Peaceful mountain homestay.',
    maxGuests: 3,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'JW Marriott Mussoorie',
    type: 'Hotel',
    price: 15500,
    location: 'Kempty Falls Road, Mussoorie',
    targetAudience: 'employee',
    amenities: ['Spa', 'Pool', 'Luxury Dining'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'],
    description: 'Luxury mountain resort experience.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.booking.com/',
    source: 'Booking.com'
  },

  {
    title: 'Pinewood Corporate Suites',
    type: 'Hotel',
    price: 7200,
    location: 'Library Chowk, Mussoorie',
    targetAudience: 'employee',
    amenities: ['Business Lounge', 'WiFi', 'Restaurant'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'],
    description: 'Modern hotel for professionals.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.goibibo.com/',
    source: 'Goibibo'
  },

  // =========================
  // SHIMLA PROPERTIES
  // =========================

  {
    title: 'Snow Valley Hostel',
    type: 'Hostel',
    price: 600,
    location: 'Mall Road, Shimla',
    targetAudience: 'student',
    amenities: ['WiFi', 'Bonfire', 'Dorm Beds'],
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'],
    description: 'Affordable hostel in central Shimla.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Himalayan Cottage Homestay',
    type: 'Homestay',
    price: 1500,
    location: 'Kufri Road, Shimla',
    targetAudience: 'student',
    amenities: ['Mountain View', 'WiFi', 'Breakfast'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Cozy homestay surrounded by hills.',
    maxGuests: 4,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'The Oberoi Cecil',
    type: 'Hotel',
    price: 17500,
    location: 'Chaura Maidan, Shimla',
    targetAudience: 'employee',
    amenities: ['Luxury Spa', 'Fine Dining', 'Pool'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'],
    description: 'One of the most luxurious stays in Shimla.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.makemytrip.com/',
    source: 'MakeMyTrip'
  },

  {
    title: 'Royal Pine Resort',
    type: 'Villa',
    price: 22000,
    location: 'Mashobra, Shimla',
    targetAudience: 'employee',
    amenities: ['Private Garden', 'Fireplace', 'Chef'],
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'],
    description: 'Exclusive villa for premium travelers.',
    maxGuests: 8,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },
    // =========================
  // MANALI PROPERTIES
  // =========================

  {
    title: 'Nomad Peaks Hostel',
    type: 'Hostel',
    price: 550,
    location: 'Old Manali, Manali',
    targetAudience: 'student',
    amenities: ['WiFi', 'Cafe', 'Bonfire', 'Mountain View'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    description: 'Popular backpacker hostel in Old Manali.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Snow Trails Homestay',
    type: 'Homestay',
    price: 1300,
    location: 'Vashisht, Manali',
    targetAudience: 'student',
    amenities: ['Mountain View', 'Breakfast', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Peaceful homestay with Himalayan views.',
    maxGuests: 4,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'Himalayan Dormitory Hub',
    type: 'Dormitory',
    price: 400,
    location: 'Mall Road, Manali',
    targetAudience: 'student',
    amenities: ['Locker', 'WiFi', 'Shared Kitchen'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'],
    description: 'Affordable dormitory near main market.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.goibibo.com/',
    source: 'Goibibo'
  },

  {
    title: 'The Himalayan Resort',
    type: 'Hotel',
    price: 9800,
    location: 'Hadimba Road, Manali',
    targetAudience: 'employee',
    amenities: ['Spa', 'Mountain View', 'Restaurant'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800'],
    description: 'Luxury stay with beautiful mountain scenery.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.makemytrip.com/',
    source: 'MakeMyTrip'
  },

  {
    title: 'Pinewood Luxury Villa',
    type: 'Villa',
    price: 24000,
    location: 'Solang Valley, Manali',
    targetAudience: 'employee',
    amenities: ['Private Fireplace', 'Chef', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'],
    description: 'Premium villa for luxury travelers.',
    maxGuests: 8,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  // =========================
  // JAIPUR PROPERTIES
  // =========================

  {
    title: 'Pink City Backpackers',
    type: 'Hostel',
    price: 500,
    location: 'MI Road, Jaipur',
    targetAudience: 'student',
    amenities: ['WiFi', 'Cafe', 'Rooftop Seating'],
    images: ['https://images.unsplash.com/photo-1555854817-5b27381b4f8d?auto=format&fit=crop&q=80&w=800'],
    description: 'Budget hostel near Jaipur city center.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Rajputana Homestay',
    type: 'Homestay',
    price: 1100,
    location: 'Bani Park, Jaipur',
    targetAudience: 'student',
    amenities: ['Traditional Food', 'WiFi', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Traditional Rajasthani stay experience.',
    maxGuests: 4,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'Holiday Inn Jaipur',
    type: 'Hotel',
    price: 8200,
    location: 'Tonk Road, Jaipur',
    targetAudience: 'employee',
    amenities: ['Pool', 'Gym', 'Business Lounge'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'],
    description: 'Business-friendly luxury hotel.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.booking.com/',
    source: 'Booking.com'
  },

  {
    title: 'Royal Desert Villa',
    type: 'Villa',
    price: 19500,
    location: 'Amer Road, Jaipur',
    targetAudience: 'employee',
    amenities: ['Private Pool', 'Chef', 'Luxury Rooms'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'],
    description: 'Royal villa inspired by Rajput architecture.',
    maxGuests: 6,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  // =========================
  // VARANASI PROPERTIES
  // =========================

  {
    title: 'Ghat View Hostel',
    type: 'Hostel',
    price: 450,
    location: 'Dashashwamedh Ghat, Varanasi',
    targetAudience: 'student',
    amenities: ['WiFi', 'River View', 'Shared Kitchen'],
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'],
    description: 'Backpacker hostel near famous ghats.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Spiritual Stay Homestay',
    type: 'Homestay',
    price: 950,
    location: 'Assi Ghat, Varanasi',
    targetAudience: 'student',
    amenities: ['Temple View', 'Breakfast', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Authentic spiritual homestay experience.',
    maxGuests: 3,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'BrijRama Palace',
    type: 'Hotel',
    price: 14500,
    location: 'Darbhanga Ghat, Varanasi',
    targetAudience: 'employee',
    amenities: ['Luxury Spa', 'Fine Dining', 'River View'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'],
    description: 'Luxury heritage palace hotel.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.makemytrip.com/',
    source: 'MakeMyTrip'
  },

  {
    title: 'Royal Ganges Villa',
    type: 'Villa',
    price: 21000,
    location: 'Ramnagar, Varanasi',
    targetAudience: 'employee',
    amenities: ['Private Garden', 'Chef', 'Luxury Rooms'],
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'],
    description: 'Premium villa overlooking the Ganges.',
    maxGuests: 7,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  // =========================
  // RISHIKESH EXTRA PROPERTIES
  // =========================

  {
    title: 'Adventure Junkies Hostel',
    type: 'Hostel',
    price: 500,
    location: 'Shivpuri, Rishikesh',
    targetAudience: 'student',
    amenities: ['WiFi', 'Adventure Desk', 'Bonfire'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    description: 'Hostel specially designed for rafting travelers.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Yoga Retreat Homestay',
    type: 'Homestay',
    price: 1250,
    location: 'Tapovan, Rishikesh',
    targetAudience: 'student',
    amenities: ['Yoga Hall', 'Organic Food', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Ideal stay for yoga and meditation lovers.',
    maxGuests: 3,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'Ganga Riverside Resort',
    type: 'Hotel',
    price: 8800,
    location: 'Laxman Jhula, Rishikesh',
    targetAudience: 'employee',
    amenities: ['Spa', 'Pool', 'River View'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800'],
    description: 'Luxury resort near Ganga river.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.booking.com/',
    source: 'Booking.com'
  },
    // =========================
  // AYODHYA PROPERTIES
  // =========================

  {
    title: 'Ram Bhakt Hostel',
    type: 'Hostel',
    price: 450,
    location: 'Ram Janmabhoomi Road, Ayodhya',
    targetAudience: 'student',
    amenities: ['WiFi', 'Locker', 'Shared Kitchen'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    description: 'Affordable stay near Ram Mandir.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Saryu River Homestay',
    type: 'Homestay',
    price: 1100,
    location: 'Saryu Ghat, Ayodhya',
    targetAudience: 'student',
    amenities: ['River View', 'Breakfast', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Traditional spiritual homestay experience.',
    maxGuests: 4,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'Ayodhya Royal Residency',
    type: 'Hotel',
    price: 7200,
    location: 'Faizabad Road, Ayodhya',
    targetAudience: 'employee',
    amenities: ['Restaurant', 'Business Lounge', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'],
    description: 'Premium hotel for family and business stays.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.makemytrip.com/',
    source: 'MakeMyTrip'
  },

  {
    title: 'Ramayana Palace Hotel',
    type: 'Hotel',
    price: 8900,
    location: 'Hanuman Garhi, Ayodhya',
    targetAudience: 'employee',
    amenities: ['Luxury Rooms', 'Temple View', 'Parking'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'],
    description: 'Luxury spiritual retreat in Ayodhya.',
    maxGuests: 3,
    externalBookingUrl: 'https://www.booking.com/',
    source: 'Booking.com'
  },

  // =========================
  // AGRA PROPERTIES
  // =========================

  {
    title: 'Taj Backpackers Hostel',
    type: 'Hostel',
    price: 550,
    location: 'Taj Ganj, Agra',
    targetAudience: 'student',
    amenities: ['WiFi', 'Cafe', 'City Tours'],
    images: ['https://images.unsplash.com/photo-1555854817-5b27381b4f8d?auto=format&fit=crop&q=80&w=800'],
    description: 'Backpacker stay near Taj Mahal.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Mughal Heritage Homestay',
    type: 'Homestay',
    price: 1350,
    location: 'Fatehabad Road, Agra',
    targetAudience: 'student',
    amenities: ['Traditional Food', 'WiFi', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Experience Mughal hospitality in Agra.',
    maxGuests: 4,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'The Oberoi Amarvilas',
    type: 'Hotel',
    price: 28000,
    location: 'Taj East Gate Road, Agra',
    targetAudience: 'employee',
    amenities: ['Luxury Spa', 'Taj Mahal View', 'Pool'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'],
    description: 'Ultra luxury hotel with Taj Mahal views.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.makemytrip.com/',
    source: 'MakeMyTrip'
  },

  {
    title: 'Taj Imperial Suites',
    type: 'Hotel',
    price: 9500,
    location: 'Civil Lines, Agra',
    targetAudience: 'employee',
    amenities: ['Business Lounge', 'Restaurant', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'],
    description: 'Perfect for business and family stays.',
    maxGuests: 3,
    externalBookingUrl: 'https://www.goibibo.com/',
    source: 'Goibibo'
  },

  // =========================
  // VRINDAVAN PROPERTIES
  // =========================

  {
    title: 'Krishna Bhakti Hostel',
    type: 'Hostel',
    price: 400,
    location: 'Banke Bihari Road, Vrindavan',
    targetAudience: 'student',
    amenities: ['WiFi', 'Temple Tours', 'Shared Kitchen'],
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'],
    description: 'Budget-friendly stay for spiritual travelers.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Radha Madhav Homestay',
    type: 'Homestay',
    price: 950,
    location: 'Prem Mandir Road, Vrindavan',
    targetAudience: 'student',
    amenities: ['Temple View', 'Breakfast', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Peaceful devotional homestay.',
    maxGuests: 3,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'Nidhivan Luxury Resort',
    type: 'Hotel',
    price: 8200,
    location: 'Mathura Road, Vrindavan',
    targetAudience: 'employee',
    amenities: ['Spa', 'Pool', 'Restaurant'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800'],
    description: 'Luxury spiritual resort experience.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.booking.com/',
    source: 'Booking.com'
  },

  {
    title: 'Vrindavan Royal Palace',
    type: 'Villa',
    price: 18500,
    location: 'ISKCON Temple Area, Vrindavan',
    targetAudience: 'employee',
    amenities: ['Private Garden', 'Luxury Rooms', 'Chef'],
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'],
    description: 'Premium villa near ISKCON temple.',
    maxGuests: 7,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  // =========================
  // KASHI / VARANASI EXTRA
  // =========================

  {
    title: 'Kashi Spiritual Hostel',
    type: 'Hostel',
    price: 500,
    location: 'Manikarnika Ghat, Kashi',
    targetAudience: 'student',
    amenities: ['WiFi', 'Shared Kitchen', 'Ghat Tours'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    description: 'Affordable hostel for spiritual backpackers.',
    maxGuests: 1,
    externalBookingUrl: 'https://www.hostelworld.com/',
    source: 'HostelWorld'
  },

  {
    title: 'Banaras Heritage Homestay',
    type: 'Homestay',
    price: 1200,
    location: 'Assi Ghat, Kashi',
    targetAudience: 'student',
    amenities: ['River View', 'Breakfast', 'Cultural Tours'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'],
    description: 'Traditional Banarasi stay experience.',
    maxGuests: 4,
    externalBookingUrl: 'https://www.airbnb.co.in/',
    source: 'Airbnb'
  },

  {
    title: 'Ganges Crown Hotel',
    type: 'Hotel',
    price: 9200,
    location: 'Dashashwamedh Ghat, Kashi',
    targetAudience: 'employee',
    amenities: ['Luxury Dining', 'River View', 'Spa'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'],
    description: 'Premium stay overlooking Ganga river.',
    maxGuests: 2,
    externalBookingUrl: 'https://www.makemytrip.com/',
    source: 'MakeMyTrip'
  },

  {
    title: 'Royal Banaras Suites',
    type: 'Hotel',
    price: 7600,
    location: 'Godowlia, Kashi',
    targetAudience: 'employee',
    amenities: ['Conference Hall', 'Restaurant', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'],
    description: 'Elegant hotel in the heart of Kashi.',
    maxGuests: 3,
    externalBookingUrl: 'https://www.goibibo.com/',
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
