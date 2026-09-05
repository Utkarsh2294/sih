import React from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Stepper = ({ steps, currentStep, onStepClick }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {/* Mobile Vertical Stepper (hidden on md+) */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <button
                  onClick={() => onStepClick && onStepClick(index)}
                  disabled={!onStepClick}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={t('step_aria_label', { step: index + 1, title: step.label, defaultValue: `Step ${index + 1}: ${step.label}` })}
                  className={`flex items-center justify-center w-8 h-8 rounded-full z-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                    isCompleted ? 'bg-primary-600 text-white' :
                    isCurrent ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-600 dark:bg-primary-900 dark:text-primary-300' :
                    'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" aria-hidden="true" /> : <span className="text-sm font-medium">{index + 1}</span>}
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-full min-h-[2rem] mt-2 ${isCompleted ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} aria-hidden="true" />
                )}
              </div>
              <div className="pb-4">
                <p className={`text-sm font-semibold ${isCurrent ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>{step.label}</p>
                {step.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Horizontal Stepper (hidden on mobile) */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="relative flex flex-col items-center flex-1">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="absolute top-4 left-1/2 w-full h-0.5 -z-10" aria-hidden="true">
                  <div className={`h-full ${isCompleted ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                </div>
              )}
              
              <button
                onClick={() => onStepClick && onStepClick(index)}
                disabled={!onStepClick}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={t('step_aria_label', { step: index + 1, title: step.label, defaultValue: `Step ${index + 1}: ${step.label}` })}
                className={`flex items-center justify-center w-8 h-8 rounded-full mb-2 bg-white dark:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                  isCompleted ? 'bg-primary-600 text-white' :
                  isCurrent ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-600 dark:bg-primary-900 dark:text-primary-300' :
                  'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" aria-hidden="true" /> : <span className="text-sm font-medium">{index + 1}</span>}
              </button>
              
              <div className="text-center px-2">
                <p className={`text-sm font-semibold ${isCurrent ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>{step.label}</p>
                {step.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func,
};

export default Stepper;
