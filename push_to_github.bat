@echo off
setlocal enabledelayedexpansion
set "PATH=C:\Users\781\AppData\Local\Programs\Git\cmd;%PATH%"
cd /d "%~dp0"

echo ===================================================================
echo     EduResolve Helpdesk - 1-Click Push to GitHub
echo ===================================================================
echo.

set "DEFAULT_REPO=https://github.com/salbiyafordhous-stack/SEE-PRO.git"
echo Default repository: %DEFAULT_REPO%
echo.
set /p "USER_REPO=Enter your GitHub repo URL (or press ENTER to use default): "

if "%USER_REPO%"=="" (
    set "REPO_URL=%DEFAULT_REPO%"
) else (
    set "REPO_URL=%USER_REPO%"
)

echo.
echo Initializing git and committing files...
if exist ".git" (
    rmdir /s /q ".git"
)

git init
git config user.name "Student Helpdesk Admin"
git config user.email "helpdesk-admin@users.noreply.github.com"
git branch -M main
git add .
git commit -m "feat: complete student complaint and ticket management system"

git remote add origin %REPO_URL%
echo.
echo Pushing to: %REPO_URL%
echo.
git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================================
    echo   SUCCESS! Your code has been pushed to GitHub!
    echo ===================================================================
) else (
    echo ===================================================================
    echo   NOTE: If GitHub requested credentials, use your GitHub username
    echo   and your Personal Access Token (PAT) as the password.
    echo ===================================================================
)

echo.
pause
