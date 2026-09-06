import React from 'react';
import PropTypes from 'prop-types';
import { ShieldCheck } from 'lucide-react';

const VerifiedPartnerBadge = ({ compact = false }) => (
  <span
    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:ring-emerald-800"
    title="Verified partner means VittSetu has marked this branch as an authorised channel in the prototype data."
  >
    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
    {compact ? 'Verified' : 'Verified Partner'}
  </span>
);

VerifiedPartnerBadge.propTypes = {
  compact: PropTypes.bool,
};

export default VerifiedPartnerBadge;
