import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../ui/SkeletonLoader';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import { explainRecommendation, explainNoMatch } from '../../services/explainService';
import ExplainabilityPanel from '../ExplainabilityPanel';

const SchemeCard = ({ scheme, inputs, onSelect, index }) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const explanation = explainRecommendation(inputs, scheme);

  const getBadgeColor = (confidence) => {
    switch (confidence) {
      case 'high': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getBadgeText = (confidence) => {
    switch (confidence) {
      case 'high': return t('recommender.results.bestMatch', 'Best Match');
      case 'medium': return t('recommender.results.alsoEligible', 'Also Eligible');
      default: return t('recommender.results.possibleMatch', 'Possible Match');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        delay: shouldReduceMotion ? 0 : index * 0.15,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="overflow-hidden border-2 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-3 ${getBadgeColor(scheme.confidence)}`}>
                {scheme.confidence === 'high' && <CheckCircle2 size={12} className="mr-1" />}
                {getBadgeText(scheme.confidence)}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t(scheme.nameKey, scheme.name)}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('recommender.results.loanLimit', 'Max Loan Limit')}</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {scheme.maxLoanLimit ? `₹${(scheme.maxLoanLimit/100000).toFixed(1)}L` : t('common.na', 'N/A')}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('recommender.results.interestRate', 'Interest Rate')}</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {scheme.interestRateMin}% - {scheme.interestRateMax}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('recommender.results.moratorium', 'Moratorium')}</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {scheme.moratoriumMinMonths}-{scheme.moratoriumMaxMonths} {t('common.months', 'months')}
              </p>
            </div>
            <div className="flex items-center justify-end">
              <Button onClick={() => onSelect(scheme.schemeId)} variant="primary" size="sm">
                {t('recommender.results.selectScheme', 'Select Scheme')}
              </Button>
            </div>
          </div>

          <div className="mt-4"><ExplainabilityPanel verdict="eligible" reasonText={explanation} /></div>
        </div>
      </Card>
    </motion.div>
  );
};

SchemeCard.propTypes = {
  scheme: PropTypes.object.isRequired,
  inputs: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default function RecommenderResults({ inputs, results, onStartOver, onSelectScheme }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial delay for better UX "thinking"
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <SkeletonLoader className="h-8 w-64 mx-auto mb-2" />
          <SkeletonLoader className="h-4 w-96 mx-auto" />
        </div>
        {[1, 2].map((i) => (
          <Card key={i} className="p-6">
            <SkeletonLoader className="h-6 w-1/3 mb-6" />
            <div className="grid grid-cols-4 gap-4 mb-4">
              <SkeletonLoader className="h-10 w-full" />
              <SkeletonLoader className="h-10 w-full" />
              <SkeletonLoader className="h-10 w-full" />
              <SkeletonLoader className="h-10 w-full" />
            </div>
            <SkeletonLoader className="h-4 w-1/4 mt-6" />
          </Card>
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <EmptyState
          title={t('recommender.results.noMatchTitle', 'No exact matches found')}
          description={explainNoMatch(inputs) || t('recommender.results.noMatchDesc', 'Based on your inputs, we couldn\'t find a scheme that perfectly matches your criteria. Try adjusting your requirements.')}
          action={
            <Button onClick={onStartOver} variant="primary" size="lg">
              {t('recommender.results.startOver', 'Start Over')}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10 animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {t('recommender.results.title', 'Recommended Schemes for You')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t('recommender.results.subtitle', 'Based on your profile and requirements, here are the government schemes you are eligible for.')}
        </p>
      </div>

      <div className="space-y-6">
        {results.map((scheme, index) => (
          <SchemeCard 
            key={scheme.schemeId} 
            scheme={scheme} 
            inputs={inputs} 
            onSelect={onSelectScheme} 
            index={index} 
          />
        ))}
      </div>

      <div className="mt-12 text-center border-t border-slate-200 dark:border-slate-800 pt-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {t('recommender.results.notSatisfied', 'Want to explore other options?')}
        </p>
        <Button onClick={onStartOver} variant="outline">
          {t('recommender.results.startOver', 'Start Over')}
        </Button>
        <Link className="ml-4 inline-block text-sm font-semibold text-primary-700 underline dark:text-primary-300" to={`/compare-schemes?ids=${results.map((scheme) => scheme.schemeId).join(',')}`}>Compare all eligible schemes</Link>
      </div>
    </div>
  );
}

RecommenderResults.propTypes = {
  inputs: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
  onStartOver: PropTypes.func.isRequired,
  onSelectScheme: PropTypes.func.isRequired,
};
