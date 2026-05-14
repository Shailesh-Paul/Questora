import React, { useState, useEffect } from "react";
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
  const [durationType, setDurationType] = useState("hours");
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
        userName: "Traveler",
        userContact: "9999999999",
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
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
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
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 mb-12 backdrop-blur-2xl shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-8">
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
    </div>
  );
}