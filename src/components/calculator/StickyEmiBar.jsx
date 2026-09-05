import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatINR } from '../../utils/currency';

const StickyEmiBar = ({ emi, totalPayable, isVisible }) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? false : { y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={shouldReduceMotion ? false : { y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-[60px] left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-3 flex justify-between items-center md:hidden"
        >
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('calculator.emi')}</div>
            <div className="font-bold text-primary-700 dark:text-primary-300">{formatINR(emi)}<span className="text-xs font-normal">/mo</span></div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('calculator.total')}</div>
            <div className="font-semibold text-gray-800 dark:text-gray-200">{formatINR(totalPayable)}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

StickyEmiBar.propTypes = {
  emi: PropTypes.number.isRequired,
  totalPayable: PropTypes.number.isRequired,
  isVisible: PropTypes.bool.isRequired
};

export default StickyEmiBar;
