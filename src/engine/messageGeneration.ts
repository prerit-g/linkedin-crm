/**
 * Message Generation Engine for LinkedIn Outreach CRM
 * Implements templates from .kiro/steering/message-templates.md
 */

import { ProfileInput } from '../types/contact';
import { ContactFunction, Category } from '../types/contact';
import { ClassificationResult } from './classification';

// Function label mapping for message templates
const FUNCTION_LABELS: Record<ContactFunction, string> = {
  ACCOUNTS_PAYABLE: 'Accounts Payable',
  ACCOUNTS_RECEIVABLE: 'Accounts Receivable',
  P2P: 'P2P',
  O2C: 'O2C',
  R2R: 'R2R',
  ACCOUNTING: 'Accounting',
  FINANCE_OPERATIONS: 'Finance Operations',
  FINANCE: 'finance', // lowercase for mid-sentence use
  FINTECH: 'FinTech',
  HR: 'HR',
  UNKNOWN: 'finance',
};

// Seniority-based lead verb mapping
const LEAD_VERBS: Record<string, string> = {
  Manager: 'lead',
  Director: 'lead',
  Senior: 'lead', // For senior roles that might lead teams
  Unknown: 'lead', // Default
};

// Team label mapping based on function
function getTeamLabel(functionType: ContactFunction, seniority: string): string {
  const functionLabel = FUNCTION_LABELS[functionType];
  
  if (functionType === 'P2P') return 'the P2P function';
  if (functionType === 'O2C') return 'the O2C function';
  if (functionType === 'R2R') return 'the R2R function';
  if (functionType === 'FINANCE_OPERATIONS') return 'the Finance Operations team';
  if (functionType === 'ACCOUNTS_PAYABLE') return 'the Accounts Payable team';
  if (functionType === 'ACCOUNTS_RECEIVABLE') return 'the Accounts Receivable team';
  if (functionType === 'ACCOUNTING') return 'the accounting team';
  if (functionType === 'FINTECH') return 'the FinTech team';
  if (functionType === 'HR') return 'the HR team';
  
  // Default for generic finance
  return 'the finance team';
}

/**
 * Generate personalized message based on profile and classification
 */
export function generateMessage(
  profile: ProfileInput,
  classification: ClassificationResult
): string {
  const { category, function: functionType, seniority } = classification;
  
  // Get function label for message
  const functionLabel = FUNCTION_LABELS[functionType];
  
  // Base template variables
  const variables = {
    firstName: profile.firstName || '',
    company: profile.company || '',
    function: functionLabel,
  };
  
  // Category-specific templates
  if (category === 'CAT_1') {
    return generateCategory1Message(variables);
  } else if (category === 'CAT_2') {
    const leadVerb = LEAD_VERBS[seniority] || 'lead';
    const teamLabel = getTeamLabel(functionType, seniority);
    return generateCategory2Message({ ...variables, leadVerb, teamLabel });
  } else if (category === 'CAT_3') {
    return generateCategory3Message(variables);
  } else {
    // For manual review or unknown categories, use Category 1 as fallback
    return generateCategory1Message(variables);
  }
}

/**
 * Category 1 Template — Associate / Executive / Junior Professional
 */
function generateCategory1Message(variables: {
  firstName: string;
  company: string;
  function: string;
}): string {
  const { firstName, company, function: functionName } = variables;
  
  return `Hi ${firstName},

I see you're working in ${functionName} at ${company}. I am actively looking for an entry-level role in this space.

To prepare, I built a hands-on AP project on my profile using PostgreSQL, Excel, and Power BI to manage data pipelines and track vendor metrics. If your team has any junior openings or an internal referral program, I would love the opportunity to share my resume.`;
}

/**
 * Category 2 Template — Senior / Team Lead / Manager / Supervisor
 */
function generateCategory2Message(variables: {
  firstName: string;
  company: string;
  function: string;
  leadVerb: string;
  teamLabel: string;
}): string {
  const { firstName, company, leadVerb, teamLabel } = variables;
  
  return `Hi ${firstName},

I see you ${leadVerb} ${teamLabel} at ${company}. I am looking for an entry-level opportunity and wanted to see if you are actively hiring or building a pipeline for junior roles.

To ensure I can add value immediately, I built a mock AP ledger project using PostgreSQL for data management, Excel for reconciliations, and Power BI for aging dashboards. I'd love to pass along my resume if you have a current or upcoming slot on your team.`;
}

/**
 * Category 3 Template — HR / Recruiting / Hiring
 */
function generateCategory3Message(variables: {
  firstName: string;
  company: string;
  function: string;
}): string {
  const { firstName, company } = variables;
  
  return `Hi ${firstName},

I'm seeking an entry-level accounting or finance position at ${company} and want to get on your radar for any open or upcoming junior roles.

I specialize in AP/AR workflows, and my profile features a live data project built using Excel, SQL, and Power BI to demonstrate my technical readiness. Could you review my profile for shortlisting, or point me toward the right hiring team?`;
}

/**
 * Validate generated message against rules
 */
export function validateMessage(
  message: string,
  profile: ProfileInput,
  classification: ClassificationResult
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check 1: Correct first name used
  if (profile.firstName && !message.includes(profile.firstName)) {
    errors.push('First name not found in message');
  }
  
  // Check 2: Correct company used
  if (profile.company && !message.includes(profile.company)) {
    errors.push('Company not found in message');
  }
  
  // Check 3: No invented leadership claims for non-leadership roles
  if (classification.category === 'CAT_1' || classification.category === 'CAT_3') {
    const leadershipTerms = ['lead', 'manage', 'oversee', 'run'];
    const hasLeadershipClaim = leadershipTerms.some(term => 
      message.toLowerCase().includes(term)
    );
    
    if (hasLeadershipClaim) {
      errors.push('Incorrect leadership claim for non-leadership category');
    }
  }
  
  // Check 4: No hiring claims unless explicitly in profile
  const hiringTerms = ['hiring', 'open roles', 'currently hiring', 'job posting'];
  const hasHiringClaim = hiringTerms.some(term => 
    message.toLowerCase().includes(term)
  );
  
  // Category 2 template has conditional hiring language - this is allowed
  const isConditionalHiring = message.includes('if you are actively hiring') || 
                              message.includes('if your team has any junior openings');
  
  if (hasHiringClaim && !isConditionalHiring) {
    errors.push('Inappropriate hiring claim without conditional language');
  }
  
  // Check 5: Message length (not too short, not too long)
  const wordCount = message.split(/\s+/).length;
  if (wordCount < 50) {
    errors.push('Message is too short (less than 50 words)');
  }
  if (wordCount > 200) {
    errors.push('Message is too long (more than 200 words)');
  }
  
  // Check 6: No prohibited phrases
  const prohibitedPhrases = [
    'I was extremely impressed',
    'I\'ve been following your amazing career',
    'Your incredible journey inspired me',
    'You are clearly a leader in your field',
    'I\'ve admired your work for a long time',
    'I hope this message finds you well',
    'I wanted to reach out to you today',
    'I am passionate about leveraging synergies',
    'As someone who is deeply committed to excellence',
    'I believe we could create mutual value',
  ];
  
  prohibitedPhrases.forEach(phrase => {
    if (message.includes(phrase)) {
      errors.push(`Contains prohibited phrase: "${phrase}"`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate personalization notes for manual review
 */
export function generatePersonalizationNotes(
  profile: ProfileInput,
  classification: ClassificationResult
): string {
  const notes: string[] = [];
  
  if (classification.function !== 'UNKNOWN') {
    notes.push(`Function: ${FUNCTION_LABELS[classification.function]}`);
  }
  
  if (classification.seniority !== 'Unknown') {
    notes.push(`Seniority: ${classification.seniority}`);
  }
  
  if (profile.headline) {
    notes.push(`Headline: "${profile.headline.substring(0, 100)}..."`);
  }
  
  if (classification.needsManualReview && classification.manualReviewReason) {
    notes.push(`Review needed: ${classification.manualReviewReason}`);
  }
  
  return notes.join('\n');
}