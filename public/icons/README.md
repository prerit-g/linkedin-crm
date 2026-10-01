# PWA Icons for Outreach CRM

## Icon Requirements

The Outreach CRM Progressive Web App requires icons in multiple sizes for different platforms:

### Required Sizes:
- 72x72 - Android homescreen
- 96x96 - Android task switcher
- 128x128 - Chrome
- 144x144 - IE tile
- 152x152 - Apple touch (iPad)
- 192x192 - Android Chrome, Google Play
- 384x384 - Android splash screen
- 512x512 - Web app manifest, splash screen
- 512x512 maskable - Adaptive icons (Android)

## Icon Design Guidelines

### Colors:
- Primary: Indigo (#4F46E5)
- Background: White (#FFFFFF) or transparent

### Style:
- Simple, professional design
- Briefcase or "O" letter icon recommended
- Clean, minimalist design
- Good contrast for visibility

## SVG Template

Here's an SVG template that can be used to generate all icon sizes:

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background (optional) -->
  <rect width="512" height="512" rx="96" fill="#4F46E5"/>
  
  <!-- Briefcase Icon -->
  <path d="M128 128h256v64H128v-64z" fill="#FFFFFF"/>
  <path d="M96 192h320c17.7 0 32 14.3 32 32v192c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" fill="#FFFFFF"/>
  <path d="M224 128v-32c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32v32" fill="none" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
</svg>
```

## Alternative "O" Letter Design:

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="256" cy="256" r="200" fill="#4F46E5"/>
  
  <!-- "O" letter -->
  <circle cx="256" cy="256" r="120" fill="none" stroke="#FFFFFF" stroke-width="40"/>
</svg>
```

## Maskable Icon (for adaptive icons)

Maskable icons should have safe zone padding. Use 80% of the canvas:

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Safe zone (80% of canvas) -->
  <g transform="translate(51.2 51.2) scale(0.8)">
    <!-- Icon content here (same as regular icon) -->
    <circle cx="256" cy="256" r="200" fill="#4F46E5"/>
    <circle cx="256" cy="256" r="120" fill="none" stroke="#FFFFFF" stroke-width="40"/>
  </g>
</svg>
```

## Generation Process

### Using ImageMagick (command line):
```bash
# Convert SVG to PNG
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 512x512 icon-512.png
convert maskable-icon.svg -resize 512x512 icon-512-maskable.png

# Generate all sizes
sizes=(72 96 128 144 152 192 384 512)
for size in ${sizes[@]}; do
  convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

### Using Online Tools:
1. **Favicon Generator**: https://realfavicongenerator.net/
2. **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
3. **Maskable Icon Editor**: https://maskable.app/

### Using Figma/Sketch:
1. Create 512x512 artboard
2. Design icon with 80% safe zone for maskable version
3. Export as PNG in all required sizes

## Testing

Test icons using:
1. Chrome DevTools → Application → Manifest
2. https://www.pwabuilder.com/
3. Android Chrome "Add to Home Screen"
4. iOS Safari "Add to Home Screen"

## Notes

- Icons should be square with transparent or solid color background
- Maskable icons need padding for Android adaptive icons
- Apple requires specific sizes for different devices
- Favicon (16x16, 32x32) is also recommended but not required for PWA

## Production Checklist

- [ ] 192x192 PNG (regular)
- [ ] 512x512 PNG (regular)
- [ ] 512x512 PNG (maskable)
- [ ] Favicon (16x16, 32x32)
- [ ] Apple touch icons (various sizes)
- [ ] Windows tile icon
- [ ] Manifest includes all icons
- [ ] Icons pass PWA validator tests