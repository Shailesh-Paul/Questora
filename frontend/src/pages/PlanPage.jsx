import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { DESTINATIONS, MOCK_ACTIVITIES, fetchWeather, fetchListings, mapDbToActivity, mapDbToHotel } from "../lib/api";
import { ArrowLeft, ChevronDown, ChevronUp, Plus, Minus, Check, CheckCircle2, X, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { format, differenceInDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, isBefore, startOfDay, addDays, addMonths, subMonths } from "date-fns";

function CustomCalendar({ dateRange, setDateRange, weather, destinationId }) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const [availabilityData, setAvailabilityData] = useState({});

  useEffect(() => {
    if (!destinationId) return;
    const fetchAvailability = async () => {
      try {
        const startStr = startDate.toISOString();
        const endStr = endDate.toISOString();
        const res = await fetch(`http://localhost:5000/api/availability?destinationId=${destinationId}&start=${startStr}&end=${endStr}`);
        const data = await res.json();
        if (data.dailyTotals) {
          setAvailabilityData(data.dailyTotals);
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err);
      }
    };
    fetchAvailability();
  }, [destinationId, currentMonth]);

  const onDateClick = (day) => {
    if (isBefore(day, startOfDay(new Date()))) return;
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: day, end: null });
    } else if (isBefore(day, dateRange.start)) {
      setDateRange({ start: day, end: null });
    } else {
      setDateRange({ start: dateRange.start, end: day });
    }
  };

  const getWeatherForDay = (day) => {
    if (!weather) return null;
    if (isBefore(day, startOfDay(new Date()))) return null;
    const seed = day.getDate();
    const tempVar = (seed % 5) - 2;
    const icons = ['☀️', '🌤️', '⛅', '☁️', '🌦️'];
    const icon = icons[seed % icons.length];
    const temp = weather.temp + tempVar;
    
    let statusText = "Moderate";
    if (temp > 30) statusText = "Hot";
    if (temp < 15) statusText = "Cold";
    
    return { temp, icon, statusText };
  };

  const getAvailabilityForDay = (day) => {
    if (isBefore(day, startOfDay(new Date()))) return null;
    
    const MAX_CAPACITY = 50;
    const dateStr = day.toISOString().split('T')[0];
    const booked = availabilityData ? (availabilityData[dateStr] || 0) : 0;
    
    let score = (booked / MAX_CAPACITY) * 100;
    if (booked === 0) {
       const isWeekend = day.getDay() === 0 || day.getDay() === 6;
       score = isWeekend ? 30 : 10;
    }
    
    if (score >= 80) return { status: 'red', text: 'Low Availability', colorClass: 'bg-red-500' };
    if (score >= 50) return { status: 'yellow', text: 'Filling Fast', colorClass: 'bg-yellow-500' };
    return { status: 'green', text: 'Available', colorClass: 'bg-emerald-500' };
  };

  return (
    <div className="bg-white/90 border border-slate-200 rounded-2xl p-4 shadow-sm backdrop-blur-md">
      <div className="flex justify-between items-center mb-3 px-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-full transition-colors shadow-sm"><ArrowLeft size={12}/></button>
        <span className="font-display font-bold text-lg text-slate-900 tracking-wide uppercase">{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-full transition-colors shadow-sm"><ArrowLeft size={12} className="rotate-180"/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1 uppercase tracking-widest">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, dayIdx) => {
          const isSelected = (dateRange.start && isSameDay(day, dateRange.start)) || (dateRange.end && isSameDay(day, dateRange.end));
          const isInRange = dateRange.start && dateRange.end && isWithinInterval(day, { start: dateRange.start, end: dateRange.end });
          const weatherInfo = getWeatherForDay(day);
          const availability = getAvailabilityForDay(day);
          const isPast = isBefore(day, startOfDay(new Date()));

          return (
            <div
              key={day.toString()}
              onClick={() => onDateClick(day)}
              className={`
                relative h-20 sm:h-24 p-2 border border-slate-50 transition-all cursor-pointer group
                ${!isSameMonth(day, monthStart) ? 'bg-slate-50/30' : 'bg-white'}
                ${isSelected ? 'bg-orange-50 border-orange-200 z-10' : ''}
                ${isInRange ? 'bg-orange-50/50' : ''}
                ${isPast ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:bg-slate-50'}
              `}
            >
              <span className={`text-xs font-bold ${isSameMonth(day, monthStart) ? 'text-slate-900' : 'text-slate-300'}`}>{format(day, "d")}</span>
              
              {!isPast && weatherInfo && (
                <div className="absolute top-2 right-2 text-right">
                  <p className="text-[10px] leading-none mb-0.5">{weatherInfo.icon}</p>
                  <p className="text-[8px] font-bold text-slate-400 leading-none">{weatherInfo.temp}°</p>
                </div>
              )}

              {!isPast && availability && (
                <div className="absolute bottom-2 left-2 right-2">
                  <div className={`h-1 w-full rounded-full ${availability.colorClass} opacity-40 mb-1 group-hover:opacity-100 transition-opacity`}></div>
                  <p className={`text-[7px] font-bold uppercase tracking-tighter truncate ${availability.status === 'red' ? 'text-red-500' : availability.status === 'yellow' ? 'text-yellow-600' : 'text-emerald-600'}`}>
                    {availability.text}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PlanPage() {
  const navigate = useNavigate();
  const { 
    destination, setDestination,
    members, setMembers,
    budget, setBudget,
    budgetType, setBudgetType,
    dateRange: storeDateRange, setDateRange: setStoreDateRange,
    selectedHotel, selectHotel, clearHotel,
    selectedActivities, toggleActivity,
    totalCost
  } = useTripStore();

  const parseDateSafe = (d) => {
    if (!d) return null;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const dateRange = {
    start: parseDateSafe(storeDateRange?.start),
    end: parseDateSafe(storeDateRange?.end)
  };

  const setDateRange = (range) => {
    setStoreDateRange(range);
  };

  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState("ALL");
  const [weather, setWeather] = useState(null);
  const [selectedModalActivity, setSelectedModalActivity] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [activeMapActivity, setActiveMapActivity] = useState(MOCK_ACTIVITIES[0]);
  const [destSearchQuery, setDestSearchQuery] = useState("");
  const [dbActivities, setDbActivities] = useState([]);
  const [dbStays, setDbStays] = useState([]);

  useEffect(() => {
    if (!destination?.name) return;
    
    fetchListings().then(listings => {
      const targetDest = destination.name.toLowerCase().trim();
      const locationFiltered = listings.filter(l => {
        const cityMatch = l.city && l.city.toLowerCase().trim().includes(targetDest);
        const locMatch = l.location && l.location.toLowerCase().trim().includes(targetDest);
        const stateMatch = l.state && l.state.toLowerCase().trim().includes(targetDest);
        return cityMatch || locMatch || stateMatch;
      });

      const acts = locationFiltered.filter(l => l.category === "Activities").map(mapDbToActivity);
      const stays = locationFiltered.filter(l => l.category === "Stay").map(mapDbToHotel);
      
      setDbActivities(acts);
      setDbStays(stays);
    }).catch(err => {
      console.error("PlanPage listing fetch error:", err);
    });
  }, [destination]);

  const allActivities = [...MOCK_ACTIVITIES, ...dbActivities];
  const allStays = [...dbStays];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!destination && DESTINATIONS.length > 0) {
      setDestination(DESTINATIONS[0]);
    } else if (destination) {
      fetchWeather(destination.name).then(setWeather);
    }
  }, [destination, setDestination]);

  const nights = dateRange.start && dateRange.end 
    ? Math.max(1, differenceInDays(dateRange.end, dateRange.start)) 
    : 0;

  const perPersonBudget = budgetType === "per_person" ? budget : Math.round(budget / members);

  const getTier = (perPerson) => {
    if (perPerson < 8000) return "ECONOMY TIER";
    if (perPerson < 25000) return "PREMIUM TIER";
    return "LUXURY TIER";
  };

  const filteredMapItems = allActivities.filter(a => activityFilter === "ALL" || a.category === activityFilter);

  const mapPositions = [
    { top: '25%', left: '20%' },
    { top: '40%', left: '55%' },
    { top: '75%', left: '30%' },
    { top: '20%', left: '75%' },
    { top: '65%', left: '70%' },
    { top: '55%', left: '15%' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <button onClick={() => navigate("/")} className="group flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors mb-4">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back to Explore</span>
            </button>
            <div className="relative group inline-block">
              <h1 
                onClick={() => setDestDropdownOpen(!destDropdownOpen)}
                className="font-display font-black text-6xl text-slate-900 cursor-pointer flex items-center gap-4 hover:text-orange-600 transition-colors drop-shadow-sm"
              >
                {destination?.name || "Select Destination"}
                <ChevronDown size={32} className={`transition-transform duration-300 ${destDropdownOpen ? 'rotate-180 text-orange-500' : 'text-slate-300'}`} />
              </h1>
              
              {destDropdownOpen && (
                <div className="absolute top-full left-0 mt-4 w-80 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-2xl z-50 p-6 animate-in zoom-in-95 duration-200">
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search destinations..." 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20"
                      value={destSearchQuery}
                      onChange={(e) => setDestSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {DESTINATIONS.filter(d => d.name.toLowerCase().includes(destSearchQuery.toLowerCase())).map(d => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setDestination(d);
                          setDestDropdownOpen(false);
                          toast.success(`Welcome to ${d.name}!`);
                        }}
                        className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center justify-between group ${destination?.id === d.id ? 'bg-orange-50 text-orange-700 font-bold' : 'hover:bg-slate-50 text-slate-600 font-medium'}`}
                      >
                        {d.name}
                        {destination?.id === d.id && <CheckCircle2 size={16} className="text-orange-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <p className="text-slate-500 font-medium text-lg mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              {destination?.tagline}
            </p>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setShowBillModal(true)} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-3 group">
              View Itinerary
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] group-hover:scale-110 transition-transform">{selectedActivities.length + (selectedHotel ? 1 : 0)}</div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
            {/* Trip Parameters */}
            <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="space-y-10">
                {/* Members */}
                <div>
                  <p className="text-slate-700 font-bold text-xs tracking-wider mb-6 uppercase drop-shadow-sm">Traveling Party</p>
                  <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                    <button onClick={() => setMembers(Math.max(1, members - 1))} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm active:scale-95"><Minus size={20} /></button>
                    <div className="text-center px-4">
                      <p className="text-4xl font-display font-black text-slate-900">{members}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Explorers</p>
                    </div>
                    <button onClick={() => setMembers(members + 1)} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm active:scale-95"><Plus size={20} /></button>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-slate-700 font-bold text-xs tracking-wider uppercase drop-shadow-sm">Estimated Budget</p>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button onClick={() => setBudgetType('per_person')} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${budgetType === 'per_person' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Per Person</button>
                      <button onClick={() => setBudgetType('total')} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${budgetType === 'total' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Total Trip</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => setBudget(budgetType === "per_person" ? 5000 : 5000 * members)} className={`border-2 p-5 rounded-2xl text-left transition-all ${getTier(perPersonBudget) === "ECONOMY TIER" ? "border-orange-500 bg-orange-50/90 shadow-md" : "border-slate-200 bg-white/80 hover:border-orange-300 hover:shadow-sm"}`}><p className="font-bold text-lg text-slate-900 mb-1">Economy</p><p className="text-xs text-slate-500 font-bold tracking-wider">₹3K–8K {budgetType === 'per_person' ? '/pp' : ''}</p></button>
                    <button onClick={() => setBudget(budgetType === "per_person" ? 15000 : 15000 * members)} className={`border-2 p-5 rounded-2xl text-left transition-all ${getTier(perPersonBudget) === "PREMIUM TIER" ? "border-orange-500 bg-orange-50/90 shadow-md" : "border-slate-200 bg-white/80 hover:border-orange-300 hover:shadow-sm"}`}><p className="font-bold text-lg text-slate-900 mb-1">Premium</p><p className="text-xs text-slate-500 font-bold tracking-wider">₹8K–25K {budgetType === 'per_person' ? '/pp' : ''}</p></button>
                    <button onClick={() => setBudget(budgetType === "per_person" ? 35000 : 35000 * members)} className={`border-2 p-5 rounded-2xl text-left transition-all ${getTier(perPersonBudget) === "LUXURY TIER" ? "border-orange-500 bg-orange-50/90 shadow-md" : "border-slate-200 bg-white/80 hover:border-orange-300 hover:shadow-sm"}`}><p className="font-bold text-lg text-slate-900 mb-1">Luxury</p><p className="text-xs text-slate-500 font-bold tracking-wider">₹25K+ {budgetType === 'per_person' ? '/pp' : ''}</p></button>
                  </div>

                  {getTier(perPersonBudget) === "ECONOMY TIER" && (
                    <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="flex items-center gap-3 mb-6"><div className="w-8 h-[2px] bg-emerald-500"></div><h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Affordable Local Gems</h3></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dbStays.filter(s => s.price < 3000).length > 0 ? (
                          dbStays.filter(s => s.price < 3000).map(stay => (
                            <div key={stay.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow"><img src={stay.image} alt={stay.name} className="w-20 h-20 rounded-xl object-cover" /><div className="flex-1"><div className="flex justify-between items-start"><h4 className="font-bold text-slate-900 text-sm">{stay.name}</h4><span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Local</span></div><p className="text-xs text-slate-500 mt-1">₹{stay.price}/night</p><button onClick={() => { selectHotel(stay); toast.success(`${stay.name} selected!`); }} className="mt-3 text-[10px] font-bold text-orange-500 uppercase tracking-wider hover:text-orange-600">{selectedHotel?.id === stay.id ? "Selected ✓" : "Quick Book"}</button></div></div>
                          ))
                        ) : (
                          <div className="col-span-full py-8 px-6 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center"><p className="text-xs text-slate-500 font-medium italic mb-1">No budget homestays found in {destination.name} yet.</p><p className="text-[10px] text-slate-400">Stay Tuned !</p></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Travel Dates */}
                <div>
                  <p className="text-slate-700 font-bold text-xs tracking-wider mb-4 uppercase drop-shadow-sm">Travel Dates & Weather</p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <button 
                      onClick={() => {
                        const d = new Date();
                        const diff = (5 - d.getDay() + 7) % 7 || 7;
                        const start = new Date(d); start.setDate(d.getDate() + diff);
                        const end = new Date(start); end.setDate(start.getDate() + 2);
                        setDateRange({ start, end });
                      }}
                      className="px-6 py-3 bg-white/80 border-2 border-slate-200 rounded-xl text-sm font-bold hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
                    >
                      This Weekend
                    </button>
                    <button 
                      onClick={() => {
                        const d = new Date();
                        const diff = (5 - d.getDay() + 7) % 7 || 7;
                        const start = new Date(d); start.setDate(d.getDate() + diff + 7);
                        const end = new Date(start); end.setDate(start.getDate() + 2);
                        setDateRange({ start, end });
                      }}
                      className="px-6 py-3 bg-white/80 border-2 border-slate-200 rounded-xl text-sm font-bold hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
                    >
                      Next Weekend
                    </button>
                  </div>
                  
                  <CustomCalendar dateRange={dateRange} setDateRange={setDateRange} weather={weather} destinationId={destination?.id} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-400">
            {/* Interactive Map */}
            <div className="w-full pt-16 border-t border-slate-300/50">
              <div className="mb-12 text-center"><p className="text-orange-600 font-bold text-xs tracking-wider mb-3 uppercase drop-shadow-sm">Interactive Guide</p><h2 className="font-display font-bold text-4xl text-slate-900 mb-4 drop-shadow-sm">Explore Activities</h2><p className="text-slate-800 text-lg font-medium drop-shadow-sm max-w-2xl mx-auto">Click on the map pins to explore top experiences across the region and add them directly to your itinerary.</p></div>
              <div className="flex flex-col xl:flex-row gap-8 items-stretch h-auto xl:h-[600px] mb-20">
                
                {/* Left Side: Featured Activity Details */}
                <div className="xl:w-[450px] shrink-0 bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl flex flex-col relative animate-in fade-in duration-300">
                  {activeMapActivity ? (
                    <>
                      <div className="h-64 sm:h-72 w-full relative shrink-0">
                        <img src={activeMapActivity.image || activeMapActivity.thumb1} className="w-full h-full object-cover" alt="Featured Activity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                        <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-lg border border-white/30">
                          {activeMapActivity.category === 'Adventure' ? '🛶' : activeMapActivity.category === 'Extreme' ? '🪂' : activeMapActivity.category === 'Wellness' ? '🧘' : activeMapActivity.category === 'Culture' ? '🪔' : '⛺'}
                        </div>
                        <div className="absolute bottom-5 left-6 right-6">
                          <span className="px-3 py-1 bg-orange-500 text-white text-[9px] font-bold tracking-widest uppercase rounded-full mb-2 inline-block shadow-md">
                            {activeMapActivity.category}
                          </span>
                          <h3 className="font-display font-bold text-3xl text-white leading-tight">{activeMapActivity.name}</h3>
                        </div>
                      </div>
                      
                      <div className="p-8 flex flex-col flex-1">
                        <p className="text-slate-600 font-medium text-lg italic mb-8 leading-relaxed flex-1">"{activeMapActivity.shortDesc}"</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">⏱️</div>
                            <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                              <p className="font-bold text-slate-800 text-sm">{activeMapActivity.duration}</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">💰</div>
                            <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Price</p>
                              <p className="font-bold text-slate-800 text-sm">₹{activeMapActivity.price} <span className="text-[10px] text-slate-500">pp</span></p>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => {
                            if (activeMapActivity.type) {
                              if (selectedHotel?.id === activeMapActivity.id) clearHotel();
                              else selectHotel(activeMapActivity);
                            } else {
                              toggleActivity(activeMapActivity.id);
                            }
                          }}
                          className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 shadow-md border-2 ${
                            (activeMapActivity.type ? selectedHotel?.id === activeMapActivity.id : selectedActivities.includes(activeMapActivity.id)) 
                              ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' 
                              : 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1'
                          }`}
                        >
                          {(activeMapActivity.type ? selectedHotel?.id === activeMapActivity.id : selectedActivities.includes(activeMapActivity.id)) ? (<> <Check size={16} /> Added to Trip </>) : (<> <Plus size={16} /> Add to Trip </>)}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="font-medium">Select a pin on the map to see details</p>
                    </div>
                  )}
                </div>

                {/* Right Side: Map Canvas */}
                <div className="flex-1 bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl border-4 border-white">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200" className="w-full h-full object-cover opacity-50 grayscale" alt="Map Region" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-transparent to-slate-900/40"></div>
                  
                  <div className="absolute top-6 left-6 right-6 flex gap-2">
                    {["ALL", "Adventure", "Culture", "Extreme", "Wellness"].map(cat => (
                      <button key={cat} onClick={() => setActivityFilter(cat)} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activityFilter === cat ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}>{cat}</button>
                    ))}
                  </div>

                  {filteredMapItems.map((act, idx) => (
                    <div
                      key={act.id}
                      className="absolute cursor-pointer transition-all hover:scale-125 z-10"
                      style={mapPositions[idx % mapPositions.length]}
                      onClick={() => setActiveMapActivity(act)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-2xl border-2 transition-all ${activeMapActivity?.id === act.id ? 'bg-orange-500 border-white scale-125 ring-4 ring-orange-500/30' : 'bg-white border-orange-500'}`}>
                        {act.category === 'Adventure' ? '🛶' : act.category === 'Extreme' ? '🪂' : act.category === 'Wellness' ? '🧘' : act.category === 'Culture' ? '🪔' : '⛺'}
                      </div>
                      {activeMapActivity?.id === act.id && <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-xl border border-slate-700 animate-in slide-in-from-top-2">{act.name}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVITY MODAL */}
        {selectedModalActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedModalActivity(null)}></div>
            <div className="relative bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
              <button onClick={() => setSelectedModalActivity(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 transition-colors"><X size={20} /></button>
              <div className="h-64 sm:h-80 w-full relative">
                <img src={selectedModalActivity.image || selectedModalActivity.thumb1} className="w-full h-full object-cover" alt="Activity Modal Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6"><span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-md mb-3 inline-block shadow-md">{selectedModalActivity.category}</span><h2 className="font-display font-bold text-3xl sm:text-4xl text-white">{selectedModalActivity.name}</h2></div>
              </div>
              <div className="p-8">
                <p className="text-lg text-slate-600 italic mb-6">"{selectedModalActivity.shortDesc}"</p>
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">⏱️</div><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p><p className="font-bold text-slate-900">{selectedModalActivity.duration}</p></div></div>
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">⭐</div><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</p><p className="font-bold text-slate-900">{selectedModalActivity.rating} / 5.0</p></div></div>
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">💰</div><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</p><p className="font-bold text-slate-900">₹{selectedModalActivity.price} pp</p></div></div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => { toggleActivity(selectedModalActivity.id); setSelectedModalActivity(null); }} className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-md ${selectedActivities.includes(selectedModalActivity.id) ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_5_15px_rgba(249,115,22,0.3)]'}`}>{selectedActivities.includes(selectedModalActivity.id) ? 'Remove from Trip' : 'Select Activity'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BILL MODAL */}
        {showBillModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
              <div className="bg-slate-900 text-white p-8 flex justify-between items-center">
                <div><h2 className="font-display font-bold text-3xl mb-1">Trip Breakdown</h2><p className="text-slate-400 text-sm font-medium uppercase tracking-widest">{destination.name} · {members} Members</p></div>
                <button onClick={() => setShowBillModal(false)} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><X size={24} /></button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                {selectedHotel && (
                  <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100">
                    <img src={selectedHotel.image} alt={selectedHotel.name} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-xl text-slate-900">{selectedHotel.name}</h3><p className="font-display font-bold text-xl text-slate-900">₹{(selectedHotel.price * nights).toLocaleString()}</p></div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{selectedHotel.type} · {nights} nights</p>
                      <div className="flex gap-2">{selectedHotel.amenities.slice(0, 3).map(a => (<span key={a} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">{a}</span>))}</div>
                    </div>
                  </div>
                )}
                <div className="space-y-6 mb-8">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Selected Experiences</p>
                  {selectedActivities.map(id => {
                    const act = allActivities.find(a => a.id === id);
                    if (!act) return null;
                    return (
                      <div key={id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">{act.category === 'Adventure' ? '🛶' : act.category === 'Extreme' ? '🪂' : act.category === 'Wellness' ? '🧘' : act.category === 'Culture' ? '🪔' : '⛺'}</div>
                          <div><p className="font-bold text-slate-800">{act.name}</p><p className="text-[10px] text-slate-500 uppercase tracking-widest">{act.category} · {members} People</p></div>
                        </div>
                        <p className="font-bold text-slate-900">₹{(act.price * members).toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="flex justify-between items-center mb-4 text-slate-600 font-medium"><span>Platform Service Fee</span><span>₹{(members * 250).toLocaleString()}</span></div>
                  <div className="flex justify-between items-center text-slate-900 pt-4 border-t border-slate-200"><span className="font-display font-bold text-2xl">Total Payable</span><span className="font-display font-bold text-3xl text-orange-600">₹{(totalCost + (members * 250)).toLocaleString()}</span></div>
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-200 flex gap-4">
                <button onClick={() => setShowBillModal(false)} className="flex-1 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-widest text-xs">Customize More</button>
                <button onClick={() => { setShowBillModal(false); navigate("/booking"); }} className="flex-[2] py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 uppercase tracking-widest text-xs flex justify-center items-center gap-2">Proceed to Checkout <ArrowLeft size={16} className="rotate-180" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}