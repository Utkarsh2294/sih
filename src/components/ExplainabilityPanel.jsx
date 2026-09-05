import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp, CircleCheck, CircleX, Info } from 'lucide-react';

const styles = { eligible: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100', 'not-eligible': 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100', 'lower-rank': 'border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-100' };
const ExplainabilityPanel = ({ verdict, reasonText, suggestion }) => {
  const [open, setOpen] = useState(false); const Icon = verdict === 'eligible' ? CircleCheck : verdict === 'not-eligible' ? CircleX : Info;
  return <div className={`rounded-xl border ${styles[verdict]}`}><button onClick={() => setOpen(!open)} className="flex w-full items-center gap-2 p-3 text-left text-sm font-semibold"><Icon className="h-5 w-5 shrink-0" />Why this result <span className="ml-auto">{open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span></button>{open && <div className="border-t border-current/15 px-3 pb-3 pt-2 text-sm"><p>{reasonText}</p>{suggestion && <p className="mt-2 font-medium">{suggestion}</p>}</div>}</div>;
};
ExplainabilityPanel.propTypes = { verdict: PropTypes.oneOf(['eligible', 'not-eligible', 'lower-rank']).isRequired, reasonText: PropTypes.string.isRequired, suggestion: PropTypes.string };
export default ExplainabilityPanel;
