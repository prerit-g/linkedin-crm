/**
 * Validation utilities for contact form
 */

import { isValidLinkedInUrl, normalizeLinkedInUrl } from './linkedin';

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate LinkedIn URL
 */
export function validateLinkedInUrl(url: string): string | null {
  if (!url.trim()) {
    return 'LinkedIn URL is required';
  }
  
  try {
    // Use the comprehensive validation from linkedin.ts
    if (!isValidLinkedInUrl(url)) {
      return 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)';
    }
    
    // Try to normalize to catch any edge cases
    normalizeLinkedInUrl(url);
    return null;
  } catch (error) {
    return 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)';
  }
}

/**
 * Validate required text field
 */
export function validateRequired(fieldName: string, value: string): string | null {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate text field length
 */
export function validateMaxLength(fieldName: string, value: string, maxLength: number): string | null {
  if (value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return null;
}

/**
 * Validate email (for future use)
 */
export function validateEmail(email: string): string | null {
  if (!email.trim()) return null; // Email is optional
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

/**
 * Validate a profile input form
 */
export function validateProfileInput(data: {
  linkedInUrl: string;
  firstName: string;
  currentJobTitle: string;
  company: string;
  headline?: string;
  about?: string;
  location?: string;
  userNotes?: string;
}): FormValidationResult {
  const errors: ValidationError[] = [];
  
  // Validate LinkedIn URL
  const linkedInError = validateLinkedInUrl(data.linkedInUrl);
  if (linkedInError) {
    errors.push({ field: 'linkedInUrl', message: linkedInError });
  }
  
  // Validate required fields
  const firstNameError = validateRequired('First name', data.firstName);
  if (firstNameError) {
    errors.push({ field: 'firstName', message: firstNameError });
  }
  
  const jobTitleError = validateRequired('Job title', data.currentJobTitle);
  if (jobTitleError) {
    errors.push({ field: 'currentJobTitle', message: jobTitleError });
  }
  
  const companyError = validateRequired('Company', data.company);
  if (companyError) {
    errors.push({ field: 'company', message: companyError });
  }
  
  // Validate max lengths
  const maxLengths = {
    linkedInUrl: 500,
    firstName: 100,
    lastName: 100,
    currentJobTitle: 200,
    company: 200,
    headline: 500,
    about: 2000,
    location: 200,
    userNotes: 5000,
  };
  
  Object.entries(maxLengths).forEach(([field, maxLength]) => {
    const value = data[field as keyof typeof data];
    if (value && value.length > maxLength) {
      errors.push({
        field,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} must be less than ${maxLength} characters`,
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check for duplicate contact
 * Primary key: LinkedIn URL
 * Fallback: Full Name + Company + Current Role
 */
export function isDuplicateContact(
  newContact: {
    linkedInUrl: string;
    firstName: string;
    lastName: string;
    company: string;
    currentJobTitle: string;
  },
  existingContacts: Array<{
    linkedInUrl: string;
    firstName: string;
    lastName: string;
    company: string;
    currentJobTitle: string;
  }>
): boolean {
  // Normalize LinkedIn URL for comparison
  const normalizeUrl = (url: string) => {
    return url.trim().toLowerCase().replace(/\/$/, '');
  };
  
  const newUrl = normalizeUrl(newContact.linkedInUrl);
  
  // Check primary key (LinkedIn URL)
  const urlDuplicate = existingContacts.some(contact => 
    normalizeUrl(contact.linkedInUrl) === newUrl
  );
  
  if (urlDuplicate) return true;
  
  // Check fallback: Full Name + Company + Current Role
  const normalizeString = (str: string) => str.trim().toLowerCase();
  
  return existingContacts.some(contact => {
    const sameName = 
      normalizeString(contact.firstName) === normalizeString(newContact.firstName) &&
      normalizeString(contact.lastName) === normalizeString(newContact.lastName);
    
    const sameCompany = 
      normalizeString(contact.company) === normalizeString(newContact.company);
    
    const sameRole = 
      normalizeString(contact.currentJobTitle) === normalizeString(newContact.currentJobTitle);
    
    return sameName && sameCompany && sameRole;
  });
}