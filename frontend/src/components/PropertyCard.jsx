import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, IndianRupee, Heart } from 'lucide-react';

const PropertyCard = ({ property }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 group"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={property.images[0] || 'https://images.unsplash.com/photo-1555854817-5b27381b4f8d?auto=format&fit=crop&q=80&w=800'} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 transition-colors">
            <Heart className="size-5" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-900 shadow-sm">
            {property.type}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="size-4 fill-current" />
            <span className="text-sm font-bold text-slate-700">{property.rating || '4.5'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <MapPin className="size-4" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 3).map((amenity, i) => (
            <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-medium uppercase tracking-wider">
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
              +{property.amenities.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div>
            <span className="text-2xl font-black text-blue-600 flex items-center">
              <IndianRupee className="size-5" />
              {property.price.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ month</span>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
