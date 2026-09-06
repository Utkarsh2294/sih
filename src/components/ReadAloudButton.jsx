import React from 'react';
import PropTypes from 'prop-types';
import { Volume2 } from 'lucide-react';
import useTextToSpeech from '../hooks/useTextToSpeech';

const ReadAloudButton = ({ text, label = 'Read aloud' }) => {
  const { speak, isSpeaking } = useTextToSpeech(text);
  return (
    <button type="button" onClick={speak} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-primary-700 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-primary-300" aria-label={label} title={label}>
      <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
    </button>
  );
};

ReadAloudButton.propTypes = {
  text: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default ReadAloudButton;
