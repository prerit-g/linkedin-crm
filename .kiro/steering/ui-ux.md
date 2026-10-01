# UI / UX Guidelines

## Design Philosophy

Clean, professional productivity/CRM design.
Desktop is the primary target; mobile must also work correctly.

Prioritize:
- Readability
- Fast navigation
- Clear status indicators
- Minimal clutter
- Easy message copying
- Easy profile review
- Strong visual hierarchy
- Obvious primary action at all times

Avoid:
- Excessive animations or transitions
- Overly colorful dashboards
- Unnecessary decorative elements
- Complicated or deep navigation
- Ambiguous call-to-action buttons

## Layout — Desktop

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (fixed, 220px)   │  Main Content Area       │
│  ─────────────────        │  ─────────────────────── │
│  • Dashboard              │  [page content here]     │
│  • Contacts               │                          │
│  • Message Queue          │                          │
│  • Manual Review  [badge] │                          │
│  • Follow-Ups     [badge] │                          │
│  • Settings               │                          │
│                           │                          │
└─────────────────────────────────────────────────────┘
```

Badges on sidebar items show pending counts (e.g., Manual Review: 3).

## Layout — Mobile

On screens below 768px:
- Sidebar collapses to a bottom navigation bar or hamburger menu
- Tables convert to stacked cards
- Actions remain accessible (no hidden critical actions)

## Color System

Use a neutral, professional palette:

| Role | Color |
|---|---|
| Primary brand | Indigo (#4F46E5) |
| Primary hover | Indigo dark (#4338CA) |
| Background | Gray-50 (#F9FAFB) |
| Surface / card | White (#FFFFFF) |
| Border | Gray-200 (#E5E7EB) |
| Text primary | Gray-900 (#111827) |
| Text secondary | Gray-500 (#6B7280) |
| Status: NEW | Gray badge |
| Status: REVIEW REQUIRED | Amber/Yellow badge |
| Status: MESSAGE READY | Blue badge |
| Status: APPROVED | Indigo badge |
| Status: CONTACTED | Green badge |
| Status: REPLIED | Emerald badge |
| Status: FOLLOW-UP | Orange badge |
| Status: NO RESPONSE | Gray badge |
| Status: NOT RELEVANT | Red/neutral badge |
| Status: REJECTED | Red badge |
| Confidence HIGH | Green dot/badge |
| Confidence MEDIUM | Amber dot/badge |
| Confidence LOW | Red dot/badge |
| Category 1 | Blue chip |
| Category 2 | Purple chip |
| Category 3 | Teal chip |
| Manual Review | Amber chip |

## Typography

- Font: System font stack (Inter preferred if available, fallback to system-ui, sans-serif)
- Base size: 14px (desktop), 16px (mobile)
- Headings: semi-bold to bold
- Body: regular
- Monospace: for IDs or technical values only

## CRM Table

Columns: Name | Role | Company | Function | Category | Confidence | Status | Actions

Actions per row:
- [VIEW] — opens Contact Detail page
- [COPY MESSAGE] — copies generated message to clipboard, shows brief "Copied!" toast
- [OPEN LINKEDIN] — opens LinkedIn URL in new tab, shows manual reminder
- [APPROVE] — changes status to APPROVED
- [MARK CONTACTED] — changes status to CONTACTED

Tables on desktop: standard horizontal table with sticky header.
Tables on mobile: each row becomes a card with name, role, company, status prominent.

## Contact Detail Page Layout

```
[← Back to Contacts]

PROFILE
  Name | Role | Company | Function | Seniority | LinkedIn URL

CLASSIFICATION
  Category | Confidence | Reason

MESSAGE
  [text area — editable]
  [EDIT] [COPY] [REGENERATE] [APPROVE]

LINKEDIN
  [OPEN LINKEDIN]
  "Open LinkedIn, paste your message manually, then return and mark contacted."

TRACKING
  Status | Contacted Date | Response | Follow-Up Date | Notes
```

## Dashboard Layout

Metric cards in a 3-column grid (desktop), 2-column (tablet), 1-column (mobile):

- Total Contacts
- Relevant Contacts
- Category 1
- Category 2
- Category 3
- Manual Review (with link)
- Messages Ready
- Approved
- Contacted
- Replies
- Follow-Ups Due (with link)
- Not Relevant

## Manual Review Queue

Table/card list showing:
- Name
- Role
- Company
- Detected Function
- Possible Category
- Confidence
- Reason for Uncertainty

Actions per item:
- [CLASSIFY MANUALLY] — opens classification editor
- [VIEW] — opens Contact Detail

## Message Queue

Shows contacts with status = MESSAGE READY or APPROVED.

Per row:
- Name, Company, Category, Status
- [COPY MESSAGE] [OPEN LINKEDIN] [APPROVE] [MARK CONTACTED]

## Follow-Ups Page

Shows contacts where Follow-Up Date ≤ today and status = CONTACTED or NO RESPONSE.

Per row:
- Name, Company, Status, Follow-Up Date, Days Overdue
- [VIEW] [OPEN LINKEDIN] [COPY MESSAGE]

## Add Contact Form

Fields:
- LinkedIn URL (required)
- First Name (required)
- Last Name
- Current Job Title (required)
- Company (required)
- Headline / About (optional — paste from profile)
- Location (optional)
- Additional Notes (optional)

Button: [CLASSIFY & GENERATE MESSAGE]

After submission:
- Run relevance check
- Run classification
- Generate message
- Redirect to Contact Detail for review

## Toast / Notification Messages

Use brief, non-blocking toasts for:
- "Message copied to clipboard"
- "Status updated"
- "Contact added"
- "Already contacted — duplicate detected"

Duration: ~3 seconds. Position: top-right or bottom-right.

## Accessibility

- All interactive elements must be keyboard accessible
- Color is never the sole means of conveying status (use text labels + color)
- Sufficient color contrast (WCAG AA minimum)
- Focus rings visible on keyboard navigation
- ARIA labels on icon-only buttons
