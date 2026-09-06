import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ToastContainer } from '../ui/Toast';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Footer from './Footer';
import useAppStore from '../../store/useAppStore';
import AssistantLauncher from '../assistant/AssistantLauncher';

const AppShell = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  
  // Safe defaults if store is not yet implemented
  const fontScale = useAppStore?.(state => state.fontScale) || 1;
  const theme = useAppStore?.(state => state.theme) || 'light';
  const highContrast = useAppStore((state) => state.highContrast);
  const dyslexiaFont = useAppStore((state) => state.dyslexiaFont);
  const reduceMotion = useAppStore((state) => state.reduceMotion);
  const isOnline = useAppStore((state) => state.isOnline);
  const offlineBannerDismissed = useAppStore((state) => state.offlineBannerDismissed);
  const setOnlineStatus = useAppStore((state) => state.setOnlineStatus);
  const dismissOfflineBanner = useAppStore((state) => state.dismissOfflineBanner);
  const flushQueuedGrievances = useAppStore((state) => state.flushQueuedGrievances);
  const [installPrompt, setInstallPrompt] = useState(null);

  const pageVariants = {
    initial: { opacity: 0, y: shouldReduceMotion || reduceMotion ? 0 : 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: shouldReduceMotion || reduceMotion ? 0 : -10 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
  };

  useEffect(() => {
    const online = () => { setOnlineStatus(true); flushQueuedGrievances(); };
    const offline = () => setOnlineStatus(false);
    const install = (event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    window.addEventListener('beforeinstallprompt', install);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
      window.removeEventListener('beforeinstallprompt', install);
    };
  }, [setOnlineStatus, flushQueuedGrievances]);

  return (
    <div 
      className={`flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''} ${highContrast ? 'contrast-more' : ''} ${dyslexiaFont ? 'font-readable' : ''}`}
      style={{ '--font-scale': fontScale, fontSize: 'calc(16px * var(--font-scale))' }}
    >
      <Header />
      {!isOnline && !offlineBannerDismissed && <div className="flex items-center justify-between gap-3 bg-accent-100 px-4 py-2 text-sm font-semibold text-accent-950 dark:bg-accent-900 dark:text-accent-50"><span>You are offline — showing saved data. Any grievance will be queued.</span><button type="button" onClick={dismissOfflineBanner} className="underline">Dismiss</button></div>}
      {installPrompt && <div className="border-b border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-950 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-100"><button type="button" onClick={() => { installPrompt.prompt(); setInstallPrompt(null); }} className="font-bold underline">Install VittSetu</button><span className="ml-2">for quicker offline access.</span></div>}
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col relative overflow-y-auto">
          <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
          
          <Footer />
        </main>
      </div>
      
      <BottomNav />
      <AssistantLauncher />
      
      <ToastContainer />
    </div>
  );
};

export default AppShell;
