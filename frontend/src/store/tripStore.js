import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTripStore = create(
  persist(
    (set, get) => ({
      // Session ID for auto-saving
      sessionId: Date.now().toString(),

      // Destination
      destination: null,
      setDestination: (dest) => {
        set({ destination: dest });
        get().autoSaveTrip();
      },

      // Trip config
      members: 2,
      setMembers: (n) => {
        set({ members: n });
        get().autoSaveTrip();
      },

      budget: 15000,
      setBudget: (b) => {
        set({ budget: b });
        get().autoSaveTrip();
      },

      budgetType: "per_person",
      setBudgetType: (t) => {
        set({ budgetType: t });
        get().autoSaveTrip();
      },

      dateRange: { start: null, end: null },
      setDateRange: (range) => {
        set({ dateRange: range });
        get().autoSaveTrip();
      },

      selectedActivities: [],
      toggleActivity: (activity) => {
        set((state) => ({
          selectedActivities: state.selectedActivities.includes(activity)
            ? state.selectedActivities.filter((a) => a !== activity)
            : [...state.selectedActivities, activity],
        }));
        get().autoSaveTrip();
      },

      tripName: "",
      setTripName: (name) => {
        set({ tripName: name });
        get().autoSaveTrip();
      },

      nights: 0,
      setNights: (n) => {
        set({ nights: n });
        get().autoSaveTrip();
      },

      // Booking cart (Activities)
      cart: [],
      addToCart: (item) => {
        set((state) => ({
          cart: state.cart.find((i) => i.id === item.id)
            ? state.cart
            : [...state.cart, item],
        }));
        get().autoSaveTrip();
      },
      removeFromCart: (id) => {
        set((state) => ({ cart: state.cart.filter((i) => i.id !== id) }));
        get().autoSaveTrip();
      },

      // Selected Hotel
      selectedHotel: null,
      selectHotel: (hotel) => {
        set({ selectedHotel: hotel });
        get().autoSaveTrip();
      },
      clearHotel: () => {
        set({ selectedHotel: null });
        get().autoSaveTrip();
      },

      // Computed
      getTotalCost: () => {
        const { cart, selectedHotel, nights } = get();
        const activitiesCost = cart.reduce((sum, item) => sum + (item.price || 0), 0);
        const hotelCost = selectedHotel ? (selectedHotel.price || 0) * nights : 0;
        return activitiesCost + hotelCost;
      },

      getCostPerPerson: () => {
        const { members } = get();
        const total = get().getTotalCost();
        return Math.round(total / members);
      },

      getRemainingBudget: () => {
        const { budget, budgetType, members } = get();
        const totalBudget = budgetType === "per_person" ? budget * members : budget;
        return totalBudget - get().getTotalCost();
      },

      // Auto-save trip to backend
      autoSaveTrip: async () => {
        const state = get();
        const {
          sessionId,
          tripName,
          destination,
          members,
          budget,
          budgetType,
          dateRange,
          nights,
          selectedHotel,
          cart,
          budget: totalBudgetVal
        } = state;

        if (!destination) return;

        const totalBudget = budgetType === "total" ? budget : budget * members;
        const perPersonBudget = budgetType === "per_person" ? budget : Math.round(budget / members);
        const activitiesCost = cart.reduce((sum, item) => sum + (item.price || 0), 0);
        const hotelCost = selectedHotel ? (selectedHotel.price || 0) * nights : 0;
        const grandTotal = activitiesCost + hotelCost;

        try {
          await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/tripplans/autosave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              tripName,
              destination,
              members,
              budget,
              budgetType,
              dateRange,
              nights,
              hotel: selectedHotel ? {
                id: selectedHotel.id,
                name: selectedHotel.name,
                image: selectedHotel.image,
                price: selectedHotel.price
              } : null,
              activities: cart.map(item => ({
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price,
                duration: item.duration
              })),
              totalBudget,
              perPersonBudget,
              activitiesCost,
              hotelCost,
              grandTotal
            })
          });
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      },

      // Reset
      reset: () =>
        set({
          destination: null,
          members: 2,
          budget: 15000,
          dateRange: { start: null, end: null },
          selectedActivities: [],
          tripName: "",
          cart: [],
          selectedHotel: null,
          nights: 0,
          sessionId: Date.now().toString()
        }),
    }),
    { name: "luxe-trip-store" }
  )
);

export default useTripStore;