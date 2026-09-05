import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CurrencyInput from './CurrencyInput';
import ChipSelector from './ChipSelector';
import Button from '../ui/Button';

export default function StepDetails({
  purpose,
  projectCost,
  courseFee,
  educationLocation,
  onChange,
  onNext,
  onBack,
}) {
  const { t } = useTranslation();

  const isBusinessOrVocational = purpose === 'business' || purpose === 'vocational';
  const isEducation = purpose === 'education';

  const eduLocationOptions = [
    { value: 'india', label: t('recommender.details.india', 'India') },
    { value: 'abroad', label: t('recommender.details.abroad', 'Abroad') },
  ];

  const handleUnknownCost = () => {
    onChange('projectCost', null);
  };

  const isNextDisabled = () => {
    if (isBusinessOrVocational) {
      return projectCost === undefined; // null is valid (don't know yet), number is valid
    }
    if (isEducation) {
      return !courseFee || !educationLocation;
    }
    return true;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isBusinessOrVocational
            ? t('recommender.details.projectCostTitle', 'What is your estimated project cost?')
            : t('recommender.details.educationTitle', 'Tell us about your course')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t('recommender.details.subtitle', 'This helps us find schemes that match your requirements.')}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        {isBusinessOrVocational && (
          <div className="space-y-6">
            <CurrencyInput
              value={projectCost || 10000}
              onChange={(val) => onChange('projectCost', val)}
              min={10000}
              max={5000000}
              step={10000}
              label={t('recommender.details.projectCostLabel', 'Project Cost')}
            />
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleUnknownCost}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  projectCost === null
                    ? 'bg-primary-50 border-primary-600 text-primary-700 dark:bg-primary-900/30 dark:border-primary-500 dark:text-primary-300'
                    : 'bg-transparent border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {t('recommender.details.unknownCost', "I don't have this yet")}
              </button>
            </div>
          </div>
        )}

        {isEducation && (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('recommender.details.studyLocation', 'Where will you be studying?')}
              </label>
              <ChipSelector
                options={eduLocationOptions}
                value={educationLocation}
                onChange={(val) => onChange('educationLocation', val)}
              />
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <CurrencyInput
                value={courseFee || 50000}
                onChange={(val) => onChange('courseFee', val)}
                min={50000}
                max={2500000}
                step={10000}
                label={t('recommender.details.courseFeeLabel', 'Estimated Course Fee')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between max-w-2xl mx-auto mt-8">
        <Button variant="outline" onClick={onBack} size="lg">
          {t('common.back', 'Back')}
        </Button>
        <Button onClick={onNext} disabled={isNextDisabled()} size="lg">
          {t('common.next', 'Next')}
        </Button>
      </div>
    </div>
  );
}

StepDetails.propTypes = {
  purpose: PropTypes.string,
  projectCost: PropTypes.number,
  courseFee: PropTypes.number,
  educationLocation: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
