# Classification Rules

## Stage 1 — Relevance Check

Before classifying, determine whether the contact is relevant.

A contact is RELEVANT if their current role is in:
- Accounts Payable / AP
- Accounts Receivable / AR
- Accounting
- Finance
- Finance Operations
- FinTech
- Procure-to-Pay / P2P / Purchase-to-Pay
- Order-to-Cash / O2C
- Record-to-Report / R2R
- Procurement Operations
- HR / Recruiting / Talent Acquisition (relevant as outreach targets regardless of finance function)

A contact is NOT RELEVANT if their role is purely in:
- Software Engineering
- Marketing
- Sales
- Legal
- Operations unrelated to finance
- IT / Infrastructure
- Any function unrelated to accounting, finance operations, or HR/recruiting

Rule: Do not treat every person mentioning "finance" as relevant.
"Finance" must be in the context of accounting or finance operations, not unrelated business functions.

Mark irrelevant contacts as: NOT RELEVANT

## Stage 2 — Function Classification

Choose the MOST SPECIFIC function supported by the profile.

Priority order (most to least specific):
1. Accounts Payable (AP)
2. Accounts Receivable (AR)
3. Procure-to-Pay (P2P)
4. Order-to-Cash (O2C)
5. Record-to-Report (R2R)
6. Accounting
7. Finance Operations
8. Finance
9. FinTech
10. HR / Recruiting (for Category 3 contacts)

Abbreviation recognition:
- AP = Accounts Payable
- AR = Accounts Receivable
- P2P = Procure-to-Pay = Purchase-to-Pay
- O2C = Order-to-Cash
- R2R = Record-to-Report
- TA = Talent Acquisition
- HRBP = Human Resources Business Partner

NEVER invent a more specific function than the profile supports.

## Stage 3 — Category Classification

### Category Priority (when multiple categories apply)
1. HR / Recruiting / Hiring (Category 3) — highest priority
2. Senior / Leadership (Category 2)
3. Junior / Associate / Entry-level (Category 1)

### Category 1 — Associate / Executive / Junior Professional

Use when the role is clearly junior or entry-level.

Signal words: Associate, Junior, Executive (in finance context), Analyst, Junior Analyst,
Junior Associate, AP/AR/P2P/O2C/R2R + Associate/Analyst/Executive

Examples:
- Accounts Payable Associate → Category 1
- AR Executive → Category 1
- P2P Analyst → Category 1
- Finance Analyst → Category 1 (if no senior/lead indicator)
- Junior Finance Analyst → Category 1

Do NOT classify "Senior Associate" automatically as Category 1.

### Category 2 — Senior / Team Lead / Manager / Supervisor

Use when the role is clearly senior or includes leadership/management responsibility.

Signal words: Senior, Lead, Team Lead, Team Leader, Supervisor, Assistant Manager,
Manager, Senior Manager, Head of

Examples:
- Senior Analyst → Category 2
- AP Team Lead → Category 2
- Finance Manager → Category 2
- R2R Supervisor → Category 2
- Senior Manager – Finance Operations → Category 2
- Operations Manager (finance context) → Category 2

Do NOT automatically classify as Category 2 based on seniority alone
when the function is unclear.

### Category 3 — HR / Recruiting / Hiring

Use when the person's current role indicates genuine HR, recruitment, talent acquisition,
or hiring responsibility.

Signal words: HR, Human Resources, HRBP, Recruiter, Recruitment, Talent Acquisition,
Talent Partner, Campus Recruiter, Hiring Manager

Examples:
- HRBP → Category 3
- Talent Acquisition Specialist → Category 3
- HR Executive → Category 3
- Hiring Manager – Finance → Category 3 (HR/hiring responsibility is primary)
- Recruitment Manager → Category 3

Do NOT classify someone as Category 3 just because "HR" appears anywhere in their profile.
The person's CURRENT ROLE must indicate HR/recruiting responsibility.

### Manual Review

Send to Manual Review when ANY of the following apply:
- Seniority is unclear
- Function is unclear
- Multiple categories apply and cannot be resolved by priority rules
- Information is insufficient to classify
- The role may be irrelevant but is not clearly irrelevant
- Company is unclear
- "Senior Associate" with no additional context
- HR and finance responsibilities genuinely overlap
- Leadership responsibility is asserted but not supported by title/context

## Stage 4 — Confidence Assessment

### HIGH Confidence
Role and function are explicit.
Example: "Accounts Payable Associate at Genpact" → Category 1, AP, HIGH

### MEDIUM Confidence
Reasonably clear but some context is missing.
Example: "Finance Executive" → possibly Category 1, Finance, MEDIUM (executive level in finance context is usually entry-level but could vary)

### LOW Confidence
Ambiguous title, multiple interpretations, or insufficient information.
Example: "Senior Associate" with no function stated → LOW

LOW confidence → always send to Manual Review.

## Ambiguity Examples

| Title | Category | Confidence | Notes |
|---|---|---|---|
| Accounts Payable Associate | 1 | HIGH | Clear |
| AR Executive | 1 | HIGH | Executive in finance = entry-level |
| P2P Analyst | 1 | HIGH | Clear |
| O2C Analyst | 1 | HIGH | Clear |
| Finance Manager | 2 | HIGH | Clear management role |
| AP Team Lead | 2 | HIGH | Clear lead role |
| R2R Supervisor | 2 | HIGH | Clear supervisor |
| Senior Associate – P2P | 2 or MR | MEDIUM | "Senior" elevates; context needed |
| HRBP | 3 | HIGH | Clear HR role |
| Talent Acquisition Specialist | 3 | HIGH | Clear |
| Hiring Manager – Finance | 3 | HIGH | HR/hiring is primary |
| Software Engineer | NOT RELEVANT | HIGH | Not in target function |
| Senior Associate – Finance (ambiguous) | MR | LOW | Needs more context |
| Finance Manager (not hiring) | 2 | HIGH | Leadership, not HR |
| HR without finance specialization | 3 | HIGH | HR is Category 3 target |
