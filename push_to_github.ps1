# PowerShell script to push LinkedIn Outreach CRM to GitHub
# Run this script in PowerShell as Administrator

Write-Host "🚀 Pushing LinkedIn Outreach CRM to GitHub..." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# Check if Git is installed
try {
    git --version
    Write-Host "✓ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Then restart PowerShell and try again." -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
$projectPath = "c:\Users\preri\linkedin crm"
Set-Location $projectPath

# Step 1: Initialize Git repository
Write-Host "`n1. Initializing Git repository..." -ForegroundColor Cyan
git init

# Step 2: Configure Git user (you may need to update these)
Write-Host "`n2. Configuring Git user..." -ForegroundColor Cyan
git config user.email "your-email@example.com"
git config user.name "Your Name"

Write-Host "⚠️  Please update the email and name above with your GitHub credentials" -ForegroundColor Yellow
Write-Host "   Edit this script and change 'your-email@example.com' and 'Your Name'" -ForegroundColor Yellow

# Step 3: Check what will be committed
Write-Host "`n3. Checking files to commit..." -ForegroundColor Cyan
git status

# Step 4: Add all files (except those in .gitignore)
Write-Host "`n4. Adding files to Git..." -ForegroundColor Cyan
git add .

# Step 5: Commit the files
Write-Host "`n5. Committing files..." -ForegroundColor Cyan
git commit -m "Initial commit: LinkedIn Outreach CRM PWA"

# Step 6: Add remote repository
Write-Host "`n6. Adding GitHub remote repository..." -ForegroundColor Cyan
git remote add origin https://github.com/prerit-g/linkedin-crm.git

# Step 7: Push to GitHub
Write-Host "`n7. Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "   This may ask for your GitHub credentials" -ForegroundColor Yellow
git push -u origin main

# Step 8: Verify
Write-Host "`n8. Verifying push..." -ForegroundColor Cyan
git remote -v
git log --oneline -5

Write-Host "`n🎉 Done! Your code is now on GitHub:" -ForegroundColor Green
Write-Host "   https://github.com/prerit-g/linkedin-crm" -ForegroundColor Cyan

Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Visit https://github.com/prerit-g/linkedin-crm to verify" -ForegroundColor White
Write-Host "2. Check that all files are present" -ForegroundColor White
Write-Host "3. Delete this script: Remove-Item push_to_github.ps1" -ForegroundColor White