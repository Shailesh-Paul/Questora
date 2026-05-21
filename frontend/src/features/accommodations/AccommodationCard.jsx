import React, { useState } from 'react';
import { logExternalBooking } from './AccommodationAPI';
import toast from 'react-hot-toast';
import { ExternalLink, Star, ShieldCheck, MapPin } from 'lucide-react';
import useTripStore from '../../store/tripStore';

const STAY_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1542314831-c6a4d14d8373?w=800",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
];

const getStayImage = (accommodation) => {
  if (accommodation.images?.[0]) return accommodation.images[0];
  const seed = (accommodation._id || accommodation.title || "").toString();
  const idx = seed.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % STAY_FALLBACK_IMAGES.length;
  return STAY_FALLBACK_IMAGES[idx];
};

export default function AccommodationCard({ accommodation, userRole }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { selectHotel } = useTripStore();
  const stayImage = getStayImage(accommodation);

  const handleExternalBooking = async () => {
    setIsProcessing(true);
    
    // Log the booking and trigger WhatsApp confirmation
    await logExternalBooking({
      accommodationId: accommodation._id,
      destination: accommodation.destination,
      bookingPlatform: accommodation.bookingPlatform,
      estimatedPrice: accommodation.pricePerNight,
      userPhoneNumber: '+919999999999', // In a real app, pull from Auth context/store
      accommodationName: accommodation.title
    });

    toast.success(`Redirecting to ${accommodation.bookingPlatform}...`);
    
    // Select it in store for budget calculation
    selectHotel({
      id: accommodation._id,
      name: accommodation.title,
      price: accommodation.pricePerNight,
      image: accommodation.images?.[0]
    });

    setTimeout(() => {
      window.open(accommodation.externalBookingLink, '_blank');
      setIsProcessing(false);
    }, 1500);
  };

  const isRecommended = accommodation.recommendationScore >= 80;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col h-full relative">
      {/* Dynamic Recommendation Badge */}
      {isRecommended && (
        <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-orange-500/20 backdrop-blur-md flex items-center gap-1">
          <Star size={12} className="fill-white" /> Recommended for {userRole === 'student' ? 'Students' : 'You'}
        </div>
      )}

      <div className="h-48 relative overflow-hidden">
        <img 
          src={stayImage} 
          alt={accommodation.title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{accommodation.title}</h3>
            <p className="text-sm text-white/60 flex items-center gap-1">
              <MapPin size={14} /> {accommodation.destination}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-emerald-400">₹{accommodation.pricePerNight}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Per Night</div>
          </div>
        </div>

        <p className="text-sm text-white/70 line-clamp-2 mb-4">{accommodation.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs bg-white/5 text-white/80 px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider font-medium">
            {accommodation.type}
          </span>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold flex items-center gap-1">
            <Star size={12} className="fill-emerald-400" /> {accommodation.ratings}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Book via</span>
            <span className="text-sm font-bold text-white flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-400" /> {accommodation.bookingPlatform}
            </span>
          </div>
          
          <button 
            onClick={handleExternalBooking}
            disabled={isProcessing}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            {isProcessing ? 'Redirecting...' : 'Book Now'}
            {!isProcessing && <ExternalLink size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
