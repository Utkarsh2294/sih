import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ChipSelector from './ChipSelector';
import Button from '../ui/Button';

export default function StepDisability({ value, onChange, onNext, onBack }) {
  const { t } = useTranslation();

  const options = [
    { value: 'yes', label: t('common.yes', 'Yes') },
    { value: 'no', label: t('common.no', 'No') },
    { value: 'prefer_not_to_say', label: t('common.preferNotToSay', 'Prefer not to say') },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('recommender.disability.title', 'Do you have a disability?')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t('recommender.disability.subtitle', 'Some schemes offer additional concessions for persons with disabilities')}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ChipSelector options={options} value={value} onChange={onChange} />
      </div>

      <div className="flex justify-center max-w-2xl mx-auto mt-4">
        <button
          type="button"
          onClick={() => {
            onChange('skip');
            onNext();
          }}
          className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline underline-offset-4"
        >
          {t('common.skipStep', 'Skip this step')}
        </button>
      </div>

      <div className="flex justify-between max-w-2xl mx-auto mt-8">
        <Button variant="outline" onClick={onBack} size="lg">
          {t('common.back', 'Back')}
        </Button>
        <Button onClick={onNext} disabled={!value} size="lg">
          {t('common.next', 'Next')}
        </Button>
      </div>
    </div>
  );
}

StepDisability.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
