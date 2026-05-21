export const FEATURE_FLAGS = {
  ENABLE_RECOMMENDATION_ENGINE: import.meta.env.VITE_ENABLE_RECOMMENDATION_ENGINE !== 'false',
  ENABLE_AI_PLANNER: import.meta.env.VITE_ENABLE_AI_PLANNER !== 'false',
  ENABLE_RENTALS: import.meta.env.VITE_ENABLE_RENTALS !== 'false',
  ENABLE_ACTIVITIES: import.meta.env.VITE_ENABLE_ACTIVITIES !== 'false'
};
