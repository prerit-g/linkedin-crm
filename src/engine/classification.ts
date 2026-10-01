/**
 * Classification Engine for LinkedIn Outreach CRM
 * Implements rules from .kiro/steering/classification-rules.md
 */

import { ProfileInput } from '../types/contact';
import { ContactFunction, Category, Confidence } from '../types/contact';

export interface ClassificationResult {
  isRelevant: boolean;
  function: ContactFunction;
  seniority: string;
  category: Category;
  confidence: Confidence;
  classificationReason: string;
  needsManualReview: boolean;
  manualReviewReason?: string;
}

// Relevant keywords by function (case-insensitive)
const RELEVANT_KEYWORDS = {
  ACCOUNTS_PAYABLE: ['accounts payable', 'ap', 'ap ', 'ap associate', 'ap analyst', 'ap specialist'],
  ACCOUNTS_RECEIVABLE: ['accounts receivable', 'ar', 'ar ', 'ar associate', 'ar analyst', 'ar specialist'],
  P2P: ['procure-to-pay', 'p2p', 'purchase-to-pay', 'procure to pay'],
  O2C: ['order-to-cash', 'o2c', 'order to cash'],
  R2R: ['record-to-report', 'r2r', 'record to report'],
  ACCOUNTING: ['accounting', 'accountant', 'accounting associate', 'accounting analyst'],
  FINANCE_OPERATIONS: ['finance operations', 'fin ops', 'financial operations'],
  FINANCE: ['finance', 'financial', 'finance associate', 'finance analyst'],
  FINTECH: ['fintech', 'financial technology'],
  HR: ['hr', 'human resources', 'recruiter', 'recruitment', 'talent acquisition', 'hiring', 'hrbp'],
};

// Irrelevant keywords (roles not in target functions)
const IRRELEVANT_KEYWORDS = [
  'software engineer', 'developer', 'programmer',
  'marketing', 'sales', 'business development',
  'legal', 'lawyer', 'attorney',
  'operations manager', 'operations specialist', // unless finance context
  'it', 'information technology', 'infrastructure',
  'product manager', 'product owner',
  'designer', 'ux', 'ui',
];

// Category signal words
const CATEGORY_SIGNALS = {
  CAT_1: ['associate', 'junior', 'executive', 'analyst', 'specialist', 'coordinator'],
  CAT_2: ['senior', 'lead', 'team lead', 'team leader', 'supervisor', 'assistant manager', 'manager', 'head of', 'director', 'vp'],
  CAT_3: ['hr', 'human resources', 'hrbp', 'recruiter', 'recruitment', 'talent acquisition', 'talent partner', 'campus recruiter', 'hiring manager'],
};

/**
 * Check if a contact is relevant based on their job title and profile
 */
function checkRelevance(profile: ProfileInput): { isRelevant: boolean; reason: string } {
  const text = `${profile.currentJobTitle} ${profile.headline} ${profile.about}`.toLowerCase();
  
  // Check for irrelevant keywords first
  for (const keyword of IRRELEVANT_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      // Check if it's in finance context (e.g., "Finance Operations Manager" is relevant)
      const isFinanceContext = 
        text.includes('finance') || 
        text.includes('accounting') || 
        text.includes('ap') ||
        text.includes('ar') ||
        text.includes('p2p') ||
        text.includes('o2c') ||
        text.includes('r2r');
      
      if (!isFinanceContext) {
        return { 
          isRelevant: false, 
          reason: `Role contains "${keyword}" which is not in target functions` 
        };
      }
    }
  }
  
  // Check for relevant keywords
  let foundRelevant = false;
  let reason = '';
  
  for (const [functionKey, keywords] of Object.entries(RELEVANT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        foundRelevant = true;
        reason = `Found "${keyword}" in profile`;
        break;
      }
    }
    if (foundRelevant) break;
  }
  
  // HR is always relevant (Category 3 target)
  if (text.includes('hr') || text.includes('human resources') || text.includes('recruit')) {
    return { isRelevant: true, reason: 'HR/Recruiting role is always relevant for outreach' };
  }
  
  if (!foundRelevant) {
    return { 
      isRelevant: false, 
      reason: 'No relevant finance, accounting, or HR keywords found in profile' 
    };
  }
  
  return { isRelevant: true, reason };
}

/**
 * Determine the most specific function from the profile
 */
function classifyFunction(profile: ProfileInput): { function: ContactFunction; reason: string } {
  const text = `${profile.currentJobTitle} ${profile.headline} ${profile.about}`.toLowerCase();
  
  // Check in order of specificity (most specific first)
  const functionChecks: Array<{ key: ContactFunction; keywords: string[] }> = [
    { key: 'ACCOUNTS_PAYABLE', keywords: RELEVANT_KEYWORDS.ACCOUNTS_PAYABLE },
    { key: 'ACCOUNTS_RECEIVABLE', keywords: RELEVANT_KEYWORDS.ACCOUNTS_RECEIVABLE },
    { key: 'P2P', keywords: RELEVANT_KEYWORDS.P2P },
    { key: 'O2C', keywords: RELEVANT_KEYWORDS.O2C },
    { key: 'R2R', keywords: RELEVANT_KEYWORDS.R2R },
    { key: 'ACCOUNTING', keywords: RELEVANT_KEYWORDS.ACCOUNTING },
    { key: 'FINANCE_OPERATIONS', keywords: RELEVANT_KEYWORDS.FINANCE_OPERATIONS },
    { key: 'FINANCE', keywords: RELEVANT_KEYWORDS.FINANCE },
    { key: 'FINTECH', keywords: RELEVANT_KEYWORDS.FINTECH },
    { key: 'HR', keywords: RELEVANT_KEYWORDS.HR },
  ];
  
  for (const check of functionChecks) {
    for (const keyword of check.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return { 
          function: check.key, 
          reason: `Found "${keyword}" in profile` 
        };
      }
    }
  }
  
  return { 
    function: 'UNKNOWN', 
    reason: 'Could not determine specific function from profile' 
  };
}

/**
 * Determine seniority from job title
 */
function determineSeniority(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('junior') || lowerTitle.includes('entry')) {
    return 'Junior';
  }
  
  if (lowerTitle.includes('senior')) {
    return 'Senior';
  }
  
  if (lowerTitle.includes('manager') || lowerTitle.includes('supervisor') || lowerTitle.includes('lead')) {
    return 'Manager';
  }
  
  if (lowerTitle.includes('associate') || lowerTitle.includes('analyst') || lowerTitle.includes('executive')) {
    return 'Associate';
  }
  
  if (lowerTitle.includes('director') || lowerTitle.includes('vp') || lowerTitle.includes('head of')) {
    return 'Director';
  }
  
  return 'Unknown';
}

/**
 * Determine category based on job title and seniority
 */
function classifyCategory(
  title: string, 
  functionType: ContactFunction,
  seniority: string
): { category: Category; reason: string; needsManualReview: boolean; reviewReason?: string } {
  const lowerTitle = title.toLowerCase();
  
  // Check for Category 3 (HR/Recruiting) first (highest priority)
  if (functionType === 'HR') {
    return { 
      category: 'CAT_3', 
      reason: 'HR/Recruiting role',
      needsManualReview: false 
    };
  }
  
  // Check for Category 2 signals (senior/leadership)
  const cat2Signals = CATEGORY_SIGNALS.CAT_2;
  const hasCat2Signal = cat2Signals.some(signal => lowerTitle.includes(signal.toLowerCase()));
  
  // Check for Category 1 signals (junior/associate)
  const cat1Signals = CATEGORY_SIGNALS.CAT_1;
  const hasCat1Signal = cat1Signals.some(signal => lowerTitle.includes(signal.toLowerCase()));
  
  // Handle "Senior Associate" ambiguity
  if (lowerTitle.includes('senior') && lowerTitle.includes('associate')) {
    return {
      category: 'MANUAL_REVIEW',
      reason: 'Senior Associate - ambiguous seniority',
      needsManualReview: true,
      reviewReason: 'Senior Associate requires manual review to determine appropriate category'
    };
  }
  
  // Category priority: CAT_2 (if clear leadership) > CAT_1 > Manual Review
  if (hasCat2Signal && !hasCat1Signal) {
    return { 
      category: 'CAT_2', 
      reason: 'Senior/leadership role detected',
      needsManualReview: false 
    };
  }
  
  if (hasCat1Signal && !hasCat2Signal) {
    return { 
      category: 'CAT_1', 
      reason: 'Junior/associate role detected',
      needsManualReview: false 
    };
  }
  
  // If we have both signals or neither, send to manual review
  return {
    category: 'MANUAL_REVIEW',
    reason: 'Ambiguous seniority signals',
    needsManualReview: true,
    reviewReason: 'Could not clearly determine category from title'
  };
}

/**
 * Assess confidence level
 */
function assessConfidence(
  relevanceResult: { isRelevant: boolean; reason: string },
  functionResult: { function: ContactFunction; reason: string },
  categoryResult: { category: Category; reason: string; needsManualReview: boolean; reviewReason?: string }
): Confidence {
  // If needs manual review, confidence is LOW
  if (categoryResult.needsManualReview) {
    return 'LOW';
  }
  
  // Check for explicit role indicators
  const titleAndHeadline = `${relevanceResult.reason} ${functionResult.reason}`.toLowerCase();
  
  // HIGH confidence: explicit function and clear category
  if (
    functionResult.function !== 'UNKNOWN' &&
    functionResult.function !== 'HR' && // HR gets special handling
    !categoryResult.reason.includes('ambiguous') &&
    titleAndHeadline.includes('accounts payable') ||
    titleAndHeadline.includes('accounts receivable') ||
    titleAndHeadline.includes('p2p') ||
    titleAndHeadline.includes('o2c') ||
    titleAndHeadline.includes('r2r')
  ) {
    return 'HIGH';
  }
  
  // HR roles with clear titles are HIGH confidence
  if (functionResult.function === 'HR' && (
    titleAndHeadline.includes('hrbp') ||
    titleAndHeadline.includes('recruiter') ||
    titleAndHeadline.includes('talent acquisition')
  )) {
    return 'HIGH';
  }
  
  // MEDIUM confidence: reasonable but some ambiguity
  if (
    functionResult.function !== 'UNKNOWN' &&
    categoryResult.category !== 'MANUAL_REVIEW'
  ) {
    return 'MEDIUM';
  }
  
  // LOW confidence: everything else
  return 'LOW';
}

/**
 * Main classification function
 */
export function classifyProfile(profile: ProfileInput): ClassificationResult {
  // Stage 1: Relevance Check
  const relevanceResult = checkRelevance(profile);
  
  if (!relevanceResult.isRelevant) {
    return {
      isRelevant: false,
      function: 'UNKNOWN',
      seniority: 'Unknown',
      category: 'MANUAL_REVIEW',
      confidence: 'HIGH',
      classificationReason: `Not relevant: ${relevanceResult.reason}`,
      needsManualReview: true,
      manualReviewReason: relevanceResult.reason,
    };
  }
  
  // Stage 2: Function Classification
  const functionResult = classifyFunction(profile);
  
  // Stage 3: Seniority
  const seniority = determineSeniority(profile.currentJobTitle);
  
  // Stage 4: Category Classification
  const categoryResult = classifyCategory(
    profile.currentJobTitle,
    functionResult.function,
    seniority
  );
  
  // Stage 5: Confidence Assessment
  const confidence = assessConfidence(relevanceResult, functionResult, categoryResult);
  
  // Build classification reason
  const classificationReason = [
    relevanceResult.reason,
    functionResult.reason,
    categoryResult.reason,
    `Seniority: ${seniority}`,
    confidence === 'LOW' ? 'Low confidence - requires verification' : '',
  ].filter(Boolean).join('. ');
  
  return {
    isRelevant: true,
    function: functionResult.function,
    seniority,
    category: categoryResult.category,
    confidence,
    classificationReason,
    needsManualReview: categoryResult.needsManualReview || confidence === 'LOW',
    manualReviewReason: categoryResult.reviewReason || (confidence === 'LOW' ? 'Low confidence classification' : undefined),
  };
}

/**
 * Quick classification for title-only checks (used in UI previews)
 */
export function quickClassifyTitle(title: string): Partial<ClassificationResult> {
  const mockProfile: ProfileInput = {
    linkedInUrl: '',
    firstName: '',
    lastName: '',
    currentJobTitle: title,
    company: '',
    headline: '',
    about: '',
    location: '',
    userNotes: '',
  };
  
  const result = classifyProfile(mockProfile);
  
  return {
    isRelevant: result.isRelevant,
    function: result.function,
    category: result.category,
    confidence: result.confidence,
    needsManualReview: result.needsManualReview,
  };
}