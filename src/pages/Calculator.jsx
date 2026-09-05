import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useAppStore from '../store/useAppStore';
import schemesConfig from '../data/schemes.config.json';
import { formatINR } from '../utils/currency';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SchemePicker from '../components/calculator/SchemePicker';
import EmiSummaryCard from '../components/calculator/EmiSummaryCard';
import AmortizationChart from '../components/calculator/AmortizationChart';
import AffordabilityBanner from '../components/calculator/AffordabilityBanner';
import StickyEmiBar from '../components/calculator/StickyEmiBar';
import { Link } from 'react-router-dom';

// Import engine functions (assuming they exist or will be provided)
import { 
  calculateEmi, 
  generateAmortizationSchedule, 
  checkAffordability, 
  getTotalInterest, 
  getTotalPayable 
} from '../engine/emiEngine';

const Calculator = () => {
  const { t } = useTranslation();
  
  // Store
  const recommenderInputs = useAppStore(state => state.recommenderInputs);
  const selectedSchemeId = useAppStore(state => state.selectedSchemeId);
  const selectScheme = useAppStore(state => state.selectScheme);
  
  // State
  const [projectCost, setProjectCost] = useState(100000);
  const [downPayment, setDownPayment] = useState(10000);
  const [tenure, setTenure] = useState(60);
  const [interestRate, setInterestRate] = useState(8);
  const [isScrolledPastCard, setIsScrolledPastCard] = useState(false);
  
  const summaryCardRef = useRef(null);

  // Derived state for the selected scheme
  const scheme = useMemo(() => {
    return schemesConfig.find(s => s.id === selectedSchemeId) || null;
  }, [selectedSchemeId]);

  // Initialization & bounds
  useEffect(() => {
    if (scheme) {
      const avgRate = (scheme.interestRateMin + scheme.interestRateMax) / 2;
      setInterestRate(avgRate);
      
      const newTenure = Math.max(scheme.repaymentTenureMinMonths, Math.min(tenure, scheme.repaymentTenureMaxMonths));
      setTenure(newTenure);

      if (recommenderInputs?.projectCost) {
        const cost = Math.min(recommenderInputs.projectCost, scheme.maxLoanLimit);
        setProjectCost(cost);
        setDownPayment(cost * (scheme.ownContributionPercent / 100));
      } else {
        const cost = Math.min(100000, scheme.maxLoanLimit);
        setProjectCost(cost);
        setDownPayment(cost * (scheme.ownContributionPercent / 100));
      }
    }
  }, [scheme, recommenderInputs]);

  // Observer for sticky bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolledPastCard(!entry.isIntersecting);
      },
      { root: null, threshold: 0 }
    );
    if (summaryCardRef.current) {
      observer.observe(summaryCardRef.current);
    }
    return () => {
      if (summaryCardRef.current) {
        observer.unobserve(summaryCardRef.current);
      }
    };
  }, []);

  // Handlers
  const handleSchemeSelect = (id) => {
    selectScheme(id);
  };

  const handleShare = () => {
    const text = encodeURIComponent(`My EMI for ${scheme?.name} is ${formatINR(emi)}/mo. Total payable: ${formatINR(totalPayable)}.`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculations
  const loanAmount = Math.max(0, projectCost - downPayment);
  
  const emi = useMemo(() => {
    if (loanAmount <= 0) return 0;
    const emiPayingMonths = tenure - (scheme?.moratoriumMinMonths || 0);
    return calculateEmi ? calculateEmi(loanAmount, interestRate, emiPayingMonths) : 0;
  }, [loanAmount, interestRate, tenure, scheme]);

  const schedule = useMemo(() => {
    if (loanAmount <= 0 || !generateAmortizationSchedule) return [];
    return generateAmortizationSchedule(
      loanAmount, 
      interestRate, 
      scheme?.moratoriumMinMonths || 0, 
      scheme?.moratoriumType || 'interest-accrued', 
      tenure - (scheme?.moratoriumMinMonths || 0)
    );
  }, [loanAmount, interestRate, scheme, tenure]);

  const totalInterest = schedule.length > 0 && getTotalInterest ? getTotalInterest(schedule) : 0;
  const totalPayable = schedule.length > 0 && getTotalPayable ? getTotalPayable(schedule) : loanAmount;
  
  const income = recommenderInputs?.annualFamilyIncome || 300000;
  const affordability = checkAffordability ? checkAffordability(emi, income / 12) : { level: 'ok', ratio: 0.2 };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('calculator.title', 'EMI Calculator')}</h1>
      
      {!scheme && (
        <SchemePicker 
          schemes={schemesConfig} 
          selectedSchemeId={selectedSchemeId} 
          onSelect={handleSchemeSelect} 
        />
      )}

      {scheme && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            <Card className="p-4 bg-primary-50/50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100">{scheme.name}</h2>
                <Button variant="outline" size="sm" onClick={() => selectScheme(null)}>Change</Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Max Loan: {formatINR(scheme.maxLoanLimit)} | Rate: {scheme.interestRateMin}% - {scheme.interestRateMax}%
              </p>
              {recommenderInputs?.projectCost && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  ✓ {t('calculator.prefilledNote', 'Pre-filled from your scheme recommendation')}
                </p>
              )}
            </Card>

            <Card className="p-6">
              <div className="space-y-6">
                
                {/* Project Cost Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Cost</label>
                    <input 
                      type="number" 
                      value={projectCost}
                      onChange={(e) => setProjectCost(Number(e.target.value))}
                      className="w-24 px-2 py-1 text-right border rounded bg-transparent dark:border-gray-700"
                    />
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={scheme.maxLoanLimit} 
                    step={5000}
                    value={projectCost}
                    onChange={(e) => setProjectCost(Number(e.target.value))}
                    className="w-full accent-primary-600"
                  />
                </div>

                {/* Down Payment Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Down Payment</label>
                    <input 
                      type="number" 
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-24 px-2 py-1 text-right border rounded bg-transparent dark:border-gray-700"
                    />
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={projectCost} 
                    step={1000}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full accent-primary-600"
                  />
                </div>

                {/* Tenure Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenure (Months)</label>
                    <input 
                      type="number" 
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-24 px-2 py-1 text-right border rounded bg-transparent dark:border-gray-700"
                    />
                  </div>
                  <input 
                    type="range" 
                    min={scheme.repaymentTenureMinMonths} 
                    max={scheme.repaymentTenureMaxMonths} 
                    step={6}
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full accent-primary-600"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Includes {scheme.moratoriumMinMonths} months moratorium ({scheme.moratoriumType})
                  </div>
                </div>

              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">{t('calculator.scheduleChart', 'Amortization Schedule')}</h3>
              <AmortizationChart schedule={schedule} moratoriumMonths={scheme.moratoriumMinMonths} />
            </Card>

          </div>

          <div className="space-y-6">
            <div ref={summaryCardRef}>
              <EmiSummaryCard 
                emi={emi} 
                totalInterest={totalInterest} 
                totalPayable={totalPayable} 
                loanAmount={loanAmount} 
              />
            </div>

            <AffordabilityBanner 
              level={affordability.level} 
              ratio={affordability.ratio} 
              income={income} 
            />
            <Card className="p-4 border-primary-200 bg-primary-50/60 dark:border-primary-800 dark:bg-primary-950/30">
              <p className="font-semibold text-primary-950 dark:text-primary-100">Verify income without hunting for paperwork</p>
              <p className="mt-1 text-sm text-primary-900 dark:text-primary-200">Share only the data you choose through the mocked Account Aggregator and DigiLocker flow.</p>
              <Link to="/consent" className="mt-3 inline-block text-sm font-bold text-primary-700 underline dark:text-primary-300">Verify in 10 seconds</Link>
            </Card>

            <div className="flex flex-col gap-3">
              <Button onClick={handleShare} className="w-full" variant="primary">
                {t('calculator.shareWa', 'Share via WhatsApp')}
              </Button>
              <Button onClick={handlePrint} className="w-full" variant="outline">
                {t('calculator.downloadPrint', 'Print Schedule')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {scheme && (
        <StickyEmiBar 
          emi={emi} 
          totalPayable={totalPayable} 
          isVisible={isScrolledPastCard} 
        />
      )}
    </div>
  );
};

export default Calculator;
