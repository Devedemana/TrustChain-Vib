@echo off
echo Building TrustChain for Production...
echo =====================================

echo Setting environment variables...
set REACT_APP_USE_PRODUCTION=true
set REACT_APP_USE_MOCK_DATA=false

echo Running production build...
npm run build

if %ERRORLEVEL% == 0 (
    echo.
    echo ✅ Production build completed successfully!
    echo 📁 Output directory: dist/
    echo 🚀 Ready for deployment!
) else (
    echo.
    echo ❌ Build failed with error code %ERRORLEVEL%
    echo Please check the error messages above.
)

pause
