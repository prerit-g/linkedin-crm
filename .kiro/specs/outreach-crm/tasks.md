# Tasks: Outreach CRM

## Implementation Principles

- Each phase must leave the application in a buildable, runnable state
- Run `npm run build` at the end of every phase — fix all errors before starting the next
- Never break the build to add a feature
- Each phase has its own Definition of Done before proceeding

---

## Phase 1 — Project Foundation & Database

**Goal:** Working project scaffold with types, store, and persistence. App boots with routing.
Nothing is rendered beyond a skeleton shell, but all data infrastructure is solid.

### 1.1 — Initialize project

- [ ] Create `package.json` with pinned dependency versions:
  - **Runtime:** `react@18`, `react-dom@18`, `react-router-dom@6`, `zustand@4`,
    `lucide-react`, `react-hot-toast`, `date-fns@3`
  - **Dev:** `vite@5`, `@vitejs/plugin-react`, `vite-plugin-pwa`,
    `typescript@5`, `@types/react`, `@types/react-dom`,
    `tailwindcss@3`, `autoprefixer`, `postcss`,
    `vitest`, `@testing-library/react`, `@testing-library/jest-dom`,
    `@vitest/ui`, `jsdom`
- [ ] Create `vite.config.ts`:
  - React plugin
  - VitePWA plugin (stub config — full config in Phase 8)
  - Vitest config (`environment: 'jsdom'`, `globals: true`, `setupFiles`)
  - Path alias: `@` → `src/`
- [ ] Create `tsconfig.json` with strict mode, `paths` for `@` alias
- [ ] Create `tailwind.config.ts`:
  - Content paths for all `src/**/*.tsx`
  - Extend theme with brand colors: `indigo-600 = #4F46E5`, `indigo-700 = #4338CA`
  - Font family: `Inter, system-ui, sans-serif`
- [ ] Create `postcss.config.js`
- [ ] Create `vitest.setup.ts` with `@testing-library/jest-dom` import

### 1.2 — Entry HTML

- [ ] Create `index.html`:
  - `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
  - `<meta name="theme-color" content="#4F46E5">`
  - `<meta name="apple-mobile-web-app-capable" content="yes">`
  - `<meta name="apple-mobile-web-app-status-bar-style" content="default">`
  - `<meta name="apple-mobile-web-app-title" content="Outreach CRM">`
  - `<link rel="manifest" href="/manifest.webmanifest">`
  - Title: `Outreach CRM`

### 1.3 — TypeScript data model

- [ ] Create `src/types/contact.ts` with all enums:
  - `ContactStatus`: `NEW | REVIEW_REQUIRED | MESSAGE_READY | APPROVED | CONTACTED | REPLIED | FOLLOW_UP | NO_RESPONSE | NOT_RELEVANT | REJECTED`
  - `Category`: `CAT_1 | CAT_2 | CAT_3 | MANUAL_REVIEW`
  - `Confidence`: `HIGH | MEDIUM | LOW`
  - `ContactFunction`: `ACCOUNTS_PAYABLE | ACCOUNTS_RECEIVABLE | P2P | O2C | R2R | ACCOUNTING | FINANCE_OPERATIONS | FINANCE | FINTECH | HR | UNKNOWN`
  - `MessageStatus`: `NONE | DRAFT | READY | APPROVED | SENT`
  - `ResponseStatus`: `NONE | POSITIVE | NEGATIVE | NEUTRAL`
  - `ReviewStatus`: `PENDING | APPROVED | REJECTED`
- [ ] Create `Contact` interface with all fields:
  - Identity: `id`, `firstName`, `lastName`, `fullName`, `linkedInUrl`
  - Profile: `currentJobTitle`, `company`, `headline`, `about`, `location`,
    `industry`, `previousCompany`, `relevantSkills[]`, `tags[]`,
    `hiringIndicator`, `referralIndicator`
  - Classification: `isRelevant`, `function`, `seniority`, `category`,
    `confidence`, `classificationReason`, `personalizationNotes`
  - Message: `generatedMessage`, `messageStatus`
  - Workflow: `status`, `reviewStatus`
  - Tracking: `contactedDate`, `responseStatus`, `followUpDate`, `userNotes`
  - Metadata: `createdAt`, `lastUpdated`
- [ ] Create `ProfileInput` interface (form submission shape):
  - Required: `linkedInUrl`, `firstName`, `currentJobTitle`, `company`
  - Optional: `lastName`, `headline`, `about`, `location`, `userNotes`
- [ ] Create `src/types/index.ts` barrel export

### 1.4 — Zustand store

- [ ] Create `src/store/contactStore.ts`:
  - Store interface: `contacts: Contact[]`
  - `addContact(contact)` — pushes to array; silently rejects if duplicate exists
  - `updateContact(id, updates)` — shallow merge; always updates `lastUpdated`
  - `deleteContact(id)` — removes by id
  - `getContactById(id)` — pure selector, returns `Contact | undefined`
  - `findDuplicate(url, fullName, company, title)`:
    - First check: exact LinkedIn URL match (case-insensitive)
    - Fallback: `fullName + company + currentJobTitle` match (case-insensitive, trimmed)
    - Returns existing `Contact` or `undefined`
  - `importContacts(contacts)` — overwrites entire array (caller must confirm first)
  - `loadTestData()` — calls `loadTestContacts()` from `src/data/testProfiles.ts`
  - `clearAll()` — resets `contacts` to `[]`
  - Wrap with `persist` middleware, key `outreach-crm-v1`

### 1.5 — Selector hooks

- [ ] Create `src/hooks/useContacts.ts`:
  - `useAllContacts()` — all contacts
  - `useContactById(id: string)` — single contact or undefined
  - `useContactsByStatus(status: ContactStatus)` — filtered
  - `useContactsByCategory(category: Category)` — filtered
  - `useDashboardMetrics()` → computed object:
    ```
    {
      total, relevant, cat1, cat2, cat3,
      manualReview, messagesReady, approved,
      contacted, replied, followUpsDue, notRelevant
    }
    ```
  - `useManualReviewContacts()` → contacts where `status === 'REVIEW_REQUIRED'`
  - `useMessageQueueContacts()` → status is `MESSAGE_READY` or `APPROVED`
  - `useFollowUpContacts()` → `followUpDate ≤ today` AND status in `[CONTACTED, NO_RESPONSE]`
- [ ] Create `src/hooks/useFilters.ts`:
  - Local filter state: `category`, `function`, `company` (text), `status`, `confidence`
  - `applyFilters(contacts: Contact[]): Contact[]` — applies all active filters
  - `clearFilters()` — resets all filter values
  - `activeFilterCount: number` — count of non-default filter values

### 1.6 — Entry point and skeleton routing

- [ ] Create `src/index.css` — `@tailwind base; @tailwind components; @tailwind utilities;`
- [ ] Create `src/main.tsx` — React root mount to `#root`
- [ ] Create `src/App.tsx` — `createBrowserRouter` with 8 stub routes:
  - `/` → placeholder `<div>Dashboard</div>`
  - `/contacts` → placeholder
  - `/contacts/add` → placeholder
  - `/contacts/:id` → placeholder
  - `/messages` → placeholder
  - `/review` → placeholder
  - `/followups` → placeholder
  - `/settings` → placeholder
  - `*` → redirect to `/`
- [ ] Verify `npm run dev` boots without errors
- [ ] Verify `npm run build` succeeds
- [ ] Verify `npm run test` runs (0 tests pass = acceptable at this stage)

**Phase 1 Definition of Done:**
- `npm run dev` starts cleanly
- `npm run build` succeeds with no errors
- TypeScript strict mode has no type errors
- Store reads/writes work (manually verify via browser console)
- All types are exported and importable

---

## Phase 2 — Contact CRM

**Goal:** Full CRUD UI for contacts. Add, view, browse, filter, and update contact records.
No classification engine yet — contacts sit in `NEW` status after manual entry.
The app becomes genuinely usable for storing contacts.

### 2.1 — UI primitives

- [ ] Create `src/components/ui/Button.tsx`:
  - Props: `variant` (primary | secondary | ghost | danger), `size` (sm | md | lg),
    `disabled`, `loading`, `icon`, `onClick`, standard button props
  - Primary: `bg-indigo-600 hover:bg-indigo-700 text-white`
  - Secondary: `bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`
  - Ghost: `text-gray-600 hover:bg-gray-100`
  - Danger: `bg-red-600 hover:bg-red-700 text-white`
  - Disabled + loading states
- [ ] Create `src/components/ui/Badge.tsx`:
  - Props: `variant` (default | primary | success | warning | error | info)
  - Small pill with text label
- [ ] Create `src/components/ui/StatusPill.tsx`:
  - Props: `status: ContactStatus`
  - Maps each status to correct Tailwind color classes (per ui-ux.md color map)
  - Always shows text label, never color-only
- [ ] Create `src/components/ui/CategoryBadge.tsx`:
  - Props: `category: Category`
  - Maps: CAT_1→blue, CAT_2→purple, CAT_3→teal, MANUAL_REVIEW→amber
  - Label: "Cat 1" | "Cat 2" | "Cat 3" | "Manual Review"
- [ ] Create `src/components/ui/ConfidenceBadge.tsx`:
  - Props: `confidence: Confidence`
  - Maps: HIGH→green, MEDIUM→amber, LOW→red
- [ ] Create `src/components/ui/Card.tsx`:
  - White surface, rounded-lg, shadow-sm, border
  - Optional `header` slot, optional `footer` slot
  - `padding` prop (default md)
- [ ] Create `src/components/ui/Modal.tsx`:
  - Accessible dialog: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
  - Focus trap on open, restore focus on close
  - Overlay backdrop, centered content panel
  - Close on Escape key and overlay click
  - `title`, `children`, `footer`, `onClose` props
- [ ] Create `src/components/ui/EmptyState.tsx`:
  - Lucide icon, heading, subtext, optional CTA button
  - Centered, muted styling
- [ ] Create `src/components/ui/index.ts` barrel

### 2.2 — App shell and navigation

- [ ] Create `src/components/layout/Sidebar.tsx`:
  - App logo + "Outreach CRM" wordmark at top
  - Nav items: Dashboard, Contacts, Message Queue, Manual Review, Follow-Ups, Settings
  - Each nav item: icon (Lucide) + label + optional numeric badge
  - Active item: indigo background, white text
  - Inactive item: gray-700 text, hover:bg-gray-100
  - Badge values from `useDashboardMetrics()`:
    - Contacts: total count
    - Message Queue: messagesReady count
    - Manual Review: manualReview count
    - Follow-Ups: followUpsDue count
  - Fixed left, full height, `w-56`, `bg-white`, `border-r border-gray-200`
- [ ] Create `src/components/layout/MobileNav.tsx`:
  - Fixed bottom bar, `h-16`, `bg-white`, `border-t border-gray-200`
  - 5 items: Dashboard, Contacts, Queue, Review, More
  - "More" shows a slide-up sheet with Follow-Ups and Settings links
  - Active item: indigo icon + label
  - Visible only at `< lg` breakpoint
- [ ] Create `src/components/layout/AppShell.tsx`:
  - Desktop (`lg+`): `flex` row, `Sidebar` fixed left + main area fills remaining width
  - Mobile: main area full width with `pb-16` for bottom nav clearance
  - Renders `<Outlet />` in main area
  - Wraps `<Toaster />` from react-hot-toast
- [ ] Update `src/App.tsx` — wrap all routes inside `AppShell`

### 2.3 — Add Contact form

- [ ] Create `src/components/contacts/DuplicateWarning.tsx`:
  - Props: `existing: Contact`
  - Shows: "This contact is already in your CRM" with name, company, status
  - Link: [View Existing Contact] navigates to `/contacts/:id`
- [ ] Create `src/pages/AddContact.tsx`:
  - Form fields (all from `ProfileInput`):
    - LinkedIn URL (required) — real-time validation: must contain `linkedin.com/in/`
    - First Name (required)
    - Last Name (optional)
    - Current Job Title (required)
    - Company (required)
    - Headline / About (optional, textarea — "Paste from LinkedIn profile")
    - Location (optional)
    - Additional Notes (optional)
  - On LinkedIn URL blur: run `findDuplicate()` by URL; show `DuplicateWarning` if found
  - On form submit:
    - Validate required fields (inline error messages per field)
    - Run `findDuplicate()` again (full check)
    - If duplicate found: block submit, show warning
    - If new: create `Contact` with `status: 'NEW'` and `category: 'MANUAL_REVIEW'`
      (classification engine added in Phase 3 — for now just store raw)
    - Call `addContact(contact)`
    - Navigate to `/contacts/:id`
  - Cancel button: navigates back
  - Character counts on textarea fields

### 2.4 — Contact table and filters

- [ ] Create `src/hooks/useFilters.ts` (move from Phase 1 if not yet done):
  - State: `{ category, function: fn, company, status, confidence, responseStatus }`
  - `applyFilters(contacts)` — AND logic across all active filters
  - `clearFilters()`
  - `activeFilterCount`
- [ ] Create `src/components/contacts/ContactFilters.tsx`:
  - Category dropdown: All | Cat 1 | Cat 2 | Cat 3 | Manual Review
  - Function dropdown: All | Accounts Payable | AR | P2P | O2C | R2R | Accounting | Finance Ops | Finance | FinTech | HR
  - Company text input (live filter)
  - Status dropdown: All | + each status value
  - Confidence dropdown: All | High | Medium | Low
  - Active filter count badge: "3 filters active" + [Clear All] button
  - Collapsible on mobile (default collapsed)
- [ ] Create `src/components/contacts/ContactRow.tsx`:
  - Columns: Name (bold) | Role | Company | Function badge | Category badge |
    Confidence badge | Status pill | Actions
  - Actions (icon buttons with tooltips + aria-labels):
    - [View] → navigates to `/contacts/:id`
    - [Copy Message] → disabled if `generatedMessage` is empty; enabled in Phase 4
    - [Open LinkedIn] → disabled if `linkedInUrl` empty; enabled in Phase 6
    - [Approve] → visible only when status is `MESSAGE_READY`
    - [Mark Contacted] → available from APPROVED status onward
  - Hover state: `hover:bg-gray-50`
- [ ] Create `src/components/contacts/ContactTable.tsx`:
  - Sticky header row (`sticky top-0 bg-white z-10`)
  - Maps filtered contacts to `ContactRow`
  - Shows count: "Showing X of Y contacts"
  - `EmptyState` when filtered list is empty ("No contacts match your filters")
  - `EmptyState` when all contacts empty ("Add your first contact")
- [ ] Create `src/components/contacts/ContactCard.tsx` (mobile):
  - Card layout: Name + status pill on top row, role + company below, badges row,
    actions row at bottom
  - Tap anywhere on card → navigates to Contact Detail
  - Visible below `lg` breakpoint
- [ ] Create `src/pages/Contacts.tsx`:
  - Page header: "Contacts" + count + [Add Contact] button (→ `/contacts/add`)
  - Desktop: `ContactFilters` (collapsible sidebar or above table) + `ContactTable`
  - Mobile: `ContactFilters` (collapsible) + `ContactCard` list
  - Sort: default by `lastUpdated` descending

### 2.5 — Contact Detail page

- [ ] Create `src/components/messages/CopyButton.tsx`:
  - Props: `message: string`, `disabled?: boolean`
  - Calls `navigator.clipboard.writeText(message)`
  - On success: `toast.success('Message copied to clipboard')`
  - On failure: `toast.error('Copy failed — please select the text manually')`
  - Shows "Copied!" text for 2s after success
- [ ] Create `src/components/messages/MessageEditor.tsx`:
  - Props: `message: string`, `onSave: (msg: string) => void`, `onRegenerate?: () => void`,
    `readOnly?: boolean`
  - Display mode: shows message in a styled pre-wrap div
  - Edit mode: textarea, character count (`${n}/700`), [Save] [Cancel] buttons
  - [Edit] button toggles to edit mode
  - [Regenerate] button — shows confirmation "This will replace the current message" if
    message exists; calls `onRegenerate()`
  - [Approve] button — calls back to parent
- [ ] Create `src/pages/ContactDetail.tsx`:
  - Load contact from store by `params.id`; navigate to `/contacts` if not found
  - Breadcrumb: `[← Contacts]` + contact name
  - **PROFILE section** (Card):
    - Name (h2), Role, Company
    - Function badge, Seniority label, Confidence badge
    - LinkedIn URL: displayed as text + [Visit Profile] icon link (opens in new tab,
      noopener/noreferrer — no special handling yet; LinkedIn workflow in Phase 6)
    - Location, Tags (editable inline)
  - **CLASSIFICATION section** (Card):
    - Category badge (large), Confidence badge, classification reason text
    - Note: "This contact is awaiting classification" if status is NEW (Phase 3 adds engine)
  - **MESSAGE section** (Card):
    - `MessageEditor` component
    - Note: "No message generated yet" if `generatedMessage` is empty (Phase 4 adds engine)
    - [Copy] button (CopyButton)
  - **LINKEDIN section** (Card) — placeholder in this phase; full behavior in Phase 6:
    - [Open LinkedIn Profile] button (simple link for now)
  - **TRACKING section** (Card):
    - Status: dropdown selector, saves on change
    - Contacted Date: date picker (shown when status is CONTACTED+)
    - Response Status: dropdown
    - Follow-Up Date: date picker
    - User Notes: textarea, [Save Notes] button
    - Last Updated: displayed (read-only)
  - All tracking updates call `updateContact(id, updates)`
  - Toast on save: "Contact updated"

### 2.6 — Build and smoke test

- [ ] `npm run build` — no errors
- [ ] `npm run dev` — smoke test all 8 routes
- [ ] Add a contact manually — verify it appears in Contacts table
- [ ] Edit tracking fields — verify changes persist after page refresh
- [ ] Verify duplicate warning fires when re-entering same LinkedIn URL

**Phase 2 Definition of Done:**
- All contacts pages render correctly on desktop and mobile
- Add Contact form validates and saves
- Duplicate detection works
- Contacts table filters work
- Contact Detail shows all sections and saves tracking data
- Build succeeds with no errors

---

## Phase 3 — Classification Engine

**Goal:** Pure TypeScript classification engine with full unit test coverage.
When a contact is added, it is automatically classified (relevant/not, function, category,
confidence). The engine runs purely in the browser — no external calls.

### 3.1 — Relevance engine

- [ ] Create `src/engine/relevance.ts`:
  - `RELEVANT_TERMS: string[]` — full list from design.md
  - `DISQUALIFYING_TERMS: string[]` — full list from design.md
  - `checkRelevance(input: ProfileInput): { isRelevant: boolean; reason: string }`:
    - Concatenate `currentJobTitle + ' ' + (headline ?? '')` as search text
    - If any disqualifying term matches AND no relevant term matches → `isRelevant: false`
    - If any relevant term matches → `isRelevant: true`
    - If only "finance" matches (not in accounting/ops context) → `isRelevant: true` with
      reason flagging LOW confidence for upstream caller
    - No match either way → `isRelevant: false`, reason: "No relevant function detected"
- [ ] Create `src/engine/relevance.test.ts`:
  - Test profiles 1–11: all → `isRelevant: true`
  - Test profile 12 (Software Engineer): → `isRelevant: false`
  - Test profiles 13–15: → `isRelevant: true`
  - Edge cases: "Finance Director" → relevant, "IT Finance Analyst" → relevant,
    "Marketing Manager" → not relevant, "Sales Operations" → not relevant

### 3.2 — Function and category classifier

- [ ] Create `src/engine/classifier.ts`:
  - `FUNCTION_PATTERNS: Array<{ fn: ContactFunction; patterns: RegExp[] }>`:
    Ordered priority waterfall — first match wins:
    1. `ACCOUNTS_PAYABLE`: `/accounts?\s*payable/i`, `/\bap\b/i`
    2. `ACCOUNTS_RECEIVABLE`: `/accounts?\s*receivable/i`, `/\bar\b/i`
    3. `P2P`: `/p2p/i`, `/procure.to.pay/i`, `/purchase.to.pay/i`
    4. `O2C`: `/o2c/i`, `/order.to.cash/i`
    5. `R2R`: `/r2r/i`, `/record.to.report/i`
    6. `ACCOUNTING`: `/\baccounting\b/i`, `/\baccountant\b/i`
    7. `FINANCE_OPERATIONS`: `/finance\s*op/i`, `/fin\s*op/i`
    8. `FINANCE`: `/\bfinance\b/i`, `/\bfinancial\b/i`
    9. `FINTECH`: `/fintech/i`, `/fin\s*tech/i`
    10. `HR`: `/\bhr\b/i`, `/human\s*resource/i`, `/\bhrbp\b/i`, `/recruit/i`,
        `/talent\s*acqui/i`, `/hiring/i`
  - `CAT3_SIGNALS: RegExp[]`: HR, HRBP, recruiter, talent acquisition, hiring manager,
    talent partner, campus recruiter
  - `CAT2_SIGNALS: RegExp[]`: senior, lead, team lead, supervisor, manager, head of,
    assistant manager, senior manager
  - `CAT1_SIGNALS: RegExp[]`: associate, junior, analyst, executive (in finance context)
  - `classifyFunction(input: ProfileInput): ContactFunction`:
    - Search text: `currentJobTitle + ' ' + (headline ?? '')`
    - Return first `FUNCTION_PATTERNS` entry whose pattern matches; else `'UNKNOWN'`
  - `classifySeniority(input: ProfileInput): string`:
    - Search title for: Junior → "Junior", Senior → "Senior", Manager → "Manager",
      Lead/Team Lead → "Lead", Supervisor → "Supervisor", Associate → "Associate",
      Analyst → "Analyst", Executive → "Executive"
    - Returns most senior matching label (Senior > Manager > Lead > Supervisor > Associate > Analyst > Executive > Junior > "")
  - `classifyCategory(input, fn, seniority): { category: Category; confidence: Confidence; reason: string }`:
    - Search text: `currentJobTitle + ' ' + (headline ?? '')`
    - **Step 1 — Cat 3 check:** if any `CAT3_SIGNALS` match → CAT_3, HIGH
    - **Step 2 — Cat 2 check:** if any `CAT2_SIGNALS` match AND fn is not UNKNOWN → CAT_2, HIGH
    - **Step 2b:** if any `CAT2_SIGNALS` match AND fn IS UNKNOWN → CAT_2, MEDIUM
    - **Step 3 — Senior Associate special case:** if title matches `/senior\s*associate/i` AND
      no explicit function beyond "Finance" → MANUAL_REVIEW, LOW
    - **Step 4 — Cat 1 check:** if any `CAT1_SIGNALS` match → CAT_1, HIGH (with explicit fn),
      MEDIUM (with generic Finance/FinTech fn)
    - **Step 5 — Fallback:** no signal → MANUAL_REVIEW, LOW
    - LOW confidence always outputs MANUAL_REVIEW regardless of category guess
- [ ] Create `src/engine/classifier.test.ts`:
  - All 15 seed profiles → verify expected category + confidence (table in design.md)
  - Special cases: "Senior Associate – P2P" → CAT_2, MEDIUM
  - "Senior Associate" (no function) → MANUAL_REVIEW, LOW
  - "Finance Executive" → CAT_1, MEDIUM
  - "HRBP" → CAT_3, HIGH
  - "Finance Manager | HRBP" → CAT_3, HIGH (Cat 3 priority wins)
  - "HR Executive" → CAT_3, HIGH

### 3.3 — Pipeline orchestrator

- [ ] Create `src/engine/pipeline.ts`:
  - `processProfile(input: ProfileInput): Contact`:
    1. `id = crypto.randomUUID()`
    2. `fullName = firstName + ' ' + lastName`
    3. `createdAt = lastUpdated = new Date().toISOString()`
    4. `{ isRelevant, reason: relevanceReason } = checkRelevance(input)`
    5. If `!isRelevant`:
       - `status = 'NOT_RELEVANT'`, `category = 'MANUAL_REVIEW'`,
         `function = 'UNKNOWN'`, `confidence = 'HIGH'`, `isRelevant = false`
       - Skip classifier and generator
    6. If `isRelevant`:
       - `fn = classifyFunction(input)`
       - `seniority = classifySeniority(input)`
       - `{ category, confidence, reason } = classifyCategory(input, fn, seniority)`
       - If `category === 'MANUAL_REVIEW'`: `status = 'REVIEW_REQUIRED'`, skip generator
       - Else: proceed to generator and validator (Phase 4)
    7. Return fully-populated `Contact` object
    8. All unset optional string fields default to `''`; array fields default to `[]`
    9. `messageStatus = 'NONE'` for NOT_RELEVANT and MANUAL_REVIEW
- [ ] Create `src/engine/pipeline.test.ts`:
  - All 15 seed profiles: verify `status` and `category` match expected table
  - Profile 12 → `status: NOT_RELEVANT`, `isRelevant: false`
  - Profile 13 → `status: REVIEW_REQUIRED`, `category: MANUAL_REVIEW`

### 3.4 — Test seed data

- [ ] Create `src/data/testProfiles.ts`:
  - `TEST_PROFILE_INPUTS: ProfileInput[]` — 15 profile inputs (exact data from design.md table)
  - `loadTestContacts(): Contact[]` — maps all 15 through `processProfile()`
  - Used by `store.loadTestData()` and unit tests

### 3.5 — Wire engine into Add Contact form

- [ ] Update `src/pages/AddContact.tsx`:
  - Replace manual `Contact` construction with `processProfile(input)` call
  - Show loading indicator during processing (even though sync, good UX pattern)
  - After `processProfile()`: check `contact.status` and show appropriate toast:
    - `NOT_RELEVANT` → toast.error("Contact not relevant to your job target")
    - `REVIEW_REQUIRED` → toast("Classified — manual review needed")
    - `MESSAGE_READY` → toast.success("Contact classified — message ready")
  - Still call `addContact(contact)` and navigate regardless of status

### 3.6 — Build and test

- [ ] `npm run test` — all engine unit tests pass
- [ ] `npm run build` — no errors
- [ ] Load test data via store (temporary button in Settings stub or browser console)
- [ ] Verify all 15 profiles have correct category in Contacts table

**Phase 3 Definition of Done:**
- All 15 seed profiles classify correctly
- All engine unit tests pass (relevance, classifier, pipeline)
- `npm run build` succeeds
- Classification results visible in Contacts table for newly added contacts

---

## Phase 4 — Personalization / Message Engine

**Goal:** Message generation and validation pipeline. Every classifiable contact gets a
personalized message built from the correct template. Messages are validated before being
marked READY. The message editor is fully functional.

### 4.1 — Function and team label maps

- [ ] Create `src/engine/messageGenerator.ts`:
  - `FUNCTION_LABELS: Record<ContactFunction, string>`:
    ```
    ACCOUNTS_PAYABLE: 'Accounts Payable'
    ACCOUNTS_RECEIVABLE: 'Accounts Receivable'
    P2P: 'P2P'
    O2C: 'O2C'
    R2R: 'R2R'
    ACCOUNTING: 'Accounting'
    FINANCE_OPERATIONS: 'Finance Operations'
    FINANCE: 'finance'           ← lowercase (used mid-sentence)
    FINTECH: 'FinTech'
    HR: 'HR'
    UNKNOWN: 'finance'
    ```
  - `TEAM_LABELS: Record<ContactFunction, string>`:
    ```
    ACCOUNTS_PAYABLE: 'the Accounts Payable team'
    ACCOUNTS_RECEIVABLE: 'the Accounts Receivable team'
    P2P: 'the P2P function'
    O2C: 'the O2C function'
    R2R: 'the R2R function'
    ACCOUNTING: 'the Accounting team'
    FINANCE_OPERATIONS: 'the Finance Operations team'
    FINANCE: 'the finance team'
    FINTECH: 'the FinTech team'
    HR: 'the HR team'
    UNKNOWN: 'the finance team'
    ```
  - `generateMessage(contact: Contact): string`:
    - If `category === 'MANUAL_REVIEW'`: return `''`
    - CAT_1 template — fill `firstName`, `function` label, `company`
    - CAT_2 template — fill `firstName`, `leadVerb` (always "lead" unless context says otherwise),
      `teamLabel`, `company`
    - CAT_3 template — fill `firstName`, `company`
    - After filling: verify no `{{` or `}}` remain; throw if any unfilled variable detected
  - Exact template strings from `message-templates.md` steering file — do not paraphrase

### 4.2 — Message validator

- [ ] Create `src/engine/validator.ts`:
  - `PROHIBITED_PHRASES: string[]`:
    ```
    'extremely impressed', 'following your', 'incredible journey', 'amazing career',
    'inspired me', 'leader in your field', 'hope this message finds you',
    'wanted to reach out', 'passionate about leveraging', 'mutual value',
    'i have admired'
    ```
  - `LEADERSHIP_CLAIM_PATTERNS: RegExp[]`:
    ```
    /you lead the/i, /you manage the/i, /you run the/i, /you oversee/i,
    /you head the/i
    ```
  - `ASSERTIVE_HIRING_PATTERNS: RegExp[]`:
    ```
    /since you are.*hiring/i, /i saw you posted/i, /you.*posted.*job/i,
    /currently hiring for/i
    ```
  - `validateMessage(contact: Contact): { valid: boolean; failures: string[] }`:
    - Check 1: `contact.firstName` (lowercased) appears in message (lowercased)
    - Check 2: `contact.company` (lowercased) appears in message (lowercased)
    - Check 3: `contact.category !== 'MANUAL_REVIEW'`
    - Check 4: `contact.function !== 'UNKNOWN'`
    - Check 5: `contact.seniority !== ''`
    - Check 6: none of `PROHIBITED_PHRASES` appear in message (case-insensitive)
    - Check 7: no `LEADERSHIP_CLAIM_PATTERNS` unless `category === 'CAT_2'`
    - Check 8: no `ASSERTIVE_HIRING_PATTERNS`
    - Check 9: `message.length >= 100 && message.length <= 700`
    - Check 10: message contains `\n\n` (at least 2 paragraphs)
    - Check 11: message does not contain `{{` or `}}`

### 4.3 — Wire generator and validator into pipeline

- [ ] Update `src/engine/pipeline.ts`:
  - After successful classification (category ≠ MANUAL_REVIEW):
    - `generatedMessage = generateMessage(contact)`
    - `{ valid, failures } = validateMessage({ ...contact, generatedMessage })`
    - If `valid`:
      - `messageStatus = 'READY'`
      - `status = 'MESSAGE_READY'`
    - If `!valid`:
      - `messageStatus = 'DRAFT'`
      - `status = 'REVIEW_REQUIRED'`
      - `classificationReason += '\nValidation failures: ' + failures.join(', ')`
- [ ] Update `src/engine/pipeline.test.ts`:
  - Profiles 1–11, 14–15: verify `status === 'MESSAGE_READY'`
  - Profile 12: `status === 'NOT_RELEVANT'`, `generatedMessage === ''`
  - Profile 13: `status === 'REVIEW_REQUIRED'`, `generatedMessage === ''`

### 4.4 — Message unit tests

- [ ] Create `src/engine/messageGenerator.test.ts`:
  - CAT_1 (AP Associate): message contains "Accounts Payable", correct firstName + company,
    does NOT contain leadership language
  - CAT_1 (AR Executive): message contains "Accounts Receivable"
  - CAT_1 (P2P Analyst): message contains "P2P"
  - CAT_2 (Finance Manager): message contains "lead", "finance team", correct company
  - CAT_2 (AP Team Lead): message contains "Accounts Payable team"
  - CAT_2 (R2R Supervisor): message contains "R2R function"
  - CAT_3 (HRBP): message contains company name, no finance function claim
  - CAT_3 (TA Specialist): correct company
  - MANUAL_REVIEW: returns `''`
  - No `{{` or `}}` in any output
  - No prohibited phrases in any output
- [ ] Create `src/engine/validator.test.ts`:
  - Valid Cat 1/2/3 messages → `valid: true`, `failures: []`
  - Message with "extremely impressed" → `valid: false`, failures contains "Check 6"
  - Message with assertive hiring claim → `valid: false`, failures contains "Check 8"
  - Message with `{{firstName}}` unfilled → `valid: false`, failures contains "Check 11"
  - Message with no paragraphs → `valid: false`, failures contains "Check 10"
  - Message too short (< 100 chars) → `valid: false`, failures contains "Check 9"

### 4.5 — Wire message editor to Contact Detail

- [ ] Update `src/pages/ContactDetail.tsx` MESSAGE section:
  - Show `MessageEditor` with actual `generatedMessage`
  - [Regenerate] calls `generateMessage()` + `validateMessage()`, updates store via
    `updateContact()`, shows toast
  - [Approve] calls `updateContact(id, { status: 'APPROVED', messageStatus: 'APPROVED' })`
  - [Copy] calls `navigator.clipboard.writeText(generatedMessage)`

### 4.6 — Build and test

- [ ] `npm run test` — all generator + validator tests pass
- [ ] `npm run build` — no errors
- [ ] Load test data; verify messages generated for profiles 1–11, 14–15
- [ ] Manually verify Cat 1, Cat 2, Cat 3 messages look correct
- [ ] Verify profile 13 has no message (Manual Review)
- [ ] Verify editing and regenerating a message works on Contact Detail page

**Phase 4 Definition of Done:**
- All 3 message templates generate correctly for all classifiable profiles
- Validator catches all 11 failure conditions
- All message and validator unit tests pass
- Message editor allows edit, save, regenerate on Contact Detail
- `npm run build` succeeds

---

## Phase 5 — Message Queue + Manual Review

**Goal:** Dedicated pages for working through the message pipeline. Users can batch-approve
messages, process the manual review queue, and track follow-ups — all in one workflow.

### 5.1 — Message Queue page

- [ ] Create `src/pages/MessageQueue.tsx`:
  - Page header: "Message Queue" + count badge (MESSAGE_READY + APPROVED)
  - Tabs: "Ready to Approve" (MESSAGE_READY) | "Approved" (APPROVED)
  - Table columns: Name | Company | Function | Category | Status | Actions
  - Row actions:
    - [Copy Message] — `CopyButton`
    - [Open LinkedIn] — placeholder, full behavior Phase 6
    - [Approve] — visible when MESSAGE_READY; calls `updateContact(id, { status: 'APPROVED', messageStatus: 'APPROVED' })`
    - [Mark Contacted] — visible when APPROVED; calls `updateContact(id, { status: 'CONTACTED', contactedDate: today })`
  - Empty state per tab: "No messages ready" / "No approved messages"
  - Bulk actions: [Approve All Ready] with confirmation count

### 5.2 — Manual Review Queue page

- [ ] Create `src/components/contacts/ClassifyManuallyPanel.tsx`:
  - Props: `contact: Contact`, `onSave: (updates: Partial<Contact>) => void`, `onClose: () => void`
  - Display current classification reason prominently
  - Fields:
    - Category: radio buttons (Cat 1 / Cat 2 / Cat 3) — no Manual Review option
    - Function: dropdown (all values)
    - Seniority: text input
    - Personalization Notes: textarea (optional)
  - [Generate Message] button:
    - Calls `generateMessage()` with overridden category + function
    - Calls `validateMessage()`
    - Shows generated message in preview textarea (editable)
    - Shows validation result
  - [Save Classification] button:
    - Validates category + function are set
    - Calls `onSave()` with: category, function, seniority, generatedMessage, messageStatus,
      status (MESSAGE_READY if valid, REVIEW_REQUIRED if invalid)
    - Contact disappears from Manual Review queue
  - [Cancel] closes without saving
- [ ] Create `src/pages/ManualReview.tsx`:
  - Page header: "Manual Review" + count badge
  - Table columns: Name | Role | Company | Detected Function | Possible Category |
    Confidence | Reason for Uncertainty | Actions
  - Row actions: [Classify Manually] (opens ClassifyManuallyPanel as modal) | [View]
  - On [Classify Manually]: show `ClassifyManuallyPanel` in a `Modal`
  - On save: call `updateContact()`, show toast "Contact classified"
  - Empty state: "No contacts need manual review. Great work!"

### 5.3 — Follow-Ups page

- [ ] Create `src/pages/FollowUps.tsx`:
  - Page header: "Follow-Ups" + overdue count badge
  - Table columns: Name | Company | Status | Follow-Up Date | Days Overdue
  - Sort: most overdue first
  - Row actions: [View] | [Open LinkedIn] (Phase 6) | [Copy Message]
  - Prominent note: "Remember to send your follow-up manually on LinkedIn"
  - Days Overdue: computed from `followUpDate` to today; shown in red if > 7 days
  - Empty state: "No follow-ups due — you're all caught up"

### 5.4 — Build and test

- [ ] `npm run build` — no errors
- [ ] Load test data; verify:
  - Message Queue shows profiles with MESSAGE_READY status
  - Manual Review shows profile 13 (ambiguous Senior Associate)
  - Manually classify profile 13 → message generated → moved to Message Queue
  - Approve a message in queue → status changes to APPROVED
  - Mark as Contacted → status changes to CONTACTED

**Phase 5 Definition of Done:**
- Message Queue page renders, tabs work, actions fire correctly
- Manual Review queue shows correct contacts
- ClassifyManuallyPanel generates a message and saves classification
- Follow-Ups page renders (empty state acceptable — no contacts with follow-up dates yet)
- `npm run build` succeeds

---

## Phase 6 — LinkedIn URL / Clipboard Workflow

**Goal:** Full safety-compliant LinkedIn URL handling. The [Open LinkedIn] button opens the
correct URL with `noopener,noreferrer`. The manual action reminder is shown. Clipboard copy
works everywhere. The contact status is NEVER automatically changed by opening LinkedIn.

### 6.1 — LinkedIn URL validation utility

- [ ] Create `src/utils/linkedin.ts`:
  - `LINKEDIN_URL_PATTERN = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-\_\.%]+\/?$/`
  - `isValidLinkedInUrl(url: string): boolean`
  - `normalizeLinkedInUrl(url: string): string` — lowercases scheme/domain, trims trailing slash
  - `openLinkedInProfile(url: string): void`:
    - Validates URL first; if invalid: `toast.error('Invalid LinkedIn URL')`
    - If valid: `window.open(url, '_blank', 'noopener,noreferrer')`
    - Does NOT change any contact status
    - Does NOT communicate with the opened page
  - Unit tests in `src/utils/linkedin.test.ts`:
    - Valid URLs: `https://linkedin.com/in/username`, `https://www.linkedin.com/in/user-name`
    - Invalid URLs: empty string, `https://linkedin.com/`, `http://linkedin.com/in/user`,
      just `linkedin.com/in/user`

### 6.2 — LinkedIn manual action reminder

- [ ] Create `src/components/contacts/LinkedInReminder.tsx`:
  - Props: `visible: boolean`
  - Shows an info banner (blue) with exact text:
    > "LinkedIn is now open in your browser. Please paste your message and send it manually.
    > When done, return here and click [Mark Contacted]."
  - Includes a [Mark Contacted] button that calls back to parent
  - Auto-visible when shown; dismissible after 30 seconds or on user dismiss
  - Rendered inside Contact Detail and Message Queue rows

### 6.3 — Wire [Open LinkedIn] buttons everywhere

- [ ] Update `src/components/contacts/ContactRow.tsx`:
  - [Open LinkedIn] calls `openLinkedInProfile(contact.linkedInUrl)`
  - After click: show `LinkedInReminder` toast (persistent toast with dismiss button)
  - Status does NOT change

- [ ] Update `src/pages/ContactDetail.tsx` LINKEDIN section:
  - Replace placeholder with full implementation:
    - [Open LinkedIn Profile] button → calls `openLinkedInProfile(contact.linkedInUrl)`
    - Reminder text rendered below button (static, always visible when linkedInUrl present):
      > "LinkedIn is now open in your browser. Please paste your message and send it manually.
      > When done, return here and click Mark Contacted."
    - [Mark Contacted] button visible — calls `updateContact(id, { status: 'CONTACTED', contactedDate: today })`
    - URL displayed as text (not an auto-following link)

- [ ] Update `src/pages/MessageQueue.tsx` [Open LinkedIn]:
  - Same `openLinkedInProfile()` call
  - Show `LinkedInReminder` inline banner below the row on click

- [ ] Update `src/pages/FollowUps.tsx` [Open LinkedIn]:
  - Same pattern

### 6.4 — Add Contact form LinkedIn URL field

- [ ] Update `src/pages/AddContact.tsx`:
  - Use `isValidLinkedInUrl()` for real-time validation
  - Show inline error: "Please enter a valid LinkedIn profile URL (linkedin.com/in/...)"
  - Auto-prepend `https://` if user pastes without scheme

### 6.5 — Clipboard hardening

- [ ] Update `src/components/messages/CopyButton.tsx`:
  - Handle `navigator.clipboard` not available (older browsers):
    - Fallback: `document.execCommand('copy')` via hidden textarea
  - Never copy silently — always triggered by user click

### 6.6 — Build and security audit

- [ ] `npm run test` — linkedin.test.ts passes
- [ ] `npm run build` — no errors
- [ ] Manual audit: search entire `src/` for any `window.location`, `document.cookie`,
  `XMLHttpRequest`, `fetch` targeting linkedin.com → must find zero matches
- [ ] Manual audit: verify no `eval()`, `new Function()`, or `dangerouslySetInnerHTML`
- [ ] Verify [Open LinkedIn] does not change contact status

**Phase 6 Definition of Done:**
- `openLinkedInProfile()` validated and tested
- All [Open LinkedIn] buttons across all pages use the safe utility
- Manual action reminder shown after every [Open LinkedIn] click
- Status is never automatically changed by opening LinkedIn
- Clipboard copy works with fallback
- Security audit finds no automation code
- `npm run build` succeeds

---

## Phase 7 — Dashboard + Tracking

**Goal:** Fully functional Dashboard with live metrics. Complete contact tracking lifecycle
including response recording, follow-up scheduling, and status history.

### 7.1 — Dashboard page

- [ ] Create `src/pages/Dashboard.tsx`:
  - Uses `useDashboardMetrics()`
  - Page header: "Dashboard" + current date
  - **Metric grid** (3-col desktop, 2-col tablet, 1-col mobile):
    - Total Contacts (gray, links to /contacts)
    - Relevant Contacts (blue)
    - Category 1 (blue chip, links to /contacts?category=CAT_1)
    - Category 2 (purple chip, links to /contacts?category=CAT_2)
    - Category 3 (teal chip, links to /contacts?category=CAT_3)
    - Manual Review (amber, links to /review — prominent if > 0)
    - Messages Ready (blue, links to /messages)
    - Approved (indigo, links to /messages)
    - Contacted (green)
    - Replies (emerald)
    - Follow-Ups Due (orange, links to /followups — shown in red if > 0)
    - Not Relevant (gray)
  - Each card: metric name, large number, subtle icon, optional trend indicator
  - **Quick Actions section** below metrics:
    - [Add New Contact] → `/contacts/add`
    - [Review Manual Queue] → `/review` (shown with count if > 0)
    - [View Message Queue] → `/messages` (shown with count if > 0)
  - **Empty state** when `total === 0`:
    - Illustration/icon, "Welcome to Outreach CRM"
    - "Start by adding your first LinkedIn contact"
    - [Add Contact] CTA button
    - [Load Test Data] button for demo purposes

### 7.2 — Enhanced tracking on Contact Detail

- [ ] Update `src/pages/ContactDetail.tsx` TRACKING section:
  - Status selector — all valid `ContactStatus` values
  - Automatic behavior:
    - Selecting CONTACTED: if `contactedDate` is empty, auto-fill today's date (user can change)
    - Selecting REPLIED: show Response Status field
    - Selecting FOLLOW_UP: show Follow-Up Date picker
  - Response Status field:
    - Options: None | Positive | Negative | Neutral
    - Positive response → show congratulations note
  - Follow-Up Date field:
    - Date picker — only enables when status is FOLLOW_UP or CONTACTED
    - Warning if date is in the past on save
  - User Notes: free text, no limit, auto-saved on blur (debounced 500ms)
  - [Save Tracking] button: saves all tracking fields, shows toast "Tracking updated"
  - Last Updated: displayed as relative time (e.g., "2 hours ago") using date-fns

### 7.3 — Dashboard URL-based category filter

- [ ] Update Contacts page to read `?category=CAT_1` (etc.) from URL search params
  on initial load and pre-populate category filter
- [ ] Update Dashboard metric cards to generate correct link with search param

### 7.4 — Build and test

- [ ] `npm run build` — no errors
- [ ] Load test data; verify all 12 Dashboard metrics show correct counts
- [ ] Click Manual Review card → navigates to /review with correct contacts
- [ ] Click Follow-Ups Due → navigates to /followups
- [ ] Set a follow-up date on a contacted contact → verify it appears in Follow-Ups page
- [ ] Mark a contact as Replied → verify Replies count increments on Dashboard

**Phase 7 Definition of Done:**
- Dashboard shows all 12 metrics correctly
- Metrics update live when contacts are modified
- Tracking section on Contact Detail saves all fields
- Follow-up dates drive Follow-Ups page correctly
- `npm run build` succeeds

---

## Phase 8 — PWA + Desktop Installation

**Goal:** Fully installable PWA. App icons generated. Manifest complete. Service worker
pre-caches the app shell. Install prompt exposed in Settings. The app opens as a standalone
window after installation on Windows (Chrome/Edge).

### 8.1 — App icons

- [ ] Create `scripts/generateIcons.mjs` — Node script using `canvas` package to generate:
  - Background: indigo `#4F46E5`, rounded corners (radius = 20% of size)
  - Foreground: white letter "O" centered, bold, proportional font size
  - Exports: `icon-192.png`, `icon-512.png`
  - Maskable version (`icon-512-maskable.png`): same design, content within inner 80% safe zone
- [ ] Run script: `node scripts/generateIcons.mjs`
- [ ] Verify all 3 PNG files are present in `public/icons/`

### 8.2 — Offline fallback page

- [ ] Create `public/offline.html`:
  - Standalone HTML (no JS dependencies)
  - Styles inlined
  - Indigo background or white with indigo header
  - App name: "Outreach CRM"
  - Message: "You're offline. Your contacts are safe — reconnect to use the app."
  - No links to external resources (fully self-contained)

### 8.3 — PWA manifest and service worker

- [ ] Update `vite.config.ts` VitePWA configuration (full config):
  ```ts
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
      navigateFallback: 'index.html',
      navigateFallbackDenylist: [/^\/offline\.html$/],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
      ],
    },
  })
  ```
- [ ] Update `src/main.tsx` service worker registration (vite-plugin-pwa handles this
  automatically with `registerType: 'autoUpdate'` — verify virtual module import)
- [ ] Create `src/hooks/usePWAInstall.ts`:
  - Listen for `beforeinstallprompt` event
  - Store deferred prompt in ref
  - `canInstall: boolean` — true when prompt is available
  - `isStandalone: boolean` — `window.matchMedia('(display-mode: standalone)').matches`
  - `promptInstall(): Promise<void>` — calls `deferredPrompt.prompt()`, awaits result,
    shows toast on success/failure
  - Clean up event listener on unmount

### 8.4 — Settings page (full implementation)

- [ ] Create `src/pages/Settings.tsx`:
  - **PWA Install section**:
    - If `isStandalone`: show "✓ Outreach CRM is installed" with green checkmark
    - If `canInstall`: show [Install Outreach CRM] button → calls `promptInstall()`
    - If neither: show install instructions for Chrome/Edge:
      > "To install: open this page in Chrome or Edge, click the ⊕ icon in the address bar,
      > then click 'Install'."
    - Show "Run `npx serve dist` for local production serving if needed"
  - **Data Management section**:
    - [Export Contacts] button:
      - Creates JSON blob of all contacts
      - Downloads as `outreach-crm-export-{YYYY-MM-DD}.json`
      - `URL.createObjectURL()` — no external transmission
    - [Import Contacts] button:
      - File input (hidden), triggered by button
      - Reads JSON, validates each contact has `id`, `firstName`, `company`, `status`
      - Shows preview: "Import X contacts?" confirmation modal
      - On confirm: calls `importContacts(contacts)`
      - Toast: "X contacts imported"
    - [Load Test Data] button:
      - Confirmation modal: "This will add 15 test contacts"
      - Calls `store.loadTestData()`
      - Toast: "15 test contacts loaded"
    - [Clear All Data] button (danger):
      - Confirmation modal: "This will permanently delete all X contacts. This cannot be undone."
      - Calls `store.clearAll()`
      - Toast: "All contacts deleted"
  - **About section**:
    - App name, version (from `package.json` via `import.meta.env.VITE_APP_VERSION`),
      build date
    - Description from product.md
    - "Data stored locally — never transmitted"

### 8.5 — PWA verification

- [ ] `npm run build` — verify `dist/manifest.webmanifest` exists and contains all fields
- [ ] `npm run build` — verify `dist/sw.js` or Workbox-generated SW exists
- [ ] `npx vite preview` — serve locally
- [ ] Open Chrome/Edge → DevTools → Application tab:
  - [ ] Manifest: no errors, all icons listed
  - [ ] Service Workers: registered, status "activated and running"
  - [ ] Storage: app data visible in localStorage
- [ ] Install prompt appears in Chrome address bar
- [ ] Install the PWA — verify it opens in a standalone window
- [ ] Close and reopen from desktop shortcut — verify it launches correctly
- [ ] Disable network in DevTools — verify app loads from cache, shows offline indicator

**Phase 8 Definition of Done:**
- `npm run build` produces valid manifest and service worker
- PWA installs from Chrome/Edge on Windows
- Installed app opens as standalone window
- App functions offline
- Install button in Settings works
- Export/Import/Clear All work correctly
- `npm run build` succeeds

---

## Phase 9 — Testing + Security Review

**Goal:** Complete test coverage for all engine logic. Full security audit. Performance check.
Lighthouse PWA audit passing. Accessibility review. Final build sign-off.

### 9.1 — Complete unit test suite

- [ ] Verify all engine test files are complete and passing:
  - `src/engine/relevance.test.ts`
  - `src/engine/classifier.test.ts`
  - `src/engine/messageGenerator.test.ts`
  - `src/engine/validator.test.ts`
  - `src/engine/pipeline.test.ts`
  - `src/utils/linkedin.test.ts`
- [ ] All 15 seed profile tests pass with correct expected values
- [ ] `npm run test` — all tests pass, zero failures

### 9.2 — Security audit

- [ ] Search `src/` for any automation violations:
  - `grep -r "linkedin.com" src/` → only `utils/linkedin.ts` and type definitions allowed
  - `grep -r "fetch(" src/` → zero matches (or only settings export — no LinkedIn fetches)
  - `grep -r "XMLHttpRequest" src/` → zero matches
  - `grep -r "eval(" src/` → zero matches
  - `grep -r "dangerouslySetInnerHTML" src/` → zero matches
  - `grep -r "document.cookie" src/` → zero matches
  - `grep -r "window.opener" src/` → zero matches (only the `noopener` attribute check)
- [ ] Verify [Open LinkedIn] never changes contact status automatically
- [ ] Verify [Mark Contacted] is the only path to CONTACTED status
- [ ] Verify no auto-paste, no auto-click, no auto-send logic exists anywhere
- [ ] Verify clipboard is only written on explicit user click

### 9.3 — End-to-end workflow walkthrough

For each of the 15 test profiles, verify manually:
- [ ] Profile 1 (AP Associate): Cat 1 | AP | HIGH | correct Cat 1 message
- [ ] Profile 2 (AR Executive): Cat 1 | AR | HIGH | correct Cat 1 message
- [ ] Profile 3 (P2P Analyst): Cat 1 | P2P | HIGH
- [ ] Profile 4 (O2C Analyst): Cat 1 | O2C | HIGH
- [ ] Profile 5 (Finance Manager): Cat 2 | Finance | HIGH | "lead the finance team"
- [ ] Profile 6 (AP Team Lead): Cat 2 | AP | HIGH | "lead the Accounts Payable team"
- [ ] Profile 7 (R2R Supervisor): Cat 2 | R2R | HIGH | "lead the R2R function"
- [ ] Profile 8 (Senior Associate P2P): Cat 2 | P2P | MEDIUM — verify message correct
- [ ] Profile 9 (HRBP): Cat 3 | HR | HIGH | correct Cat 3 message
- [ ] Profile 10 (TA Specialist): Cat 3 | HR | HIGH
- [ ] Profile 11 (Hiring Manager – Finance): Cat 3 | HR | HIGH
- [ ] Profile 12 (Software Engineer): NOT_RELEVANT | no message
- [ ] Profile 13 (Senior Associate Finance ambiguous): MANUAL_REVIEW | no auto message
- [ ] Profile 14 (Finance Manager non-hiring): Cat 2 | Finance | HIGH — NOT Cat 3
- [ ] Profile 15 (HR Executive): Cat 3 | HR | HIGH

### 9.4 — Accessibility review

- [ ] Keyboard navigation: Tab through every page — all interactive elements reachable,
  focus ring visible
- [ ] Verify `aria-label` on all icon-only buttons (Copy, Open LinkedIn, View, Approve)
- [ ] Verify `role="dialog"` + `aria-modal` on Modal component
- [ ] Verify status/category badges always show text (never color-only)
- [ ] Run Lighthouse → Accessibility score ≥ 90

### 9.5 — Mobile layout review

- [ ] Chrome DevTools → 375px (iPhone SE) viewport:
  - [ ] Sidebar hidden, bottom nav visible
  - [ ] Contacts table converts to card layout
  - [ ] Add Contact form fully usable
  - [ ] Contact Detail page scrolls correctly
  - [ ] Message Queue cards readable
  - [ ] Manual Review queue works
- [ ] Chrome DevTools → 768px (tablet) viewport:
  - [ ] 2-column dashboard grid
  - [ ] Sidebar visible or hamburger menu

### 9.6 — Performance review

- [ ] `npm run build` — check bundle sizes in Vite output
- [ ] Verify total JS < 500KB gzipped
- [ ] Run Lighthouse → Performance score ≥ 85
- [ ] Run Lighthouse → PWA audit — all criteria green

### 9.7 — Final build sign-off

- [ ] `npm run test` — zero failures
- [ ] `npm run build` — zero errors, zero warnings (document any remaining warnings)
- [ ] `npx vite preview` — app runs correctly from built output
- [ ] PWA installs from built output
- [ ] All data persists correctly after app close and reopen
- [ ] Export → Clear → Import round-trip: data is identical

**Phase 9 Definition of Done (= Project Complete):**
1. All unit tests pass
2. Security audit finds no LinkedIn automation code
3. All 15 profiles classify and message correctly
4. PWA installs and runs as standalone on Windows
5. Lighthouse PWA audit passes
6. Lighthouse Accessibility ≥ 90
7. `npm run build` clean
8. Export/Import/Clear round-trip verified

---

## Phase Dependency Map

```
Phase 1 (Foundation)
  └─► Phase 2 (Contact CRM)
        └─► Phase 3 (Classification Engine)
              └─► Phase 4 (Message Engine)
                    └─► Phase 5 (Message Queue + Manual Review)
                          └─► Phase 6 (LinkedIn Workflow)     ─┐
                                └─► Phase 7 (Dashboard)        ├─► Phase 8 (PWA)
                                                                │         └─► Phase 9 (QA)
                                Phase 8 also depends on ───────┘
                                all prior phases being complete
```

## Overall Definition of Done

The project is complete when all 9 phases are signed off, specifically:
1. `npm run test` — all tests pass
2. `npm run build` — clean, no errors
3. PWA installs from Chrome/Edge on Windows as a standalone window
4. All 15 seed profiles produce correct classification + message
5. Zero LinkedIn automation code in the codebase
6. All status transitions require explicit user action
7. Data persists across app restarts
8. Lighthouse PWA: all criteria green
9. Lighthouse Accessibility: ≥ 90
