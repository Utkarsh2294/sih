import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CurrencyInput from './CurrencyInput';
import Button from '../ui/Button';

export default function StepIncome({ value, onChange, onNext, onBack }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('recommender.income.title', 'What is your annual family income?')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t('recommender.income.subtitle', 'Many government schemes have income criteria for eligibility.')}
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <CurrencyInput
          value={value || 50000}
          onChange={onChange}
          min={50000}
          max={1000000}
          step={10000}
          label={t('recommender.income.label', 'Annual Income')}
        />
      </div>

      <div className="flex justify-between max-w-2xl mx-auto mt-8">
        <Button variant="outline" onClick={onBack} size="lg">
          {t('common.back', 'Back')}
        </Button>
        <Button onClick={onNext} disabled={value === undefined} size="lg">
          {t('common.next', 'Next')}
        </Button>
      </div>
    </div>
  );
}

StepIncome.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
