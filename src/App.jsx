import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppShell from './components/layout/AppShell';
import EmptyState from './components/ui/EmptyState';
import { AlertTriangle } from 'lucide-react';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const SchemeRecommender = lazy(() => import('./pages/SchemeRecommender'));
const Calculator = lazy(() => import('./pages/Calculator'));
const PartnerLocator = lazy(() => import('./pages/PartnerLocator'));
const Applications = lazy(() => import('./pages/Applications'));
const VittGyan = lazy(() => import('./pages/VittGyan'));
const Profile = lazy(() => import('./pages/Profile'));
const ConsentFlow = lazy(() => import('./pages/ConsentFlow'));
const SchemeComparison = lazy(() => import('./pages/SchemeComparison'));
const PartnerReport = lazy(() => import('./pages/PartnerReport'));
const ApplicationTracker = lazy(() => import('./pages/ApplicationTracker'));

// Minimal skeleton loader for Suspense fallback
const SkeletonLoader = () => (
  <div className="w-full h-full min-h-[50vh] flex items-center justify-center p-8 animate-pulse">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    </div>
  </div>
);

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="h-full flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={AlertTriangle}
        title={t('common.not_found.title', 'Page Not Found')}
        description={t('common.not_found.desc', 'The page you are looking for does not exist or has been moved.')}
      />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SkeletonLoader />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/scheme-recommender" element={<SchemeRecommender />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/partner-locator" element={<PartnerLocator />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/:id" element={<ApplicationTracker />} />
            <Route path="/vittgyan" element={<VittGyan />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/consent" element={<ConsentFlow />} />
            <Route path="/compare-schemes" element={<SchemeComparison />} />
            <Route path="/partner-locator/:partnerId/report" element={<PartnerReport />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
