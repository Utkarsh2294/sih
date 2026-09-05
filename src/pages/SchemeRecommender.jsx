import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

const SchemeRecommender = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={Search}
        title={t('pages.scheme_recommender.title', 'Smart Scheme Recommender')}
        description={t('pages.scheme_recommender.description', 'Phase 1 coming soon')}
      />
    </div>
  );
};

export default SchemeRecommender;
