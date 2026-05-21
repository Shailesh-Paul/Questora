import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { fetchDestinations, mapDbToActivity, MOCK_ACTIVITIES } from "../lib/api";
import { fetchActivitiesByDestination } from "../features/activities/activitiesAPI";
import { mapDbToFrontendDestination, findDestinationMatch, normalizeDestinationKey } from "../utils/destination";
import { ArrowLeft, Star, Clock, Users, ExternalLink, CreditCard, CheckCircle, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import DemandEngine from "../components/DemandEngine";
import AccommodationList from "../features/accommodations/AccommodationList";

export default function ItineraryPage() {
  const navigate = useNavigate();
  const { destination: destId } = useParams();
  const { destination, setDestination, members, budget, addToCart, removeFromCart, cart, selectedHotel, selectHotel, getRemainingBudget, autoSaveTrip, dateRange } = useTripStore();

  const nightsLocal = dateRange.start && dateRange.end ? Math.max(1, Math.round((new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24))) : 2;

  const [activityFilter, setActivityFilter] = useState("All");
  const [dbActivities, setDbActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);
  const [pageDestination, setPageDestination] = useState(destination);

  const activeDestination = pageDestination || destination;

  useEffect(() => {
    const normalizedParam = destId?.toLowerCase()?.trim();
    if (!normalizedParam) return;

    const localDestination = destination?.name?.toLowerCase()?.trim();
    if (localDestination === normalizedParam) {
      setPageDestination(destination);
      return;
    }

    const resolveDestination = async () => {
      try {
        const destinations = await fetchDestinations();
        const match = findDestinationMatch(destinations, normalizedParam);

        if (match) {
          const mapped = mapDbToFrontendDestination(match);
          console.log(`[DEBUG] ItineraryPage resolved destination: ${mapped.name}`);
          setDestination(mapped);
          setPageDestination(mapped);
        } else {
          console.warn(`[DEBUG] ItineraryPage: no match for "${normalizedParam}"`);
          setPageDestination(destination);
        }
      } catch (err) {
        console.error("Destination lookup failed:", err);
        setPageDestination(destination);
      }
    };

    resolveDestination();
  }, [destId, destination, setDestination]);

  useEffect(() => {
    if (!activeDestination?.name) {
      setDbActivities([]);
      return;
    }

    const fetchActivities = async () => {
      setActivitiesLoading(true);
      setActivitiesError(null);
      setDbActivities([]);

      try {
        const activities = await fetchActivitiesByDestination(activeDestination.name);
        const destKey = normalizeDestinationKey(activeDestination.name);
        const mapped = (activities || [])
          .map(mapDbToActivity)
          .filter((activity) => normalizeDestinationKey(activity.destination) === destKey);

        console.log(`[DEBUG] ItineraryPage activities for ${activeDestination.name}: api=${activities?.length || 0} mapped=${mapped.length}`);

        if (mapped.length > 0) {
          setDbActivities(mapped);
        } else {
          const fallback = MOCK_ACTIVITIES.filter(
            (act) => normalizeDestinationKey(act.destination) === destKey
          );
          if (fallback.length > 0) {
            console.warn(`[DEBUG] ItineraryPage: using MOCK_ACTIVITIES fallback (${fallback.length})`);
            setDbActivities(fallback);
          } else {
            setActivitiesError(`No activities found for ${activeDestination.name}.`);
          }
        }
      } catch (err) {
        console.error("Activity fetch error:", err);
        const fallback = MOCK_ACTIVITIES.filter((act) => act.destination?.toLowerCase?.() === activeDestination.name.toLowerCase().trim());
        setDbActivities(fallback);
        setActivitiesError("Unable to load activities from the server. Showing curated suggestions.");
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, [activeDestination]);

  const destinationKey = activeDestination?.name?.toLowerCase()?.trim() || "";
  const filteredMocks = MOCK_ACTIVITIES.filter((act) => act.destination?.toLowerCase?.() === destinationKey);
  const allActivities = dbActivities.length > 0 ? dbActivities : filteredMocks;

  const inCart = (id) => cart.some((i) => i.id === id);

  const handleAddActivity = (item) => {
    if (inCart(item.id)) {
      removeFromCart(item.id);
      toast.success(`${item.name} removed`);
    } else {
      addToCart({ ...item, type: "activity", price: item.price * members });
      toast.success(`${item.name} added`);
    }
    autoSaveTrip();
  };

  const filteredActivities = activityFilter === "All"
    ? allActivities
    : allActivities.filter(a => a.category === activityFilter);

  const activityCategoryDefaults = ["Adventure", "Spiritual", "Nightlife", "Historical", "Nature", "Wellness", "Water Sports", "Local Exploration"];
  const categories = [
    "All",
    ...Array.from(new Set([
      ...activityCategoryDefaults,
      ...allActivities.map(a => a.category).filter(Boolean)
    ]))
  ];

  const totalActivitiesCost = cart.reduce((sum, i) => sum + i.price, 0);
  const totalHotelCost = selectedHotel ? selectedHotel.price * nightsLocal : 0;
  const totalCost = totalActivitiesCost + totalHotelCost;
  const remaining = getRemainingBudget();

  return (
    <div className="min-h-screen relative font-body text-slate-100">
      <div className="fixed inset-0 z-[-1]">
        <img
          src={activeDestination?.image || destination?.image || "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1920"}
          alt="Destination Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
      </div>

      <div className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/plan")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-semibold text-sm">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 pr-4 border-r border-white/10">
            <div className="bg-orange-500/20 p-2 rounded-lg"><Wallet size={20} className="text-orange-400" /></div>
            <div>
              <p className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest font-bold">Total Budget</p>
              <p className="font-bold text-xs sm:text-sm">₹{(budget * members).toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="px-2">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Remaining</p>
            <p className={`font-bold text-lg ${remaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              ₹{remaining.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-16 text-center">
          <p className="text-orange-400 font-bold tracking-[0.3em] uppercase text-sm mb-4">Curated For You</p>
          <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-8xl text-white tracking-tight drop-shadow-2xl px-4">
            {activeDestination?.name || destination?.name || "Destination"}
          </h1>
        </div>

        <div className="mb-20">
          <AccommodationList destination={activeDestination || destination} />
        </div>

        <DemandEngine destination={activeDestination || destination} budget={budget} />

        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-orange-500"></span> Curated Activities
          </h2>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActivityFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activityFilter === cat ? "bg-orange-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {activitiesError && (
            <div className="mb-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-amber-100">
              {activitiesError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activitiesLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-3xl p-6 h-64"></div>
              ))
            ) : filteredActivities.length > 0 ? (
              filteredActivities.map((act) => (
                <div key={act.id} className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-3xl p-6 hover:border-white/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold tracking-wider text-orange-400 uppercase bg-orange-400/10 px-3 py-1 rounded-full">{act.category}</span>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                        <Star size={14} className="fill-yellow-400" /> {act.rating}
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-3">{act.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/50 mb-6">
                      <div className="flex items-center gap-1"><Clock size={14}/> {act.duration}</div>
                      <div className="flex items-center gap-1"><Users size={14}/> {act.slots} slots</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <div>
                      <span className="text-xl font-bold">₹{act.price.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-white/50"> /pp</span>
                    </div>
                    <button
                      onClick={() => handleAddActivity(act)}
                      className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                        inCart(act.id) ? "bg-emerald-500 text-white" : "bg-white text-slate-900 hover:bg-slate-200"
                      }`}
                    >
                      {inCart(act.id) ? "Added ✓" : "Add"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-white/10 bg-slate-950/70 p-8 text-center text-white/70">
                <p className="text-lg font-semibold mb-2">No activities found for {activeDestination?.name || 'this destination'}.</p>
                <p className="text-sm text-white/50">Try selecting a different destination or adjusting your travel preferences.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <p className="text-sm font-bold text-orange-400 tracking-widest uppercase mb-2">Final Summary</p>
            <div className="flex flex-col gap-1">
              <p className="font-display text-4xl md:text-5xl font-bold">₹{totalCost.toLocaleString("en-IN")}</p>
              <p className="text-white/50 text-sm mt-2">
                Activities ({cart.length}): ₹{totalActivitiesCost.toLocaleString("en-IN")} <span className="text-emerald-400 font-bold ml-2">(Pay 20% Advance)</span>
              </p>
              {selectedHotel && (
                <p className="text-white/50 text-sm">
                  Hotel ({nightsLocal} nights): ₹{totalHotelCost.toLocaleString("en-IN")} <span className="text-blue-400 font-bold ml-2">(Pay Directly)</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
            {cart.length > 0 && (
              <button onClick={() => navigate("/booking")} className="flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                <CreditCard size={20} /> Checkout & Pay Advance
              </button>
            )}

            {selectedHotel && (
              <div className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-2xl">
                <CheckCircle size={20} /> Stay Tracked
              </div>
            )}

            {!selectedHotel && cart.length === 0 && (
              <div className="text-white/50 italic px-8 py-4">Add a stay or activity to proceed</div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}