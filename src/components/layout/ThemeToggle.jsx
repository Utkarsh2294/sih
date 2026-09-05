import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import useAppStore from '../../store/useAppStore';

const ThemeToggle = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useAppStore();
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label={theme === 'dark' ? t('layout.theme_toggle.light', 'Switch to Light Mode') : t('layout.theme_toggle.dark', 'Switch to Dark Mode')}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: shouldReduceMotion ? 0 : (theme === 'dark' ? 180 : 0),
          scale: shouldReduceMotion ? 1 : (theme === 'dark' ? 1 : 1)
        }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </motion.div>
    </button>
  );
};

ThemeToggle.propTypes = {};

export default ThemeToggle;
