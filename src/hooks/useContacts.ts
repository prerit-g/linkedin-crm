import { useMemo } from 'react';
import { useContactStore, selectFollowUpContacts } from '@/store/contactStore';
import type {
  Contact,
  ContactStatus,
  Category,
  DashboardMetrics,
  ProfileInput,
  MessageStatus,
  ReviewStatus,
} from '@/types';

// ─── Raw access ───────────────────────────────────────────────────────────────

/** All contacts, sorted by lastUpdated descending (most recent first). */
export function useAllContacts(): Contact[] {
  return useContactStore(
    (s) => [...s.contacts].sort(
      (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )
  );
}

/** Single contact by id, or undefined. */
export function useContactById(id: string): Contact | undefined {
  return useContactStore((s) => s.contacts.find((c) => c.id === id));
}

// ─── Filtered slices ──────────────────────────────────────────────────────────

/** Contacts matching a specific status. */
export function useContactsByStatus(status: ContactStatus): Contact[] {
  return useContactStore(
    (s) => s.contacts.filter((c) => c.status === status)
  );
}

/** Contacts matching a specific category. */
export function useContactsByCategory(category: Category): Contact[] {
  return useContactStore(
    (s) => s.contacts.filter((c) => c.category === category)
  );
}

/**
 * Contacts in the Manual Review queue:
 * status is REVIEW_REQUIRED (any category) OR category is MANUAL_REVIEW.
 */
export function useManualReviewContacts(): Contact[] {
  return useContactStore(
    (s) =>
      s.contacts.filter(
        (c) =>
          c.status === 'REVIEW_REQUIRED' || c.category === 'MANUAL_REVIEW'
      )
  );
}

/**
 * Contacts in the Message Queue:
 * status is MESSAGE_READY or APPROVED.
 */
export function useMessageQueueContacts(): Contact[] {
  return useContactStore(
    (s) =>
      s.contacts.filter(
        (c) => c.status === 'MESSAGE_READY' || c.status === 'APPROVED'
      )
  );
}

/**
 * Contacts with a follow-up due:
 * followUpDate ≤ today AND status is CONTACTED or NO_RESPONSE.
 */
export function useFollowUpContacts(): Contact[] {
  return useContactStore((s) => selectFollowUpContacts(s.contacts));
}

// ─── Dashboard metrics ────────────────────────────────────────────────────────

/**
 * Computes all 12 dashboard metric values in a single memoized selector.
 * Re-renders only when the contacts array changes.
 */
export function useDashboardMetrics(): DashboardMetrics {
  const contacts = useContactStore((s) => s.contacts);

  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let relevant = 0;
    let cat1 = 0;
    let cat2 = 0;
    let cat3 = 0;
    let manualReview = 0;
    let messagesReady = 0;
    let approved = 0;
    let contacted = 0;
    let replied = 0;
    let followUpsDue = 0;
    let notRelevant = 0;

    for (const c of contacts) {
      if (c.isRelevant) relevant++;
      if (c.category === 'CAT_1') cat1++;
      if (c.category === 'CAT_2') cat2++;
      if (c.category === 'CAT_3') cat3++;
      if (c.status === 'REVIEW_REQUIRED' || c.category === 'MANUAL_REVIEW') manualReview++;
      if (c.status === 'MESSAGE_READY') messagesReady++;
      if (c.status === 'APPROVED') approved++;
      if (c.status === 'CONTACTED') contacted++;
      if (c.status === 'REPLIED') replied++;
      if (c.status === 'NOT_RELEVANT') notRelevant++;

      if (
        c.followUpDate &&
        (c.status === 'CONTACTED' || c.status === 'NO_RESPONSE')
      ) {
        const due = new Date(c.followUpDate);
        due.setHours(0, 0, 0, 0);
        if (due <= today) followUpsDue++;
      }
    }

    return {
      total: contacts.length,
      relevant,
      cat1,
      cat2,
      cat3,
      manualReview,
      messagesReady,
      approved,
      contacted,
      replied,
      followUpsDue,
      notRelevant,
    };
  }, [contacts]);
}

// ─── Store actions ───────────────────────────────────────────────────────────

/**
 * Create a new contact from profile input
 * For Phase 2: Creates contact with default classification
 * Phase 3 will add proper classification pipeline
 */
export function useContactActions() {
  const addContact = useContactStore((s) => s.addContact);
  const updateContact = useContactStore((s) => s.updateContact);
  const deleteContact = useContactStore((s) => s.deleteContact);
  const findDuplicate = useContactStore((s) => s.findDuplicate);

  /**
   * Create a new contact from profile input with automatic classification
   */
  const createContact = async (input: ProfileInput): Promise<{ success: boolean; duplicate?: Contact }> => {
    // Generate a unique ID
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // Create full name
    const fullName = `${input.firstName} ${input.lastName}`.trim();
    
    // Run classification engine
    const { classifyProfile, generateMessage, generatePersonalizationNotes } = await import('../engine');
    
    const classification = classifyProfile(input);
    const generatedMessage = generateMessage(input, classification);
    const personalizationNotes = generatePersonalizationNotes(input, classification);
    
    // Determine initial status based on classification
    let status: ContactStatus = 'NEW';
    let messageStatus: MessageStatus = 'NONE';
    let reviewStatus: ReviewStatus = 'PENDING';
    
    if (!classification.isRelevant) {
      status = 'NOT_RELEVANT';
    } else if (classification.needsManualReview) {
      status = 'REVIEW_REQUIRED';
    } else if (classification.confidence === 'HIGH' || classification.confidence === 'MEDIUM') {
      status = 'MESSAGE_READY';
      messageStatus = 'READY';
    }
    
    const contact: Contact = {
      // Identity
      id,
      firstName: input.firstName,
      lastName: input.lastName,
      fullName,
      linkedInUrl: input.linkedInUrl,

      // Profile
      currentJobTitle: input.currentJobTitle,
      company: input.company,
      headline: input.headline,
      about: input.about,
      location: input.location,
      industry: '',
      previousCompany: '',
      relevantSkills: [],
      tags: [],
      hiringIndicator: false,
      referralIndicator: false,

      // Classification (from engine)
      isRelevant: classification.isRelevant,
      function: classification.function,
      seniority: classification.seniority,
      category: classification.category,
      confidence: classification.confidence,
      classificationReason: classification.classificationReason,
      personalizationNotes,

      // Message
      generatedMessage,
      messageStatus,

      // Workflow
      status,
      reviewStatus,

      // Tracking
      contactedDate: '',
      responseStatus: 'NONE' as const,
      followUpDate: '',
      userNotes: input.userNotes,

      // Metadata
      createdAt: now,
      lastUpdated: now,
    };

    // Add the contact
    return addContact(contact);
  };

  return {
    contacts: useContactStore((s) => s.contacts),
    addContact: createContact,
    updateContact,
    deleteContact,
    findDuplicate,
  };
}

// Convenience hook
export function useContacts() {
  return useContactActions();
}
