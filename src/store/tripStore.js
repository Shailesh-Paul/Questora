import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTripStore = create(
  persist(
    (set, get) => ({
      // Destination
      destination: null,
      setDestination: (dest) => set({ destination: dest }),

      // Trip config
      members: 2,
      setMembers: (n) => set({ members: n }),

      budget: 15000,
      setBudget: (b) => set({ budget: b }),

      budgetType: "per_person", // "per_person" | "total"
      setBudgetType: (t) => set({ budgetType: t }),

      dateRange: { start: null, end: null },
      setDateRange: (range) => set({ dateRange: range }),

      selectedActivities: [],
      toggleActivity: (activity) =>
        set((state) => ({
          selectedActivities: state.selectedActivities.includes(activity)
            ? state.selectedActivities.filter((a) => a !== activity)
            : [...state.selectedActivities, activity],
        })),

      tripName: "",
      setTripName: (name) => set({ tripName: name }),

      // Booking cart
      cart: [],
      addToCart: (item) =>
        set((state) => ({
          cart: state.cart.find((i) => i.id === item.id)
            ? state.cart
            : [...state.cart, item],
        })),
      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),

      // Computed
      getTotalCost: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + (item.price || 0), 0);
      },

      getCostPerPerson: () => {
        const { cart, members } = get();
        const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
        return Math.round(total / members);
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
        }),
    }),
    { name: "luxe-trip-store" }
  )
);

export default useTripStore;
