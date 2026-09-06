import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Bell, Landmark, Settings } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import useAppStore from '../../store/useAppStore';
import AccessibilityPanel from './AccessibilityPanel';
import DemoResetButton from '../DemoResetButton';

const Header = () => {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const notifications = useAppStore((state) => state.notifications);
  const markNotificationsRead = useAppStore((state) => state.markNotificationsRead);
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  const unread = notifications.filter((item) => !item.read).length;

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
          <div className="hidden lg:block"><DemoResetButton /></div>
          <label className="hidden items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 sm:flex">
            <span>View</span>
            <select value={role} onChange={(event) => setRole(event.target.value)} className="min-h-9 rounded-lg border border-slate-300 bg-white px-2 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-white" aria-label="Switch prototype role">
              <option value="citizen">Citizen</option>
              <option value="partner">Partner staff</option>
              <option value="policy">NSFDC policy</option>
            </select>
          </label>
          <ThemeToggle />
          <div className="relative">
            <button onClick={() => { setShowNotifications(!showNotifications); markNotificationsRead(); }} className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label="View notifications">
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {unread > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-accent-950">{unread}</span>}
            </button>
            {showNotifications && <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900"><p className="px-1 pb-2 text-sm font-bold dark:text-white">Updates</p>{notifications.length ? <div className="max-h-72 space-y-2 overflow-y-auto">{notifications.map((item) => <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200" key={item.id}>{item.text}<p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p></div>)}</div> : <p className="px-1 py-4 text-sm text-slate-500">No updates yet.</p>}</div>}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowAccessibility(!showAccessibility)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={t('layout.header.accessibility', 'Accessibility Settings')}
            >
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            {showAccessibility && <AccessibilityPanel onClose={() => setShowAccessibility(false)} />}
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {};

export default Header;
