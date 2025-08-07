@echo off
echo ============================================
echo 🚀 TrustChain Deployment with New Canister
echo ============================================
echo.
echo New Canister ID: emnyw-syaaa-aaaaa-qajoq-cai
echo.

echo 📋 Setting environment variables...
set REACT_APP_CANISTER_ID=emnyw-syaaa-aaaaa-qajoq-cai
set CANISTER_ID_TRUSTCHAIN_BACKEND=emnyw-syaaa-aaaaa-qajoq-cai
set REACT_APP_NETWORK=ic
set REACT_APP_IC_HOST=https://ic0.app
set REACT_APP_USE_PRODUCTION=true

echo.
echo 🔧 Building application with new canister ID...
call npm run build

echo.
echo 📦 Deploying to IC with your canister...
dfx deploy --network ic --with-cycles 1000000000000

echo.
echo ✅ Deployment completed!
echo.
echo 🌐 Your TrustChain App URLs:
echo Frontend: https://emnyw-syaaa-aaaaa-qajoq-cai.ic0.app
echo Backend API: https://a4gq6-oaaaa-aaaab-qaa4q-cai.icp0.io/?id=emnyw-syaaa-aaaaa-qajoq-cai
echo.
echo 🧪 Test your deployment:
echo dfx canister --network ic call emnyw-syaaa-aaaaa-qajoq-cai getSystemInfo
echo.
pause
