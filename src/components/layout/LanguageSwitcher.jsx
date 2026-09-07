import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Search, Check, X } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const languages = [
  { code: 'as', label: 'Assamese (অসমীয়া)', short: 'AS' },
  { code: 'bn', label: 'Bengali (বাংলা)', short: 'BN' },
  { code: 'brx', label: 'Bodo (बड़ो)', short: 'BRX' },
  { code: 'doi', label: 'Dogri (डोगरी)', short: 'DOI' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'gu', label: 'Gujarati (ગુજરાતી)', short: 'GU' },
  { code: 'hi', label: 'Hindi (हिन्दी)', short: 'HI' },
  { code: 'kn', label: 'Kannada (ಕನ್ನಡ)', short: 'KN' },
  { code: 'ks', label: 'Kashmiri (कॉशुर)', short: 'KS' },
  { code: 'gom', label: 'Konkani (कोंकणी)', short: 'GOM' },
  { code: 'mai', label: 'Maithili (मैथिली)', short: 'MAI' },
  { code: 'ml', label: 'Malayalam (മലയാളം)', short: 'ML' },
  { code: 'mni', label: 'Manipuri (ꯃꯤꯇꯩꯂꯣꯟ)', short: 'MNI' },
  { code: 'mr', label: 'Marathi (मराठी)', short: 'MR' },
  { code: 'ne', label: 'Nepali (नेपाली)', short: 'NE' },
  { code: 'or', label: 'Odia (ଓଡ଼ିଆ)', short: 'OR' },
  { code: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)', short: 'PA' },
  { code: 'sa', label: 'Sanskrit (संस्कृतम्)', short: 'SA' },
  { code: 'sat', label: 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)', short: 'SAT' },
  { code: 'sd', label: 'Sindhi (سنڌي)', short: 'SD' },
  { code: 'ta', label: 'Tamil (தமிழ்)', short: 'TA' },
  { code: 'te', label: 'Telugu (తెలుగు)', short: 'TE' },
  { code: 'ur', label: 'Urdu (اردو)', short: 'UR' },
];

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearch('');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setIsOpen(false);
    setSearch('');
  };

  const currentLang = languages.find((l) => l.code === language) || languages.find((l) => l.code === 'en');

  const filteredLanguages = useMemo(() => {
    if (!search) return languages;
    const lowerSearch = search.toLowerCase();
    return languages.filter(
      (lang) =>
        lang.label.toLowerCase().includes(lowerSearch) ||
        lang.code.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label={t('layout.language_switcher.label', 'Switch Language')}
        aria-expanded={isOpen}
      >
        <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline-block">
          {currentLang?.short || 'EN'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 max-h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl z-50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('layout.language_switcher.search', 'Search language...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
                autoFocus
              />
            </div>
            <button onClick={() => setIsOpen(false)} className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="overflow-y-auto py-1 flex-1">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between ${
                      language === lang.code
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && <Check className="w-4 h-4" />}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-center text-gray-500 dark:text-gray-400">
                {t('layout.language_switcher.no_results', 'No languages found')}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
