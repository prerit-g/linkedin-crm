import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Contact, ContactStatus, Category } from '@/types';

// ─── Store Interface ──────────────────────────────────────────────────────────

interface ContactStore {
  contacts: Contact[];

  // CRUD
  addContact: (contact: Contact) => { success: boolean; duplicate?: Contact };
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  // Lookup
  getContactById: (id: string) => Contact | undefined;
  findDuplicate: (
    url: string,
    fullName: string,
    company: string,
    title: string
  ) => Contact | undefined;

  // Bulk
  importContacts: (contacts: Contact[]) => void;
  loadTestData: () => void;
  clearAll: () => void;
}

// ─── Store Implementation ─────────────────────────────────────────────────────

export const useContactStore = create<ContactStore>()(
  persist(
    (set, get) => ({
      contacts: [],

      // ── addContact ────────────────────────────────────────────────────────
      addContact: (contact) => {
        const existing = get().findDuplicate(
          contact.linkedInUrl,
          contact.fullName,
          contact.company,
          contact.currentJobTitle
        );
        if (existing) {
          return { success: false, duplicate: existing };
        }
        set((state) => ({ contacts: [contact, ...state.contacts] }));
        return { success: true };
      },

      // ── updateContact ─────────────────────────────────────────────────────
      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id
              ? { ...c, ...updates, lastUpdated: new Date().toISOString() }
              : c
          ),
        }));
      },

      // ── deleteContact ─────────────────────────────────────────────────────
      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        }));
      },

      // ── getContactById ────────────────────────────────────────────────────
      getContactById: (id) => {
        return get().contacts.find((c) => c.id === id);
      },

      // ── findDuplicate ─────────────────────────────────────────────────────
      // Primary check: LinkedIn URL (case-insensitive, trimmed)
      // Fallback: fullName + company + currentJobTitle (case-insensitive, trimmed)
      findDuplicate: (url, fullName, company, title) => {
        const contacts = get().contacts;
        const normalizeUrl = (u: string) => u.toLowerCase().trim().replace(/\/$/, '');
        const normalize = (s: string) => s.toLowerCase().trim();

        if (url.trim()) {
          const match = contacts.find(
            (c) => normalizeUrl(c.linkedInUrl) === normalizeUrl(url)
          );
          if (match) return match;
        }

        // Fallback — only if all three fields are non-empty
        if (fullName.trim() && company.trim() && title.trim()) {
          return contacts.find(
            (c) =>
              normalize(c.fullName) === normalize(fullName) &&
              normalize(c.company) === normalize(company) &&
              normalize(c.currentJobTitle) === normalize(title)
          );
        }

        return undefined;
      },

      // ── importContacts ────────────────────────────────────────────────────
      // Caller is responsible for confirming before calling this (it overwrites)
      importContacts: (contacts) => {
        set({ contacts });
      },

      // ── loadTestData ──────────────────────────────────────────────────────
      loadTestData: () => {
        import('../data/testProfiles').then(({ testProfiles }) => {
          // Create contacts from test profiles
          const testContacts = testProfiles.map((profile, index) => {
            const id = `test-${index + 1}`;
            const now = new Date().toISOString();
            const fullName = `${profile.firstName} ${profile.lastName}`.trim();
            
            // Default classification for test data
            return {
              // Identity
              id,
              firstName: profile.firstName,
              lastName: profile.lastName,
              fullName,
              linkedInUrl: profile.linkedInUrl,

              // Profile
              currentJobTitle: profile.currentJobTitle,
              company: profile.company,
              headline: profile.headline,
              about: profile.about,
              location: profile.location,
              industry: '',
              previousCompany: '',
              relevantSkills: [],
              tags: [],
              hiringIndicator: false,
              referralIndicator: false,

              // Classification (will be updated by classification engine when added)
              isRelevant: true,
              function: 'UNKNOWN' as const,
              seniority: '',
              category: 'MANUAL_REVIEW' as const,
              confidence: 'LOW' as const,
              classificationReason: 'Test data - needs classification',
              personalizationNotes: '',

              // Message
              generatedMessage: '',
              messageStatus: 'NONE' as const,

              // Workflow
              status: 'NEW' as const,
              reviewStatus: 'PENDING' as const,

              // Tracking
              contactedDate: '',
              responseStatus: 'NONE' as const,
              followUpDate: '',
              userNotes: profile.userNotes,

              // Metadata
              createdAt: now,
              lastUpdated: now,
            };
          });

          set({ contacts: testContacts });
        }).catch(error => {
          console.error('Failed to load test data:', error);
        });
      },

      // ── clearAll ──────────────────────────────────────────────────────────
      clearAll: () => {
        set({ contacts: [] });
      },
    }),
    {
      name: 'outreach-crm-v1',
      // Only persist the contacts array; actions are recreated on hydration
      partialize: (state) => ({ contacts: state.contacts }),
    }
  )
);

// ─── Derived Selectors (pure functions, not hooks) ────────────────────────────
// Used internally by hooks and by the store's loadTestData action.

export function selectContactsByStatus(
  contacts: Contact[],
  status: ContactStatus
): Contact[] {
  return contacts.filter((c) => c.status === status);
}

export function selectContactsByCategory(
  contacts: Contact[],
  category: Category
): Contact[] {
  return contacts.filter((c) => c.category === category);
}

export function selectFollowUpContacts(contacts: Contact[]): Contact[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return contacts.filter((c) => {
    if (!c.followUpDate) return false;
    const due = new Date(c.followUpDate);
    due.setHours(0, 0, 0, 0);
    return (
      due <= today &&
      (c.status === 'CONTACTED' || c.status === 'NO_RESPONSE')
    );
  });
}
