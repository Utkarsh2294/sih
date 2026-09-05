import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Home as HomeIcon, Search, Calculator, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const Home = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  const quickActions = [
    {
      title: t('home.quick_actions.schemes.title', 'Find a Scheme'),
      description: t('home.quick_actions.schemes.desc', 'Discover government schemes tailored for you.'),
      icon: Search,
      path: '/scheme-recommender',
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-50 dark:bg-primary-900/30',
    },
    {
      title: t('home.quick_actions.calculator.title', 'Calculator'),
      description: t('home.quick_actions.calculator.desc', 'Calculate your financial benefits and EMIs.'),
      icon: Calculator,
      path: '/calculator',
      color: 'text-accent-600 dark:text-accent-400',
      bg: 'bg-accent-50 dark:bg-accent-900/30',
    },
    {
      title: t('home.quick_actions.partner.title', 'Find a Partner'),
      description: t('home.quick_actions.partner.desc', 'Locate nearby CSCs and banks.'),
      icon: MapPin,
      path: '/partner-locator',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/30',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="text-center md:text-left space-y-4 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
          <HomeIcon className="w-8 h-8 text-primary-700 dark:text-primary-300" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          {t('home.welcome.title', 'Welcome to VittSetu')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          {t('home.welcome.description', 'Your unified platform for discovering government schemes, financial literacy, and seamless access to financial services.')}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 px-2">
          {t('home.quick_actions.heading', 'Quick Actions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div key={action.path} variants={itemVariants}>
                <Link to={action.path} className="block h-full group focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl">
                  {/* Using Card component for layout */}
                  <div className="h-full hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-start bg-white dark:bg-gray-800 rounded-xl">
                    <div className={`p-3 rounded-lg mb-4 ${action.bg}`}>
                      <Icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                      {action.description}
                    </p>
                    <div className="flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 mt-auto">
                      {t('common.get_started', 'Get Started')}
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
