/**
 * Test profiles for LinkedIn Outreach CRM
 * Realistic LinkedIn profiles for testing classification engine
 */

import { ProfileInput } from '../types/contact';

export const testProfiles: ProfileInput[] = [
  // Category 1: Junior/Associate roles
  {
    linkedInUrl: 'https://linkedin.com/in/john-smith-ap',
    firstName: 'John',
    lastName: 'Smith',
    currentJobTitle: 'Accounts Payable Associate',
    company: 'TechCorp Inc.',
    headline: 'Accounts Payable Associate at TechCorp | AP Automation Enthusiast',
    about: 'Recently graduated with accounting degree. Focused on AP processes and automation. Looking to streamline vendor payments and improve cash flow management.',
    location: 'New York, NY',
    userNotes: 'Great candidate for AP outreach - clear junior role',
  },
  {
    linkedInUrl: 'https://linkedin.com/in/sarah-jones-ar',
    firstName: 'Sarah',
    lastName: 'Jones',
    currentJobTitle: 'Accounts Receivable Executive',
    company: 'FinanceSolutions LLC',
    headline: 'AR Executive | Credit Management | Collections Specialist',
    about: 'Handling AR operations for mid-market clients. Specialized in credit analysis and collections. Implementing automated payment reminder systems.',
    location: 'Chicago, IL',
    userNotes: 'AR executive role - good for category 1',
  },
  {
    linkedInUrl: 'https://linkedin.com/in/mike-p2p',
    firstName: 'Mike',
    lastName: 'Chen',
    currentJobTitle: 'P2P Analyst',
    company: 'GlobalProcure Ltd.',
    headline: 'Procure-to-Pay Analyst | Procurement Operations | Vendor Management',
    about: 'Managing P2P lifecycle for IT procurement. Focus on vendor onboarding, purchase orders, and invoice processing. Implementing electronic invoicing system.',
    location: 'San Francisco, CA',
    userNotes: 'Clear P2P role - should classify well',
  },

  // Category 2: Senior/Leadership roles
  {
    linkedInUrl: 'https://linkedin.com/in/robert-finance-manager',
    firstName: 'Robert',
    lastName: 'Williams',
    currentJobTitle: 'Finance Manager',
    company: 'EnterpriseBank',
    headline: 'Finance Manager | FP&A | Budgeting & Forecasting',
    about: 'Leading finance team for commercial banking division. Responsible for budgeting, forecasting, and financial analysis. 10+ years in banking finance.',
    location: 'Charlotte, NC',
    userNotes: 'Finance Manager - clear leadership role',
  },
  {
    linkedInUrl: 'https://linkedin.com/in/lisa-ap-manager',
    firstName: 'Lisa',
    lastName: 'Garcia',
    currentJobTitle: 'AP Team Lead',
    company: 'ManufacturingCo',
    headline: 'Accounts Payable Team Lead | Process Improvement | AP Automation',
    about: 'Leading 5-person AP team handling $50M+ in monthly payments. Implemented robotic process automation reducing manual work by 40%.',
    location: 'Detroit, MI',
    userNotes: 'AP Team Lead - should be category 2',
  },
  {
    linkedInUrl: 'https://linkedin.com/in/david-r2r-supervisor',
    firstName: 'David',
    lastName: 'Brown',
    currentJobTitle: 'R2R Supervisor',
    company: 'HealthcareSystems Inc.',
    headline: 'Record-to-Report Supervisor | Month-end Close | Financial Reporting',
    about: 'Supervising R2R team for healthcare provider. Managing month-end close, financial reporting, and compliance. Implementing new ERP system.',
    location: 'Boston, MA',
    userNotes: 'R2R Supervisor - clear supervisory role',
  },

  // Category 3: HR/Recruiting roles
  {
    linkedInUrl: 'https://linkedin.com/in/amanda-hr-recruiter',
    firstName: 'Amanda',
    lastName: 'Taylor',
    currentJobTitle: 'HR Business Partner',
    company: 'FinanceFirst Bank',
    headline: 'HRBP | Talent Acquisition | Employee Relations',
    about: 'HR Business Partner supporting finance division. Focus on talent acquisition for accounting and finance roles. Managing recruitment pipeline.',
    location: 'New York, NY',
    userNotes: 'HRBP - clear category 3',
  },
  {
    linkedInUrl: 'https://linkedin.com/in/james-talent-acquisition',
    firstName: 'James',
    lastName: 'Miller',
    currentJobTitle: 'Talent Acquisition Specialist',
    company: 'FinTechStartup',
    headline: 'Talent Acquisition | Finance & Tech Recruitment | Campus Hiring',
    about: 'Recruiting for finance and tech roles at fast-growing FinTech. Specialized in entry-level and campus recruitment for finance operations.',
    location: 'Austin, TX',
    userNotes: 'Talent Acquisition - category 3',
  },
  {
    linkedInUrl: 'https://linkedin.com/in/emily-hiring-manager',
    firstName: 'Emily',
    lastName: 'Davis',
    currentJobTitle: 'Hiring Manager - Finance',
    company: 'CorporateConglomerate',
    headline: 'Hiring Manager | Finance Recruitment | Team Building',
    about: 'Responsible for hiring finance professionals across multiple business units. Building finance teams for new market expansions.',
    location: 'Atlanta, GA',
    userNotes: 'Hiring Manager finance - category 3',
  },

  // Manual Review candidates (ambiguous)
  {
    linkedInUrl: 'https://linkedin.com/in/tom-senior-associate',
    firstName: 'Tom',
    lastName: 'Wilson',
    currentJobTitle: 'Senior Associate - Finance',
    company: 'ConsultingFirm',
    headline: 'Senior Associate | Financial Consulting | Process Improvement',
    about: 'Senior finance consultant working on process improvement projects. Not a team lead but senior individual contributor.',
    location: 'Washington, DC',
    userNotes: 'Senior Associate - ambiguous, should go to manual review',
  },
  {
    linkedInUrl: 'https://linkedin.com/in/patricia-operations',
    firstName: 'Patricia',
    lastName: 'Martinez',
    currentJobTitle: 'Operations Manager',
    company: 'LogisticsCo',
    headline: 'Operations Manager | Supply Chain | Process Optimization',
    about: 'Managing warehouse operations and supply chain logistics. Not specifically finance but involves financial aspects.',
    location: 'Memphis, TN',
    userNotes: 'Operations Manager - might not be relevant, manual review',
  },

  // Not Relevant (outside target functions)
  {
    linkedInUrl: 'https://linkedin.com/in/alex-software-engineer',
    firstName: 'Alex',
    lastName: 'Johnson',
    currentJobTitle: 'Software Engineer',
    company: 'TechStartup',
    headline: 'Full Stack Developer | React | Node.js | Cloud Architecture',
    about: 'Building web applications and cloud infrastructure. Passionate about clean code and scalable systems.',
    location: 'Seattle, WA',
    userNotes: 'Software Engineer - not relevant',
  },
  {
    linkedInUrl: 'https://linkedin.com/in/jessica-marketing',
    firstName: 'Jessica',
    lastName: 'Lee',
    currentJobTitle: 'Marketing Manager',
    company: 'ConsumerBrand',
    headline: 'Marketing Manager | Digital Marketing | Brand Strategy',
    about: 'Leading marketing campaigns and brand strategy. Focus on customer acquisition and retention.',
    location: 'Los Angeles, CA',
    userNotes: 'Marketing - not relevant',
  },
];

/**
 * Expected classification results for test profiles
 */
export interface ExpectedClassification {
  isRelevant: boolean;
  function: string;
  category: string;
  confidence: string;
  needsManualReview: boolean;
}

export const expectedClassifications: ExpectedClassification[] = [
  // John Smith - AP Associate
  {
    isRelevant: true,
    function: 'ACCOUNTS_PAYABLE',
    category: 'CAT_1',
    confidence: 'HIGH',
    needsManualReview: false,
  },
  // Sarah Jones - AR Executive
  {
    isRelevant: true,
    function: 'ACCOUNTS_RECEIVABLE',
    category: 'CAT_1',
    confidence: 'HIGH',
    needsManualReview: false,
  },
  // Mike Chen - P2P Analyst
  {
    isRelevant: true,
    function: 'P2P',
    category: 'CAT_1',
    confidence: 'HIGH',
    needsManualReview: false,
  },
  // Robert Williams - Finance Manager
  {
    isRelevant: true,
    function: 'FINANCE',
    category: 'CAT_2',
    confidence: 'HIGH',
    needsManualReview: false,
  },
  // Lisa Garcia - AP Team Lead
  {
    isRelevant: true,
    function: 'ACCOUNTS_PAYABLE',
    category: 'CAT_2',
    confidence: 'HIGH',
    needsManualReview: false,
  },
  // David Brown - R2R Supervisor
  {
    isRelevant: true,
    function: 'R2R',
    category: 'CAT_2',
    confidence: 'HIGH',
    needsManualReview: false,
  },
  // Amanda Taylor - HRBP
  {
    isRelevant: true,
    function: 'HR',
    category: 'CAT_3',
    confidence: 'HIGH',
    needsManualReview: false,
  },
  // James Miller - Talent Acquisition
  {
    isRelevant: true,
    function: 'HR',
    category: 'CAT_3',
    confidence: 'HIGH',
    needsManualReview: false,
  },
  // Emily Davis - Hiring Manager Finance
  {
    isRelevant: true,
    function: 'HR',
    category: 'CAT_3',
    confidence: 'HIGH',
    needsManualReview: false,
  },
  // Tom Wilson - Senior Associate
  {
    isRelevant: true,
    function: 'FINANCE',
    category: 'MANUAL_REVIEW',
    confidence: 'LOW',
    needsManualReview: true,
  },
  // Patricia Martinez - Operations Manager
  {
    isRelevant: false, // Might be false or need manual review
    function: 'UNKNOWN',
    category: 'MANUAL_REVIEW',
    confidence: 'LOW',
    needsManualReview: true,
  },
  // Alex Johnson - Software Engineer
  {
    isRelevant: false,
    function: 'UNKNOWN',
    category: 'MANUAL_REVIEW',
    confidence: 'HIGH',
    needsManualReview: true,
  },
  // Jessica Lee - Marketing Manager
  {
    isRelevant: false,
    function: 'UNKNOWN',
    category: 'MANUAL_REVIEW',
    confidence: 'HIGH',
    needsManualReview: true,
  },
];

/**
 * Utility function to load test data into store
 */
export function getTestProfile(index: number): ProfileInput {
  if (index < 0 || index >= testProfiles.length) {
    throw new Error(`Invalid test profile index: ${index}`);
  }
  return testProfiles[index];
}

/**
 * Get all test profiles
 */
export function getAllTestProfiles(): ProfileInput[] {
  return [...testProfiles];
}

/**
 * Get test profiles by expected category
 */
export function getTestProfilesByCategory(category: string): ProfileInput[] {
  const indices = expectedClassifications
    .map((expected, index) => expected.category === category ? index : -1)
    .filter(index => index !== -1);
  
  return indices.map(index => testProfiles[index]);
}