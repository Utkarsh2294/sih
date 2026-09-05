import React from 'react';
import PropTypes from 'prop-types';

const ProgressRing = ({ value, label, size = 92 }) => {
  const radius = 38; const circumference = 2 * Math.PI * radius; const offset = circumference - (Math.max(0, Math.min(value, 100)) / 100) * circumference;
  return <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} aria-label={`${label}: ${Math.round(value)}%`}><svg className="-rotate-90" width={size} height={size} viewBox="0 0 92 92"><circle cx="46" cy="46" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" /><circle cx="46" cy="46" r={radius} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-primary-600" strokeDasharray={circumference} strokeDashoffset={offset} /></svg><span className="absolute text-xs font-bold text-slate-800 dark:text-slate-100">{label}</span></div>;
};
ProgressRing.propTypes = { value: PropTypes.number.isRequired, label: PropTypes.string.isRequired, size: PropTypes.number };
export default ProgressRing;
