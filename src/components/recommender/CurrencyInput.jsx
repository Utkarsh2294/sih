import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function CurrencyInput({ value, onChange, min, max, step = 1000, label }) {
  const [inputValue, setInputValue] = useState('');

  const formatINR = (number) => {
    if (number === null || number === undefined || isNaN(number)) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    setInputValue(formatINR(value));
  }, [value]);

  const handleTextChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(e.target.value);
    
    if (rawValue) {
      const parsed = parseInt(rawValue, 10);
      // We don't restrict to max immediately on type to allow backspacing/editing,
      // but we update the parent with bounded values
      const bounded = Math.min(Math.max(parsed, min), max);
      onChange(bounded);
    } else {
      onChange(min);
    }
  };

  const handleTextBlur = () => {
    setInputValue(formatINR(value));
  };

  const handleSliderChange = (e) => {
    const newVal = parseInt(e.target.value, 10);
    onChange(newVal);
  };

  return (
    <div className="w-full space-y-4">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          className="w-full p-4 text-xl font-semibold text-center border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-primary-400"
          aria-label={label || 'Currency input'}
        />
      </div>
      <div className="px-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value || min}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600 dark:bg-slate-700 dark:accent-primary-500"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value || min}
          aria-label={`${label} slider`}
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
          <span>{formatINR(min)}</span>
          <span>{formatINR(max)}</span>
        </div>
      </div>
    </div>
  );
}

CurrencyInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  label: PropTypes.string,
};
