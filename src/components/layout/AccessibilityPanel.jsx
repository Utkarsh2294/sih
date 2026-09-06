import React from 'react';
import PropTypes from 'prop-types';
import useAppStore from '../../store/useAppStore';
import Button from '../ui/Button';

const AccessibilityPanel = ({ onClose }) => {
  const fontScale = useAppStore((state) => state.fontScale);
  const setFontScale = useAppStore((state) => state.setFontScale);
  const highContrast = useAppStore((state) => state.highContrast);
  const setHighContrast = useAppStore((state) => state.setHighContrast);
  const dyslexiaFont = useAppStore((state) => state.dyslexiaFont);
  const setDyslexiaFont = useAppStore((state) => state.setDyslexiaFont);
  const reduceMotion = useAppStore((state) => state.reduceMotion);
  const setReduceMotion = useAppStore((state) => state.setReduceMotion);
  const ttsEnabled = useAppStore((state) => state.ttsEnabled);
  const setTtsEnabled = useAppStore((state) => state.setTtsEnabled);

  return (
    <div className="absolute right-0 mt-2 w-[min(92vw,360px)] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <h2 className="font-bold dark:text-white">Accessibility settings</h2>
      <div className="mt-4 space-y-4 text-sm">
        <label className="block font-semibold dark:text-slate-100">Text size<select value={fontScale} onChange={(event) => setFontScale(Number(event.target.value))} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white"><option value={1}>100%</option><option value={1.25}>125%</option><option value={1.5}>150%</option></select></label>
        {[[highContrast, setHighContrast, 'High contrast'], [dyslexiaFont, setDyslexiaFont, 'Readable font'], [reduceMotion, setReduceMotion, 'Reduce motion'], [ttsEnabled, setTtsEnabled, 'Read aloud controls']].map(([value, setter, label]) => <label key={label} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 font-semibold dark:bg-slate-800 dark:text-slate-100"><span>{label}</span><input type="checkbox" checked={value} onChange={(event) => setter(event.target.checked)} className="h-5 w-5 accent-primary-600" /></label>)}
      </div>
      <Button className="mt-4 w-full" variant="secondary" onClick={onClose}>Close</Button>
    </div>
  );
};

AccessibilityPanel.propTypes = { onClose: PropTypes.func.isRequired };
export default AccessibilityPanel;
