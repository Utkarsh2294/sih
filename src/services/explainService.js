/**
 * Helper to format numbers in INR format.
 * @param {number} num 
 * @returns {string} formatted number string
 */
function formatINR(num) {
  if (num === null || num === undefined) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

/**
 * Generate a plain-language explanation for why a scheme was recommended.
 * 
 * @param {Object} inputs - same shape as getEligibleSchemes inputs
 * @param {Object} result - a single scheme result from getEligibleSchemes
 * @returns {string} plain-language explanation
 */
export function explainRecommendation(inputs, result) {
  const formattedIncome = formatINR(inputs.annualFamilyIncome);
  
  if (inputs.purpose === 'business') {
    const cost = inputs.projectCost;
    if (cost) {
      const formattedCost = formatINR(cost);
      if (result.schemeId === 'micro_finance') {
        return `You are eligible for the ${result.name} because your project cost of ${formattedCost} falls under the ₹1,40,000 limit and your family income of ${formattedIncome} is within the ₹5,00,000 ceiling.`;
      } else if (result.schemeId === 'term_loan') {
        return `You qualify for the ${result.name} as your project cost of ${formattedCost} is within the ₹50,00,000 limit and your family income is ${formattedIncome}.`;
      } else if (result.schemeId === 'mahila_samridhi_yojana') {
        return `As a female applicant with a project cost of ${formattedCost}, you are eligible for the ${result.name} offering concessional interest rates.`;
      } else if (result.schemeId === 'aajeevika_microfinance') {
         return `Your project cost of ${formattedCost} and income of ${formattedIncome} makes you eligible for the ${result.name}.`;
      } else if (result.schemeId === 'udyam_nidhi') {
         return `You are eligible for the ${result.name} with your business project cost of ${formattedCost}.`;
      }
      return `You are eligible for the ${result.name} based on your project cost of ${formattedCost} and family income of ${formattedIncome}.`;
    } else {
      return `You appear eligible for the ${result.name} based on your family income of ${formattedIncome}, pending project cost details.`;
    }
  } else if (inputs.purpose === 'education') {
    const fee = inputs.courseFee;
    const formattedFee = fee ? formatINR(fee) : '';
    const loc = inputs.educationLocation === 'india' ? 'India' : 'abroad';
    if (fee && inputs.educationLocation) {
      return `Based on your plan to study in ${loc} with a course fee of ${formattedFee} and family income of ${formattedIncome}, you qualify for the ${result.name} at ${result.interestRateMin}-${result.interestRateMax}% interest.`;
    }
    return `Based on your family income of ${formattedIncome} and education plans, you qualify for the ${result.name}.`;
  } else if (inputs.purpose === 'vocational') {
    return `Your family income of ${formattedIncome} qualifies you for the ${result.name} to pursue vocational training.`;
  }
  
  return `You are eligible for the ${result.name} based on your provided details.`;
}

/**
 * Generate an explanation of why no schemes matched (closest gap).
 * 
 * @param {Object} inputs 
 * @returns {string} explanation of why no schemes matched
 */
export function explainNoMatch(inputs) {
  const formattedIncome = formatINR(inputs.annualFamilyIncome);
  
  if (inputs.annualFamilyIncome > 500000) {
    return `Your annual family income of ${formattedIncome} is just above the ₹5,00,000 ceiling for these schemes.`;
  }
  
  if (inputs.purpose === 'business' && inputs.projectCost > 5000000) {
    const formattedCost = formatINR(inputs.projectCost);
    return `Your project cost of ${formattedCost} exceeds the maximum ₹50,00,000 limit for Term Loans.`;
  }
  
  return "Unfortunately, we couldn't find a matching scheme for your specific requirements at this time.";
}
