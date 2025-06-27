@echo off
setlocal enabledelayedexpansion

:: TrustChain Demo Automation Script for Windows
:: This script demonstrates the full functionality of the TrustChain application

echo 🚀 TrustChain Demo Automation Script
echo ====================================

:: Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the TrustChain project directory
    pause
    exit /b 1
)

echo 📋 Step 1: Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

echo 📋 Step 2: Starting DFX local network...
call dfx start --background --clean
if %ERRORLEVEL% neq 0 (
    echo ⚠️  DFX network might already be running or failed to start
) else (
    echo ✅ DFX local network started
)

echo 📋 Step 3: Deploying backend canister...
call dfx deploy trustchain_backend
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to deploy backend canister
    pause
    exit /b 1
)
echo ✅ Backend canister deployed successfully

for /f "tokens=*" %%i in ('dfx canister id trustchain_backend') do set BACKEND_CANISTER=%%i
echo ✅ Backend Canister ID: %BACKEND_CANISTER%

echo 📋 Step 4: Building frontend...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to build frontend
    pause
    exit /b 1
)
echo ✅ Frontend built successfully

echo 📋 Step 5: Deploying frontend canister...
call dfx deploy trustchain_frontend
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to deploy frontend canister
    pause
    exit /b 1
)
echo ✅ Frontend canister deployed successfully

for /f "tokens=*" %%i in ('dfx canister id trustchain_frontend') do set FRONTEND_CANISTER=%%i
echo ✅ Frontend Canister ID: %FRONTEND_CANISTER%

echo 📋 Step 6: Testing backend functionality...

:: Test credential issuance
echo 📋 Testing credential issuance...
set OWNER_PRINCIPAL=rdmx6-jaaaa-aaaah-qacaa-cai
set METADATA={"degree": "Bachelor of Computer Science", "institution": "MIT", "gpa": "3.8", "year": "2024"}

call dfx canister call trustchain_backend issueCredential "(%OWNER_PRINCIPAL%, \"%METADATA%\")"
if %ERRORLEVEL% neq 0 (
    echo ⚠️  Credential issuance test failed
) else (
    echo ✅ Test credential issued successfully
)

:: Test credential verification
echo 📋 Testing credential verification...
call dfx canister call trustchain_backend getAllCredentials
if %ERRORLEVEL% neq 0 (
    echo ⚠️  Credential verification test failed
) else (
    echo ✅ Credential verification test passed
)

echo 📋 Step 7: Demo scenario setup...

:: Issue multiple test credentials
echo 📋 Issuing demo credentials...

echo Issuing credential 1...
call dfx canister call trustchain_backend issueCredential "(%OWNER_PRINCIPAL%, \"{\\\"degree\\\": \\\"Bachelor of Computer Science\\\", \\\"institution\\\": \\\"MIT\\\", \\\"gpa\\\": \\\"3.8\\\", \\\"year\\\": \\\"2024\\\"}\")"
timeout /t 1 > nul

echo Issuing credential 2...
call dfx canister call trustchain_backend issueCredential "(%OWNER_PRINCIPAL%, \"{\\\"degree\\\": \\\"Master of AI\\\", \\\"institution\\\": \\\"Stanford\\\", \\\"gpa\\\": \\\"3.9\\\", \\\"year\\\": \\\"2024\\\"}\")"
timeout /t 1 > nul

echo Issuing credential 3...
call dfx canister call trustchain_backend issueCredential "(%OWNER_PRINCIPAL%, \"{\\\"certification\\\": \\\"Blockchain Developer\\\", \\\"institution\\\": \\\"IBM\\\", \\\"skills\\\": [\\\"Smart Contracts\\\", \\\"DeFi\\\"], \\\"year\\\": \\\"2024\\\"}\")"
timeout /t 1 > nul

echo ✅ Demo credentials issued

echo 📋 Step 8: Starting development server...
echo Starting the development server on http://localhost:3000
echo.
echo 🎯 Demo Features Available:
echo   • Authentication with Internet Identity
echo   • Single credential issuance
echo   • Bulk CSV upload
echo   • QR code generation for credentials
echo   • QR code scanning for verification
echo   • NFT badge minting
echo   • Student credential management
echo   • Institution dashboard
echo.
echo 📝 Demo Scenarios:
echo   1. Login as Institution → Issue Credentials
echo   2. Upload CSV file with multiple credentials
echo   3. Generate QR codes for issued credentials
echo   4. Login as Student → View credentials
echo   5. Generate QR codes for sharing
echo   6. Verify credentials by scanning QR codes
echo   7. Mint NFT badges for achievements
echo.
echo 🔧 Backend Canister Commands:
echo   dfx canister call trustchain_backend getAllCredentials
echo   dfx canister call trustchain_backend getCredentialCount
echo   dfx canister call trustchain_backend getSystemInfo
echo.

:: Start the development server
call npm run dev

pause
