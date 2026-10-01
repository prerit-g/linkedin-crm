/**
 * Tests for LinkedIn URL validation utilities
 */

import { 
  isValidLinkedInUrl, 
  normalizeLinkedInUrl, 
  extractLinkedInUsername, 
  createLinkedInUrl,
  formatLinkedInUrlForDisplay,
  getLinkedInManualActionReminder 
} from './linkedin';

describe('LinkedIn URL Utilities', () => {
  describe('isValidLinkedInUrl', () => {
    it('should validate correct LinkedIn URLs', () => {
      const validUrls = [
        'https://linkedin.com/in/johndoe',
        'https://www.linkedin.com/in/jane-doe',
        'https://linkedin.com/in/john_doe123',
        'https://linkedin.com/in/jane.doe',
        'https://linkedin.com/in/john-doe-123',
      ];
      
      validUrls.forEach(url => {
        expect(isValidLinkedInUrl(url)).toBe(true);
      });
    });

    it('should reject invalid LinkedIn URLs', () => {
      const invalidUrls = [
        '', // empty
        'not-a-url',
        'https://linkedin.com/company/companyname', // company page
        'https://linkedin.com/in/', // no username
        'https://linkedin.com/in/j', // too short
        'https://linkedin.com/in/john?query=param', // query params
        'https://linkedin.com/in/jane#fragment', // fragment
        'https://linkedin.com/in/john&other=param', // invalid character
        'http://linkedin.com/in/johndoe', // HTTP not HTTPS
        'https://malicious.com/in/johndoe', // wrong domain
        'https://linkedin.com/invalid/johndoe', // wrong path
      ];
      
      invalidUrls.forEach(url => {
        expect(isValidLinkedInUrl(url)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      // URLs with trailing slash
      expect(isValidLinkedInUrl('https://linkedin.com/in/johndoe/')).toBe(true);
      
      // Mixed case
      expect(isValidLinkedInUrl('HTTPS://LINKEDIN.COM/IN/JOHNDOE')).toBe(true);
      
      // With www
      expect(isValidLinkedInUrl('https://www.linkedin.com/in/johndoe')).toBe(true);
      
      // Very long username (within limits)
      expect(isValidLinkedInUrl('https://linkedin.com/in/john-doe-with-a-very-long-username-that-is-still-valid')).toBe(true);
    });
  });

  describe('normalizeLinkedInUrl', () => {
    it('should normalize various URL formats consistently', () => {
      const testCases = [
        { input: 'https://linkedin.com/in/johndoe', expected: 'https://linkedin.com/in/johndoe' },
        { input: 'https://www.linkedin.com/in/janedoe', expected: 'https://linkedin.com/in/janedoe' },
        { input: 'http://linkedin.com/in/johndoe', expected: 'https://linkedin.com/in/johndoe' },
        { input: 'http://www.linkedin.com/in/janedoe', expected: 'https://linkedin.com/in/janedoe' },
        { input: 'linkedin.com/in/johndoe', expected: 'https://linkedin.com/in/johndoe' },
        { input: 'www.linkedin.com/in/janedoe', expected: 'https://linkedin.com/in/janedoe' },
        { input: 'https://linkedin.com/in/johndoe/', expected: 'https://linkedin.com/in/johndoe' },
      ];
      
      testCases.forEach(({ input, expected }) => {
        expect(normalizeLinkedInUrl(input)).toBe(expected);
      });
    });

    it('should throw error for invalid URLs', () => {
      const invalidUrls = [
        'invalid-url',
        'https://linkedin.com/invalid/johndoe',
        'https://linkedin.com/in/',
      ];
      
      invalidUrls.forEach(url => {
        expect(() => normalizeLinkedInUrl(url)).toThrow();
      });
    });
  });

  describe('extractLinkedInUsername', () => {
    it('should extract username from valid URLs', () => {
      const testCases = [
        { url: 'https://linkedin.com/in/johndoe', expected: 'johndoe' },
        { url: 'https://www.linkedin.com/in/jane-doe', expected: 'jane-doe' },
        { url: 'https://linkedin.com/in/john_doe123', expected: 'john_doe123' },
        { url: 'https://linkedin.com/in/jane.doe', expected: 'jane.doe' },
        { url: 'https://linkedin.com/in/john-doe-123/', expected: 'john-doe-123' },
      ];
      
      testCases.forEach(({ url, expected }) => {
        expect(extractLinkedInUsername(url)).toBe(expected);
      });
    });

    it('should return null for invalid URLs', () => {
      expect(extractLinkedInUsername('invalid-url')).toBeNull();
      expect(extractLinkedInUsername('https://linkedin.com/invalid/johndoe')).toBeNull();
      expect(extractLinkedInUsername('')).toBeNull();
    });
  });

  describe('createLinkedInUrl', () => {
    it('should create valid LinkedIn URLs from usernames', () => {
      const testCases = [
        { username: 'johndoe', expected: 'https://linkedin.com/in/johndoe' },
        { username: 'jane-doe', expected: 'https://linkedin.com/in/jane-doe' },
        { username: 'john_doe', expected: 'https://linkedin.com/in/john_doe' },
        { username: 'jane.doe', expected: 'https://linkedin.com/in/jane.doe' },
        { username: 'john123', expected: 'https://linkedin.com/in/john123' },
      ];
      
      testCases.forEach(({ username, expected }) => {
        expect(createLinkedInUrl(username)).toBe(expected);
      });
    });

    it('should validate generated URLs', () => {
      const url = createLinkedInUrl('johndoe');
      expect(isValidLinkedInUrl(url)).toBe(true);
      expect(extractLinkedInUsername(url)).toBe('johndoe');
    });

    it('should throw error for invalid usernames', () => {
      expect(() => createLinkedInUrl('')).toThrow();
      expect(() => createLinkedInUrl('j')).toThrow(); // too short
      expect(() => createLinkedInUrl('john@doe')).toThrow(); // invalid character
    });
  });

  describe('formatLinkedInUrlForDisplay', () => {
    it('should format URLs for display', () => {
      expect(formatLinkedInUrlForDisplay('https://linkedin.com/in/johndoe')).toBe('https://linkedin.com/in/johndoe');
      
      // Truncates long URLs
      const longUrl = 'https://linkedin.com/in/john-doe-with-a-very-very-very-long-username-that-needs-truncation';
      const truncated = formatLinkedInUrlForDisplay(longUrl, 40);
      expect(truncated).toContain('...');
      expect(truncated.length).toBeLessThanOrEqual(43); // Account for ellipsis
    });

    it('should handle invalid URLs gracefully', () => {
      expect(formatLinkedInUrlForDisplay('invalid-url')).toBe('Invalid LinkedIn URL');
      expect(formatLinkedInUrlForDisplay('')).toBe('Invalid LinkedIn URL');
    });
  });

  describe('getLinkedInManualActionReminder', () => {
    it('should return the correct reminder message', () => {
      const reminder = getLinkedInManualActionReminder();
      expect(typeof reminder).toBe('string');
      expect(reminder.length).toBeGreaterThan(0);
      expect(reminder).toContain('LinkedIn is now open');
      expect(reminder).toContain('paste your message');
      expect(reminder).toContain('click "Mark Contacted"');
    });
  });
});