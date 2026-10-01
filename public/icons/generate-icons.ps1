# PowerShell script to generate PWA icons from SVG files
# Requires ImageMagick installed: https://imagemagick.org/script/download.php

param(
    [string]$svgPath = "icon.svg",
    [string]$maskableSvgPath = "icon-maskable.svg",
    [string]$outputDir = "."
)

# Check if ImageMagick is installed
if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
    Write-Host "ImageMagick is not installed. Please install it from https://imagemagick.org/script/download.php" -ForegroundColor Red
    exit 1
}

Write-Host "Generating PWA icons for Outreach CRM..." -ForegroundColor Green

# Create output directory if it doesn't exist
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# Required sizes for PWA
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

Write-Host "Generating regular icons..." -ForegroundColor Yellow
foreach ($size in $sizes) {
    $outputFile = Join-Path $outputDir "icon-${size}x${size}.png"
    Write-Host "  Creating $outputFile"
    magick convert $svgPath -resize "${size}x${size}" $outputFile
}

# Generate the required sizes for manifest
Write-Host "`nGenerating manifest icons..." -ForegroundColor Yellow

# 192x192 (required)
magick convert $svgPath -resize "192x192" (Join-Path $outputDir "icon-192.png")

# 512x512 (required)
magick convert $svgPath -resize "512x512" (Join-Path $outputDir "icon-512.png")

# 512x512 maskable (required for Android adaptive icons)
magick convert $maskableSvgPath -resize "512x512" (Join-Path $outputDir "icon-512-maskable.png")

# Generate favicon sizes
Write-Host "`nGenerating favicon..." -ForegroundColor Yellow
magick convert $svgPath -resize "32x32" (Join-Path $outputDir "favicon-32x32.png")
magick convert $svgPath -resize "16x16" (Join-Path $outputDir "favicon-16x16.png")

# Create favicon.ico (multiple sizes in one file)
magick convert $svgPath -define icon:auto-resize="256,128,64,48,32,16" (Join-Path $outputDir "favicon.ico")

# Generate Apple touch icons
Write-Host "`nGenerating Apple touch icons..." -ForegroundColor Yellow
$appleSizes = @(
    @("180", "apple-touch-icon"),
    @("167", "apple-touch-icon-ipad-retina"),
    @("152", "apple-touch-icon-ipad"),
    @("120", "apple-touch-icon-iphone-retina"),
    @("114", "apple-touch-icon-iphone-retina-old"),
    @("76", "apple-touch-icon-ipad-old"),
    @("57", "apple-touch-icon-iphone-old")
)

foreach ($appleIcon in $appleSizes) {
    $size = $appleIcon[0]
    $name = $appleIcon[1]
    $outputFile = Join-Path $outputDir "${name}-${size}x${size}.png"
    Write-Host "  Creating $outputFile"
    magick convert $svgPath -resize "${size}x${size}" $outputFile
}

# Create mstile icon for Windows
Write-Host "`nGenerating Windows tile icon..." -ForegroundColor Yellow
magick convert $svgPath -resize "144x144" (Join-Path $outputDir "mstile-144x144.png")

Write-Host "`nIcon generation complete!" -ForegroundColor Green
Write-Host "Files generated in: $((Get-Item $outputDir).FullName)" -ForegroundColor Cyan

# Display summary
Write-Host "`n=== SUMMARY ===" -ForegroundColor Magenta
Write-Host "Required for PWA manifest:" -ForegroundColor Yellow
Write-Host "  ✓ icon-192.png (192x192)" -ForegroundColor Green
Write-Host "  ✓ icon-512.png (512x512)" -ForegroundColor Green
Write-Host "  ✓ icon-512-maskable.png (512x512 maskable)" -ForegroundColor Green

Write-Host "`nAdditional icons for platform support:" -ForegroundColor Yellow
Write-Host "  ✓ favicon.ico (multiple sizes)" -ForegroundColor Green
Write-Host "  ✓ Apple touch icons (7 sizes)" -ForegroundColor Green
Write-Host "  ✓ Windows tile icon" -ForegroundColor Green
Write-Host "  ✓ Various sizes for different devices" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Verify icons in Chrome DevTools → Application → Manifest" -ForegroundColor White
Write-Host "2. Test PWA installation on different platforms" -ForegroundColor White
Write-Host "3. Update manifest.webmanifest if needed" -ForegroundColor White