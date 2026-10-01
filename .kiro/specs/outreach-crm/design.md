# Design: Outreach CRM

## Technology Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Build tool | Vite | 5.x | Fast HMR, first-class PWA plugin, clean static output |
| UI framework | React | 18.x | Component model fits CRM patterns |
| Language | TypeScript | 5.x | Type safety critical for data model correctness |
| Styling | Tailwind CSS | 3.x | Utility-first; matches professional palette; zero runtime |
| Routing | React Router | 6.x | SPA routing; sidebar nav model |
| Global state | Zustand | 4.x | Lightweight; built-in persist middleware; no boilerplate |
| Persistence | localStorage (via Zustand persist) | — | Zero-server; works offline; survives restarts |
| PWA | vite-plugin-pwa | 0.x | Workbox-powered SW + manifest injection |
| Icons | Lucide React | latest | Tree-shakeable; consistent line icon set |
| Toasts | react-hot-toast | latest | Lightweight; accessible; non-blocking |
| Dates | date-fns | 3.x | Lightweight; predictable; no global state |
| Testing | Vitest + React Testing Library | latest | Native Vite integration |

No backend. No external API calls. 100% client-side.

---

## Project Folder Structure

```
linkedin crm/
├── .kiro/
│   ├── steering/                      ← 8 steering files
│   └── specs/outreach-crm/            ← this spec
├── public/
│   ├── manifest.webmanifest           ← PWA manifest
│   ├── offline.html                   ← offline fallback page
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── icon-512-maskable.png
├── src/
│   ├── main.tsx                       ← React root + SW registration
│   ├── App.tsx                        ← Router root
│   ├── index.css                      ← Tailwind directives
│   │
│   ├── types/
│   │   └── contact.ts                 ← all TS interfaces and enums
│   │
│   ├── data/
│   │   └── testProfiles.ts            ← 15 seed contacts (spec §33)
│   │
│   ├── engine/
│   │   ├── relevance.ts               ← Stage 1: isRelevant check
│   │   ├── classifier.ts              ← Stage 2+3: function + category
│   │   ├── messageGenerator.ts        ← template filling + team label logic
│   │   └── validator.ts               ← 11-point validation checklist
│   │
│   ├── store/
│   │   └── contactStore.ts            ← Zustand store with persist
│   │
│   ├── hooks/
│   │   ├── useContacts.ts             ← store selector hooks
│   │   ├── useFilters.ts              ← filter state hook
│   │   └── usePWAInstall.ts           ← beforeinstallprompt handler
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx           ← sidebar + main area wrapper
│   │   │   ├── Sidebar.tsx            ← nav links with badge counts
│   │   │   └── MobileNav.tsx          ← bottom nav bar for mobile
│   │   ├── ui/
│   │   │   ├── Badge.tsx              ← status / category / confidence badges
│   │   │   ├── Button.tsx             ← primary / secondary / ghost variants
│   │   │   ├── Card.tsx               ← metric card + surface card
│   │   │   ├── Modal.tsx              ← confirmation dialog
│   │   │   ├── StatusPill.tsx         ← colored pill + text label
│   │   │   └── EmptyState.tsx         ← empty page placeholder
│   │   ├── contacts/
│   │   │   ├── ContactTable.tsx       ← desktop table
│   │   │   ├── ContactCard.tsx        ← mobile card view
│   │   │   ├── ContactRow.tsx         ← single table row + inline actions
│   │   │   ├── ContactFilters.tsx     ← filter panel
│   │   │   └── DuplicateWarning.tsx   ← already-in-CRM banner
│   │   └── messages/
│   │       ├── MessageEditor.tsx      ← editable message textarea
│   │       └── CopyButton.tsx         ← clipboard copy + toast
│   │
│   └── pages/
│       ├── Dashboard.tsx
│       ├── Contacts.tsx
│       ├── AddContact.tsx
│       ├── ContactDetail.tsx
│       ├── MessageQueue.tsx
│       ├── ManualReview.tsx
│       ├── FollowUps.tsx
│       └── Settings.tsx
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Data Model

### Enums

```typescript
// src/types/contact.ts

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
  | 'CAT_1'           // Associate / Executive / Junior
  | 'CAT_2'           // Senior / Lead / Manager
  | 'CAT_3'           // HR / Recruiting / Hiring
  | 'MANUAL_REVIEW';  // Cannot be auto-classified

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
```

### Contact Interface

```typescript
export interface Contact {
  // ─── Identity ─────────────────────────────────────────
  id: string;                    // UUID (crypto.randomUUID)
  firstName: string;
  lastName: string;
  fullName: string;              // computed: firstName + ' ' + lastName
  linkedInUrl: string;           // PRIMARY UNIQUE KEY; validated linkedin.com/in/ URL

  // ─── Profile ──────────────────────────────────────────
  currentJobTitle: string;
  company: string;
  headline: string;              // optional; pasted from LinkedIn
  about: string;                 // optional; pasted from LinkedIn
  location: string;              // optional
  industry: string;              // optional
  previousCompany: string;       // optional
  relevantSkills: string[];      // optional
  tags: string[];                // user-defined tags
  hiringIndicator: boolean;      // true only if profile explicitly states hiring activity
  referralIndicator: boolean;    // true only if referral info explicitly present

  // ─── Classification ───────────────────────────────────
  isRelevant: boolean;
  function: ContactFunction;
  seniority: string;             // e.g. "Junior" | "Senior" | "Manager" | "Associate"
  category: Category;
  confidence: Confidence;
  classificationReason: string;  // human-readable explanation of the classification
  personalizationNotes: string;  // any special notes for message generation

  // ─── Message ──────────────────────────────────────────
  generatedMessage: string;
  messageStatus: MessageStatus;

  // ─── Workflow ─────────────────────────────────────────
  status: ContactStatus;
  reviewStatus: ReviewStatus;

  // ─── Tracking ─────────────────────────────────────────
  contactedDate: string;         // ISO date string | empty string
  responseStatus: ResponseStatus;
  followUpDate: string;          // ISO date string | empty string
  userNotes: string;

  // ─── Metadata ─────────────────────────────────────────
  createdAt: string;             // ISO timestamp
  lastUpdated: string;           // ISO timestamp
}
```

### Add Contact Input Form Shape

```typescript
export interface ProfileInput {
  linkedInUrl: string;
  firstName: string;
  lastName: string;
  currentJobTitle: string;
  company: string;
  headline?: string;
  about?: string;
  location?: string;
  userNotes?: string;
}
```

---

## Classification Engine Design

### Pipeline (src/engine/)

```
ProfileInput
    │
    ▼
relevance.ts → checkRelevance(input)
    │             returns { isRelevant, reason }
    │
    ▼ (if not relevant → status: NOT_RELEVANT, stop)
    │
classifier.ts → classifyFunction(input)
    │             returns ContactFunction
    │
    ├──────────── classifySeniority(input)
    │             returns string ("Junior" | "Senior" | "Manager" | ...)
    │
    └──────────── classifyCategory(input, fn, seniority)
                  returns { category, confidence, reason }
                  LOW confidence → category forced to MANUAL_REVIEW
    │
    ▼
messageGenerator.ts → generateMessage(contact)
    │                  returns string (filled template)
    │                  MANUAL_REVIEW → returns '' (no message)
    │
    ▼
validator.ts → validateMessage(contact)
               returns { valid: boolean, failures: string[] }
               valid   → messageStatus: READY, status: MESSAGE_READY
               invalid → messageStatus: DRAFT, status: REVIEW_REQUIRED
```

### Relevance Engine (relevance.ts)

Relevant keyword groups (tested against job title + headline, case-insensitive):

```typescript
const RELEVANT_TERMS = [
  'payable', 'receivable', ' ap ', 'ap/', '/ap',
  'accounts payable', 'accounts receivable',
  'p2p', 'procure', 'procurement',
  'o2c', 'order to cash', 'order-to-cash',
  'r2r', 'record to report', 'record-to-report',
  'accounting', 'accountant',
  'finance operation', 'finance ops',
  'fintech', 'fin tech',
  'hr', 'human resources', 'hrbp',
  'recruiter', 'recruitment', 'talent acquisition',
  'hiring manager',
];

const DISQUALIFYING_TERMS = [
  'software engineer', 'software developer', 'frontend', 'backend',
  'fullstack', 'devops', 'data engineer', 'machine learning',
  'marketing', 'growth', 'brand',
  'sales', 'business development', 'account executive',
  'legal', 'counsel', 'attorney',
];
```

Logic: if DISQUALIFYING_TERMS match AND no RELEVANT_TERMS match → NOT_RELEVANT.
"Finance" alone without accounting/operations context → treated as MEDIUM confidence,
user should review.

### Classifier (classifier.ts)

**Function classification** (priority waterfall):

```typescript
// Returns the first matching function in priority order
const FUNCTION_PATTERNS: Array<{ fn: ContactFunction; patterns: RegExp[] }> = [
  { fn: 'ACCOUNTS_PAYABLE',    patterns: [/accounts?\s*payable/i, /\bap\b/i] },
  { fn: 'ACCOUNTS_RECEIVABLE', patterns: [/accounts?\s*receivable/i, /\bar\b/i] },
  { fn: 'P2P',                 patterns: [/p2p/i, /procure.to.pay/i, /purchase.to.pay/i] },
  { fn: 'O2C',                 patterns: [/o2c/i, /order.to.cash/i] },
  { fn: 'R2R',                 patterns: [/r2r/i, /record.to.report/i] },
  { fn: 'ACCOUNTING',          patterns: [/\baccounting\b/i, /\baccountant\b/i] },
  { fn: 'FINANCE_OPERATIONS',  patterns: [/finance\s*op/i, /fin\s*op/i] },
  { fn: 'FINANCE',             patterns: [/\bfinance\b/i, /\bfinancial\b/i] },
  { fn: 'FINTECH',             patterns: [/fintech/i, /fin\s*tech/i] },
  { fn: 'HR',                  patterns: [/\bhr\b/i, /human\s*resource/i, /\bhrbp\b/i,
                                           /recruit/i, /talent\s*acqui/i, /hiring/i] },
];
```

**Category classification** (priority order: Cat 3 > Cat 2 > Cat 1):

```typescript
const CAT3_SIGNALS = [
  /\bhr\b/i, /human\s*resource/i, /\bhrbp\b/i,
  /recruit/i, /talent\s*acqui/i,
  /hiring\s*manager/i, /talent\s*partner/i,
  /campus\s*recruit/i,
];

const CAT2_SIGNALS = [
  /\bsenior\b/i, /\blead\b/i, /team\s*lead/i,
  /\bsupervisor\b/i, /\bmanager\b/i, /\bhead\s+of\b/i,
  /assistant\s*manager/i, /senior\s*manager/i,
];

const CAT1_SIGNALS = [
  /\bassociate\b/i, /\bjunior\b/i, /\banalyst\b/i,
  /\bexecutive\b/i,  // only in finance context
];
```

Confidence rules:
- CAT3 match → HIGH (HR/recruiting is explicit)
- CAT2 match + explicit function → HIGH
- CAT2 match + no clear function → MEDIUM
- CAT1 match + explicit function → HIGH
- CAT1 match + only "Finance" or "Executive" → MEDIUM
- "Senior Associate" with no sub-function context → LOW → MANUAL_REVIEW
- No clear signal → LOW → MANUAL_REVIEW

**Special case: "Senior Associate"**
If title contains both "Senior" and "Associate" without a clear function:
→ confidence: LOW → MANUAL_REVIEW with reason: "Senior Associate with ambiguous seniority"

### Message Generator (messageGenerator.ts)

**Function label map** (ContactFunction → display string):

```typescript
const FUNCTION_LABELS: Record<ContactFunction, string> = {
  ACCOUNTS_PAYABLE:    'Accounts Payable',
  ACCOUNTS_RECEIVABLE: 'Accounts Receivable',
  P2P:                 'P2P',
  O2C:                 'O2C',
  R2R:                 'R2R',
  ACCOUNTING:          'Accounting',
  FINANCE_OPERATIONS:  'Finance Operations',
  FINANCE:             'finance',
  FINTECH:             'FinTech',
  HR:                  'HR',
  UNKNOWN:             'finance',
};
```

**Team label map for Category 2** (ContactFunction → "the X team/function"):

```typescript
const TEAM_LABELS: Record<ContactFunction, string> = {
  ACCOUNTS_PAYABLE:    'the Accounts Payable team',
  ACCOUNTS_RECEIVABLE: 'the Accounts Receivable team',
  P2P:                 'the P2P function',
  O2C:                 'the O2C function',
  R2R:                 'the R2R function',
  ACCOUNTING:          'the Accounting team',
  FINANCE_OPERATIONS:  'the Finance Operations team',
  FINANCE:             'the finance team',
  FINTECH:             'the FinTech team',
  HR:                  'the HR team',
  UNKNOWN:             'the finance team',
};
```

Template filling is pure string replacement — no external AI/LLM calls.

### Validator (validator.ts)

Runs 11 checks. Returns `{ valid: boolean, failures: string[] }`.

Checks implemented as assertions:
1. `firstName` is not empty and appears in message
2. `company` is not empty and appears in message
3. `category` is not MANUAL_REVIEW (should not reach validator)
4. `function` is not UNKNOWN
5. `seniority` is not empty
6. Message does not contain any PROHIBITED_PHRASES list items
7. Message does not contain leadership claim keywords unless category is CAT_2
8. Message does not contain hiring claim keywords in assertive form
9. Message length ≥ 100 characters and ≤ 700 characters
10. Message passes a template structure check (expected paragraph markers present)
11. `{{` or `}}` not present in final message (unfilled variable detected)

---

## Zustand Store Design

```typescript
// src/store/contactStore.ts

interface ContactStore {
  contacts: Contact[];

  // ─── CRUD ────────────────────────────────────────────
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  // ─── Lookup ──────────────────────────────────────────
  getContactById: (id: string) => Contact | undefined;
  findDuplicate: (url: string, fullName: string, company: string, title: string)
    => Contact | undefined;

  // ─── Bulk operations ─────────────────────────────────
  importContacts: (contacts: Contact[]) => void;
  loadTestData: () => void;
  clearAll: () => void;
}

// Persisted to localStorage under key: 'outreach-crm-v1'
```

Selector hooks in `src/hooks/useContacts.ts`:
- `useAllContacts()` — all contacts
- `useContactById(id)` — single contact
- `useContactsByStatus(status)` — filtered list
- `useContactsByCategory(cat)` — filtered list
- `useDashboardMetrics()` — computed counts for all dashboard cards
- `useManualReviewContacts()` — REVIEW_REQUIRED + MANUAL_REVIEW
- `useMessageQueueContacts()` — MESSAGE_READY + APPROVED
- `useFollowUpContacts()` — followUpDate ≤ today AND status in [CONTACTED, NO_RESPONSE]

---

## Routing

```
/                     → Dashboard
/contacts             → Contacts (table + filters)
/contacts/add         → Add Contact form
/contacts/:id         → Contact Detail
/messages             → Message Queue
/review               → Manual Review Queue
/followups            → Follow-Ups
/settings             → Settings
```

All routes render inside `AppShell` which provides the sidebar (desktop) and mobile nav.

The router is `createBrowserRouter` (React Router 6). A 404 catch-all redirects to `/`.

---

## UI Component Design

### AppShell

```
Desktop (≥1024px):
┌──────────────────────────────────────────────────────────┐
│ Sidebar (w-56, fixed, full height)  │  Main (flex-1, overflow-y-auto) │
└──────────────────────────────────────────────────────────┘

Mobile (<1024px):
┌──────────────────────────────────────────────────────────┐
│  Main content (full width, pb-16)                        │
├──────────────────────────────────────────────────────────┤
│  Bottom nav bar (fixed bottom, h-16)                     │
└──────────────────────────────────────────────────────────┘
```

### Sidebar Nav Items

| Label | Route | Badge source |
|---|---|---|
| Dashboard | / | — |
| Contacts | /contacts | total contacts count |
| Message Queue | /messages | MESSAGE_READY count |
| Manual Review | /review | REVIEW_REQUIRED count |
| Follow-Ups | /followups | overdue follow-ups count |
| Settings | /settings | — |

### Status Badge Color Map

| Status | Tailwind classes |
|---|---|
| NEW | bg-gray-100 text-gray-700 |
| REVIEW_REQUIRED | bg-amber-100 text-amber-800 |
| MESSAGE_READY | bg-blue-100 text-blue-800 |
| APPROVED | bg-indigo-100 text-indigo-800 |
| CONTACTED | bg-green-100 text-green-800 |
| REPLIED | bg-emerald-100 text-emerald-800 |
| FOLLOW_UP | bg-orange-100 text-orange-800 |
| NO_RESPONSE | bg-gray-100 text-gray-600 |
| NOT_RELEVANT | bg-red-50 text-red-600 |
| REJECTED | bg-red-100 text-red-800 |

### Category Badge Color Map

| Category | Tailwind classes |
|---|---|
| CAT_1 | bg-blue-100 text-blue-800 |
| CAT_2 | bg-purple-100 text-purple-800 |
| CAT_3 | bg-teal-100 text-teal-800 |
| MANUAL_REVIEW | bg-amber-100 text-amber-800 |

### Confidence Badge Color Map

| Confidence | Tailwind classes |
|---|---|
| HIGH | bg-green-100 text-green-800 |
| MEDIUM | bg-amber-100 text-amber-800 |
| LOW | bg-red-100 text-red-800 |

---

## PWA Configuration

### vite.config.ts (VitePWA plugin)

```typescript
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['icons/*.png', 'offline.html'],
  manifest: {
    name: 'Outreach CRM',
    short_name: 'Outreach',
    description: 'Personal LinkedIn job-search outreach CRM',
    theme_color: '#4F46E5',
    background_color: '#F9FAFB',
    display: 'standalone',
    start_url: '/',
    scope: '/',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512-maskable.png', sizes: '512x512',
        type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
        handler: 'CacheFirst',
        options: { cacheName: 'google-fonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } },
      },
    ],
    navigateFallback: 'index.html',
  },
})
```

### Icon Generation

Icons generated programmatically using `canvas` API in a build script, or provided as
static PNG files. Minimum required sizes: 192×192, 512×512, 512×512 maskable.

Design: indigo (#4F46E5) rounded square background, white "O" lettermark.

---

## Test Data (15 Seed Profiles)

The 15 profiles map to expected outcomes as follows:

| # | Name | Title | Company | Expected Category | Expected Confidence |
|---|---|---|---|---|---|
| 1 | Priya Sharma | Accounts Payable Associate | Genpact | CAT_1 | HIGH |
| 2 | Rohan Mehta | Accounts Receivable Executive | Infosys BPM | CAT_1 | HIGH |
| 3 | Ananya Singh | P2P Analyst | Accenture | CAT_1 | HIGH |
| 4 | Karan Patel | O2C Analyst | Wipro | CAT_1 | HIGH |
| 5 | Sunita Rao | Finance Manager | TCS | CAT_2 | HIGH |
| 6 | Deepak Nair | AP Team Lead | EXL Service | CAT_2 | HIGH |
| 7 | Meena Iyer | R2R Supervisor | Capgemini | CAT_2 | HIGH |
| 8 | Arjun Kumar | Senior Associate – P2P | HCL BPO | CAT_2 | MEDIUM |
| 9 | Pooja Verma | HRBP | Deloitte | CAT_3 | HIGH |
| 10 | Vikram Choudhary | Talent Acquisition Specialist | KPMG | CAT_3 | HIGH |
| 11 | Nisha Gupta | Hiring Manager – Finance | Ernst & Young | CAT_3 | HIGH |
| 12 | Rahul Joshi | Software Engineer | Google | NOT_RELEVANT | HIGH |
| 13 | Swati Bose | Senior Associate – Finance | Mphasis | MANUAL_REVIEW | LOW |
| 14 | Aditya Shetty | Finance Manager | Oracle | CAT_2 | HIGH |
| 15 | Kavitha Reddy | HR Executive | Unilever | CAT_3 | HIGH |

---

## Security Design

| Concern | Implementation |
|---|---|
| LinkedIn automation | Only `window.open(url, '_blank', 'noopener,noreferrer')` is used |
| Data transmission | Zero network requests. All data in localStorage. |
| Credential storage | None — no passwords, tokens, or sessions |
| XSS prevention | All data rendered via React JSX (escaped by default). No `dangerouslySetInnerHTML`. |
| Clipboard | Only on explicit `[COPY MESSAGE]` click via `navigator.clipboard.writeText()` |
| URL validation | Regex: `/^https:\/\/(www\.)?linkedin\.com\/in\//` |
| Input sanitization | All string fields trimmed; max lengths enforced on form submit |
| Dynamic code | No `eval()`, no `new Function()`, no dynamic `import()` of user data |
| Data export | `URL.createObjectURL(new Blob([json]))` — client-side only |
| Import validation | Schema shape validated before any data is written to store |
