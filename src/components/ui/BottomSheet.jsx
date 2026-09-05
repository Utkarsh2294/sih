import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

const BottomSheet = ({ isOpen, onClose, children, title, snapPoints }) => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus trap basic setup
      if (sheetRef.current) {
        const focusableElements = sheetRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length) {
          focusableElements[0].focus();
        } else {
          sheetRef.current.focus();
        }
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  const backdropVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  const sheetVariants = prefersReducedMotion
    ? { hidden: { y: '100%' }, visible: { y: 0 } }
    : { hidden: { y: '100%' }, visible: { y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } } };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={sheetRef}
            className="fixed inset-x-0 bottom-0 z-50 w-full bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl flex flex-col max-h-[85vh]"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            drag={prefersReducedMotion ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={prefersReducedMotion ? undefined : handleDragEnd}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'bottom-sheet-title' : undefined}
            tabIndex="-1"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing w-full" aria-hidden="true">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              {title && (
                <h2 id="bottom-sheet-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
              )}
              <button
                type="button"
                className="p-2 ml-auto text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                onClick={onClose}
                aria-label={t('close_sheet', { defaultValue: 'Close sheet' })}
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

BottomSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  snapPoints: PropTypes.arrayOf(PropTypes.number),
};

export default BottomSheet;
