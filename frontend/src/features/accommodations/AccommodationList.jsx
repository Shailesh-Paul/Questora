import React, { useState, useEffect } from 'react';
import { fetchAccommodations } from './AccommodationAPI';
import AccommodationCard from './AccommodationCard';
import AccommodationFilters from './AccommodationFilters';
import { Loader2, AlertCircle } from 'lucide-react';
import useTripStore from '../../store/tripStore';

export default function AccommodationList({ destination }) {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('all');

  // In a real app, this comes from an Auth Context. 
  // We mock 'student' here to demonstrate the recommendation engine logic.
  const userRole = 'student'; 

  // We need to fetch new accommodations when destination changes
  useEffect(() => {
    if (!destination?.name) return;

    let isMounted = true;
    setLoading(true);
    
    // Clear old state safely to prevent stale Ujjain data in Goa
    setAccommodations([]);

    const loadAccommodations = async () => {
      try {
        const data = await fetchAccommodations(destination.name, userRole);
        if (isMounted) setAccommodations(data);
      } catch (err) {
        if (isMounted) setError("Failed to load accommodations.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAccommodations();

    return () => { isMounted = false; };
  }, [destination]);

  const filteredAccommodations = accommodations.filter(acc => {
    const accType = acc.type?.toLowerCase?.() || '';

    // Type Filter
    if (selectedType !== 'All' && accType !== selectedType.toLowerCase()) return false;
    
    // Price Filter
    if (selectedPrice === 'budget' && acc.pricePerNight >= 2000) return false;
    if (selectedPrice === 'mid' && (acc.pricePerNight < 2000 || acc.pricePerNight > 8000)) return false;
    if (selectedPrice === 'premium' && acc.pricePerNight <= 8000) return false;

    return true;
  });

  if (!destination) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Where to Stay</h2>
          <p className="text-white/40 mt-2 font-medium">Curated {userRole} recommendations for {destination.name}</p>
        </div>
      </div>

      <AccommodationFilters 
        selectedType={selectedType} 
        setSelectedType={setSelectedType}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
      />

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 text-orange-500">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-sm font-bold uppercase tracking-widest text-white/40">Fetching Top Stays...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex items-center justify-center text-red-400 gap-3">
          <AlertCircle /> {error}
        </div>
      ) : filteredAccommodations.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center text-center backdrop-blur-md">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20 mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">No properties found</h3>
          <p className="text-white/40 text-sm">Try adjusting your filters to see more results in {destination.name}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccommodations.map(acc => (
            <AccommodationCard key={acc._id} accommodation={acc} userRole={userRole} />
          ))}
        </div>
      )}
    </div>
  );
}
