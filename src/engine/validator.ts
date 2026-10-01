import { Contact } from '../types/contact';

const PROHIBITED_PHRASES = [
  'extremely impressed',
  'following your',
  'incredible journey',
  'amazing career',
  'inspired me',
  'leader in your field',
  'hope this message finds you',
  'wanted to reach out',
  'passionate about leveraging',
  'mutual value',
  'i have admired',
];

const LEADERSHIP_CLAIM_PATTERNS = [
  /you lead the/i,
  /you manage the/i,
  /you run the/i,
  /you oversee/i,
  /you head the/i,
];

const ASSERTIVE_HIRING_PATTERNS = [
  /since you are.*hiring/i,
  /i saw you posted/i,
  /you.*posted.*job/i,
  /currently hiring for/i,
];

export interface ValidationResult {
  valid: boolean;
  failures: string[];
}

export function validateMessage(contact: Contact): ValidationResult {
  const failures: string[] = [];
  const message = contact.generatedMessage || '';
  const lowerMessage = message.toLowerCase();
  const lowerFirstName = contact.firstName.toLowerCase();
  const lowerCompany = contact.company.toLowerCase();

  // Check 1: firstName appears in message
  if (!lowerMessage.includes(lowerFirstName)) {
    failures.push('First name not found in message');
  }

  // Check 2: company appears in message
  if (!lowerMessage.includes(lowerCompany)) {
    failures.push('Company name not found in message');
  }

  // Check 3: category is not MANUAL_REVIEW
  if (contact.category === 'MANUAL_REVIEW') {
    failures.push('Contact is marked for manual review');
  }

  // Check 4: function is not UNKNOWN
  if (contact.function === 'UNKNOWN') {
    failures.push('Contact function is unknown');
  }

  // Check 5: seniority is not empty
  if (!contact.seniority?.trim()) {
    failures.push('Seniority not specified');
  }

  // Check 6: no prohibited phrases
  for (const phrase of PROHIBITED_PHRASES) {
    if (lowerMessage.includes(phrase.toLowerCase())) {
      failures.push(`Contains prohibited phrase: "${phrase}"`);
      break;
    }
  }

  // Check 7: no leadership claims unless category is CAT_2
  if (contact.category !== 'CAT_2') {
    for (const pattern of LEADERSHIP_CLAIM_PATTERNS) {
      if (pattern.test(message)) {
        failures.push('Contains leadership claim but contact is not Category 2');
        break;
      }
    }
  }

  // Check 8: no assertive hiring claims
  for (const pattern of ASSERTIVE_HIRING_PATTERNS) {
    if (pattern.test(message)) {
      failures.push('Contains assertive hiring claim without explicit profile evidence');
      break;
    }
  }

  // Check 9: message length between 100 and 700 characters
  if (message.length < 100) {
    failures.push('Message too short (minimum 100 characters)');
  }
  if (message.length > 700) {
    failures.push('Message too long (maximum 700 characters)');
  }

  // Check 10: message contains at least 2 paragraphs
  const paragraphCount = message.split('\n\n').filter(p => p.trim()).length;
  if (paragraphCount < 2) {
    failures.push('Message should have at least 2 paragraphs');
  }

  // Check 11: no unfilled template variables
  if (message.includes('{{') || message.includes('}}')) {
    failures.push('Message contains unfilled template variables');
  }

  return {
    valid: failures.length === 0,
    failures,
  };
}