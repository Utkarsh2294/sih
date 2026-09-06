import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ShieldAlert, X } from 'lucide-react';

const AntiMiddlemanBanner = ({ className = '' }) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className={`rounded-2xl border border-accent-200 bg-accent-50 p-4 text-accent-950 shadow-sm dark:border-accent-800 dark:bg-accent-950/30 dark:text-accent-100 ${className}`}>
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="font-bold">This service is completely free.</p>
          <p className="mt-1 text-sm">Never pay anyone to submit your application. If someone asks for money, report it safely.</p>
          <Link className="mt-2 inline-flex text-sm font-bold underline" to="/profile?report=suspicious-agent">Report a suspicious agent</Link>
        </div>
        <button type="button" onClick={() => setDismissed(true)} className="rounded-full p-1 hover:bg-accent-100 focus:outline-none focus:ring-2 focus:ring-accent-600 dark:hover:bg-accent-900" aria-label="Dismiss safety message">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

AntiMiddlemanBanner.propTypes = {
  className: PropTypes.string,
};

export default AntiMiddlemanBanner;
