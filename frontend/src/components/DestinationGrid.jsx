import React from "react";
import { ArrowRight } from "lucide-react";
import { DESTINATIONS } from "../lib/api";

export default function DestinationGrid({ onSelect }) {
  const getCrowdStyles = (level) => {
    switch(level) {
      case 'low': return { text: 'Low Crowd', dot: 'crowd-low', bg: 'bg-green-100 text-green-800' };
      case 'medium': return { text: 'Moderate', dot: 'crowd-medium', bg: 'bg-yellow-100 text-yellow-800' };
      case 'high': return { text: 'Crowded', dot: 'crowd-high', bg: 'bg-red-100 text-red-800' };
      default: return { text: 'Unknown', dot: 'crowd-low', bg: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <section id="destinations" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-4">Trending This Weekend</h2>
            <p className="text-slate-600 max-w-xl">
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
