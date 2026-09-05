import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n'; // Initialize i18n
import useAppStore from './store/useAppStore';
import i18n from './i18n';

/**
 * Component to synchronize Zustand store state with DOM elements and i18n.
 * This runs outside of the main App tree re-renders, but ensures global
 * side effects like dark mode class, font scale CSS variables, and language changes apply.
 */
function StoreInitializer() {
  const theme = useAppStore((state) => state.theme);
  const fontScale = useAppStore((state) => state.fontScale);
  const language = useAppStore((state) => state.language);

  // Sync theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync font scale
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }, [fontScale]);

  // Sync language
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
      document.documentElement.lang = language;
    }
  }, [language]);

  return null;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreInitializer />
    <App />
  </React.StrictMode>
);
