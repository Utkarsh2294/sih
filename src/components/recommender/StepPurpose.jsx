import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Briefcase, GraduationCap, Wrench } from 'lucide-react';
import ChipSelector from './ChipSelector';
import Button from '../ui/Button';

export default function StepPurpose({ value, onChange, onNext }) {
  const { t } = useTranslation();

  const options = [
    {
      value: 'business',
      label: t('recommender.purpose.business', 'Business/Micro-Enterprise'),
      icon: <Briefcase size={32} strokeWidth={1.5} />,
    },
    {
      value: 'education',
      label: t('recommender.purpose.education', 'Education'),
      icon: <GraduationCap size={32} strokeWidth={1.5} />,
    },
    {
      value: 'vocational',
      label: t('recommender.purpose.vocational', 'Vocational Training'),
      icon: <Wrench size={32} strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('recommender.purpose.title', 'What do you need funding for?')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t('recommender.purpose.subtitle', 'Select the primary purpose of your loan.')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <ChipSelector options={options} value={value} onChange={onChange} />
      </div>

      <div className="flex justify-end max-w-3xl mx-auto mt-8">
        <Button onClick={onNext} disabled={!value} size="lg">
          {t('common.next', 'Next')}
        </Button>
      </div>
    </div>
  );
}

StepPurpose.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
