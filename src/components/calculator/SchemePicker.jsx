import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { formatINR } from '../../utils/currency';
import Card from '../ui/Card';

const SchemePicker = ({ schemes, selectedSchemeId, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <label htmlFor="scheme-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('calculator.selectScheme')}
      </label>
      <select
        id="scheme-select"
        value={selectedSchemeId || ''}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
      >
        <option value="" disabled>{t('calculator.chooseScheme')}</option>
        {schemes.map(scheme => (
          <option key={scheme.id} value={scheme.id}>
            {scheme.name} - {formatINR(scheme.maxLoanLimit)} Limit ({scheme.interestRateMin}% - {scheme.interestRateMax}%)
          </option>
        ))}
      </select>
    </div>
  );
};

SchemePicker.propTypes = {
  schemes: PropTypes.array.isRequired,
  selectedSchemeId: PropTypes.string,
  onSelect: PropTypes.func.isRequired
};

export default SchemePicker;
