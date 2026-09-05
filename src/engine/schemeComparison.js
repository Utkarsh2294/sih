import { formatINR } from '../utils/currency.js';

/** Normalizes editable scheme config into presentation rows for the comparison UI. */
export const buildComparisonRows = (schemes) => [
  { label: 'Maximum loan', values: schemes.map((scheme) => formatINR(scheme.maxLoanLimit)) },
  { label: 'Interest rate', values: schemes.map((scheme) => `${scheme.interestRateMin}%–${scheme.interestRateMax}%`) },
  { label: 'Moratorium', values: schemes.map((scheme) => `${scheme.moratoriumMinMonths}–${scheme.moratoriumMaxMonths} months`) },
  { label: 'Repayment tenure', values: schemes.map((scheme) => `${scheme.repaymentTenureMinMonths}–${scheme.repaymentTenureMaxMonths} months`) },
  { label: 'Own contribution', values: schemes.map((scheme) => `${scheme.ownContributionPercent}%`) },
];
