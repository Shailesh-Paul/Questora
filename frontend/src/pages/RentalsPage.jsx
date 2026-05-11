import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { 
  ArrowLeft, Bike, Car, MapPin, 
  Clock, Calendar, PlusCircle, 
  Search, Filter, ChevronRight, 
  Star, ShieldCheck, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import RentalRegistrationModal from "../components/RentalRegistrationModal";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const MOCK_RENTALS = [
  // GOA
  { id: "r1", title: "Royal Enfield Classic 350", category: "Bikes", location: "Goa", hourlyPrice: 100, dailyPrice: 800, pricingType: "both", rating: 4.8, images: ["https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=400"], ownerName: "Rajesh", contact: "9876543210" },
  { id: "r2", title: "Thar 4x4 Convertible", category: "Cars", location: "Goa", hourlyPrice: 400, dailyPrice: 3500, pricingType: "both", rating: 4.9, images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400"], ownerName: "Goa Drive", contact: "9876543211" },
  { id: "r3", title: "Activa 6G Scooter", category: "Scooters", location: "Goa", hourlyPrice: 50, dailyPrice: 400, pricingType: "both", rating: 4.7, images: ["https://images.unsplash.com/photo-1519750292352-c9fc17322ed7?w=400"], ownerName: "Local Rentals", contact: "9876543212" },
  { id: "r5", title: "BMW G310 GS", category: "Bikes", location: "Goa", hourlyPrice: 250, dailyPrice: 1800, pricingType: "both", rating: 4.9, images: ["https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=400"], ownerName: "Elite Bikes", contact: "9876543214" },
  { id: "r6", title: "Suzuki Access 125", category: "Scooters", location: "Goa", hourlyPrice: 60, dailyPrice: 450, pricingType: "both", rating: 4.6, images: ["https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=400"], ownerName: "Quick Rent", contact: "9876543215" },
  { id: "r7", title: "Fortuner Legender", category: "Cars", location: "Goa", hourlyPrice: 800, dailyPrice: 6500, pricingType: "both", rating: 4.9, images: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400"], ownerName: "VIP Goa", contact: "9876543216" },
  { id: "r8", title: "Vespa VXL 150", category: "Scooters", location: "Goa", hourlyPrice: 80, dailyPrice: 600, pricingType: "both", rating: 4.8, images: ["https://images.unsplash.com/photo-1560243563-062bff001d68?w=400"], ownerName: "Style Ride", contact: "9876543217" },
  
  // MANALI
  { id: "r4", title: "Mountain Bike (MTB)", category: "Bikes", location: "Manali", hourlyPrice: 80, dailyPrice: 600, pricingType: "both", rating: 4.6, images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400"], ownerName: "Himalayan Gear", contact: "9876543213" },
  { id: "r9", title: "Royal Enfield Himalayan", category: "Bikes", location: "Manali", hourlyPrice: 150, dailyPrice: 1200, pricingType: "both", rating: 4.9, images: ["https://images.unsplash.com/photo-1525160354320-d8e92641c563?w=400"], ownerName: "Snow Rides", contact: "9876543218" },
  { id: "r10", title: "Mahindra Scorpio-N", category: "Cars", location: "Manali", hourlyPrice: 500, dailyPrice: 4000, pricingType: "both", rating: 4.8, images: ["https://images.unsplash.com/photo-1582141517551-87265a711200?w=400"], ownerName: "Mountain Kings", contact: "9876543219" },
  { id: "r11", title: "KTM Duke 390", category: "Bikes", location: "Manali", hourlyPrice: 200, dailyPrice: 1500, pricingType: "both", rating: 4.7, images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400"], ownerName: "Swift Rent", contact: "9876543220" },
  { id: "r12", title: "Fat Bike (Snow Edition)", category: "Bikes", location: "Manali", hourlyPrice: 100, dailyPrice: 700, pricingType: "both", rating: 4.5, images: ["https://images.unsplash.com/photo-1553105659-d918b25db74b?w=400"], ownerName: "Snow Gear", contact: "9876543221" },
  
  // RISHIKESH
  { id: "r13", title: "Honda CB350 RS", category: "Bikes", location: "Rishikesh", hourlyPrice: 120, dailyPrice: 900, pricingType: "both", rating: 4.8, images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400"], ownerName: "Ganga Rides", contact: "9876543222" },
  { id: "r14", title: "Hyundai Creta", category: "Cars", location: "Rishikesh", hourlyPrice: 350, dailyPrice: 3000, pricingType: "both", rating: 4.7, images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400"], ownerName: "Divine Wheels", contact: "9876543223" },
  { id: "r15", title: "Bajaj Avenger 220", category: "Bikes", location: "Rishikesh", hourlyPrice: 90, dailyPrice: 700, pricingType: "both", rating: 4.6, images: ["https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400"], ownerName: "Cruise Rent", contact: "9876543224" },
  { id: "r16", title: "Electric Scooter", category: "Scooters", location: "Rishikesh", hourlyPrice: 40, dailyPrice: 300, pricingType: "both", rating: 4.4, images: ["https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=400"], ownerName: "Eco Wheels", contact: "9876543225" },
  { id: "r17", title: "Innova Crysta", category: "Cars", location: "Rishikesh", hourlyPrice: 600, dailyPrice: 5000, pricingType: "both", rating: 4.9, images: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400"], ownerName: "Ganga Travel", contact: "9876543226" },
  
  // OTHERS / MIXED
  { id: "r18", title: "Yamaha R15 V4", category: "Bikes", location: "Goa", hourlyPrice: 180, dailyPrice: 1400, pricingType: "both", rating: 4.7, images: ["https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=400"], ownerName: "Speedy", contact: "9876543227" },
  { id: "r19", title: "Swift Desire", category: "Cars", location: "Manali", hourlyPrice: 250, dailyPrice: 2000, pricingType: "both", rating: 4.5, images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400"], ownerName: "Local Cab", contact: "9876543228" },
  { id: "r20", title: "Jupiter 125", category: "Scooters", location: "Rishikesh", hourlyPrice: 50, dailyPrice: 400, pricingType: "both", rating: 4.6, images: ["https://images.unsplash.com/photo-1519750292352-c9fc17322ed7?w=400"], ownerName: "Local Scoot", contact: "9876543229" },
];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function RentalsPage() {
  const navigate = useNavigate();
  const { destination } = useTripStore();
  
  const [rentals, setRentals] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duration, setDuration] = useState(1);
  const [durationType, setDurationType] = useState("hours"); // 'hours' | 'days'
  const [isProcessing, setIsProcessing] = useState(false);
  
  const selectedLocation = destination?.name || "Goa";

  useEffect(() => {
    fetchRentals();
  }, [selectedLocation]);

  const fetchRentals = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/listings?location=${selectedLocation}`);
      const dbRentals = res.data.filter(l => ['Bikes', 'Cars', 'Scooters'].includes(l.category));
      setRentals(dbRentals.length > 0 ? dbRentals : MOCK_RENTALS.filter(r => r.location.toLowerCase() === selectedLocation.toLowerCase()));
    } catch (err) {
      setRentals(MOCK_RENTALS.filter(r => r.location.toLowerCase() === selectedLocation.toLowerCase()));
    }
  };

  const filteredRentals = activeCategory === "All" 
    ? rentals 
    : rentals.filter(r => r.category === activeCategory);

  const calculatePrice = (rental) => {
    if (durationType === "hours") {
      return (rental.hourlyPrice || (rental.dailyPrice / 10)) * duration;
    } else {
      return (rental.dailyPrice || (rental.hourlyPrice * 10)) * duration;
    }
  };

  const handleRentNow = async (rental) => {
    const amount = calculatePrice(rental);
    if (amount <= 0) {
      toast.error("Invalid amount");
      return;
    }

    setIsProcessing(true);
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      const orderRes = await axios.post(`${API_URL}/api/bookings/create-order`, {
        amount,
        listingId: rental._id || rental.id,
        ownerName: rental.ownerName,
        ownerContact: rental.contact,
        userName: "Traveler", // Mock user
        userContact: "9999999999", // Mock contact
        duration,
        durationType
      });

      const { orderId, bookingId } = orderRes.data;

      const options = {
        key: "rzp_test_SnQQo0BjlwDtYq",
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "Questora Rentals",
        description: `Rent ${rental.title} from ${rental.ownerName}`,
        image: rental.images[0],
        order_id: orderId,
        handler: async function (response) {
          await axios.post(`${API_URL}/api/bookings/verify`, {
            ...response,
            bookingId
          });
          toast.success(`Booking Confirmed! Call ${rental.ownerName} at ${rental.contact}`, {
            duration: 6000,
            icon: '✅'
          });
        },
        prefill: {
          name: "Traveler",
          email: "traveler@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#f97316",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error("Payment initiation failed.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white font-body pb-20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <header className="px-6 py-6 border-b border-white/5 backdrop-blur-xl sticky top-0 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold font-display tracking-tight">
              Rentals in <span className="text-orange-400 italic">{selectedLocation}</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-white/10 transition-all"
          >
            <PlusCircle size={18} className="text-orange-400" />
            List Your Vehicle
          </button>
        </header>

        <div className="max-w-7xl mx-auto px-6 pt-12">
          {/* Rapido-style Controls */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 mb-12 backdrop-blur-2xl shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Category Tabs */}
              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 w-full lg:w-auto">
                {["All", "Bikes", "Cars", "Scooters"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeCategory === cat ? "bg-orange-500 text-white shadow-lg" : "text-white/40 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="h-8 w-[1px] bg-white/10 hidden lg:block" />

              {/* Duration Selector */}
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  <button 
                    onClick={() => setDurationType("hours")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${durationType === "hours" ? "bg-white/10 text-white" : "text-white/30"}`}
                  >
                    Hourly
                  </button>
                  <button 
                    onClick={() => setDurationType("days")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${durationType === "days" ? "bg-white/10 text-white" : "text-white/30"}`}
                  >
                    Daily
                  </button>
                </div>
                
                <div className="flex items-center bg-black/40 border border-white/5 rounded-2xl px-4 py-2.5 gap-4">
                  <button onClick={() => setDuration(Math.max(1, duration - 1))} className="text-orange-400 font-bold hover:scale-125 transition-transform">-</button>
                  <span className="font-bold w-12 text-center text-sm">{duration} {durationType}</span>
                  <button onClick={() => setDuration(duration + 1)} className="text-orange-400 font-bold hover:scale-125 transition-transform">+</button>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                <Zap size={14} className="text-yellow-400" />
                Live Pricing Active
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {filteredRentals.map(item => (
              <div key={item.id} className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[1.1/1] overflow-hidden relative">
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute top-5 left-5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] font-bold">{item.rating || 4.5}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-orange-400 transition-colors">{item.title}</h3>
                    <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md border border-orange-500/20 font-bold uppercase tracking-wider">{item.category}</span>
                  </div>
                  <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><MapPin size={12} /> {item.location}</p>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-6">By {item.ownerName}</p>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Total Rent</p>
                        <p className="text-2xl font-black text-white">₹{calculatePrice(item).toLocaleString()}</p>
                      </div>
                      <p className="text-[10px] text-white/40 font-medium mb-1">/{duration}{durationType[0]}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleRentNow(item)}
                    disabled={isProcessing}
                    className="w-full py-4 bg-white text-black font-black rounded-xl text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Rent Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredRentals.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block p-10 bg-white/5 rounded-full mb-8 border border-white/5">
                <Bike size={64} className="text-white/10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No rentals found in {selectedLocation}</h2>
              <p className="text-white/40 max-w-sm mx-auto">Be the first one to list a vehicle in this area!</p>
            </div>
          )}
        </div>
      </div>

      <RentalRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchRentals}
      />
=======
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { fetchListings, mapDbToRental } from "../lib/api";
import { ArrowLeft, Car, Bike, ShieldCheck, Zap, Info, Clock, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";

// Move MOCK_RENTALS outside the component
export const MOCK_RENTALS = [
  // CARS
  {
    id: 1,
    category: "cars",
    name: "Mahindra Thar",
    image: "https://images.unsplash.com/photo-1710225358761-4f5891df657d?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 499,
    rushHourPrice: 699,
    budgetTier: "PREMIUM TIER",
    features: ["4x4", "SUV", "Adventure"],
  },
  {
    id: 2,
    category: "cars",
    name: "BMW X5",
    image: "https://images.unsplash.com/photo-1617531653635-4b0e357c091b?q=80&w=777&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 1299,
    rushHourPrice: 1699,
    budgetTier: "LUXURY TIER",
    features: ["Luxury", "Automatic", "Premium"],
  },
  {
    id: 3,
    category: "cars",
    name: "Hyundai Creta",
    image: "https://images.unsplash.com/photo-1633359064754-804ba55e733f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aHl1bmRhaSUyMGNyZXRhfGVufDB8fDB8fHww",
    pricePerHour: 349,
    rushHourPrice: 499,
    budgetTier: "ECONOMY TIER",
    features: ["SUV", "Family", "Comfort"],
  },
  {
    id: 4,
    category: "cars",
    name: "Toyota Fortuner",
    image: "https://images.unsplash.com/photo-1670054953044-2605dbd0d747?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 899,
    rushHourPrice: 1199,
    budgetTier: "PREMIUM TIER",
    features: ["Offroad", "SUV", "Roadtrip"],
  },
  {
    id: 5,
    category: "cars",
    name: "Mercedes C-Class",
    image: "https://images.unsplash.com/photo-1610099610040-ab19f3a5ec35?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 1599,
    rushHourPrice: 1999,
    budgetTier: "LUXURY TIER",
    features: ["Luxury", "Sedan", "Automatic"],
  },
  {
    id: 6,
    category: "cars",
    name: "Maruti Swift",
    image: "https://images.unsplash.com/photo-1663852408695-f57f4d75a536?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 199,
    rushHourPrice: 299,
    budgetTier: "ECONOMY TIER",
    features: ["Budget", "Fuel Efficient", "City"],
  },
  {
    id: 7,
    category: "cars",
    name: "Range Rover Velar",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 1999,
    rushHourPrice: 2599,
    budgetTier: "LUXURY TIER",
    features: ["Luxury", "SUV", "Premium"],
  },
  {
    id: 8,
    category: "cars",
    name: "Kia Seltos",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 399,
    rushHourPrice: 599,
    budgetTier: "PREMIUM TIER",
    features: ["SUV", "Family", "Travel"],
  },
  {
    id: 9,
    category: "cars",
    name: "Audi Q7",
    image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 1899,
    rushHourPrice: 2399,
    budgetTier: "LUXURY TIER",
    features: ["Luxury", "Premium", "Roadtrip"],
  },
  {
    id: 10,
    category: "cars",
    name: "Honda City",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 299,
    rushHourPrice: 449,
    budgetTier: "ECONOMY TIER",
    features: ["Sedan", "Comfort", "City"],
  },
  // BIKES
  {
    id: 11,
    category: "bikes",
    name: "Royal Enfield Classic 350",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 199,
    rushHourPrice: 299,
    budgetTier: "PREMIUM TIER",
    features: ["Cruiser", "Touring", "Classic"],
  },
  {
    id: 12,
    category: "bikes",
    name: "KTM Duke 390",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 249,
    rushHourPrice: 349,
    budgetTier: "PREMIUM TIER",
    features: ["Sports", "Fast", "Adventure"],
  },
  {
    id: 13,
    category: "bikes",
    name: "Yamaha R15",
    image: "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 179,
    rushHourPrice: 249,
    budgetTier: "ECONOMY TIER",
    features: ["Sports", "Mileage", "Stylish"],
  },
  {
    id: 14,
    category: "bikes",
    name: "BMW GS 1250",
    image: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 699,
    rushHourPrice: 899,
    budgetTier: "LUXURY TIER",
    features: ["Adventure", "Touring", "Premium"],
  },
  {
    id: 15,
    category: "bikes",
    name: "Royal Enfield Himalayan",
    image: "https://images.unsplash.com/photo-1529429617124-aee711a5ac1c?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 229,
    rushHourPrice: 329,
    budgetTier: "PREMIUM TIER",
    features: ["Adventure", "Mountain", "Touring"],
  },
  // SCOOTY
  {
    id: 21,
    category: "scooty",
    name: "Honda Activa 6G",
    image: "https://images.unsplash.com/photo-1594142429108-596289ff97ea?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 99,
    rushHourPrice: 149,
    budgetTier: "ECONOMY TIER",
    features: ["Automatic", "City Ride", "Mileage"],
  },
  {
    id: 22,
    category: "scooty",
    name: "TVS Ntorq",
    image: "https://images.unsplash.com/photo-1611242320536-f12d3541249b?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 129,
    rushHourPrice: 179,
    budgetTier: "PREMIUM TIER",
    features: ["Sporty", "Bluetooth", "Fast"],
  },
  {
    id: 23,
    category: "scooty",
    name: "Suzuki Access",
    image: "https://images.unsplash.com/photo-1568772585407-9363f9bf3a87?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 109,
    rushHourPrice: 159,
    budgetTier: "ECONOMY TIER",
    features: ["Comfort", "Mileage", "Automatic"],
  },
  {
    id: 24,
    category: "scooty",
    name: "Ather 450X",
    image: "https://images.unsplash.com/photo-1620610531393-271505c87332?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 199,
    rushHourPrice: 279,
    budgetTier: "PREMIUM TIER",
    features: ["Electric", "Smart", "Premium"],
  },
  // CYCLES
  {
    id: 31,
    category: "cycles",
    name: "Mountain Explorer",
    image: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 49,
    rushHourPrice: 79,
    budgetTier: "ECONOMY TIER",
    features: ["Mountain", "Adventure", "Lightweight"],
  },
  {
    id: 32,
    category: "cycles",
    name: "Urban Rider",
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 39,
    rushHourPrice: 59,
    budgetTier: "ECONOMY TIER",
    features: ["City", "Comfort", "Daily"],
  },
  {
    id: 33,
    category: "cycles",
    name: "Roadster Pro",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 69,
    rushHourPrice: 99,
    budgetTier: "PREMIUM TIER",
    features: ["Roadbike", "Fast", "Fitness"],
  },
  {
    id: 34,
    category: "cycles",
    name: "Electric Cycle X",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 129,
    rushHourPrice: 179,
    budgetTier: "PREMIUM TIER",
    features: ["Electric", "Modern", "Smart"],
  },
];

export default function RentalsPage() {
  const navigate = useNavigate();
  const { budget, members, budgetType, destination } = useTripStore();
  const [activeCategory, setActiveCategory] = useState("cars");
  const [scrolled, setScrolled] = useState(false);
  const [dbRentals, setDbRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "cars", name: "Cars", icon: <Car size={20} /> },
    { id: "bikes", name: "Bikes", icon: <Bike size={20} /> },
    { id: "scooty", name: "Scooty", icon: <Zap size={20} /> },
    { id: "cycles", name: "Cycles", icon: <Info size={20} /> },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    // Fetch DB Listings
    if (!destination?.name) {
      setLoading(false);
    } else {
      fetchListings().then(listings => {
        const targetDest = destination.name.toLowerCase().trim();
        const rentals = listings
          .filter(l => 
            l.category === "Transport" && 
            l.location && l.location.toLowerCase().includes(targetDest)
          )
          .map(mapDbToRental);
        setDbRentals(rentals);
        setLoading(false);
      }).catch(err => {
        console.error("Rentals fetch error:", err);
        setLoading(false);
      });
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [destination]);

  const perPersonBudget = budgetType === "per_person" ? budget : Math.round(budget / members);
  
  const getTier = (perPerson) => {
    if (perPerson < 8000) return "ECONOMY TIER";
    if (perPerson < 25000) return "PREMIUM TIER";
    return "LUXURY TIER";
  };

  const userTier = getTier(perPersonBudget);

  const allRentals = [...MOCK_RENTALS, ...dbRentals];
  const filteredRentals = allRentals.filter(r => r.category === activeCategory);
  
  // Recommend vehicles based on user budget tier
  const recommendedVehicles = filteredRentals.filter(r => r.budgetTier === userTier);
  const otherVehicles = filteredRentals.filter(r => r.budgetTier !== userTier);

  return (
    <div className="min-h-screen bg-[#050816] text-white font-body">
      <Navbar scrolled={scrolled} />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to planning
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-orange-400 font-bold tracking-[0.3em] uppercase text-xs mb-3">Rental Marketplace</p>
              <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tighter">
                Premium <span className="text-orange-500">Wheels.</span>
              </h1>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Your Budget Tier</p>
              <p className="text-xl font-bold text-orange-400">{userTier}</p>
              <p className="text-[10px] text-white/60 mt-1">Based on ₹{perPersonBudget.toLocaleString()} per person budget</p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 border
                ${activeCategory === cat.id 
                  ? "bg-orange-500 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)] text-white scale-105" 
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"}
              `}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {filteredRentals.length > 0 ? (
          <>
            {/* Recommended Section */}
            {recommendedVehicles.length > 0 && (
              <div className="mb-20">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-orange-500"></span> Recommended for your budget
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recommendedVehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} recommended />
                  ))}
                </div>
              </div>
            )}

            {/* All/Other Vehicles */}
            <div>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-white/20"></span> {recommendedVehicles.length > 0 ? "Other Options" : `Available ${activeCategory}`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="py-20 text-center bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl">
            <AlertCircle size={48} className="mx-auto text-orange-500 mb-6 opacity-50" />
            <h3 className="text-2xl font-black text-white mb-2">No {activeCategory}s Found</h3>
            <p className="text-white/40 max-w-sm mx-auto px-6">We currently don't have any {activeCategory} listings for {destination?.name || 'this location'}. Try switching categories or destinations!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function VehicleCard({ vehicle, recommended }) {
  return (
    <div className={`
      group relative bg-white/5 border rounded-3xl overflow-hidden transition-all duration-500 hover:bg-white/10
      ${recommended ? 'border-orange-500/30' : 'border-white/10 hover:border-white/20'}
    `}>
      {/* Recommended Badge */}
      {recommended && (
        <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
          Best Value
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={vehicle.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">{vehicle.name}</h3>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{vehicle.budgetTier}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-400">₹{vehicle.pricePerHour}</p>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">per hour</p>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-8">
          {vehicle.features.map(f => (
            <span key={f} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white/60 font-medium">
              {f}
            </span>
          ))}
        </div>

        {/* Dynamic Pricing Box */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-orange-400">
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Dynamic Pricing</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-white/40">
              <AlertCircle size={12} />
              <span>Rush hour info</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Rush Hour Price</p>
              <p className="text-lg font-bold text-rose-400">₹{vehicle.rushHourPrice}<span className="text-xs text-white/40 font-normal"> /hr</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Increase</p>
              <p className="text-lg font-bold text-white">+{Math.round(((vehicle.rushHourPrice - vehicle.pricePerHour)/vehicle.pricePerHour)*100)}%</p>
            </div>
          </div>
        </div>

        <button className="w-full py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-xs transition-all hover:bg-orange-500 hover:text-white group">
          Book Now
          <ShieldCheck size={16} className="inline ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </button>
      </div>
>>>>>>> origin2/main
    </div>
  );
}
