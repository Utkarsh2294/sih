import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';

const AffordabilityBanner = ({ level, ratio, income }) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const config = {
    ok: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
      textKey: 'calculator.affordability.ok'
    },
    caution: {
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      textKey: 'calculator.affordability.caution'
    },
    high: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
      icon: <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400" />,
      textKey: 'calculator.affordability.high'
    }
  };

  const current = config[level] || config.ok;

  return (
    <motion.div 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start p-4 rounded-lg border ${current.color} mt-4`}
    >
      <div className="shrink-0 mr-3 mt-0.5">
        {current.icon}
      </div>
      <div>
        <p className="font-medium text-sm">{t(current.textKey)}</p>
        <p className="text-xs mt-1 opacity-80">
          {t('calculator.affordability.basedOnIncome', { ratio: Math.round(ratio * 100) })}
        </p>
      </div>
    </motion.div>
  );
};

AffordabilityBanner.propTypes = {
  level: PropTypes.oneOf(['ok', 'caution', 'high']).isRequired,
  ratio: PropTypes.number.isRequired,
  income: PropTypes.number
};

export default AffordabilityBanner;
