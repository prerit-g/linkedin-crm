# Security & LinkedIn Safety

## Data Storage Rules

Store ONLY information necessary for CRM functionality:
- Contact profile data (name, title, company, LinkedIn URL)
- Classification results
- Generated messages
- Communication status and dates
- User notes

Never store:
- LinkedIn passwords
- LinkedIn session tokens or cookies
- LinkedIn authentication credentials
- Any third-party account credentials

## LinkedIn Safety (Summary)

See linkedin-outreach-rules.md for the full rule set.

Core rules:
1. Never automate any LinkedIn action
2. Never scrape LinkedIn programmatically
3. Only open LinkedIn URLs via `window.open` with `noopener,noreferrer`
4. The user performs all LinkedIn interactions manually
5. "Mark Contacted" is a manual user action — never triggered automatically

## Network Security

- The application makes NO outbound network requests to LinkedIn
- The application makes NO outbound network requests to third-party APIs
  (unless a future AI message-generation API is explicitly added by the user)
- All data is stored locally (localStorage / IndexedDB)
- No user data is transmitted externally

## Clipboard

The application may write to the clipboard ONLY when the user explicitly clicks
[COPY MESSAGE].

Never write to the clipboard without user intent.

## window.open Safety

LinkedIn URLs must always be opened with:

```ts
window.open(url, '_blank', 'noopener,noreferrer');
```

- `noopener` — prevents the opened page from accessing `window.opener`
- `noreferrer` — prevents the referrer header from being sent
- Never use `window.open` with automation intent

## Input Validation

- LinkedIn URLs: validate format before storing (must match linkedin.com domain pattern)
- Names: sanitize for XSS (no HTML in display)
- All text inputs: trim whitespace, limit to reasonable max lengths
- No SQL injection risk (no server-side DB; all local storage)

## Content Security

- No eval() or dynamic code execution
- No innerHTML with user-supplied data (use textContent or React's safe rendering)
- Content Security Policy header recommended if served with a configurable server

## Data Export / Import

If export/import functionality is added:
- Export: JSON only, client-side, no external transmission
- Import: validate structure before accepting, reject malformed data
- Never auto-execute imported data as code

## Offline Operation

The application functions entirely offline.
No data leaves the device unless the user explicitly exports it.

## Compliance Note

This application is a personal CRM tool.
It does not scrape, harvest, or process LinkedIn data at scale.
It stores only information the user manually provides.
The user is responsible for complying with LinkedIn's Terms of Service
in their own use of the platform.
