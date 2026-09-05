import React from 'react';
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

  const pageVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: shouldReduceMotion ? 0 : -10 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
  };

  return (
    <div 
      className={`flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}
      style={{ '--font-scale': fontScale, fontSize: 'calc(16px * var(--font-scale))' }}
    >
      <Header />
      
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
