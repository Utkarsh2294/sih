import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import seedPartners from '../data/partners.mock.json';

/**
 * Zustand store for VittSetu application state.
 * Uses slice pattern and persist middleware to save state to localStorage.
 * 
 * Example usage with shallow selector:
 * import { useShallow } from 'zustand/react/shallow'
 * 
 * const { theme, toggleTheme } = useAppStore(
 *   useShallow((state) => ({ theme: state.theme, toggleTheme: state.toggleTheme }))
 * )
 */
const useAppStore = create(
  persist(
    (set) => ({
      // --- UI Slice ---
      theme: 'light',
      language: 'en',
      fontScale: 1,
      role: 'citizen',
      showTrustSignals: true,
      isOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
      offlineBannerDismissed: false,
      highContrast: false,
      dyslexiaFont: false,
      reduceMotion: false,
      ttsEnabled: true,

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      setLanguage: (lang) => set({ language: lang }),
      setFontScale: (scale) => set({ fontScale: scale }),
      setRole: (role) => set({ role }),
      setShowTrustSignals: (showTrustSignals) => set({ showTrustSignals }),
      setOnlineStatus: (isOnline) => set({ isOnline, offlineBannerDismissed: isOnline ? false : undefined }),
      dismissOfflineBanner: () => set({ offlineBannerDismissed: true }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setDyslexiaFont: (dyslexiaFont) => set({ dyslexiaFont }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setTtsEnabled: (ttsEnabled) => set({ ttsEnabled }),

      // Assistant preferences (Phase 4)
      assistantMuted: false,
      setAssistantMuted: (assistantMuted) => set({ assistantMuted }),

      // --- User Slice ---
      name: null,
      isOnboarded: false,

      setUser: (name) => set({ name }),
      setOnboarded: (status) => set({ isOnboarded: status }),

      // --- Recommender Slice ---
      recommenderInputs: null,  // { purpose, projectCost, courseFee, educationLocation, annualFamilyIncome, applicantCategory, hasDisability, gender }
      recommenderResult: null,  // Array of scheme results from getEligibleSchemes
      recommenderCompletedAt: null,  // ISO timestamp
      selectedSchemeId: null,  // The scheme the user picked from results

      setRecommenderInputs: (inputs) => set({ recommenderInputs: inputs }),
      setRecommenderResult: (result) => set({ recommenderResult: result, recommenderCompletedAt: new Date().toISOString() }),
      selectScheme: (schemeId) => set({ selectedSchemeId: schemeId }),
      resetRecommender: () => set({ recommenderInputs: null, recommenderResult: null, recommenderCompletedAt: null, selectedSchemeId: null }),

      // --- Application Slice (Phase 3 hand-off; Phase 6 expands this) ---
      selectedPartnerId: null,
      applicationSchemeId: null,
      applicationStartedAt: null,
      partners: seedPartners,
      selectPartnerForApplication: (partnerId, schemeId) => set({
        selectedPartnerId: partnerId,
        applicationSchemeId: schemeId,
        applicationStartedAt: null,
      }),
      applications: [],
      notifications: [],
      queuedGrievances: [],
      createApplication: ({ schemeId, partnerId, documents }) => {
        const now = new Date().toISOString(); const id = `APP-${Date.now().toString().slice(-7)}`;
        set((state) => ({ applications: [...state.applications, { id, schemeId, partnerId, stage: 'pending-signature', stageHistory: [{ stage: 'pending-signature', changedAt: now }], documents, grievances: [], signed: false, createdAt: now }], notifications: [{ id: `note-${Date.now()}`, read: false, createdAt: now, text: `Your application ${id} was created and is waiting for demo e-Sign.` }, ...state.notifications] }));
        return id;
      },
      advanceApplication: (id) => set((state) => {
        const stages = ['pending-signature', 'submitted', 'partner-review', 'verification', 'sanctioned', 'disbursed']; const application = state.applications.find((item) => item.id === id); const next = application && stages[stages.indexOf(application.stage) + 1]; if (!next) return state;
        const now = new Date().toISOString(); return { applications: state.applications.map((item) => item.id === id ? { ...item, stage: next, stageHistory: [...item.stageHistory, { stage: next, changedAt: now }] } : item), notifications: [{ id: `note-${Date.now()}`, read: false, createdAt: now, text: `Application ${id} moved to ${next.replace('-', ' ')}.` }, ...state.notifications] };
      }),
      signApplication: (id) => set((state) => {
        const now = new Date().toISOString();
        return {
          applications: state.applications.map((item) => item.id === id ? { ...item, signed: true, stage: 'submitted', stageHistory: [...item.stageHistory, { stage: 'submitted', changedAt: now }] } : item),
          notifications: [{ id: `note-${Date.now()}`, read: false, createdAt: now, text: `Application ${id} was signed and submitted.` }, ...state.notifications],
        };
      }),
      updateDocument: (applicationId, documentId, status) => set((state) => ({ applications: state.applications.map((item) => item.id === applicationId ? { ...item, documents: item.documents.map((document) => document.id === documentId ? { ...document, status } : document) } : item) })),
      addGrievance: (applicationId, grievance) => set((state) => ({ applications: state.applications.map((item) => item.id === applicationId ? { ...item, grievances: [...item.grievances, grievance] } : item) })),
      queueGrievance: (applicationId, grievance) => set((state) => ({ queuedGrievances: [...state.queuedGrievances, { applicationId, grievance }] })),
      flushQueuedGrievances: () => set((state) => {
        if (!state.queuedGrievances.length) return state;
        const queued = state.queuedGrievances;
        return {
          queuedGrievances: [],
          applications: state.applications.map((item) => ({ ...item, grievances: [...item.grievances, ...queued.filter((entry) => entry.applicationId === item.id).map((entry) => ({ ...entry.grievance, status: 'Open' }))] })),
          notifications: [{ id: `note-${Date.now()}`, read: false, createdAt: new Date().toISOString(), text: 'Your offline grievance has now been sent.' }, ...state.notifications],
        };
      }),
      markNotificationsRead: () => set((state) => ({ notifications: state.notifications.map((item) => ({ ...item, read: true })) })),
      updatePartnerCapacity: (partnerId, capacityStatus) => set((state) => ({
        partners: state.partners.map((partner) => partner.id === partnerId ? { ...partner, healthSignal: { ...(partner.healthSignal || {}), capacityStatus } } : partner),
      })),

      // --- Engagement & safety slice (Phase 7) ---
      completedLessonIds: [],
      currentStreakDays: 0,
      lastCompletedDate: null,
      fraudReports: [],
      completeLesson: (lessonId) => set((state) => {
        if (state.completedLessonIds.includes(lessonId)) return state;
        const today = new Date().toISOString().slice(0, 10);
        const last = state.lastCompletedDate;
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const currentStreakDays = last === today ? state.currentStreakDays : last === yesterday ? state.currentStreakDays + 1 : 1;
        return { completedLessonIds: [...state.completedLessonIds, lessonId], currentStreakDays, lastCompletedDate: today };
      }),
      addFraudReport: (report) => {
        const id = `SAFE-${Date.now().toString().slice(-7)}`;
        set((state) => ({ fraudReports: [{ ...report, id, submittedAt: new Date().toISOString(), status: 'Review queued' }, ...state.fraudReports] }));
        return id;
      },

      // DPDP-style consent ledger (Phase 4). Real providers replace only the service adapter.
      consentHistory: [],
      addConsent: (entry) => set((state) => ({ consentHistory: [...state.consentHistory, entry] })),
      revokeConsent: (id) => set((state) => ({
        consentHistory: state.consentHistory.map((entry) => entry.id === id ? { ...entry, revoked: true } : entry),
      })),
    }),
    {
      name: 'vittsetu-storage', // name of the item in the storage (must be unique)
      // Only persist certain fields if needed. By default all are persisted.
    }
  )
);

export default useAppStore;
