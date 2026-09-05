import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Landmark, Settings } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center space-x-2">
          <Landmark className="w-6 h-6 text-primary-700 dark:text-primary-400" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary-700 dark:text-primary-400 leading-tight">VittSetu</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-none">वित्त-सेतु</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={t('layout.header.accessibility', 'Accessibility Settings')}
          >
            <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {};

export default Header;
