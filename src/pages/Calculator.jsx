import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator as CalculatorIcon } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

const Calculator = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={CalculatorIcon}
        title={t('pages.calculator.title', 'Financial Calculator')}
        description={t('pages.calculator.description', 'Phase 2 coming soon')}
      />
    </div>
  );
};

export default Calculator;
