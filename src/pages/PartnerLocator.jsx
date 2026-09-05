import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

const PartnerLocator = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={MapPin}
        title={t('pages.partner_locator.title', 'Partner Locator')}
        description={t('pages.partner_locator.description', 'Phase 3 coming soon')}
      />
    </div>
  );
};

export default PartnerLocator;
