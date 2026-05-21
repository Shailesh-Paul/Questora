import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, Compass, Palmtree, Castle, 
  Building2, Trees, Star, ChevronLeft, ChevronRight, X, 
  DollarSign, MapPin, Activity as ActivityIcon, Home, 
  Calendar, CheckCircle2, Wifi, Tv, Coffee, 
  VolumeX, ShieldCheck, Search, Car, Backpack, Hotel, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTripStore from "../store/tripStore";
import { 
  fetchDestinations, 
  fetchActivitiesByDestination, 
  fetchRecommendedStays,
  mapDbToActivity 
} from "../lib/api";
import { mapDbToFrontendDestination } from "../utils/destination";

const CATEGORIES_CONFIG = {
  Spiritual: {
    title: "Spiritual Journeys",
    tagline: "Sacred landmarks, peaceful retreats, and mindfulness",
    icon: Sparkles,
    color: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    activeColor: "bg-white text-slate-950 font-extrabold"
  },
  Adventure: {
    title: "Adventure Escapes",
    tagline: "Trekking trails, river sports, and active expeditions",
    icon: ActivityIcon,
    color: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    activeColor: "bg-white text-slate-950 font-extrabold"
  },
  Beach: {
    title: "Beach & Nightlife",
    tagline: "Pristine coastlines, local cafes, and sunset walks",
    icon: Palmtree,
    color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    activeColor: "bg-white text-slate-950 font-extrabold"
  },
  Nature: {
    title: "Hill Retreats",
    tagline: "Scenic valleys, mist-covered peaks, and forest trails",
    icon: Trees,
    color: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    activeColor: "bg-white text-slate-950 font-extrabold"
  },
  Historical: {
    title: "Cultural Explorations",
    tagline: "Historical forts, heritage architectures, and ancient art",
    icon: Castle,
    color: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    activeColor: "bg-white text-slate-950 font-extrabold"
  },
  City: {
    title: "Urban Experiences",
    tagline: "Modern cityscape cafes, dynamic neighborhoods, and local art galleries",
    icon: Building2,
    color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    activeColor: "bg-white text-slate-950 font-extrabold"
  }
};

const PERSONAS = {
  student: {
    label: "Budget Explorer",
    icon: Backpack,
    desc: "Low daily budget & social hostels"
  },
  backpacker: {
    label: "Backpacker",
    icon: Compass,
    desc: "Adventure tours & trail activities"
  },
  employee: {
    label: "Premium Comfort",
    icon: Hotel,
    desc: "Top hotels, guest houses & resorts"
  },
  spiritual: {
    label: "Spiritual Seeker",
    icon: Sparkles,
    desc: "Quiet sanctuaries & sacred landmarks"
  },
  adventure: {
    label: "Active Explorer",
    icon: ActivityIcon,
    desc: "Rafting, climbing & trekking activities"
  }
};

export default function DestinationGrid({ onSelect }) {
  // --- Data and Filters States ---
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [selectedPersona, setSelectedPersona] = useState("student");
  const [activeCategory, setActiveCategory] = useState("All");
  const [maxDailyBudget, setMaxDailyBudget] = useState(10000);

  // --- Drawer Details States ---
  const [drawerDest, setDrawerDest] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerActivities, setDrawerActivities] = useState([]);
  const [drawerStays, setDrawerStays] = useState([]);

  // --- Horizontal Carousel Scroller Refs ---
  const carouselRefs = useRef({});

  // --- Fetch Initial Destinations on Mount ---
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Error fetching destinations:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDestinations();
  }, []);

  // --- Drawer Loading Lifecycle ---
  useEffect(() => {
    if (!drawerDest) return;

    const loadDrawerDetails = async () => {
      try {
        setDrawerLoading(true);
        setDrawerActivities([]);
        setDrawerStays([]);

        // Run fetches concurrently
        const [actsData, staysData] = await Promise.all([
          fetchActivitiesByDestination(drawerDest.city),
          fetchRecommendedStays(drawerDest.city, selectedPersona)
        ]);

        // Map activities and save
        const mappedActs = (actsData || []).map(mapDbToActivity);
        setDrawerActivities(mappedActs);
        setDrawerStays(staysData || []);
      } catch (err) {
        console.error("Error loading drawer details:", err);
      } finally {
        setDrawerLoading(false);
      }
    };

    loadDrawerDetails();
  }, [drawerDest, selectedPersona]);

  // --- AI Match Score & Badge Formulas ---
  const calculateMatchScore = (dest, persona) => {
    let score = 70 + Math.floor((dest.rating || 4.5) * 5); // baseline ~ 90-95
    if (score > 100) score = 100;
    
    const dailyBudget = (dest.averageStayCost || 2000) + (dest.averageFoodCost || 1000) + (dest.averageTransportCost || 500);

    if (persona === "student") {
      if (dailyBudget < 3000) score += 10;
      else if (dailyBudget > 6000) score -= 15;
      if (dest.category === "Spiritual" || dest.category === "Nature") score += 5;
    } else if (persona === "backpacker") {
      if (dest.category === "Adventure" || dest.category === "Nature" || dest.category === "Beach") score += 10;
      if (dailyBudget < 4000) score += 5;
    } else if (persona === "employee") {
      if (dailyBudget > 5500) score += 10;
      else if (dailyBudget < 3000) score -= 10;
      if (dest.category === "Beach" || dest.category === "City" || dest.category === "Historical") score += 5;
    } else if (persona === "spiritual") {
      if (dest.category === "Spiritual") score += 15;
      else score -= 12;
    } else if (persona === "adventure") {
      if (dest.category === "Adventure") score += 15;
      else if (dest.category === "Nature" || dest.category === "Beach") score += 5;
      else score -= 12;
    }

    if (score > 99) score = 99;
    if (score < 40) score = 40;
    return score;
  };

  const getAIBadge = (dest, persona) => {
    const dailyBudget = (dest.averageStayCost || 2000) + (dest.averageFoodCost || 1000) + (dest.averageTransportCost || 500);
    
    if (persona === "student") {
      if (dailyBudget < 3000) return "Best Budget Option";
      return "Budget Friendly";
    }
    if (persona === "backpacker") {
      if (dest.category === "Adventure") return "Top Adventure Spot";
      return "Backpacker's Pick";
    }
    if (persona === "employee") {
      if (dailyBudget > 5000) return "Premium Gateway";
      return "Comfortable Stay";
    }
    if (persona === "spiritual") {
      if (dest.category === "Spiritual") return "Highly Spiritual";
      return "Quiet Sanctuary";
    }
    if (persona === "adventure") {
      if (dest.category === "Adventure") return "Adventure Center";
      return "Thrill Seeker Pick";
    }
    
    if (dest.trendingScore > 90) return "Top Trending";
    return "Recommended";
  };

  // Direct-navigate helper: map dest and call onSelect immediately
  const handleCardSelect = (dest) => {
    const mapped = mapDbToFrontendDestination(dest);
    onSelect(mapped);
  };

  // --- Filtering Logic for Grid & Carousel ---
  const applyFilters = (items) => {
    return items.filter(d => {
      const dailyBudget = (d.averageStayCost || 2000) + (d.averageFoodCost || 1000) + (d.averageTransportCost || 500);
      const matchesSearch = d.city.toLowerCase().includes(searchQuery.toLowerCase()) || d.state.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBudget = dailyBudget <= maxDailyBudget;
      return matchesSearch && matchesBudget;
    });
  };

  const getFilteredByCategory = (cat) => {
    const list = destinations.filter(d => d.category === cat);
    return applyFilters(list);
  };

  const getGlobalFilteredList = () => {
    let list = [...destinations];
    if (activeCategory !== "All") {
      list = list.filter(d => d.category === activeCategory);
    }
    const filtered = applyFilters(list);
    
    // Sort dynamically by calculated match score (highest first)
    return filtered.map(d => ({
      ...d,
      matchScore: calculateMatchScore(d, selectedPersona)
    })).sort((a, b) => b.matchScore - a.matchScore);
  };

  // --- Auto-complete Search Bar Helpers ---
  const filteredSuggestions = destinations.filter(d =>
    d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomSearch = () => {
    if (!searchQuery.trim()) return;

    if (activeIndex >= 0 && activeIndex < filteredSuggestions.length) {
      const mapped = mapDbToFrontendDestination(filteredSuggestions[activeIndex]);
      onSelect(mapped);
      return;
    }

    const exactMatch = destinations.find(d => d.city.toLowerCase() === searchQuery.toLowerCase());
    if (exactMatch) {
      const mapped = mapDbToFrontendDestination(exactMatch);
      onSelect(mapped);
      return;
    }

    // Custom fallback search
    const customDest = {
      id: "custom-" + Date.now(),
      name: searchQuery,
      state: "Custom Destination",
      image: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800",
      tagline: "Explore your way",
      crowdLevel: "low",
      tag: "Custom",
      trendingScore: 90,
      averageStayCost: 2000,
      averageFoodCost: 1000,
      averageTransportCost: 500
    };
    onSelect(customDest);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      handleCustomSearch();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-orange-500 font-semibold">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const getCrowdStyles = (level) => {
    switch (level) {
      case "low":
        return { text: "Peaceful", dot: "bg-emerald-500", badge: "bg-slate-900 border-slate-800 text-slate-300" };
      case "medium":
        return { text: "Moderate Crowd", dot: "bg-amber-500", badge: "bg-slate-900 border-slate-800 text-slate-300" };
      case "high":
        return { text: "Popular Choice", dot: "bg-rose-500", badge: "bg-slate-900 border-slate-800 text-slate-300" };
      default:
        return { text: "Standard Crowd", dot: "bg-slate-500", badge: "bg-slate-900 border-slate-800 text-slate-300" };
    }
  };

  // --- Horizontal Carousel Ref Scroll Handlers ---
  const scrollCarousel = (catKey, direction) => {
    const scroller = carouselRefs.current[catKey];
    if (!scroller) return;
    const scrollAmount = direction === "left" ? -400 : 400;
    scroller.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section id="destinations" className="relative overflow-hidden py-24 text-slate-100 bg-[#0B0F19] font-sans">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* HEADER BLOCK - Highly refined, clean layout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 mb-6">
              <Compass size={13} className="text-orange-500" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                Smart Travel Curator
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Discover your next <br />
              <span className="text-orange-500">perfect getaway.</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-400 font-normal">
              Explore curated locations sorted by environment and tailored in real-time to match your desired budget and travel preferences.
            </p>
          </div>

          {/* CLEAN SEARCH BAR */}
          <div className="w-full lg:w-[420px] relative">
            <div className="flex items-center bg-slate-900/70 rounded-2xl border border-slate-800 p-2 hover:border-slate-700 transition-all shadow-md">
              <div className="pl-3 pr-2 text-slate-400">
                <Search size={16} strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="Search cities or states..."
                className="flex-1 bg-transparent outline-none py-2 text-slate-100 text-sm placeholder-slate-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleCustomSearch}
                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all shadow active:scale-95"
              >
                Plan Itinerary
              </button>
            </div>

            {showDropdown && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1524] rounded-2xl border border-slate-800 overflow-hidden z-40 max-h-80 overflow-y-auto shadow-2xl custom-scrollbar">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((dest, idx) => (
                    <div
                      key={dest._id}
                      onClick={() => handleCardSelect(dest)}
                      className={`px-5 py-3.5 hover:bg-slate-800/40 cursor-pointer flex items-center justify-between border-b border-slate-800/40 last:border-0 group transition-all ${activeIndex === idx ? 'bg-slate-800/60' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                          <img src={dest.heroImage} alt={dest.city} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200 group-hover:text-orange-500 transition-colors">
                            {highlightMatch(dest.city, searchQuery)}
                          </p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                            {highlightMatch(dest.state, searchQuery)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {calculateMatchScore(dest, selectedPersona)}% Match
                        </span>
                        <ArrowRight size={13} className="text-slate-600 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div onClick={handleCustomSearch} className="px-5 py-5 text-center cursor-pointer hover:bg-slate-800/30 transition-colors">
                    <p className="text-slate-400 text-xs mb-1">Destination not found in indexes.</p>
                    <p className="text-orange-500 font-semibold text-xs">Plan custom trip for "{searchQuery}" <ArrowRight size={12} className="inline ml-1" /></p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TRAVEL STYLES & BUDGET CONTROLLER */}
        <div className="p-6 md:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/30 backdrop-blur mb-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Persona Select - Structured minimalist labels */}
            <div className="lg:col-span-8">
              <h4 className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-4">
                1. Select your travel style
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {Object.keys(PERSONAS).map((key) => {
                  const active = selectedPersona === key;
                  const IconComponent = PERSONAS[key].icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPersona(key)}
                      className={`flex flex-col items-center sm:items-start p-4 rounded-xl border text-left transition-all duration-200 group ${
                        active 
                          ? "bg-slate-800/50 border-orange-500/50 shadow-sm scale-102" 
                          : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-orange-500 shrink-0">
                          <IconComponent size={16} strokeWidth={2.5} />
                        </span>
                        <span className="text-xs font-bold text-slate-200">{PERSONAS[key].label}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-normal leading-normal hidden sm:block">
                        {PERSONAS[key].desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Budget Controller */}
            <div className="lg:col-span-4 p-5 rounded-xl border border-slate-800 bg-slate-900/50 h-full flex flex-col justify-center">
              <div className="flex justify-between items-center mb-3.5">
                <h4 className="text-[11px] uppercase font-bold tracking-widest text-slate-400">
                  2. Maximum Daily Budget
                </h4>
                <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  ₹{maxDailyBudget.toLocaleString("en-IN")} / day
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="15000"
                step="500"
                value={maxDailyBudget}
                onChange={(e) => setMaxDailyBudget(Number(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500 transition-all hover:bg-slate-650"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-bold mt-2">
                <span>Min: ₹2k</span>
                <span>Ideal Budget Range</span>
                <span>Max: ₹15k+</span>
              </div>
            </div>

          </div>
        </div>

        {/* EXPLORATION NAV TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 border-b border-slate-800/60 scrollbar-none custom-scrollbar">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 border ${
              activeCategory === "All"
                ? "bg-white text-slate-950 border-transparent shadow font-extrabold scale-102"
                : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <Compass size={13} /> All Categories
          </button>
          
          {Object.keys(CATEGORIES_CONFIG).map((cat) => {
            const config = CATEGORIES_CONFIG[cat];
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 border ${
                  active
                    ? `${config.activeColor} border-transparent shadow scale-102`
                    : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <config.icon size={13} /> {config.title}
              </button>
            );
          })}
        </div>

        {/* --- MAIN DISCOVERY CARD GRID --- */}
        {isLoading ? (
          /* Simple, clean skeleton loader */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 h-96 flex flex-col justify-between animate-pulse">
                <div className="w-full h-44 bg-slate-800/50 rounded-xl" />
                <div className="space-y-3">
                  <div className="h-5 w-2/3 bg-slate-800/50 rounded" />
                  <div className="h-4 w-1/2 bg-slate-800/30 rounded" />
                </div>
                <div className="h-10 w-full bg-slate-800/40 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : activeCategory === "All" ? (
          /* HORIZONTAL CATEGORIES CAROUSEL ROWS */
          <div className="space-y-12">
            {Object.keys(CATEGORIES_CONFIG).map((catKey) => {
              const config = CATEGORIES_CONFIG[catKey];
              const filteredList = getFilteredByCategory(catKey);

              if (filteredList.length === 0) return null;

              return (
                <div key={catKey} className="relative">
                  
                  {/* Category Title Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${config.color} border shrink-0`}>
                          <config.icon size={14} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-200 tracking-tight">{config.title}</h3>
                        <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded bg-slate-900 border border-slate-800/80">
                          {config.tagline}
                        </span>
                      </div>
                    </div>
                    
                    {/* Control arrows */}
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => scrollCarousel(catKey, "left")}
                        className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all text-slate-400 hover:text-slate-200"
                      >
                        <ChevronLeft size={14} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => scrollCarousel(catKey, "right")}
                        className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all text-slate-400 hover:text-slate-200"
                      >
                        <ChevronRight size={14} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => setActiveCategory(catKey)}
                        className="ml-2 text-[10px] font-bold text-orange-500 hover:text-orange-400 transition-colors uppercase tracking-widest hidden sm:block"
                      >
                        View All ({filteredList.length})
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scroll Area */}
                  <div 
                    ref={(el) => (carouselRefs.current[catKey] = el)}
                    className="flex gap-6 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory custom-scrollbar"
                  >
                    {filteredList.map((dest) => {
                      const crowd = getCrowdStyles(dest.crowdLevel);
                      const dailyCost = (dest.averageStayCost || 2000) + (dest.averageFoodCost || 1000) + (dest.averageTransportCost || 500);
                      const matchScore = calculateMatchScore(dest, selectedPersona);
                      const aiBadge = getAIBadge(dest, selectedPersona);

                      return (
                        <div
                          key={dest._id}
                          onClick={() => handleCardSelect(dest)}
                          className="min-w-[280px] sm:min-w-[310px] max-w-[310px] snap-start group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 hover:bg-slate-900/40 hover:shadow-lg shrink-0"
                        >
                          <div className="relative overflow-hidden aspect-[1.25/1]">
                            <img
                              src={dest.heroImage}
                              alt={dest.city}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                            {/* CROWD LEVEL BADGE - Minimalist */}
                            <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[9px] font-bold uppercase tracking-wider backdrop-blur bg-slate-950/80 ${crowd.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${crowd.dot}`} />
                              {crowd.text}
                            </div>

                            {/* AI MATCH BADGE - Clean and integrated */}
                            <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/80 text-emerald-400 border border-emerald-500/25 text-[9px] font-bold uppercase tracking-wider backdrop-blur">
                              {matchScore}% Match
                            </div>

                            {/* DESTINATION IDENTITY */}
                            <div className="absolute bottom-0 left-0 p-5 w-full">
                              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{dest.state}</p>
                              <h4 className="text-xl font-bold tracking-tight text-white mt-0.5">{dest.city}</h4>
                            </div>
                          </div>

                          <div className="p-5 space-y-3">
                            <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                              {dest.tagline}
                            </p>
                            
                            {/* Cost Breakdown */}
                            <div className="flex justify-between items-center pt-3 border-t border-slate-800/80">
                              <div>
                                <p className="text-slate-500 text-[8px] uppercase tracking-wider font-bold">Estimated Cost</p>
                                <p className="text-slate-200 font-bold text-sm mt-0.5">₹{dailyCost.toLocaleString("en-IN")}<span className="text-[10px] text-slate-500 font-normal"> / day</span></p>
                              </div>
                              <div
                                onClick={(e) => { e.stopPropagation(); handleCardSelect(dest); }}
                                className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-400 transition-all group-hover:bg-orange-600 group-hover:border-transparent group-hover:text-white cursor-pointer"
                              >
                                <ArrowRight size={14} strokeWidth={2} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* DETAILED TAB FILTERED GRID VIEW */
          <div>
            {getGlobalFilteredList().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getGlobalFilteredList().map((dest) => {
                  const crowd = getCrowdStyles(dest.crowdLevel);
                  const dailyCost = (dest.averageStayCost || 2000) + (dest.averageFoodCost || 1000) + (dest.averageTransportCost || 500);
                  const matchScore = calculateMatchScore(dest, selectedPersona);

                  return (
                    <div
                      key={dest._id}
                      onClick={() => handleCardSelect(dest)}
                      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/40 hover:shadow-md"
                    >
                      <div className="relative overflow-hidden aspect-[1.25/1]">
                        <img
                          src={dest.heroImage}
                          alt={dest.city}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                        {/* CROWD LEVEL BADGE */}
                        <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[9px] font-bold uppercase tracking-wider backdrop-blur bg-slate-950/80 ${crowd.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${crowd.dot}`} />
                          {crowd.text}
                        </div>

                        {/* AI MATCH BADGE */}
                        <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/80 text-emerald-400 border border-emerald-500/25 text-[9px] font-bold uppercase tracking-wider backdrop-blur">
                          {matchScore}% Match
                        </div>

                        {/* DESTINATION IDENTITY */}
                        <div className="absolute bottom-0 left-0 p-5 w-full">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{dest.state}</p>
                          <h4 className="text-xl font-bold tracking-tight text-white mt-0.5">{dest.city}</h4>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                          {dest.tagline}
                        </p>
                        
                        {/* Cost Breakdown */}
                        <div className="flex justify-between items-center pt-3 border-t border-slate-800/80">
                          <div>
                            <p className="text-slate-500 text-[8px] uppercase tracking-wider font-bold">Estimated Cost</p>
                            <p className="text-slate-200 font-bold text-sm mt-0.5">₹{dailyCost.toLocaleString("en-IN")}<span className="text-[10px] text-slate-500 font-normal"> / day</span></p>
                          </div>
                          <div
                            onClick={(e) => { e.stopPropagation(); handleCardSelect(dest); }}
                            className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-400 transition-all group-hover:bg-orange-600 group-hover:border-transparent group-hover:text-white cursor-pointer"
                          >
                            <ArrowRight size={14} strokeWidth={2} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No Results State */
              <div className="text-center py-20 p-8 rounded-2xl border border-slate-850 bg-slate-900/10">
                <VolumeX size={36} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-medium mb-1 text-sm">No locations match your current daily budget limit.</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Try adjusting the daily budget slider or checking the "All Categories" tab.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* Dynamic Slide-over AI Discovery Drawer */}
      {/* ============================================================== */}
      <AnimatePresence>
        {drawerDest && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerDest(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            {/* Glowing Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 150 }}
              className="relative w-full max-w-xl bg-[#0C1220] border-l border-slate-800 text-slate-200 h-full shadow-2xl flex flex-col z-10"
            >
              {/* Floating Close Button */}
              <button
                onClick={() => setDrawerDest(null)}
                className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center hover:bg-slate-900 active:scale-95 transition-all text-slate-400 hover:text-slate-200 shadow"
              >
                <X size={14} />
              </button>

              {/* Drawer Top Hero Header */}
              <div className="relative aspect-[1.8/1] shrink-0 border-b border-slate-800/80">
                <img src={drawerDest.heroImage} alt={drawerDest.city} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1220] via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">
                      {drawerDest.category} Destination
                    </span>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1">
                      <Star size={9} className="fill-amber-400 text-amber-400" /> {drawerDest.rating || "4.5"} Rating
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">{drawerDest.city}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold leading-none">{drawerDest.state}</p>
                </div>

                {/* Score badge top-left */}
                <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-xl bg-slate-950/85 border border-slate-850 flex items-center gap-2 shadow">
                  <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                    {calculateMatchScore(drawerDest, selectedPersona)}% Compatibility Match
                  </span>
                </div>
              </div>

              {/* Drawer Main Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* 1. Daily Budget Breakdown Dashboard */}
                <div>
                  <h4 className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                    <DollarSign size={12} className="text-slate-400" /> Daily Cost Breakdown
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 space-y-3.5">
                    {/* Cost Progress bars */}
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-300">
                          <span className="flex items-center gap-1.5"><Home size={11} className="text-slate-500" /> Accommodation</span>
                          <span className="font-semibold">₹{(drawerDest.averageStayCost || 2000).toLocaleString("en-IN")} / day</span>
                        </div>
                        <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500 rounded-full" style={{ width: `${Math.min(100, ((drawerDest.averageStayCost || 2000) / 10000) * 100)}%` }} />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-300">
                          <span className="flex items-center gap-1.5"><Coffee size={11} className="text-slate-500" /> Dining & Local Food</span>
                          <span className="font-semibold">₹{(drawerDest.averageFoodCost || 1000).toLocaleString("en-IN")} / day</span>
                        </div>
                        <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500 rounded-full" style={{ width: `${Math.min(100, ((drawerDest.averageFoodCost || 1000) / 4000) * 100)}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-300">
                          <span className="flex items-center gap-1.5"><Car size={11} className="text-slate-500" /> Transit & Local Transport</span>
                          <span className="font-semibold">₹{(drawerDest.averageTransportCost || 500).toLocaleString("en-IN")} / day</span>
                        </div>
                        <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500 rounded-full" style={{ width: `${Math.min(100, ((drawerDest.averageTransportCost || 500) / 3000) * 100)}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3.5 border-t border-slate-850">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Estimated Daily Total</p>
                        <p className="text-xl font-bold text-orange-500 mt-0.5">
                          ₹{((drawerDest.averageStayCost || 2000) + (drawerDest.averageFoodCost || 1000) + (drawerDest.averageTransportCost || 500)).toLocaleString("en-IN")}
                          <span className="text-xs text-slate-500 font-normal"> / day / person</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Recommended Season</p>
                        <p className="text-xs font-semibold text-slate-200 mt-0.5">{drawerDest.bestSeason || "October to March"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Top Activities Dynamic Section */}
                <div>
                  <h4 className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                    <ActivityIcon size={12} className="text-slate-400" /> Recommended Local Experiences ({drawerActivities.length || 6})
                  </h4>

                  {drawerLoading ? (
                    <div className="space-y-2">
                      {[1, 2].map((n) => (
                        <div key={n} className="h-16 rounded-xl bg-slate-900/30 border border-slate-800 animate-pulse" />
                      ))}
                    </div>
                  ) : drawerActivities.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {drawerActivities.map((act) => (
                        <div
                          key={act.id}
                          className="flex gap-4 p-3 rounded-xl bg-slate-900/30 border border-slate-850 hover:border-slate-800 transition-all group"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-850 relative">
                            <img src={act.image} alt={act.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-1 space-y-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div className="flex justify-between items-start gap-3">
                              <h5 className="text-xs font-bold text-slate-200 group-hover:text-orange-500 transition-colors leading-tight line-clamp-1">{act.name}</h5>
                              <span className="text-xs font-semibold text-slate-300 shrink-0">₹{act.price}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-1 font-normal leading-tight">{act.shortDesc}</p>
                            
                            <div className="flex gap-3 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                              <span>⏱️ {act.duration}</span>
                              <span className="text-slate-400">{act.category}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      No custom experiences indexed.
                    </div>
                  )}
                </div>

                {/* 3. Recommended Stays Dynamic Section */}
                <div>
                  <h4 className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                    <Home size={12} className="text-slate-400" /> Recommended Accommodations ({drawerStays.length || 8})
                  </h4>

                  {drawerLoading ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2].map((n) => (
                        <div key={n} className="h-28 rounded-xl bg-slate-900/30 border border-slate-800 animate-pulse" />
                      ))}
                    </div>
                  ) : drawerStays.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {drawerStays.map((stay) => {
                        const scoreColor = stay.recommendationScore >= 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20";
                        return (
                          <div
                            key={stay._id}
                            className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between space-y-3 group"
                          >
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${scoreColor}`}>
                                  {stay.recommendationScore}% score
                                </span>
                                <span className="text-[8px] uppercase font-bold text-slate-500 tracking-wider">
                                  {stay.type}
                                </span>
                              </div>

                              <h5 className="text-xs font-bold text-slate-200 line-clamp-1 leading-snug tracking-wide group-hover:text-orange-500 transition-colors">
                                {stay.title}
                              </h5>
                              <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
                                {stay.description}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-850 flex justify-between items-end">
                              <div>
                                <p className="text-[7.5px] uppercase tracking-wider text-slate-500 leading-none">Nightly Rate</p>
                                <p className="text-xs font-bold text-slate-200 mt-1 leading-none">
                                  ₹{(stay.price || stay.pricePerNight).toLocaleString("en-IN")}<span className="text-[9px] text-slate-500 font-normal">/nt</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-0.5 text-[9px] font-bold text-slate-400">
                                <Star size={9} className="fill-amber-400 text-amber-400" /> {stay.rating || "4.5"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-5 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      No custom accommodations found.
                    </div>
                  )}
                </div>

              </div>

              {/* Drawer Bottom Sticky Plan Panel */}
              <div className="p-5 border-t border-slate-800 bg-[#0A0E1A] shrink-0 space-y-3">
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-emerald-500" /> Verified travel indexes</span>
                  <span>Collaborative planner compatible</span>
                </div>
                
                <button
                  onClick={() => {
                    const mapped = mapDbToFrontendDestination(drawerDest);
                    onSelect(mapped);
                    setDrawerDest(null);
                  }}
                  className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5"
                >
                  Confirm & Start Planning
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}