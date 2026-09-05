import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';

import useAppStore from '../store/useAppStore';
import Stepper from '../components/ui/Stepper';
import StepPurpose from '../components/recommender/StepPurpose';
import StepDetails from '../components/recommender/StepDetails';
import StepIncome from '../components/recommender/StepIncome';
import StepCategory from '../components/recommender/StepCategory';
import StepDisability from '../components/recommender/StepDisability';
import RecommenderResults from '../components/recommender/RecommenderResults';
import { getEligibleSchemes } from '../engine/schemeRules';

export default function SchemeRecommender() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  
  const {
    setRecommenderInputs,
    setRecommenderResult,
    selectScheme,
    resetRecommender,
    recommenderInputs,
    recommenderResult,
  } = useAppStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [localInputs, setLocalInputs] = useState(recommenderInputs || {});

  // Steps configuration
  const steps = [
    { label: t('recommender.steps.purpose', 'Purpose') },
    { label: t('recommender.steps.details', 'Details') },
    { label: t('recommender.steps.income', 'Income') },
    { label: t('recommender.steps.category', 'Category') },
    { label: t('recommender.steps.disability', 'Disability') },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final step completed
      setRecommenderInputs(localInputs);
      const results = getEligibleSchemes(localInputs);
      setRecommenderResult(results);
      setCurrentStep(5); // 5 represents Results
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStartOver = () => {
    resetRecommender();
    setLocalInputs({});
    setCurrentStep(0);
  };

  const handleSelectScheme = (schemeId) => {
    selectScheme(schemeId);
    // Redirect to calculator or details depending on flow
    navigate('/calculator');
  };

  const updateInput = (key, value) => {
    setLocalInputs((prev) => ({ ...prev, [key]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepPurpose
            value={localInputs.purpose}
            onChange={(val) => updateInput('purpose', val)}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <StepDetails
            purpose={localInputs.purpose}
            projectCost={localInputs.projectCost}
            courseFee={localInputs.courseFee}
            educationLocation={localInputs.educationLocation}
            onChange={updateInput}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <StepIncome
            value={localInputs.income}
            onChange={(val) => updateInput('income', val)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepCategory
            value={localInputs.category}
            onChange={(val) => updateInput('category', val)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <StepDisability
            value={localInputs.disability}
            onChange={(val) => updateInput('disability', val)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <RecommenderResults
            inputs={localInputs}
            results={recommenderResult || []}
            onStartOver={handleStartOver}
            onSelectScheme={handleSelectScheme}
          />
        );
      default:
        return null;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : -20 },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Privacy Note */}
        {currentStep < 5 && (
          <div className="flex items-center justify-center mb-8 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 py-2 px-4 rounded-full w-fit mx-auto">
            <Shield size={16} className="mr-2 text-primary-500" />
            {t('recommender.privacyNote', 'This information is used only to check scheme eligibility and is not shared without your consent.')}
          </div>
        )}

        {/* Stepper */}
        {currentStep < 5 && (
          <div className="mb-12">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
