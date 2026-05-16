import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sparkles, Compass, Star, Clock, Map as MapIcon, ChevronRight, Zap, Target, DollarSign, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import useTripStore from '../store/tripStore';
import { fetchActivitiesByDestination, getAIRecommendations, fetchNearbyActivities, fetchDestinationInfo, getAIBundle } from '../lib/api';
import PackageSidebar from '../components/PackageSidebar';
import toast from 'react-hot-toast';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }]
  }
];

const CATEGORIES = ['All', 'Spiritual', 'Adventure', 'Nightlife', 'Historical', 'Food', 'Nature', 'Water Sports', 'Wellness'];

// Google Maps Helper
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function ExperiencePlanner() {
  const [searchTerm, setSearchTerm] = useState('Goa');
  const [destinationInfo, setDestinationInfo] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [aiBundle, setAiBundle] = useState(null);
  const [nearbySuggestions, setNearbySuggestions] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 15.2993, lng: 74.1240 }); // Default to Goa coordinates
  const [selectedMapItem, setSelectedMapItem] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });
  
  const { addActivityToPackage, selectedActivities, budget, members, setDestination } = useTripStore();

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    setActivities([]);
    setRecommendations([]);
    setNearbySuggestions([]);
    setAiBundle(null);
    setDestinationInfo(null);
    
    setLoading(true);
    const targetDest = searchTerm.trim();

    try {
      const destData = await fetchDestinationInfo(targetDest);
      setDestinationInfo(destData);
      setDestination(targetDest);

      if (destData.coordinates && destData.coordinates.coordinates) {
        // [longitude, latitude] -> Google Maps uses {lat, lng}
        setMapCenter({ 
          lat: destData.coordinates.coordinates[1], 
          lng: destData.coordinates.coordinates[0] 
        });
      }

      const activityData = await fetchActivitiesByDestination(targetDest);
      setActivities(activityData);
      
      const recData = await getAIRecommendations(targetDest, budget);
      setRecommendations(recData);

      const bundleData = await getAIBundle({
        destination: targetDest,
        budget: budget || 15000,
        interests: ['Adventure', 'Nature'],
        selectedActivities: selectedActivities.map(a => a.name)
      });
      setAiBundle(bundleData);

      if (activityData.length > 0) {
        const first = activityData[0];
        const nearby = await fetchNearbyActivities(
          targetDest, 
          first.coordinates.coordinates[0], 
          first.coordinates.coordinates[1]
        );
        setNearbySuggestions(nearby.filter(n => n._id !== first._id));
      }

    } catch (err) {
      console.error(err);
      toast.error(`Could not find data for "${targetDest}". Try Goa, Ujjain, or Rishikesh.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const filteredActivities = activities.filter(act => 
    selectedCategory === 'All' || act.category === selectedCategory
  );

  const isSelected = (id) => selectedActivities.some(a => (a.id || a._id) === id);

  const totalActivityCost = selectedActivities.reduce((sum, a) => sum + (a.estimatedPrice || a.price || 0), 0);
  const estimatedTotalTrip = destinationInfo 
    ? (totalActivityCost + (destinationInfo.averageStayCost + destinationInfo.averageFoodCost + destinationInfo.averageTransportCost) * members)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-body pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LHS: Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Hero & Search */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px]" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 relative z-10">
              Explore <span className="text-orange-500">{searchTerm}</span>
            </h1>
            <p className="text-white/60 mb-8 relative z-10 text-lg">
              Dynamic activities and smart recommendations for your next journey.
            </p>
            
            <form onSubmit={handleSearch} className="relative z-10 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter destination..."
                  className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-orange-500 transition-all text-lg"
                />
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />} Search
              </button>
            </form>
          </div>

          {/* Budget Summary */}
          {destinationInfo && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <DollarSign className="text-emerald-500" size={32} />
                    <div>
                      <h3 className="font-bold">Estimated Trip Cost</h3>
                      <p className="text-sm text-emerald-200/60">Based on local averages and selected activities</p>
                    </div>
                  </div>
                  <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-2xl shadow-xl shadow-emerald-500/20">
                    ₹{estimatedTotalTrip}
                  </div>
               </div>
            </motion.div>
          )}

          {/* AI Bundle */}
          <AnimatePresence>
            {aiBundle && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-600/10 border border-blue-500/30 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <Sparkles className="text-blue-500" size={24} />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Smart AI Bundle: {aiBundle.bundleName}</h3>
                    <p className="text-sm text-blue-200/70 italic mb-4">"{aiBundle.rationale}"</p>
                    <div className="flex flex-wrap gap-2">
                      {aiBundle.activities.map(a => <span key={a} className="bg-blue-500/20 px-3 py-1 rounded-full text-xs font-bold text-blue-300"># {a}</span>)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Activity List */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3"><Compass className="text-orange-500" /> Experiences</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-[50%]">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedCategory === cat ? 'bg-orange-500 border-orange-500' : 'bg-white/5 border-white/10 text-white/40'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-white/5 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredActivities.map(act => (
                  <motion.div key={act._id} layout className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all flex flex-col">
                    <div className="h-48 relative">
                      <img src={act.images?.[0] || 'https://images.unsplash.com/photo-1544627255-75e11a2f1ab6?w=600'} className="w-full h-full object-cover" alt="" />
                      <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 uppercase tracking-widest">{act.category}</div>
                      <div className="absolute bottom-4 right-4 bg-orange-500 px-3 py-1 rounded-full font-bold">₹{act.estimatedPrice}</div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2">{act.activityName}</h3>
                      <p className="text-sm text-white/40 mb-4 line-clamp-2">{act.description}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex items-center gap-2 text-orange-400 font-bold"><Star size={16} fill="currentColor" /> {act.ratings}</div>
                        <button 
                          onClick={() => addActivityToPackage(act)}
                          disabled={isSelected(act._id)}
                          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${isSelected(act._id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 hover:bg-orange-500'}`}
                        >
                          {isSelected(act._id) ? 'Added' : 'Add to Trip'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
                <Compass className="mx-auto text-white/10 mb-4" size={48} />
                <p className="text-white/40 font-bold text-lg">No activities found for {searchTerm} in this category.</p>
              </div>
            )}
          </div>

          {/* Nearby Carousel */}
          {nearbySuggestions.length > 0 && (
            <div className="pt-8 border-t border-white/10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white/60"><MapIcon size={20} className="text-blue-500" /> Nearby Experiences</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {nearbySuggestions.map(n => (
                  <div key={n._id} className="min-w-[280px] bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 hover:bg-white/10 cursor-pointer">
                    <img src={n.images?.[0]} className="w-16 h-16 rounded-xl object-cover" alt="" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1">{n.activityName}</h4>
                      <p className="text-[10px] text-white/40">{n.category} • ₹{n.estimatedPrice}</p>
                    </div>
                    <ChevronRight className="text-white/20" size={16} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RHS: Sidebar */}
        <div className="lg:col-span-4 h-max lg:sticky lg:top-28 space-y-6">
          <PackageSidebar />
          
          {/* Interactive Map (Google Maps) */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-sm"><MapIcon size={16} className="text-orange-500" /> Destination View</h3>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
             </div>
             <div className="aspect-square bg-slate-900 rounded-2xl border border-white/10 relative overflow-hidden z-0">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapCenter}
                    zoom={12}
                    options={{
                      styles: darkMapStyle,
                      disableDefaultUI: true,
                      zoomControl: true,
                    }}
                  >
                    {activities.map(act => (
                      <Marker 
                        key={act._id} 
                        position={{ 
                          lat: act.coordinates.coordinates[1], 
                          lng: act.coordinates.coordinates[0] 
                        }}
                        onClick={() => setSelectedMapItem(act)}
                      />
                    ))}

                    {selectedMapItem && (
                      <InfoWindow
                        position={{ 
                          lat: selectedMapItem.coordinates.coordinates[1], 
                          lng: selectedMapItem.coordinates.coordinates[0] 
                        }}
                        onCloseClick={() => setSelectedMapItem(null)}
                      >
                        <div className="p-2 min-w-[150px]">
                          <h4 className="font-bold text-slate-900 text-sm mb-1">{selectedMapItem.activityName}</h4>
                          <p className="text-xs text-orange-600 font-bold">₹{selectedMapItem.estimatedPrice}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{selectedMapItem.category}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <Loader2 className="animate-spin" />
                  </div>
                )}
             </div>
             <div className="mt-4 text-[10px] text-white/40 text-center font-medium">
                {destinationInfo ? `${destinationInfo.city} Map View Active` : 'Enter destination to view map'}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
