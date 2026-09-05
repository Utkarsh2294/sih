import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function ChipSelector({ options, value, onChange, multiple = false }) {
  const { t } = useTranslation();

  const handleKeyDown = (e, optValue) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(optValue);
    }
  };

  const handleClick = (optValue) => {
    if (multiple) {
      const newValue = Array.isArray(value) ? [...value] : [];
      if (newValue.includes(optValue)) {
        onChange(newValue.filter((v) => v !== optValue));
      } else {
        onChange([...newValue, optValue]);
      }
    } else {
      onChange(optValue);
    }
  };

  const isSelected = (optValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optValue);
    }
    return value === optValue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {options.map((option) => {
        const selected = isSelected(option.value);
        return (
          <div
            key={option.value}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(option.value)}
            onKeyDown={(e) => handleKeyDown(e, option.value)}
            aria-pressed={selected}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all cursor-pointer min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
              selected
                ? 'border-primary-600 bg-primary-50 text-primary-900 dark:border-primary-500 dark:bg-primary-900/30 dark:text-primary-100'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700/50'
            }`}
          >
            {option.icon && (
              <div className={`mb-3 ${selected ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {option.icon}
              </div>
            )}
            <span className={`text-center font-medium ${selected ? 'font-semibold' : ''}`}>
              {option.label}
            </span>
            {option.description && (
              <span className="text-xs text-center mt-1 text-slate-500 dark:text-slate-400">
                {option.description}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

ChipSelector.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      description: PropTypes.string,
    })
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
};
