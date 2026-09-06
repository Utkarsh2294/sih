import partners from './partners.mock.json';

const submittedAt = '2026-09-01T10:00:00.000Z';

export const demoApplications = [
  {
    id: 'APP-DEMO-01',
    schemeId: 'micro_finance',
    partnerId: 'mh-sca-pune',
    stage: 'verification',
    signed: true,
    createdAt: submittedAt,
    stageHistory: [
      { stage: 'pending-signature', changedAt: submittedAt },
      { stage: 'submitted', changedAt: '2026-09-01T10:08:00.000Z' },
      { stage: 'partner-review', changedAt: '2026-09-02T11:30:00.000Z' },
      { stage: 'verification', changedAt: '2026-09-04T15:20:00.000Z' }
    ],
    documents: [
      { id: 'identity', name: 'Identity proof', status: 'verified' },
      { id: 'caste', name: 'Caste certificate', status: 'verified' },
      { id: 'income', name: 'Income certificate', status: 'uploaded' },
      { id: 'project', name: 'Project estimate', status: 'pending' }
    ],
    grievances: [
      {
        id: 'GRV-DEMO-1',
        category: 'Delay',
        description: 'Applicant asked for clarity on income verification timing.',
        submittedAt: '2026-09-05T09:30:00.000Z',
        slaDays: 7,
        status: 'Open'
      }
    ]
  },
  {
    id: 'APP-DEMO-02',
    schemeId: 'term_loan',
    partnerId: 'pimpri-sca',
    stage: 'sanctioned',
    signed: true,
    createdAt: '2026-08-22T12:00:00.000Z',
    stageHistory: [
      { stage: 'pending-signature', changedAt: '2026-08-22T12:00:00.000Z' },
      { stage: 'submitted', changedAt: '2026-08-22T12:04:00.000Z' },
      { stage: 'partner-review', changedAt: '2026-08-24T10:00:00.000Z' },
      { stage: 'verification', changedAt: '2026-08-28T14:00:00.000Z' },
      { stage: 'sanctioned', changedAt: '2026-09-03T11:00:00.000Z' }
    ],
    documents: [
      { id: 'identity', name: 'Identity proof', status: 'verified' },
      { id: 'income', name: 'Income certificate', status: 'verified' },
      { id: 'quotation', name: 'Equipment quotation', status: 'verified' }
    ],
    grievances: []
  },
  {
    id: 'APP-DEMO-03',
    schemeId: 'education_loan_india',
    partnerId: 'andheri-education',
    stage: 'disbursed',
    signed: true,
    createdAt: '2026-08-05T09:00:00.000Z',
    stageHistory: [
      { stage: 'pending-signature', changedAt: '2026-08-05T09:00:00.000Z' },
      { stage: 'submitted', changedAt: '2026-08-05T09:03:00.000Z' },
      { stage: 'partner-review', changedAt: '2026-08-06T10:00:00.000Z' },
      { stage: 'verification', changedAt: '2026-08-09T13:00:00.000Z' },
      { stage: 'sanctioned', changedAt: '2026-08-13T15:00:00.000Z' },
      { stage: 'disbursed', changedAt: '2026-08-18T10:00:00.000Z' }
    ],
    documents: [
      { id: 'identity', name: 'Identity proof', status: 'verified' },
      { id: 'admission', name: 'Admission letter', status: 'verified' },
      { id: 'fee', name: 'Fee structure', status: 'verified' }
    ],
    grievances: []
  }
];

export const demoState = {
  role: 'citizen',
  partners,
  applications: demoApplications,
  recommenderInputs: {
    purpose: 'business',
    projectCost: 95000,
    annualFamilyIncome: 320000,
    applicantCategory: 'self-employed',
    hasDisability: 'no',
    gender: 'female',
    district: 'Pune'
  },
  recommenderResult: null,
  selectedSchemeId: 'micro_finance',
  selectedPartnerId: 'mh-sca-pune',
  applicationSchemeId: 'micro_finance',
  completedLessonIds: ['interest-rate-basics', 'avoid-middlemen'],
  currentStreakDays: 2,
  lastCompletedDate: '2026-09-06',
  fraudReports: [],
  queuedGrievances: [],
  notifications: [
    {
      id: 'note-demo-1',
      read: false,
      createdAt: '2026-09-06T09:30:00.000Z',
      text: 'Demo data is ready for the VittSetu walkthrough.'
    }
  ]
};
