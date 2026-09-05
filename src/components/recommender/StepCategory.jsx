import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Briefcase, Building2, GraduationCap } from 'lucide-react';
import ChipSelector from './ChipSelector';
import Button from '../ui/Button';

export default function StepCategory({ value, onChange, onNext, onBack }) {
  const { t } = useTranslation();

  const options = [
    {
      value: 'self-employed',
      label: t('recommender.category.selfEmployed', 'Self-Employed'),
      icon: <Briefcase size={28} strokeWidth={1.5} />,
    },
    {
      value: 'salaried',
      label: t('recommender.category.salaried', 'Salaried'),
      icon: <Building2 size={28} strokeWidth={1.5} />,
    },
    {
      value: 'student',
      label: t('recommender.category.student', 'Student'),
      icon: <GraduationCap size={28} strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('recommender.category.title', 'What best describes you?')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t('recommender.category.subtitle', 'Select your current primary occupation.')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <ChipSelector options={options} value={value} onChange={onChange} />
      </div>

      <div className="flex justify-between max-w-3xl mx-auto mt-8">
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

StepCategory.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
