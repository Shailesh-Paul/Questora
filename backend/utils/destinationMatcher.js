const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeDestinationKey = (value) =>
  (value || '').toString().trim().toLowerCase();

const buildDestinationRegex = (destination) => {
  const safe = escapeRegex((destination || '').trim());
  return new RegExp(`^${safe}$`, 'i');
};

const buildDestinationWordRegex = (destination) => {
  const safe = escapeRegex((destination || '').trim());
  return new RegExp(`\\b${safe}\\b`, 'i');
};

module.exports = {
  escapeRegex,
  normalizeDestinationKey,
  buildDestinationRegex,
  buildDestinationWordRegex,
};
