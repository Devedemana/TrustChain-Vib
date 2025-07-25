@echo off
echo.
echo ============================================
echo   TrustChain Backend Modernization Script
echo ============================================
echo.

echo 🔧 Step 1: Stopping existing dfx instance...
dfx stop

echo.
echo 🚀 Step 2: Starting clean dfx environment...
dfx start --clean --background

echo.
echo ⏳ Waiting for dfx to initialize...
timeout /t 10 /nobreak >nul

echo.
echo 📦 Step 3: Deploying Universal Backend...
echo   (This handles TrustBoard functionality)
dfx deploy universal_backend

if %errorlevel% neq 0 (
    echo ❌ Universal backend deployment failed!
    echo    Check universal.mo for syntax errors
    goto :error
)

echo ✅ Universal backend deployed successfully!

echo.
echo 📦 Step 4: Deploying Credential Backend...
echo   (This handles credential management)
dfx deploy trustchain_backend

if %errorlevel% neq 0 (
    echo ❌ Credential backend deployment failed!
    echo    Check main.mo for syntax errors
    goto :error
)

echo ✅ Credential backend deployed successfully!

echo.
echo 🧪 Step 5: Testing Universal Backend...
echo   Testing system info...
dfx canister call universal_backend getSystemInfo

if %errorlevel% neq 0 (
    echo ⚠️  Universal backend test failed, but deployment succeeded
    echo     You can test manually later
) else (
    echo ✅ Universal backend test passed!
)

echo.
echo 🧪 Step 6: Testing Credential Backend...
echo   Testing authorized institutions...
dfx canister call trustchain_backend getAuthorizedInstitutions

if %errorlevel% neq 0 (
    echo ⚠️  Credential backend test failed, but deployment succeeded
    echo     You can test manually later
) else (
    echo ✅ Credential backend test passed!
)

echo.
echo 📋 Step 7: Getting Canister IDs...
echo.
echo 🆔 CANISTER IDs (for .env configuration):
echo   TRUSTCHAIN_BACKEND: 
dfx canister id trustchain_backend
echo   UNIVERSAL_BACKEND: 
dfx canister id universal_backend

echo.
echo 📝 Step 8: Generating .env.local...
(
echo REACT_APP_CANISTER_ID=%trustchain_id%
echo REACT_APP_UNIVERSAL_CANISTER_ID=%universal_id%
echo REACT_APP_DFX_NETWORK=local
echo REACT_APP_IC_HOST=http://127.0.0.1:8000
) > .env.local

echo ✅ Environment file created: .env.local

echo.
echo 🏗️  Step 9: Building frontend...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    echo    Check for TypeScript errors
    goto :error
)

echo ✅ Frontend built successfully!

echo.
echo 📦 Step 10: Deploying frontend...
dfx deploy trustchain_frontend

if %errorlevel% neq 0 (
    echo ❌ Frontend deployment failed!
    goto :error
)

echo ✅ Frontend deployed successfully!

echo.
echo 🎉 ========================================
echo    DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo 🌐 Access your application at:
echo    http://127.0.0.1:8000/?canisterId=
dfx canister id trustchain_frontend
echo.
echo 📝 Next Steps:
echo    1. Open the Universal Dashboard
echo    2. Test TrustBoard creation
echo    3. Verify analytics are working
echo    4. Check that no fallback warnings appear
echo.
echo 💡 If you see "actor.createTrustBoard is not a function":
echo    - Check that Universal Backend is running
echo    - Verify .env.local has correct canister IDs
echo    - Restart the development server
echo.
goto :end

:error
echo.
echo ❌ ========================================
echo    DEPLOYMENT FAILED!
echo ========================================
echo.
echo 🔍 Troubleshooting:
echo    1. Check dfx logs: dfx canister logs [canister_name]
echo    2. Verify Motoko syntax in .mo files
echo    3. Ensure dfx is properly installed
echo    4. Check network connectivity
echo.
echo 🔧 Manual commands to try:
echo    dfx start --clean --background
echo    dfx deploy universal_backend
echo    dfx deploy trustchain_backend
echo    dfx deploy trustchain_frontend
echo.
exit /b 1

:end
echo ✨ Happy coding! Your TrustChain backend is now modernized.
pause
