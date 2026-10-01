# Requirements: Outreach CRM

## Overview

Outreach CRM is a personal Progressive Web App for managing LinkedIn job-search outreach.
The user is seeking entry-level roles in accounting and finance operations.

The application classifies LinkedIn contacts, generates personalized outreach messages from
validated templates, and tracks the full communication lifecycle — all without automating
any LinkedIn action. Every final LinkedIn interaction is performed manually by the user.

#[[file:.kiro/steering/product.md]]
#[[file:.kiro/steering/linkedin-outreach-rules.md]]
#[[file:.kiro/steering/classification-rules.md]]
#[[file:.kiro/steering/message-templates.md]]
#[[file:.kiro/steering/personalization-rules.md]]
#[[file:.kiro/steering/ui-ux.md]]
#[[file:.kiro/steering/pwa-desktop.md]]
#[[file:.kiro/steering/security-and-linkedin-safety.md]]

---

## Functional Requirements

### FR-1: Contact Input

**FR-1.1** The application SHALL provide a form to add a new contact with the following fields:
- LinkedIn URL (required, must be a valid linkedin.com URL)
- First Name (required)
- Last Name (optional)
- Current Job Title (required)
- Company (required)
- Headline / About (optional — user pastes from profile)
- Location (optional)
- Additional Notes (optional)

**FR-1.2** On submission, the application SHALL immediately run the classification and
message generation pipeline without further user prompting.

**FR-1.3** After processing, the application SHALL redirect the user to the Contact Detail
page for that contact.

**FR-1.4** If a contact with the same LinkedIn URL already exists, the application SHALL
block the submission, display a "Already in your CRM" warning, and offer a link to the
existing contact record. It SHALL NOT create a duplicate.

**FR-1.5** If no LinkedIn URL is supplied, the application SHALL check for an existing
contact by Full Name + Company + Current Job Title and apply the same duplicate prevention.

---

### FR-2: Classification Engine

**FR-2.1 — Relevance Check**
The engine SHALL determine whether a contact is relevant to the user's job search.

A contact IS relevant if their current role is in: Accounts Payable (AP), Accounts
Receivable (AR), Accounting, Finance, Finance Operations, FinTech, Procure-to-Pay (P2P),
Order-to-Cash (O2C), Record-to-Report (R2R), Procurement Operations, or HR/Recruiting/
Talent Acquisition.

A contact is NOT relevant if their role is purely in Software Engineering, Marketing,
Sales, Legal, IT/Infrastructure, or any unrelated business function.

"Finance" is only relevant when in the context of accounting or finance operations.

**FR-2.2 — Function Classification**
The engine SHALL identify the most specific applicable function in this priority order:
Accounts Payable → Accounts Receivable → P2P → O2C → R2R → Accounting →
Finance Operations → Finance → FinTech → HR/Recruiting.

The engine SHALL recognize standard abbreviations: AP, AR, P2P, O2C, R2R, TA, HRBP.

The engine SHALL NEVER assign a more specific function than the profile data supports.

**FR-2.3 — Category Classification**
The engine SHALL classify each relevant contact into one of:

- **Category 1** — Associate / Executive / Junior Professional
  Signal words: Associate, Junior, Analyst, Executive (finance context)
  
- **Category 2** — Senior / Team Lead / Manager / Supervisor
  Signal words: Senior, Lead, Team Lead, Supervisor, Manager, Head of
  
- **Category 3** — HR / Recruiting / Hiring
  Signal words: HR, HRBP, Recruiter, Talent Acquisition, Hiring Manager
  
- **Manual Review** — when classification cannot be made with confidence

When multiple categories could apply, priority order is: Category 3 > Category 2 > Category 1.

**FR-2.4 — Confidence Assessment**
The engine SHALL assign a confidence level:
- HIGH: Role and function are explicit
- MEDIUM: Reasonably clear but some context is missing
- LOW: Ambiguous title or insufficient information

LOW confidence SHALL always result in Manual Review status, regardless of any category guess.

**FR-2.5 — Seniority Detection**
The engine SHALL extract a seniority label from the job title (e.g., "Junior", "Senior",
"Manager", "Analyst", "Associate") for use in personalization and display.

---

### FR-3: Message Generation

**FR-3.1** The engine SHALL generate a personalized outreach message for every classified
contact (Categories 1, 2, and 3). No message SHALL be generated for Manual Review contacts
until the user manually classifies them.

**FR-3.2 — Category 1 Message**
Template:
```
Hi {{firstName}},

I see you're working in {{function}} at {{company}}. I am actively looking for an 
entry-level role in this space.

To prepare, I built a hands-on AP project on my profile using PostgreSQL, Excel, and 
Power BI to manage data pipelines and track vendor metrics. If your team has any junior 
openings or an internal referral program, I would love the opportunity to share my resume.
```
The `{{function}}` variable SHALL use the most specific detected function label.

**FR-3.3 — Category 2 Message**
Template:
```
Hi {{firstName}},

I see you {{leadVerb}} the {{teamLabel}} at {{company}}. I am looking for an entry-level 
opportunity and wanted to see if you are actively hiring or building a pipeline for junior 
roles.

To ensure I can add value immediately, I built a mock AP ledger project using PostgreSQL 
for data management, Excel for reconciliations, and Power BI for aging dashboards. I'd 
love to pass along my resume if you have a current or upcoming slot on your team.
```
`{{leadVerb}}` defaults to "lead". `{{teamLabel}}` SHALL reflect the actual function
(e.g., "the Accounts Payable team", "the P2P function", "the finance team").

**FR-3.4 — Category 3 Message**
Template:
```
Hi {{firstName}},

I'm seeking an entry-level accounting or finance position at {{company}} and want to get 
on your radar for any open or upcoming junior roles.

I specialize in AP/AR workflows, and my profile features a live data project built using 
Excel, SQL, and Power BI to demonstrate my technical readiness. Could you review my 
profile for shortlisting, or point me toward the right hiring team?
```

**FR-3.5 — Personalization Rules**
All personalization SHALL use only facts explicitly present in the provided profile data.
The engine SHALL NEVER invent: mutual connections, conversations, referrals, hiring status,
open roles, team leadership, skills, experience, or company details not provided.
Prohibited phrases include flattery, generic AI filler, and any misrepresentation.

---

### FR-4: Message Validation

**FR-4.1** Before marking a message as READY, the engine SHALL validate all of the following:
1. Correct first name is used
2. Correct company is used
3. Correct category was applied
4. Correct function is used (most specific)
5. Seniority is accurate
6. No invented information present
7. No incorrect leadership claim
8. No incorrect hiring claim
9. Core template structure is preserved
10. Grammar is natural
11. Message is concise

**FR-4.2** If any validation check fails, the contact SHALL be moved to REVIEW REQUIRED
status and the failure reasons SHALL be recorded.

---

### FR-5: Contact Workflow & Status Management

**FR-5.1** Every contact SHALL have a status value from this set:
`NEW | REVIEW_REQUIRED | MESSAGE_READY | APPROVED | CONTACTED | REPLIED | FOLLOW_UP | NO_RESPONSE | NOT_RELEVANT | REJECTED`

**FR-5.2** The standard workflow progression is:
`NEW → (engine runs) → MESSAGE_READY or REVIEW_REQUIRED → APPROVED → CONTACTED → REPLIED / NO_RESPONSE / FOLLOW_UP`

**FR-5.3** The user SHALL be able to manually set any status on any contact at any time.

**FR-5.4** Changing status to CONTACTED SHALL record the current date as `contactedDate`.

**FR-5.5** The application SHALL NEVER automatically set status to CONTACTED or APPROVED.
These transitions require explicit user action.

**FR-5.6** Opening a LinkedIn URL SHALL NOT change the contact status. The user must
manually click [MARK CONTACTED] after returning from LinkedIn.

---

### FR-6: LinkedIn URL Handling

**FR-6.1** The application SHALL open LinkedIn profile URLs using:
`window.open(url, '_blank', 'noopener,noreferrer')`

**FR-6.2** After the user clicks [OPEN LINKEDIN], the application SHALL display:
> "LinkedIn is now open in your browser. Please paste your message and send it manually.
> When done, return here and click [Mark Contacted]."

**FR-6.3** The application SHALL NEVER interact with the LinkedIn page after opening it.
No scripts, messages, or callbacks to the opened tab.

**FR-6.4** LinkedIn URLs SHALL be validated against the pattern `linkedin.com/in/` before
being stored. Invalid URLs SHALL be rejected with an inline error message.

---

### FR-7: CRM Table & Contacts Page

**FR-7.1** The Contacts page SHALL display all contacts in a filterable table with columns:
Name | Role | Company | Function | Category | Confidence | Status | Actions

**FR-7.2** Each row SHALL have action buttons: [VIEW] [COPY MESSAGE] [OPEN LINKEDIN]
[APPROVE] [MARK CONTACTED]

**FR-7.3** [COPY MESSAGE] SHALL copy the generated message to the clipboard and show a
"Copied!" toast. If no message exists, the button SHALL be disabled.

**FR-7.4** [APPROVE] SHALL only be available when status is MESSAGE_READY. It SHALL change
status to APPROVED.

**FR-7.5** [MARK CONTACTED] SHALL change status to CONTACTED and record the current date.

**FR-7.6** The table SHALL be filterable by: Category, Function, Company, Seniority,
Relevance, Confidence, Message Status, Contact Status, Response Status, Follow-Up Status.

**FR-7.7** On mobile (<768px), the table SHALL convert to a card-per-contact layout.

---

### FR-8: Contact Detail Page

**FR-8.1** The Contact Detail page SHALL display all stored fields for a contact, grouped into sections: Profile, Classification, Message, LinkedIn, Tracking.

**FR-8.2** The generated message SHALL be displayed in an editable text area.

**FR-8.3** Message actions SHALL include: [EDIT] [COPY] [REGENERATE] [APPROVE]

**FR-8.4** [REGENERATE] SHALL re-run the message generation pipeline for the contact using
the current stored profile data, overwriting the previous message draft.

**FR-8.5** The Tracking section SHALL allow the user to set: Status, Response Status,
Follow-Up Date, and User Notes.

**FR-8.6** The page SHALL show a prominent [OPEN LINKEDIN] button with the manual action
reminder text beneath it.

---

### FR-9: Dashboard

**FR-9.1** The Dashboard SHALL display the following metrics in a grid of cards:
Total Contacts | Relevant Contacts | Category 1 | Category 2 | Category 3 |
Manual Review | Messages Ready | Approved | Contacted | Replies | Follow-Ups Due | Not Relevant

**FR-9.2** The Manual Review card and Follow-Ups Due card SHALL be clickable links to their
respective pages.

**FR-9.3** All metric values SHALL update in real time as contacts are added or modified
(reactive store subscription).

---

### FR-10: Manual Review Queue

**FR-10.1** The Manual Review page SHALL list all contacts with status REVIEW_REQUIRED or
category MANUAL_REVIEW, showing: Name, Role, Company, Detected Function, Possible Category,
Confidence, Reason for Uncertainty.

**FR-10.2** Each item SHALL have a [CLASSIFY MANUALLY] action that opens an in-page editor
allowing the user to set: Category, Function, Seniority, and trigger message regeneration.

**FR-10.3** After manual classification, the contact SHALL be removed from the queue and
proceed through the normal message generation and validation pipeline.

---

### FR-11: Message Queue

**FR-11.1** The Message Queue page SHALL list all contacts with status MESSAGE_READY or
APPROVED with columns: Name, Company, Category, Status.

**FR-11.2** Each row SHALL have: [COPY MESSAGE] [OPEN LINKEDIN] [APPROVE] [MARK CONTACTED]

---

### FR-12: Follow-Ups Page

**FR-12.1** The Follow-Ups page SHALL display contacts where `followUpDate` ≤ today AND
status is CONTACTED or NO_RESPONSE.

**FR-12.2** Each row SHALL show: Name, Company, Status, Follow-Up Date, Days Overdue.

**FR-12.3** Actions per row: [VIEW] [OPEN LINKEDIN] [COPY MESSAGE]

**FR-12.4** The application SHALL NOT automatically send any LinkedIn follow-up. The
follow-up page is a manual reminder tool only.

---

### FR-13: Settings Page

**FR-13.1** The Settings page SHALL include an [Install App] button that triggers the PWA
`beforeinstallprompt` event when the browser supports installation.

**FR-13.2** The Settings page SHALL provide an [Export Data] button that downloads all
contacts as a JSON file to the user's device (client-side, no external transmission).

**FR-13.3** The Settings page SHALL provide an [Import Data] button that accepts a JSON
file, validates its structure, and merges/replaces the contact store.

**FR-13.4** The Settings page SHALL provide a [Load Test Data] button (development/demo
use) that seeds the 15 test profiles from the specification.

**FR-13.5** The Settings page SHALL provide a [Clear All Data] button with a confirmation
dialog before executing.

---

### FR-14: Progressive Web App

**FR-14.1** The application SHALL include a `manifest.webmanifest` with:
name: "Outreach CRM", short_name: "Outreach", display: "standalone",
start_url: "/", theme_color: "#4F46E5", background_color: "#F9FAFB",
icons at 192px, 512px, and 512px maskable.

**FR-14.2** The application SHALL register a service worker that:
- Pre-caches all static app shell assets (HTML, CSS, JS, fonts, icons)
- Serves a fallback offline page when the network is unavailable
- Uses CacheFirst for static assets, StaleWhileRevalidate for the HTML shell
- Does NOT intercept or cache requests to external domains

**FR-14.3** The application SHALL handle the `beforeinstallprompt` event and allow the
user to trigger installation from the Settings page.

**FR-14.4** The installed PWA SHALL open in a standalone window (no browser chrome) and
launch directly to the Dashboard.

---

## Non-Functional Requirements

**NFR-1: LinkedIn Safety**
The application MUST NOT automate any LinkedIn action. See FR-6 and
`linkedin-outreach-rules.md` for the complete safety contract.

**NFR-2: Offline Operation**
The application SHALL function fully offline. All data is stored locally. No data is
transmitted to any external server.

**NFR-3: Performance**
The application SHALL load within 3 seconds on a modern desktop browser from cache (PWA).
Classification and message generation SHALL complete in under 500ms.

**NFR-4: Responsiveness**
The application SHALL display correctly on desktop (≥1024px), tablet (768–1023px), and
mobile (<768px). Desktop is the primary target.

**NFR-5: Accessibility**
The application SHALL meet WCAG 2.1 AA contrast requirements. All interactive elements
SHALL be keyboard accessible. Status is never conveyed by color alone.

**NFR-6: Data Integrity**
The Zustand store with localStorage persistence SHALL maintain contact data across app
restarts and browser updates. No data loss on normal close/reopen cycles.

**NFR-7: Security**
No credentials, tokens, or sessions are stored. All user input is sanitized. No `eval()`
or `dangerouslySetInnerHTML` is used. All LinkedIn URLs opened with `noopener,noreferrer`.
