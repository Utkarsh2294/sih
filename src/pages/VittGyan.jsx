import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

const VittGyan = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={BookOpen}
        title={t('pages.vittgyan.title', 'VittGyan Financial Literacy')}
        description={t('pages.vittgyan.description', 'Phase 7 coming soon')}
      />
    </div>
  );
};

export default VittGyan;
