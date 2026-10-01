# LinkedIn Outreach Rules

## Core Safety Principle

This application must NEVER automate LinkedIn in any way.
The user performs every final LinkedIn interaction manually.

## What the Application Must NEVER Do

- Automatically log into LinkedIn
- Automatically browse LinkedIn
- Automatically scroll LinkedIn
- Automatically scrape LinkedIn through browser automation
- Automatically click LinkedIn buttons
- Automatically type into LinkedIn
- Automatically paste messages into LinkedIn
- Automatically send messages
- Automatically send connection requests
- Automatically send follow-ups
- Bypass CAPTCHAs
- Bypass rate limits
- Bypass authentication
- Manipulate LinkedIn cookies or sessions
- Attempt to circumvent LinkedIn's security or anti-automation mechanisms
- Interact with the LinkedIn page after opening it

## What the Application Is Permitted to Do

- Store LinkedIn profile URLs
- Display LinkedIn profile URLs
- Open a normal LinkedIn URL in the user's default browser (window.open with noopener)
- Generate outreach messages
- Allow the user to copy a generated message to the clipboard
- Track whether the user reports they sent the message

## "Open LinkedIn" Definition

"Open LinkedIn" means ONLY calling `window.open(linkedinUrl, '_blank', 'noopener,noreferrer')`.

It does NOT mean:
- Injecting scripts into the LinkedIn page
- Communicating with the LinkedIn page after it loads
- Reading the LinkedIn page after it loads
- Automating any interaction on the LinkedIn page

## Manual Action Reminder (UI Requirement)

When the user clicks [OPEN LINKEDIN], the application must display a clear reminder:

> "LinkedIn is now open in your browser. Please paste your message and send it manually.
> When done, return here and click [Mark Contacted]."

## Status Separation

"Open LinkedIn" does NOT automatically change the contact status to CONTACTED.
The user must explicitly click [MARK CONTACTED] after returning to the CRM.

## Follow-Up Safety

The system may display "Follow-up due" as a reminder.
The system must NOT automatically send any LinkedIn follow-up message.
