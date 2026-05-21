import React from 'react';
import { Filter, Tag, Navigation } from 'lucide-react';

export default function AccommodationFilters({ 
  selectedType, 
  setSelectedType, 
  selectedPrice, 
  setSelectedPrice 
}) {
  const types = ['All', 'hotel', 'hostel', 'dormitory', 'homestay', 'villa', 'apartment'];
  const prices = [
    { label: 'All Budgets', value: 'all' },
    { label: 'Budget (< ₹2000)', value: 'budget' },
    { label: 'Mid-range (₹2000 - ₹8000)', value: 'mid' },
    { label: 'Premium (> ₹8000)', value: 'premium' }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 backdrop-blur-md">
      <div className="flex items-center gap-2 text-white/40 font-bold uppercase tracking-widest text-xs mb-6">
        <Filter size={14} /> Refine Stays
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Type Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm text-white/60 mb-3 font-medium">
            <Navigation size={14} /> Accommodation Type
          </label>
          <div className="flex flex-wrap gap-2">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedType === type 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm text-white/60 mb-3 font-medium">
            <Tag size={14} /> Price Range
          </label>
          <div className="flex flex-wrap gap-2">
            {prices.map(price => (
              <button
                key={price.value}
                onClick={() => setSelectedPrice(price.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedPrice === price.value 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                }`}
              >
                {price.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
