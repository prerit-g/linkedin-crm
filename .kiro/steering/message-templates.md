# Message Templates

## Template Variables

All templates use these replacement variables:

| Variable | Description |
|---|---|
| `{{firstName}}` | Contact's first name |
| `{{company}}` | Contact's current company |
| `{{function}}` | Most specific finance/HR function from profile |
| `{{leadVerb}}` | Leadership verb for Category 2 (e.g., "lead", "manage", "run") |
| `{{teamLabel}}` | Specific team/function label for Category 2 |

---

## Category 1 Template — Associate / Executive / Junior Professional

```
Hi {{firstName}},

I see you're working in {{function}} at {{company}}. I am actively looking for an entry-level role in this space.

To prepare, I built a hands-on AP project on my profile using PostgreSQL, Excel, and Power BI to manage data pipelines and track vendor metrics. If your team has any junior openings or an internal referral program, I would love the opportunity to share my resume.
```

### Category 1 Personalization Notes

- `{{function}}` → use the most specific function (e.g., "Accounts Payable", not just "finance")
- Do not claim the person is hiring.
- Do not claim there are open roles.
- The phrase "If your team has any junior openings or an internal referral program" is conditional — this is correct and must be preserved.

---

## Category 2 Template — Senior / Team Lead / Manager / Supervisor

```
Hi {{firstName}},

I see you {{leadVerb}} the {{teamLabel}} at {{company}}. I am looking for an entry-level opportunity and wanted to see if you are actively hiring or building a pipeline for junior roles.

To ensure I can add value immediately, I built a mock AP ledger project using PostgreSQL for data management, Excel for reconciliations, and Power BI for aging dashboards. I'd love to pass along my resume if you have a current or upcoming slot on your team.
```

### Category 2 Personalization Notes

- `{{leadVerb}}` defaults to "lead" but can be "manage", "run", "oversee" if better supported by context.
- `{{teamLabel}}` must reflect the person's actual function. Examples:
  - AP Manager → "the Accounts Payable team"
  - P2P Manager → "the P2P function"
  - Finance Operations Manager → "the Finance Operations team"
  - Finance Manager (generic) → "the finance team"
- NEVER claim someone leads a team/function unless the profile title or description explicitly supports it.
- The phrase "I am looking for an entry-level opportunity and wanted to see if you are actively hiring or building a pipeline for junior roles" is a question — do not rewrite it as a statement of fact.

---

## Category 3 Template — HR / Recruiting / Hiring

```
Hi {{firstName}},

I'm seeking an entry-level accounting or finance position at {{company}} and want to get on your radar for any open or upcoming junior roles.

I specialize in AP/AR workflows, and my profile features a live data project built using Excel, SQL, and Power BI to demonstrate my technical readiness. Could you review my profile for shortlisting, or point me toward the right hiring team?
```

### Category 3 Personalization Notes

- `{{company}}` → always the person's current employer.
- Keep the core message intact — do not add fabricated context about open roles.
- The final sentence is a request ("Could you...") — preserve this framing.

---

## Core Message Rules (All Categories)

1. Preserve the core template structure — do not restructure.
2. Only substitute variables with information sourced directly from the profile.
3. Do not add compliments or flattery.
4. Do not add mutual connections that are not verified.
5. Do not claim knowledge of open roles unless the profile explicitly states hiring activity.
6. Keep messages concise — do not pad.
7. The messages must sound like professional networking messages, not AI-generated text.
8. Grammar must be natural English.

---

## Validation Checklist (Before Marking Message as READY)

- [ ] Correct first name used
- [ ] Correct company used
- [ ] Correct category applied
- [ ] Correct function used (most specific)
- [ ] Seniority is accurate
- [ ] No invented information
- [ ] No incorrect leadership claim
- [ ] No incorrect hiring claim
- [ ] Core template structure preserved
- [ ] Grammar is natural
- [ ] Message is concise

If any check fails: regenerate or send to Manual Review.
