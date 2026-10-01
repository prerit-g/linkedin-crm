/**
 * LinkedIn URL validation and safety utilities
 * Strict compliance with LinkedIn safety rules: no automation, only safe URL opening
 */

const LINKEDIN_URL_PATTERN = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-\_\.%]+\/?$/;

/**
 * Validate if a string is a valid LinkedIn profile URL
 */
export function isValidLinkedInUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Basic pattern validation
  if (!LINKEDIN_URL_PATTERN.test(url.trim())) {
    return false;
  }
  
  // Additional safety checks
  const trimmedUrl = url.trim().toLowerCase();
  
  // Reject URLs with query parameters or fragments that could be malicious
  if (trimmedUrl.includes('?') || trimmedUrl.includes('#') || trimmedUrl.includes('&')) {
    return false;
  }
  
  // Ensure it's a proper profile URL, not company or other LinkedIn pages
  if (!trimmedUrl.includes('/in/')) {
    return false;
  }
  
  // Check for minimum length after /in/
  const afterIn = trimmedUrl.split('/in/')[1];
  if (!afterIn || afterIn.replace(/\/$/, '').length < 2) {
    return false;
  }
  
  return true;
}

/**
 * Normalize LinkedIn URL to consistent format
 */
export function normalizeLinkedInUrl(url: string): string {
  if (!isValidLinkedInUrl(url)) {
    throw new Error('Invalid LinkedIn URL');
  }
  
  let normalized = url.trim();
  
  // Ensure HTTPS
  if (normalized.startsWith('http://')) {
    normalized = normalized.replace('http://', 'https://');
  } else if (!normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }
  
  // Remove www. for consistency
  normalized = normalized.replace('https://www.', 'https://');
  
  // Ensure it starts with https://linkedin.com
  if (!normalized.startsWith('https://linkedin.com')) {
    normalized = normalized.replace('https://', 'https://linkedin.com');
  }
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');
  
  return normalized;
}

/**
 * Extract LinkedIn username from URL
 */
export function extractLinkedInUsername(url: string): string | null {
  if (!isValidLinkedInUrl(url)) return null;
  
  try {
    const normalized = normalizeLinkedInUrl(url);
    const match = normalized.match(/linkedin\.com\/in\/([^\/]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Safely open LinkedIn profile in new tab with security attributes
 * This is the ONLY allowed way to open LinkedIn URLs
 */
export function openLinkedInProfile(url: string): void {
  if (!isValidLinkedInUrl(url)) {
    throw new Error('Cannot open invalid LinkedIn URL');
  }
  
  const normalizedUrl = normalizeLinkedInUrl(url);
  
  // Open with noopener and noreferrer for security
  // This prevents the opened page from accessing window.opener
  // and prevents sending referrer header
  window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Format LinkedIn URL for display (truncated if too long)
 */
export function formatLinkedInUrlForDisplay(url: string, maxLength: number = 40): string {
  if (!isValidLinkedInUrl(url)) {
    return 'Invalid LinkedIn URL';
  }
  
  try {
    const normalized = normalizeLinkedInUrl(url);
    
    if (normalized.length <= maxLength) {
      return normalized;
    }
    
    // Truncate in the middle
    const prefix = normalized.substring(0, maxLength / 2 - 3);
    const suffix = normalized.substring(normalized.length - maxLength / 2 + 3);
    return `${prefix}...${suffix}`;
  } catch {
    return 'Invalid LinkedIn URL';
  }
}

/**
 * Create LinkedIn profile URL from username
 */
export function createLinkedInUrl(username: string): string {
  if (!username || typeof username !== 'string') {
    throw new Error('Username is required');
  }
  
  // Basic username validation
  const cleanUsername = username.trim().toLowerCase();
  if (!/^[a-zA-Z0-9\-\_\.]+$/.test(cleanUsername)) {
    throw new Error('Invalid LinkedIn username format');
  }
  
  if (cleanUsername.length < 2 || cleanUsername.length > 100) {
    throw new Error('Username must be between 2 and 100 characters');
  }
  
  const url = `https://linkedin.com/in/${cleanUsername}`;
  
  // Validate the created URL
  if (!isValidLinkedInUrl(url)) {
    throw new Error('Generated URL is not valid');
  }
  
  return url;
}

/**
 * Check if current page is being viewed as a PWA in standalone mode
 */
export function isStandalonePWA(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches
  );
}

/**
 * Get manual action reminder message for LinkedIn
 */
export function getLinkedInManualActionReminder(): string {
  return `LinkedIn is now open in your browser. Please:
1. Paste your message manually
2. Send the connection request/message
3. Return here and click "Mark Contacted"`;
}