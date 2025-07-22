# Internet Computer Deployment Configuration
# Auto-generated deployment script for Windows

@echo off
echo ========================================
echo 🚀 TrustChain IC Deployment Script
echo ========================================

echo.
echo 📋 Step 1: Checking DFX installation...
dfx --version
if %errorlevel% neq 0 (
    echo ❌ DFX not found. Please install DFX first:
    echo    Visit: https://internetcomputer.org/install.sh
    pause
    exit /b 1
)

echo.
echo 📋 Step 2: Building production frontend...
call npm run build:production
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo.
echo 📋 Step 3: Checking cycles balance...
dfx wallet balance --network ic
if %errorlevel% neq 0 (
    echo ⚠️  Wallet not found or cycles low
    echo    Make sure you have cycles in your wallet
    echo    Get cycles from your IC token first
    pause
)

echo.
echo 📋 Step 4: Starting IC deployment...
echo    This will deploy both backend and frontend to IC blockchain
echo.
set /p confirm="Continue with deployment? (y/N): "
if /i "%confirm%" neq "y" (
    echo Deployment cancelled.
    pause
    exit /b 0
)

echo.
echo 🌟 Deploying to Internet Computer...
dfx deploy --network ic

if %errorlevel% neq 0 (
    echo ❌ Deployment failed!
    echo    Check your cycles balance and network connection
    pause
    exit /b 1
) else (
    echo.
    echo ✅ SUCCESS! TrustChain deployed to IC blockchain!
    echo.
    echo 🌐 Your canister URLs:
    echo    Backend:  Check DFX output above
    echo    Frontend: Check DFX output above
    echo.
    echo 🏆 Your app is now live on the Internet Computer!
    echo    Share these URLs to showcase your blockchain app
    echo.
)

pause
