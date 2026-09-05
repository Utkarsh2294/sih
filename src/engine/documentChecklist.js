import partners from '../data/partners.mock.json';

const schemeDocuments = {
  micro_finance: ['Identity proof', 'Address proof', 'Simple business plan'],
  term_loan: ['Identity proof', 'Address proof', 'Detailed project report', 'Bank statements'],
  education_loan_india: ['Identity proof', 'Admission letter', 'Course fee schedule'],
  education_loan_abroad: ['Identity proof', 'Admission letter', 'Course fee schedule', 'Passport and visa documents'],
  udyam_nidhi: ['Identity proof', 'Business plan', 'Udyam registration if available'],
  aajeevika_microfinance: ['Identity proof', 'Address proof', 'Livelihood activity details'],
  mahila_samridhi_yojana: ['Identity proof', 'Address proof', 'Women entrepreneur declaration'],
};
const partnerTypeAdditions = { SCA: ['Caste certificate'], PSB: ['Bank account proof'], RRB: ['Local residence proof'], 'NBFC-MFI': ['Group or community reference'] };

/** Data-driven combination of scheme requirements and a partner type's requirements. */
export const getRequiredDocuments = (schemeId, partnerId) => {
  const partner = partners.find((item) => item.id === partnerId);
  const names = [...(schemeDocuments[schemeId] || ['Identity proof']), ...(partner ? partnerTypeAdditions[partner.type] || [] : [])];
  return [...new Set(names)].map((name) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, status: 'pending' }));
};
