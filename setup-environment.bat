@echo off
echo ============================================
echo   TrustChain Environment Configuration
echo ============================================
echo.

echo 🔍 Checking dfx status...
dfx ping >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ dfx is not running. Starting dfx...
    dfx start --background
    timeout /t 10 /nobreak >nul
) else (
    echo ✅ dfx is running
)

echo.
echo 🆔 Getting canister IDs...

for /f "tokens=*" %%i in ('dfx canister id trustchain_backend 2^>nul') do set TRUSTCHAIN_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id universal_backend 2^>nul') do set UNIVERSAL_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id trustchain_frontend 2^>nul') do set FRONTEND_ID=%%i

echo    Trustchain Backend: %TRUSTCHAIN_ID%
echo    Universal Backend: %UNIVERSAL_ID%
echo    Frontend: %FRONTEND_ID%

echo.
echo 📝 Creating .env.local...
(
echo # TrustChain Backend Configuration
echo REACT_APP_CANISTER_ID=%TRUSTCHAIN_ID%
echo REACT_APP_UNIVERSAL_CANISTER_ID=%UNIVERSAL_ID%
echo REACT_APP_DFX_NETWORK=local
echo REACT_APP_IC_HOST=http://127.0.0.1:8000
echo.
echo # Feature Flags
echo REACT_APP_USE_MOCK_DATA=false
echo REACT_APP_ENABLE_DEBUG_MODE=true
echo REACT_APP_ENABLE_FALLBACK=true
echo.
echo # Development Settings
echo REACT_APP_LOG_LEVEL=debug
echo REACT_APP_API_TIMEOUT=10000
) > .env.local

echo ✅ Environment file created

echo.
echo 📋 Creating development config...
(
echo {
echo   "environment": "development",
echo   "canisters": {
echo     "trustchain_backend": "%TRUSTCHAIN_ID%",
echo     "universal_backend": "%UNIVERSAL_ID%",
echo     "trustchain_frontend": "%FRONTEND_ID%"
echo   },
echo   "ic": {
echo     "host": "http://127.0.0.1:8000",
echo     "network": "local",
echo     "timeout": 10000
echo   },
echo   "features": {
echo     "universalDashboard": true,
echo     "trustBoardManagement": true,
echo     "organizationManagement": true,
echo     "analytics": true,
echo     "fallbackMode": true
echo   },
echo   "logging": {
echo     "level": "debug",
echo     "enableConsole": true,
echo     "enableBrowserLogs": true
echo   }
echo }
) > development.config.json

echo ✅ Development config created

echo.
echo 🚀 Creating development startup script...
(
echo @echo off
echo echo Starting TrustChain Development Environment...
echo.
echo echo 🔍 Checking dfx status...
echo dfx ping ^>nul 2^>^&1
echo if %%errorlevel%% neq 0 ^(
echo     echo ❌ dfx not running. Starting dfx...
echo     dfx start --background
echo     timeout /t 10 /nobreak ^>nul
echo ^)
echo.
echo echo 🚀 Starting React development server...
echo npm start
) > start-dev.bat

echo ✅ Startup script created

echo.
echo 🧪 Creating test shortcuts...
(
echo @echo off
echo echo Testing TrustChain Backend...
echo.
echo echo 🧪 Testing Universal Backend...
echo dfx canister call universal_backend getSystemInfo
echo.
echo echo 🧪 Testing Credential Backend...
echo dfx canister call trustchain_backend getAuthorizedInstitutions
echo.
echo echo ✅ Backend tests complete
echo pause
) > test-backend.bat

echo ✅ Test script created

echo.
echo 🛠️ Creating canister management script...
(
echo @echo off
echo if "%%1"=="start" ^(
echo     echo Starting all canisters...
echo     dfx start --background
echo ^) else if "%%1"=="stop" ^(
echo     echo Stopping all canisters...
echo     dfx stop
echo ^) else if "%%1"=="restart" ^(
echo     echo Restarting all canisters...
echo     dfx stop
echo     dfx start --clean --background
echo ^) else if "%%1"=="deploy" ^(
echo     echo Deploying all canisters...
echo     dfx deploy
echo ^) else if "%%1"=="status" ^(
echo     echo Canister Status:
echo     dfx canister status trustchain_backend
echo     dfx canister status universal_backend  
echo     dfx canister status trustchain_frontend
echo ^) else ^(
echo     echo Usage: %%0 {start^|stop^|restart^|deploy^|status}
echo ^)
) > manage-canisters.bat

echo ✅ Management script created

echo.
echo 📚 Creating quick reference...
(
echo # TrustChain Development Quick Reference ^(Windows^)
echo.
echo ## 🚀 Starting Development
echo ```bash
echo # Start everything
echo start-dev.bat
echo.
echo # Or manually:
echo dfx start --background
echo npm start
echo ```
echo.
echo ## 🛠️ Canister Management
echo ```bash
echo # All canister operations
echo manage-canisters.bat {start^|stop^|restart^|deploy^|status}
echo.
echo # Individual operations
echo dfx deploy universal_backend
echo dfx deploy trustchain_backend
echo dfx deploy trustchain_frontend
echo ```
echo.
echo ## 🧪 Testing
echo ```bash
echo # Quick backend test
echo test-backend.bat
echo.
echo # Individual tests
echo dfx canister call universal_backend getSystemInfo
echo dfx canister call trustchain_backend getAuthorizedInstitutions
echo ```
echo.
echo ## 🆔 Canister IDs
echo - **Trustchain Backend**: Check .env.local REACT_APP_CANISTER_ID
echo - **Universal Backend**: Check .env.local REACT_APP_UNIVERSAL_CANISTER_ID
echo - **Frontend**: Run `dfx canister id trustchain_frontend`
echo.
echo ## 🔍 Debugging
echo - **Browser Console**: Check for error messages
echo - **dfx Logs**: `dfx canister logs ^<canister_name^>`
echo - **Service Logs**: Check UniversalTrustService console messages
echo.
echo ## 🏗️ Development Workflow
echo 1. Start dfx: `dfx start --background`
echo 2. Deploy backends: `dfx deploy universal_backend ^&^& dfx deploy trustchain_backend`
echo 3. Test backends: `test-backend.bat`
echo 4. Build frontend: `npm run build`
echo 5. Deploy frontend: `dfx deploy trustchain_frontend`
echo 6. Start dev server: `npm start`
echo.
echo ## 🎯 Key URLs
echo - **Frontend**: http://127.0.0.1:3000 ^(dev server^)
echo - **IC Frontend**: http://127.0.0.1:8000/?canisterId={frontend_id}
echo - **Candid UI**: http://127.0.0.1:8000/_/candid?id={canister_id}
) > QUICK_REFERENCE.md

echo ✅ Quick reference created

echo.
echo 🎉 ========================================
echo    ENVIRONMENT SETUP COMPLETE!
echo ========================================
echo.
echo 📁 Files created:
echo    ✓ .env.local ^(environment variables^)
echo    ✓ development.config.json ^(dev config^)
echo    ✓ start-dev.bat ^(startup script^)
echo    ✓ test-backend.bat ^(testing script^)
echo    ✓ manage-canisters.bat ^(canister management^)
echo    ✓ QUICK_REFERENCE.md ^(documentation^)
echo.
echo 🚀 Quick Start:
echo    1. Run: start-dev.bat
echo    2. Open: http://127.0.0.1:3000
echo    3. Test: test-backend.bat
echo.
echo 📚 Documentation: See QUICK_REFERENCE.md
echo 🆔 Canister IDs: Check .env.local
echo.
echo ✨ Happy coding!
pause
