import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Search, Calculator, MapPin, FileText } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, labelKey: 'layout.bottom_nav.home', defaultLabel: 'Home' },
  { path: '/scheme-recommender', icon: Search, labelKey: 'layout.bottom_nav.find_scheme', defaultLabel: 'Schemes' },
  { path: '/calculator', icon: Calculator, labelKey: 'layout.bottom_nav.calculator', defaultLabel: 'Calc' },
  { path: '/partner-locator', icon: MapPin, labelKey: 'layout.bottom_nav.find_partner', defaultLabel: 'Partners' },
  { path: '/applications', icon: FileText, labelKey: 'layout.bottom_nav.my_applications', defaultLabel: 'Apps' },
];

const BottomNav = () => {
  const { t } = useTranslation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] focus:outline-none focus:text-primary-600 dark:focus:text-primary-400 transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium leading-none">{t(item.labelKey, item.defaultLabel)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

BottomNav.propTypes = {};

export default BottomNav;
