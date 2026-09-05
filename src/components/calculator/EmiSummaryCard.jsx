import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatINR } from '../../utils/currency';
import Card from '../ui/Card';

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }
    
    // Simple count animation
    const duration = 500;
    const start = displayValue;
    const end = value;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, shouldReduceMotion]);

  return <span>{formatINR(displayValue)}</span>;
};

const EmiSummaryCard = ({ emi, totalInterest, totalPayable, loanAmount }) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800 overflow-hidden relative p-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('calculator.estimatedEmi')}</h3>
        <div className="text-4xl md:text-5xl font-bold text-primary-700 dark:text-primary-300 mb-6">
          <AnimatedNumber value={emi} />
          <span className="text-lg text-gray-500 dark:text-gray-400 ml-1 font-normal">/mo</span>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-primary-200 dark:border-primary-800 pt-6 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('calculator.loanAmount')}</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{formatINR(loanAmount)}</span>
          </div>
          <div className="flex flex-col items-center border-l border-primary-200 dark:border-primary-800 pl-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('calculator.totalInterest')}</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{formatINR(totalInterest)}</span>
          </div>
          <div className="flex flex-col items-center border-l border-primary-200 dark:border-primary-800 pl-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('calculator.totalPayable')}</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{formatINR(totalPayable)}</span>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};

EmiSummaryCard.propTypes = {
  emi: PropTypes.number.isRequired,
  totalInterest: PropTypes.number.isRequired,
  totalPayable: PropTypes.number.isRequired,
  loanAmount: PropTypes.number.isRequired
};

export default EmiSummaryCard;
