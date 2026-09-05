import { getPartnerHealthTier } from './partnerHealthEngine.js';

const EARTH_RADIUS_KM = 6371;
const toRadians = (value) => (value * Math.PI) / 180;

export const haversineDistanceKm = (from, to) => {
  const latDelta = toRadians(to.latitude - from.latitude);
  const lonDelta = toRadians(to.longitude - from.longitude);
  const a = Math.sin(latDelta / 2) ** 2 + Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(lonDelta / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const priority = { recommended: 0, available: 1, unknown: 2, 'low-capacity': 3 };

export const rankPartners = (partners, userLocation, selectedSchemeId) => partners
  .filter((partner) => partner.authorizedSchemeIds.includes(selectedSchemeId))
  .map((partner) => {
    const health = getPartnerHealthTier(partner.healthSignal);
    return { ...partner, health, distanceKm: haversineDistanceKm(userLocation, partner) };
  })
  .sort((a, b) => priority[a.health.tier] - priority[b.health.tier] || a.distanceKm - b.distanceKm);
