import schemes from '../data/schemes.config.json';

/**
 * PURE function rule engine to evaluate applicant eligibility for schemes.
 * 
 * @param {Object} inputs
 * @param {string} inputs.purpose - 'business' | 'education' | 'vocational'
 * @param {number|null} inputs.projectCost - in INR
 * @param {number|null} inputs.courseFee - in INR (for education)
 * @param {string|null} inputs.educationLocation - 'india' | 'abroad'
 * @param {number} inputs.annualFamilyIncome - in INR
 * @param {string} inputs.applicantCategory - 'self-employed' | 'salaried' | 'student'
 * @param {boolean|null} inputs.hasDisability
 * @param {string|null} inputs.gender - 'male' | 'female' | 'other'
 * @returns {Array<{schemeId, name, nameKey, matchReason, confidence, maxLoanLimit, interestRateMin, interestRateMax, moratoriumMinMonths, moratoriumMaxMonths}>}
 */
export function getEligibleSchemes(inputs) {
  const matches = [];

  // Filter schemes based on hard income limits first
  const eligibleSchemes = schemes.filter(scheme => inputs.annualFamilyIncome <= scheme.eligibilityIncomeCeiling);

  // If income exceeds the maximum limit for any scheme
  if (eligibleSchemes.length === 0) return matches;

  for (const scheme of eligibleSchemes) {
    if (!scheme.purposes.includes(inputs.purpose)) continue;

    let match = false;
    let confidence = 0;
    let matchReason = '';
    
    const cost = inputs.purpose === 'education' ? inputs.courseFee : inputs.projectCost;
    const isCostNull = cost === null || cost === undefined;

    if (inputs.purpose === 'business') {
      const costValidMin = scheme.minProjectCost === null || isCostNull || cost >= scheme.minProjectCost;
      const costValidMax = scheme.maxProjectCost === null || isCostNull || cost <= scheme.maxProjectCost;
      
      if (costValidMin && costValidMax) {
        // Evaluate specific scheme constraints like gender
        if (scheme.targetGender && scheme.targetGender !== inputs.gender) continue;
        
        match = true;
        confidence = isCostNull ? 0.6 : 1.0;
        matchReason = 'business_cost_match';
        
        // Lower confidence for secondary schemes like Udyam Nidhi for business
        if (scheme.id === 'udyam_nidhi') {
          confidence = isCostNull ? 0.5 : 0.8;
          matchReason = 'business_secondary_match';
        }
      }
    } else if (inputs.purpose === 'education') {
      if (scheme.educationSubType === inputs.educationLocation || (isCostNull && !inputs.educationLocation)) {
        match = true;
        confidence = (!inputs.educationLocation || isCostNull) ? 0.6 : 1.0;
        matchReason = 'education_location_match';
      }
    } else if (inputs.purpose === 'vocational') {
      if (scheme.id === 'udyam_nidhi') {
        const costValidMax = scheme.maxProjectCost === null || isCostNull || cost <= scheme.maxProjectCost;
        if (costValidMax) {
          match = true;
          confidence = isCostNull ? 0.6 : 1.0;
          matchReason = 'vocational_match';
        }
      }
    }

    if (match) {
      matches.push({
        schemeId: scheme.id,
        name: scheme.name,
        nameKey: scheme.nameKey,
        matchReason: matchReason,
        confidence: confidence,
        maxLoanLimit: scheme.maxLoanLimit,
        interestRateMin: scheme.interestRateMin,
        interestRateMax: scheme.interestRateMax,
        moratoriumMinMonths: scheme.moratoriumMinMonths,
        moratoriumMaxMonths: scheme.moratoriumMaxMonths,
        incompleteInputs: isCostNull,
        ownContributionPercent: scheme.ownContributionPercent
      });
    }
  }

  // Sort by confidence descending
  matches.sort((a, b) => b.confidence - a.confidence);

  return matches;
}
