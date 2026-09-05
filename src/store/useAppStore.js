import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      setLanguage: (lang) => set({ language: lang }),
      setFontScale: (scale) => set({ fontScale: scale }),

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
      selectPartnerForApplication: (partnerId, schemeId) => set({
        selectedPartnerId: partnerId,
        applicationSchemeId: schemeId,
        applicationStartedAt: null,
      }),
      applications: [],
      notifications: [],
      createApplication: ({ schemeId, partnerId, documents }) => {
        const now = new Date().toISOString(); const id = `APP-${Date.now().toString().slice(-7)}`;
        set((state) => ({ applications: [...state.applications, { id, schemeId, partnerId, stage: 'submitted', stageHistory: [{ stage: 'submitted', changedAt: now }], documents, grievances: [], createdAt: now }], notifications: [{ id: `note-${Date.now()}`, read: false, createdAt: now, text: `Your application ${id} was submitted.` }, ...state.notifications] }));
        return id;
      },
      advanceApplication: (id) => set((state) => {
        const stages = ['submitted', 'partner-review', 'verification', 'sanctioned', 'disbursed']; const application = state.applications.find((item) => item.id === id); const next = application && stages[stages.indexOf(application.stage) + 1]; if (!next) return state;
        const now = new Date().toISOString(); return { applications: state.applications.map((item) => item.id === id ? { ...item, stage: next, stageHistory: [...item.stageHistory, { stage: next, changedAt: now }] } : item), notifications: [{ id: `note-${Date.now()}`, read: false, createdAt: now, text: `Application ${id} moved to ${next.replace('-', ' ')}.` }, ...state.notifications] };
      }),
      updateDocument: (applicationId, documentId, status) => set((state) => ({ applications: state.applications.map((item) => item.id === applicationId ? { ...item, documents: item.documents.map((document) => document.id === documentId ? { ...document, status } : document) } : item) })),
      addGrievance: (applicationId, grievance) => set((state) => ({ applications: state.applications.map((item) => item.id === applicationId ? { ...item, grievances: [...item.grievances, grievance] } : item) })),
      markNotificationsRead: () => set((state) => ({ notifications: state.notifications.map((item) => ({ ...item, read: true })) })),

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
