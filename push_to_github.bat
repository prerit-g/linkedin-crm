@echo off
echo 🚀 Pushing LinkedIn Outreach CRM to GitHub...
echo =============================================

REM Check if Git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    echo Then restart Command Prompt and try again.
    pause
    exit /b 1
)

echo ✓ Git is installed

REM Navigate to project directory
cd /d "c:\Users\preri\linkedin crm"

REM Step 1: Initialize Git repository
echo.
echo 1. Initializing Git repository...
git init

REM Step 2: Configure Git user - YOU NEED TO UPDATE THESE!
echo.
echo 2. Configuring Git user...
git config user.email "your-email@example.com"
git config user.name "Your Name"

echo ⚠️  IMPORTANT: Please update the email and name above
echo    Edit this .bat file and change:
echo    - "your-email@example.com" to your GitHub email
echo    - "Your Name" to your name

REM Step 3: Check what will be committed
echo.
echo 3. Checking files to commit...
git status

REM Step 4: Add all files
echo.
echo 4. Adding files to Git...
git add .

REM Step 5: Commit the files
echo.
echo 5. Committing files...
git commit -m "Initial commit: LinkedIn Outreach CRM PWA"

REM Step 6: Add remote repository
echo.
echo 6. Adding GitHub remote repository...
git remote add origin https://github.com/prerit-g/linkedin-crm.git

REM Step 7: Push to GitHub
echo.
echo 7. Pushing to GitHub...
echo    This will ask for your GitHub username and password/token
git push -u origin main

REM Step 8: Verify
echo.
echo 8. Verifying push...
git remote -v
git log --oneline -5

echo.
echo 🎉 Done! Your code is now on GitHub:
echo    https://github.com/prerit-g/linkedin-crm

echo.
echo 📋 Next steps:
echo 1. Visit https://github.com/prerit-g/linkedin-crm to verify
echo 2. Check that all files are present
echo 3. Delete this batch file: del push_to_github.bat

pause