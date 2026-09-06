import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Search, Calculator, MapPin, FileText, BookOpen, User, BarChart3, BriefcaseBusiness } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const navItems = [
  { path: '/', icon: Home, labelKey: 'layout.sidebar.home', defaultLabel: 'Home' },
  { path: '/scheme-recommender', icon: Search, labelKey: 'layout.sidebar.find_scheme', defaultLabel: 'Find a Scheme' },
  { path: '/calculator', icon: Calculator, labelKey: 'layout.sidebar.calculator', defaultLabel: 'Calculator' },
  { path: '/partner-locator', icon: MapPin, labelKey: 'layout.sidebar.find_partner', defaultLabel: 'Find a Partner' },
  { path: '/applications', icon: FileText, labelKey: 'layout.sidebar.my_applications', defaultLabel: 'My Applications' },
];

const secondaryItems = [
  { path: '/vittgyan', icon: BookOpen, labelKey: 'layout.sidebar.vittgyan', defaultLabel: 'VittGyan' },
  { path: '/profile', icon: User, labelKey: 'layout.sidebar.profile', defaultLabel: 'Profile' },
];
const staffItems = [
  { path: '/partner-dashboard', icon: BriefcaseBusiness, labelKey: 'layout.sidebar.partner_dashboard', defaultLabel: 'Partner Dashboard', roles: ['partner'] },
  { path: '/policy-dashboard', icon: BarChart3, labelKey: 'layout.sidebar.policy_dashboard', defaultLabel: 'Policy Dashboard', roles: ['policy'] },
];

const Sidebar = () => {
  const { t } = useTranslation();
  const role = useAppStore((state) => state.role);

  const renderLinks = (items) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isActive
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-100 font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3 shrink-0" />
              <span className="truncate">{t(item.labelKey, item.defaultLabel)}</span>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
      <nav className="flex-1 px-4 py-6 space-y-8">
        <div>
          <div className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            {t('layout.sidebar.main_menu', 'Main Menu')}
          </div>
          {renderLinks(navItems)}
        </div>
        
        <div>
          <div className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            {t('layout.sidebar.more', 'More')}
          </div>
          {renderLinks(secondaryItems)}
        </div>
        {staffItems.some((item) => item.roles.includes(role)) && <div>
          <div className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Staff tools</div>
          {renderLinks(staffItems.filter((item) => item.roles.includes(role)))}
        </div>}
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {};

export default Sidebar;
