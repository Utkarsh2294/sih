import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="hidden md:block w-full py-4 px-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-1">
        <p className="font-medium text-gray-700 dark:text-gray-300">
          VittSetu - {t('layout.footer.tagline', 'Bridging the Financial Gap')}
        </p>
        <p className="text-xs">
          {t('layout.footer.disclaimer', 'This platform is for informational purposes. Terms and conditions apply.')}
        </p>
        <p className="text-xs">&copy; {year} VittSetu. {t('layout.footer.rights_reserved', 'All rights reserved.')}</p>
      </div>
    </footer>
  );
};

Footer.propTypes = {};

export default Footer;
