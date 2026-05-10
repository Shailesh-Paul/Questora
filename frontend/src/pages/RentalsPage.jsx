import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { MOCK_RENTALS, fetchListings, mapDbToRental } from "../lib/api";
import { ArrowLeft, Car, Bike, ShieldCheck, Zap, Info, Clock, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function RentalsPage() {
  const navigate = useNavigate();
  const { budget, members, budgetType, destination } = useTripStore();
  const [activeCategory, setActiveCategory] = useState("cars");
  const [scrolled, setScrolled] = useState(false);
  const [dbRentals, setDbRentals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const categories = [
    { id: "cars", name: "Cars", icon: <Car size={20} /> },
    { id: "bikes", name: "Bikes", icon: <Bike size={20} /> },
    { id: "scooty", name: "Scooty", icon: <Zap size={20} /> },
    { id: "cycles", name: "Cycles", icon: <Info size={20} /> },
  ];

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
    </div>
  );
}
