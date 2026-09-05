import useAppStore from '../store/useAppStore';

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const grant = async (type, purpose, dataTypes) => {
  await wait(450);
  const entry = { id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, purpose, dataTypes, grantedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(), revoked: false };
  useAppStore.getState().addConsent(entry);
  return entry;
};

export const requestAAConsent = (purpose, dataTypes) => grant('Account Aggregator', purpose, dataTypes);
export const requestDigiLockerPull = (documentTypes) => grant('DigiLocker', 'Verify documents for your selected application', documentTypes);
