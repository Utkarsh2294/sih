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
    }),
    {
      name: 'vittsetu-storage', // name of the item in the storage (must be unique)
      // Only persist certain fields if needed. By default all are persisted.
    }
  )
);

export default useAppStore;
