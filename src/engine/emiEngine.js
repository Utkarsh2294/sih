/**
 * EMI Engine for VittSetu
 * Contains pure functions for financial calculations.
 */

/**
 * Calculates the monthly EMI for a loan.
 * @param {number} principal - The loan amount.
 * @param {number} annualRatePercent - The annual interest rate in percentage (e.g., 8.5 for 8.5%).
 * @param {number} emiPayingMonths - The number of months over which the EMI will be paid.
 * @returns {number} The calculated EMI, rounded to 2 decimal places.
 */
export const calculateEmi = (principal, annualRatePercent, emiPayingMonths) => {
  if (emiPayingMonths <= 0) return 0;
  if (annualRatePercent === 0) return parseFloat((principal / emiPayingMonths).toFixed(2));

  const r = annualRatePercent / 100 / 12;
  const n = emiPayingMonths;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  
  return parseFloat(emi.toFixed(2));
};

/**
 * Generates an amortization schedule.
 * @param {number} principal - Initial loan amount.
 * @param {number} annualRatePercent - Annual interest rate in percentage.
 * @param {number} moratoriumMonths - Number of months in the moratorium period.
 * @param {string} moratoriumType - 'capitalized' or 'interest-only'.
 * @param {number} emiPayingMonths - Number of months of standard EMI payments after moratorium.
 * @returns {Array} Array of monthly schedule objects.
 */
export const generateAmortizationSchedule = (principal, annualRatePercent, moratoriumMonths, moratoriumType, emiPayingMonths) => {
  const schedule = [];
  let currentBalance = principal;
  const monthlyRate = annualRatePercent / 100 / 12;
  
  // Handle Moratorium Period
  for (let m = 1; m <= moratoriumMonths; m++) {
    const interest = currentBalance * monthlyRate;
    let emiPaid = 0;
    let principalPaid = 0;
    
    if (moratoriumType === 'interest-only') {
      emiPaid = interest;
    } else {
      // capitalized
      currentBalance += interest;
    }
    
    schedule.push({
      month: m,
      openingBalance: currentBalance - (moratoriumType === 'capitalized' ? interest : 0),
      interest: interest,
      principalPaid: principalPaid,
      emiPaid: emiPaid,
      closingBalance: currentBalance,
      isMoratorium: true
    });
  }
  
  // Calculate standard EMI for the remaining term
  const emi = calculateEmi(currentBalance, annualRatePercent, emiPayingMonths);
  
  // Handle EMI Paying Period
  for (let m = 1; m <= emiPayingMonths; m++) {
    const interest = currentBalance * monthlyRate;
    let principalPaid = emi - interest;
    let closingBalance = currentBalance - principalPaid;
    let emiPaid = emi;
    
    // Adjust final month to clear any rounding discrepancies
    if (m === emiPayingMonths) {
      principalPaid = currentBalance;
      emiPaid = principalPaid + interest;
      closingBalance = 0;
    }
    
    schedule.push({
      month: moratoriumMonths + m,
      openingBalance: currentBalance,
      interest: interest,
      principalPaid: principalPaid,
      emiPaid: emiPaid,
      closingBalance: closingBalance,
      isMoratorium: false
    });
    
    currentBalance = closingBalance;
  }
  
  return schedule;
};

const EMI_TO_INCOME_OK_THRESHOLD = 0.30;
const EMI_TO_INCOME_CAUTION_THRESHOLD = 0.50;

/**
 * Checks the affordability of the EMI relative to monthly income.
 * @param {number} emi - The calculated monthly EMI.
 * @param {number} monthlyIncomeEstimate - The estimated monthly income.
 * @returns {Object} { level, ratio, message }
 */
export const checkAffordability = (emi, monthlyIncomeEstimate) => {
  if (!monthlyIncomeEstimate || monthlyIncomeEstimate <= 0) {
    return { level: 'ok', ratio: 0, message: 'affordability.ok' };
  }
  
  const ratio = emi / monthlyIncomeEstimate;
  const ratioPercent = parseFloat((ratio * 100).toFixed(1));
  
  if (ratio <= EMI_TO_INCOME_OK_THRESHOLD) {
    return { level: 'ok', ratio: ratioPercent, message: 'affordability.ok' };
  } else if (ratio <= EMI_TO_INCOME_CAUTION_THRESHOLD) {
    return { level: 'caution', ratio: ratioPercent, message: 'affordability.caution' };
  } else {
    return { level: 'high', ratio: ratioPercent, message: 'affordability.high' };
  }
};

/**
 * Sums total interest from the schedule.
 * @param {Array} schedule - Amortization schedule.
 * @returns {number} Total interest.
 */
export const getTotalInterest = (schedule) => {
  return schedule.reduce((sum, item) => sum + item.interest, 0);
};

/**
 * Sums total amount payable from the schedule.
 * @param {Array} schedule - Amortization schedule.
 * @returns {number} Total amount payable (total EMI paid).
 */
export const getTotalPayable = (schedule) => {
  return schedule.reduce((sum, item) => sum + item.emiPaid, 0);
};
