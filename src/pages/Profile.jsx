import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

const Profile = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={User}
        title={t('pages.profile.title', 'Your Profile')}
        description={t('pages.profile.description', 'Coming soon')}
      />
    </div>
  );
};

export default Profile;
