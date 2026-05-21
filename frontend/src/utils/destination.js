export const normalizeDestinationKey = (value) =>
  (value || '').toString().trim().toLowerCase();

export const mapDbToFrontendDestination = (dbDest) => {
  const city = dbDest?.city || dbDest?.name;
  return {
    id: dbDest?._id || dbDest?.id || normalizeDestinationKey(city),
    name: city,
    city,
    state: dbDest?.state || 'India',
    image: dbDest?.heroImage || dbDest?.image,
    heroImage: dbDest?.heroImage || dbDest?.image,
    tagline: dbDest?.tagline,
    crowdLevel: dbDest?.crowdLevel,
    tag: dbDest?.category || dbDest?.tag,
    category: dbDest?.category || dbDest?.tag,
    trendingScore: dbDest?.trendingScore,
    coordinates: dbDest?.coordinates,
    bestSeason: dbDest?.bestSeason,
    averageStayCost: dbDest?.averageStayCost,
    averageFoodCost: dbDest?.averageFoodCost,
    averageTransportCost: dbDest?.averageTransportCost,
    rating: dbDest?.rating,
  };
};

export const findDestinationMatch = (destinations, query) => {
  const key = normalizeDestinationKey(query);
  if (!key) return null;

  return destinations.find((dest) => {
    const candidates = [dest.id, dest._id, dest.name, dest.city].map(normalizeDestinationKey);
    return candidates.includes(key);
  });
};
