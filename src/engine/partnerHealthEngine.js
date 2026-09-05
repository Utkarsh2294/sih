const TIERS = {
  recommended: { label: 'Recommended', colorToken: 'green' },
  available: { label: 'Available but further', colorToken: 'blue' },
  'low-capacity': { label: 'Currently low capacity', colorToken: 'amber' },
  unknown: { label: 'Capacity data not available', colorToken: 'gray' },
};

/** Converts only disclosed signals into a citizen-facing tier; it never invents a score. */
export const getPartnerHealthTier = (healthSignal) => {
  if (!healthSignal) return { tier: 'unknown', ...TIERS.unknown };
  if (healthSignal.capacityStatus === 'low') return { tier: 'low-capacity', ...TIERS['low-capacity'] };
  if (healthSignal.capacityStatus === 'high' || healthSignal.avgTurnaroundDays <= 9) {
    return { tier: 'recommended', ...TIERS.recommended };
  }
  if (healthSignal.capacityStatus === 'medium' || typeof healthSignal.avgTurnaroundDays === 'number') {
    return { tier: 'available', ...TIERS.available };
  }
  return { tier: 'unknown', ...TIERS.unknown };
};

export const healthTierMessage = (healthSignal, tier) => {
  if (tier === 'unknown') return 'Capacity data is not yet available for this partner. It is ranked by distance only.';
  if (tier === 'low-capacity') return 'This partner has reported low capacity right now. You may prefer another option if one is available.';
  if (healthSignal?.avgTurnaroundDays) return `Reported average turnaround: about ${healthSignal.avgTurnaroundDays} days.`;
  return 'This partner has reported availability for new applications.';
};
