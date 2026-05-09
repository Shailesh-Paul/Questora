import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { DESTINATIONS } from "../lib/api";

export default function DestinationGrid({ onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredDestinations = DESTINATIONS.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Check if exact match
    const exactMatch = DESTINATIONS.find(d => d.name.toLowerCase() === searchQuery.toLowerCase());
    if (exactMatch) {
      onSelect(exactMatch);
      return;
    }

    // Create a mock destination for custom place
    const customDest = {
      id: "custom-" + Date.now(),
      name: searchQuery,
      state: "Custom Destination",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
      tagline: "Explore your way",
      crowdLevel: "low",
      tag: "Custom",
      trendingScore: 90
    };
    onSelect(customDest);
  };

  const getCrowdStyles = (level) => {
    switch(level) {
      case 'low': return { text: 'Low Crowd', dot: 'crowd-low', bg: 'bg-green-100 text-green-800' };
      case 'medium': return { text: 'Moderate', dot: 'crowd-medium', bg: 'bg-yellow-100 text-yellow-800' };
      case 'high': return { text: 'Crowded', dot: 'crowd-high', bg: 'bg-red-100 text-red-800' };
      default: return { text: 'Unknown', dot: 'crowd-low', bg: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <section id="destinations" className="py-24 bg-slate-50 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-8">
          
          {/* Search Bar Container */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1 relative">
            <div className="flex items-center bg-white rounded-full shadow-lg border border-slate-200 p-2 relative z-20 hover:shadow-xl transition-shadow">
              <div className="pl-5 pr-3 text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>
              </div>
              <input
                type="text"
                placeholder="Where to next? (e.g. Goa, Paris)"
                className="flex-1 bg-transparent outline-none py-3 text-slate-700 font-medium placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustomSearch();
                }}
              />
              <button
                onClick={handleCustomSearch}
                className="bg-slate-900 hover:bg-orange-500 text-white px-6 md:px-8 py-3 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-orange-500/30 whitespace-nowrap"
              >
                Plan Weekend
              </button>
            </div>
            
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-30 max-h-80 overflow-y-auto animate-in slide-in-from-top-2">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map(dest => (
                    <div 
                      key={dest.id}
                      onClick={() => onSelect(dest)}
                      className="px-5 py-4 hover:bg-orange-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0 group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-lg group-hover:text-orange-600 transition-colors">{dest.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{dest.state}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-orange-600 px-3 py-1 bg-white rounded-full border border-orange-200 uppercase tracking-widest shadow-sm hidden sm:block">
                        {dest.tag}
                      </span>
                    </div>
                  ))
                ) : (
                  <div 
                    onClick={handleCustomSearch}
                    className="px-5 py-6 text-center cursor-pointer hover:bg-orange-50 transition-colors"
                  >
                    <p className="text-slate-500 font-medium mb-1">Destination not found in trending.</p>
                    <p className="text-orange-600 font-bold">Plan a custom trip to "{searchQuery}" <ArrowRight size={16} className="inline ml-1 mb-0.5" /></p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 order-1 lg:order-2 lg:text-right">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4 tracking-tight">Trending This Weekend</h2>
            <p className="text-slate-600 text-lg lg:ml-auto max-w-lg">
              Our unique Crowd Indicator uses real-time data to tell you how busy a destination will be. Plan smarter.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest) => {
            const crowd = getCrowdStyles(dest.crowdLevel);
            return (
              <div
                key={dest.id}
                onClick={() => onSelect(dest)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  
                  {/* Crowd Indicator Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/90 shadow-sm flex items-center text-xs font-semibold ${crowd.bg}`}>
                    <span className={`crowd-dot ${crowd.dot}`}></span>
                    {crowd.text}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-2xl text-slate-900">{dest.name}</h3>
                    <span className="text-sm font-medium text-slate-500">{dest.state}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{dest.tagline}</p>
                  
                  <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    View Weekend Options <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
