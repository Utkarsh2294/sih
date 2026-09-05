import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

const Applications = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={FileText}
        title={t('pages.applications.title', 'My Applications')}
        description={t('pages.applications.description', 'Phase 6 coming soon')}
      />
    </div>
  );
};

export default Applications;
