# PWA & Desktop Experience

## Goal

The application must be installable as a Progressive Web App and open as a dedicated
standalone window on the desktop — not as a browser tab.

Installed experience:
Desktop → "Outreach CRM" icon → click → standalone CRM window

## Web App Manifest (manifest.webmanifest)

Required fields:

```json
{
  "name": "Outreach CRM",
  "short_name": "Outreach",
  "description": "Personal LinkedIn job-search outreach CRM",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F9FAFB",
  "theme_color": "#4F46E5",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

## Icons

Provide at minimum:
- 192×192 PNG
- 512×512 PNG
- 512×512 maskable PNG (with safe zone padding)

Icon design: simple, professional — a stylized "O" or briefcase-style mark in indigo (#4F46E5)
on a white or light background.

## display: standalone

This is the critical PWA requirement.
`"display": "standalone"` causes the installed app to open without browser chrome
(no address bar, no tab strip).
The window should feel like a native application.

## viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#4F46E5" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Outreach CRM" />
```

## Service Worker

Register a service worker for:
- App shell caching (HTML, CSS, JS, fonts, icons)
- Offline fallback page ("You are offline — the app will work again when connected")
- Cache-first strategy for static assets
- Network-first strategy for any future API calls

The service worker must NOT intercept external requests to LinkedIn or any third-party
domain. Only cache local app assets.

## Service Worker Registration

Register in `main.tsx` (or equivalent entry point) after mount:

```ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

## Install Prompt

The application should handle the `beforeinstallprompt` event:
- Store the event
- Show an "Install App" button in the Settings page or a header banner
- Trigger the prompt when the user clicks the button

On Chromium browsers (Chrome, Edge), this enables one-click install to desktop.

## Data Persistence

All CRM data is stored in `localStorage` (or IndexedDB for larger datasets).
Data must survive:
- App close and reopen
- Browser updates
- System restarts

When running as a standalone PWA, localStorage/IndexedDB behave the same as in the browser.

## start_url

`"start_url": "/"` ensures the app always opens at the dashboard, not a sub-route.

## scope

`"scope": "/"` — the entire app is within PWA scope.

## Build Output

Vite (recommended build tool) should output:
- `dist/index.html`
- `dist/assets/` (hashed CSS/JS bundles)
- `dist/manifest.webmanifest`
- `dist/sw.js`
- `dist/icons/`

The `sw.js` and `manifest.webmanifest` must be at the root of the served origin.

## Serving for Local Development and Install

During development: `vite preview` or a local static server (e.g., `serve dist`) on HTTPS
or localhost (PWA install works on localhost without HTTPS).

For production: serve from any static host (Netlify, Vercel, GitHub Pages, local IIS/nginx).

## Windows Desktop Shortcut

On Windows with Chrome or Edge:
- Browser menu → "Install Outreach CRM" (appears when manifest + SW are valid)
- Creates a desktop shortcut automatically
- Opens in its own window (standalone mode)

The user does NOT need to manually create a shortcut — the browser handles it.
