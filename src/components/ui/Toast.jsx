import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from 'react-i18next';

const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" aria-hidden="true" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" aria-hidden="true" />;
    default:
      return <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" aria-hidden="true" />;
  }
};

ToastIcon.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
};

const ToastMessage = ({ toast, onRemove }) => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const animationProps = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.1 }
      }
    : {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
      };

  return (
    <motion.div
      layout={!prefersReducedMotion}
      {...animationProps}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      className="flex items-center w-full max-w-sm p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 pointer-events-auto"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700">
        <ToastIcon type={toast.type} />
      </div>
      <div className="ml-3 text-sm font-normal text-gray-800 dark:text-gray-200 flex-1">{toast.message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 focus-visible:outline-none"
        onClick={() => onRemove(toast.id)}
        aria-label={t('close_toast', { defaultValue: 'Close toast' })}
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    </motion.div>
  );
};

ToastMessage.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info']),
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center md:items-end justify-start md:justify-end p-4 pointer-events-none sm:p-6 sm:items-end md:bottom-0 md:top-auto top-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ToastContainer;
