# Product: Outreach CRM

## Purpose

Outreach CRM is a personal job-search assistant and CRM for organizing LinkedIn contacts,
generating personalized outreach messages, and tracking the full communication lifecycle.

The application helps the user perform high-quality, manual LinkedIn outreach efficiently.
It is NOT a LinkedIn automation bot.

## User Goal

The user is seeking entry-level roles in accounting and finance operations.

Primary target functions:
- Accounts Payable (AP)
- Accounts Receivable (AR)
- Accounting
- Finance
- Finance Operations
- FinTech
- Procure-to-Pay (P2P)
- Purchase-to-Pay
- Order-to-Cash (O2C)
- Record-to-Report (R2R)
- Procurement Operations
- Related accounting and finance operations

## Primary Workflow

```
PROFILE INFORMATION
→ DATA EXTRACTION
→ RELEVANCE CHECK
→ ROLE/FUNCTION CLASSIFICATION
→ CATEGORY CLASSIFICATION
→ PERSONALIZED MESSAGE
→ USER REVIEW
→ OPEN LINKEDIN
→ USER MANUALLY COPIES/PASTES MESSAGE
→ USER MANUALLY SENDS MESSAGE
→ USER MARKS CONTACTED
→ CRM TRACKING
```

## Design Principles

Optimize for:
- ACCURACY — classifications and messages must be correct
- PERSONALIZATION — messages tailored to real profile data only
- RELEVANCE — only surface contacts relevant to the user's job target
- USER CONTROL — no action happens without user review and decision
- DATA ORGANIZATION — all contact data is cleanly stored and queryable
- EASE OF USE — primary action is always obvious; minimal clutter

Do NOT optimize for:
- Automated message volume
- Automated LinkedIn activity
- Bypassing platform controls

## The AI's Role

The AI prepares the work:
- Classifies contacts
- Generates messages
- Validates output

The human makes the final LinkedIn decision and performs the final LinkedIn action.

## Application Name

"Outreach CRM"

Short name: "Outreach"

## Status Values

NEW → REVIEW REQUIRED → MESSAGE READY → APPROVED → CONTACTED → REPLIED → FOLLOW-UP → NO RESPONSE → NOT RELEVANT → REJECTED

## Duplicate Prevention

Primary key: LinkedIn URL
Fallback: Full Name + Company + Current Role

Never automatically create a second outreach message for an already-contacted person.
Show a clear "Already contacted" warning.
