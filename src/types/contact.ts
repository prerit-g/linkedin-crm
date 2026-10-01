// ─── Status & Classification Enums ───────────────────────────────────────────

export type ContactStatus =
  | 'NEW'
  | 'REVIEW_REQUIRED'
  | 'MESSAGE_READY'
  | 'APPROVED'
  | 'CONTACTED'
  | 'REPLIED'
  | 'FOLLOW_UP'
  | 'NO_RESPONSE'
  | 'NOT_RELEVANT'
  | 'REJECTED';

export type Category =
  | 'CAT_1'           // Associate / Executive / Junior Professional
  | 'CAT_2'           // Senior / Team Lead / Manager / Supervisor
  | 'CAT_3'           // HR / Recruiting / Hiring
  | 'MANUAL_REVIEW';  // Cannot be auto-classified with confidence

export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type ContactFunction =
  | 'ACCOUNTS_PAYABLE'
  | 'ACCOUNTS_RECEIVABLE'
  | 'P2P'
  | 'O2C'
  | 'R2R'
  | 'ACCOUNTING'
  | 'FINANCE_OPERATIONS'
  | 'FINANCE'
  | 'FINTECH'
  | 'HR'
  | 'UNKNOWN';

export type MessageStatus = 'NONE' | 'DRAFT' | 'READY' | 'APPROVED' | 'SENT';

export type ResponseStatus = 'NONE' | 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// ─── Human-readable label maps ────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<Category, string> = {
  CAT_1: 'Category 1',
  CAT_2: 'Category 2',
  CAT_3: 'Category 3',
  MANUAL_REVIEW: 'Manual Review',
};

export const CATEGORY_SHORT_LABELS: Record<Category, string> = {
  CAT_1: 'Cat 1',
  CAT_2: 'Cat 2',
  CAT_3: 'Cat 3',
  MANUAL_REVIEW: 'Review',
};

export const FUNCTION_LABELS: Record<ContactFunction, string> = {
  ACCOUNTS_PAYABLE: 'Accounts Payable',
  ACCOUNTS_RECEIVABLE: 'Accounts Receivable',
  P2P: 'P2P',
  O2C: 'O2C',
  R2R: 'R2R',
  ACCOUNTING: 'Accounting',
  FINANCE_OPERATIONS: 'Finance Operations',
  FINANCE: 'Finance',
  FINTECH: 'FinTech',
  HR: 'HR',
  UNKNOWN: 'Unknown',
};

export const STATUS_LABELS: Record<ContactStatus, string> = {
  NEW: 'New',
  REVIEW_REQUIRED: 'Review Required',
  MESSAGE_READY: 'Message Ready',
  APPROVED: 'Approved',
  CONTACTED: 'Contacted',
  REPLIED: 'Replied',
  FOLLOW_UP: 'Follow-Up',
  NO_RESPONSE: 'No Response',
  NOT_RELEVANT: 'Not Relevant',
  REJECTED: 'Rejected',
};

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const RESPONSE_STATUS_LABELS: Record<ResponseStatus, string> = {
  NONE: 'None',
  POSITIVE: 'Positive',
  NEGATIVE: 'Negative',
  NEUTRAL: 'Neutral',
};

// ─── Core Interfaces ──────────────────────────────────────────────────────────

/**
 * The full Contact record stored in the CRM.
 * All optional string fields default to '' (empty string) rather than undefined
 * to simplify store logic and rendering.
 */
export interface Contact {
  // Identity
  id: string;                    // UUID (crypto.randomUUID)
  firstName: string;
  lastName: string;
  fullName: string;              // firstName + ' ' + lastName (computed on creation)
  linkedInUrl: string;           // PRIMARY UNIQUE KEY — validated linkedin.com/in/ URL

  // Profile
  currentJobTitle: string;
  company: string;
  headline: string;              // optional — pasted from LinkedIn
  about: string;                 // optional — pasted from LinkedIn
  location: string;              // optional
  industry: string;              // optional
  previousCompany: string;       // optional
  relevantSkills: string[];
  tags: string[];
  hiringIndicator: boolean;      // true ONLY if profile explicitly states hiring activity
  referralIndicator: boolean;    // true ONLY if referral info explicitly present

  // Classification
  isRelevant: boolean;
  function: ContactFunction;
  seniority: string;             // e.g. 'Junior' | 'Senior' | 'Manager' | 'Associate'
  category: Category;
  confidence: Confidence;
  classificationReason: string;  // human-readable explanation
  personalizationNotes: string;  // optional notes for message generation

  // Message
  generatedMessage: string;
  messageStatus: MessageStatus;

  // Workflow
  status: ContactStatus;
  reviewStatus: ReviewStatus;

  // Tracking
  contactedDate: string;         // ISO date string | ''
  responseStatus: ResponseStatus;
  followUpDate: string;          // ISO date string | ''
  userNotes: string;

  // Metadata
  createdAt: string;             // ISO timestamp
  lastUpdated: string;           // ISO timestamp
}

/**
 * Shape of the Add Contact form submission.
 * This is the input to the classification pipeline.
 */
export interface ProfileInput {
  linkedInUrl: string;
  firstName: string;
  lastName: string;
  currentJobTitle: string;
  company: string;
  headline: string;
  about: string;
  location: string;
  userNotes: string;
}

// ─── Dashboard Metrics ────────────────────────────────────────────────────────

export interface DashboardMetrics {
  total: number;
  relevant: number;
  cat1: number;
  cat2: number;
  cat3: number;
  manualReview: number;
  messagesReady: number;
  approved: number;
  contacted: number;
  replied: number;
  followUpsDue: number;
  notRelevant: number;
}

// ─── Filter State ─────────────────────────────────────────────────────────────

export interface FilterState {
  category: Category | '';
  function: ContactFunction | '';
  company: string;
  status: ContactStatus | '';
  confidence: Confidence | '';
  responseStatus: ResponseStatus | '';
}

export const DEFAULT_FILTERS: FilterState = {
  category: '',
  function: '',
  company: '',
  status: '',
  confidence: '',
  responseStatus: '',
};
