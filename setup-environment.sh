#!/bin/bash

# TrustChain Environment Setup Script
echo "============================================"
echo "   TrustChain Environment Configuration"
echo "============================================"
echo

# Function to get canister ID safely
get_canister_id() {
    local canister_name=$1
    local id=$(dfx canister id $canister_name 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo $id
    else
        echo "ERROR_GETTING_ID"
    fi
}

# Check if dfx is running
echo "🔍 Checking dfx status..."
if ! dfx ping > /dev/null 2>&1; then
    echo "❌ dfx is not running. Starting dfx..."
    dfx start --background
    sleep 10
else
    echo "✅ dfx is running"
fi

# Get canister IDs
echo
echo "🆔 Getting canister IDs..."
TRUSTCHAIN_ID=$(get_canister_id "trustchain_backend")
UNIVERSAL_ID=$(get_canister_id "universal_backend")
FRONTEND_ID=$(get_canister_id "trustchain_frontend")

echo "   Trustchain Backend: $TRUSTCHAIN_ID"
echo "   Universal Backend: $UNIVERSAL_ID"
echo "   Frontend: $FRONTEND_ID"

# Create environment file
echo
echo "📝 Creating .env.local..."
cat > .env.local << EOF
# TrustChain Backend Configuration
REACT_APP_CANISTER_ID=$TRUSTCHAIN_ID
REACT_APP_UNIVERSAL_CANISTER_ID=$UNIVERSAL_ID
REACT_APP_DFX_NETWORK=local
REACT_APP_IC_HOST=http://127.0.0.1:8000

# Feature Flags
REACT_APP_USE_MOCK_DATA=false
REACT_APP_ENABLE_DEBUG_MODE=true
REACT_APP_ENABLE_FALLBACK=true

# Development Settings
REACT_APP_LOG_LEVEL=debug
REACT_APP_API_TIMEOUT=10000
EOF

echo "✅ Environment file created"

# Create development configuration
echo
echo "📋 Creating development config..."
cat > development.config.json << EOF
{
  "environment": "development",
  "canisters": {
    "trustchain_backend": "$TRUSTCHAIN_ID",
    "universal_backend": "$UNIVERSAL_ID",
    "trustchain_frontend": "$FRONTEND_ID"
  },
  "ic": {
    "host": "http://127.0.0.1:8000",
    "network": "local",
    "timeout": 10000
  },
  "features": {
    "universalDashboard": true,
    "trustBoardManagement": true,
    "organizationManagement": true,
    "analytics": true,
    "fallbackMode": true
  },
  "logging": {
    "level": "debug",
    "enableConsole": true,
    "enableBrowserLogs": true
  }
}
EOF

echo "✅ Development config created"

# Create startup script
echo
echo "🚀 Creating development startup script..."
cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "Starting TrustChain Development Environment..."

# Ensure dfx is running
if ! dfx ping > /dev/null 2>&1; then
    echo "Starting dfx..."
    dfx start --background
    sleep 10
fi

# Start development server
echo "Starting React development server..."
npm start
EOF

chmod +x start-dev.sh

echo "✅ Startup script created"

# Create testing shortcuts
echo
echo "🧪 Creating test shortcuts..."
cat > test-backend.sh << 'EOF'
#!/bin/bash
echo "Testing TrustChain Backend..."

echo "🧪 Testing Universal Backend..."
dfx canister call universal_backend getSystemInfo

echo "🧪 Testing Credential Backend..."
dfx canister call trustchain_backend getAuthorizedInstitutions

echo "✅ Backend tests complete"
EOF

chmod +x test-backend.sh

# Create canister management script
cat > manage-canisters.sh << 'EOF'
#!/bin/bash

case $1 in
  "start")
    echo "Starting all canisters..."
    dfx start --background
    ;;
  "stop")
    echo "Stopping all canisters..."
    dfx stop
    ;;
  "restart")
    echo "Restarting all canisters..."
    dfx stop
    dfx start --clean --background
    ;;
  "deploy")
    echo "Deploying all canisters..."
    dfx deploy
    ;;
  "status")
    echo "Canister Status:"
    dfx canister status trustchain_backend
    dfx canister status universal_backend
    dfx canister status trustchain_frontend
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|deploy|status}"
    ;;
esac
EOF

chmod +x manage-canisters.sh

echo "✅ Management scripts created"

# Create quick reference
echo
echo "📚 Creating quick reference..."
cat > QUICK_REFERENCE.md << 'EOF'
# TrustChain Development Quick Reference

## 🚀 Starting Development
```bash
# Start everything
./start-dev.sh

# Or manually:
dfx start --background
npm start
```

## 🛠️ Canister Management
```bash
# All canister operations
./manage-canisters.sh {start|stop|restart|deploy|status}

# Individual operations
dfx deploy universal_backend
dfx deploy trustchain_backend
dfx deploy trustchain_frontend
```

## 🧪 Testing
```bash
# Quick backend test
./test-backend.sh

# Individual tests
dfx canister call universal_backend getSystemInfo
dfx canister call trustchain_backend getAuthorizedInstitutions
```

## 🆔 Canister IDs
- **Trustchain Backend**: Check .env.local REACT_APP_CANISTER_ID
- **Universal Backend**: Check .env.local REACT_APP_UNIVERSAL_CANISTER_ID
- **Frontend**: Run `dfx canister id trustchain_frontend`

## 🔍 Debugging
- **Browser Console**: Check for error messages
- **dfx Logs**: `dfx canister logs <canister_name>`
- **Service Logs**: Check UniversalTrustService console messages

## 🏗️ Development Workflow
1. Start dfx: `dfx start --background`
2. Deploy backends: `dfx deploy universal_backend && dfx deploy trustchain_backend`
3. Test backends: `./test-backend.sh`
4. Build frontend: `npm run build`
5. Deploy frontend: `dfx deploy trustchain_frontend`
6. Start dev server: `npm start`

## 🎯 Key URLs
- **Frontend**: http://127.0.0.1:3000 (dev server)
- **IC Frontend**: http://127.0.0.1:8000/?canisterId={frontend_id}
- **Candid UI**: http://127.0.0.1:8000/_/candid?id={canister_id}
EOF

echo "✅ Quick reference created"

# Summary
echo
echo "🎉 ========================================"
echo "    ENVIRONMENT SETUP COMPLETE!"
echo "========================================"
echo
echo "📁 Files created:"
echo "   ✓ .env.local (environment variables)"
echo "   ✓ development.config.json (dev config)"
echo "   ✓ start-dev.sh (startup script)"
echo "   ✓ test-backend.sh (testing script)"
echo "   ✓ manage-canisters.sh (canister management)"
echo "   ✓ QUICK_REFERENCE.md (documentation)"
echo
echo "🚀 Quick Start:"
echo "   1. Run: ./start-dev.sh"
echo "   2. Open: http://127.0.0.1:3000"
echo "   3. Test: ./test-backend.sh"
echo
echo "📚 Documentation: See QUICK_REFERENCE.md"
echo "🆔 Canister IDs: Check .env.local"
echo
echo "✨ Happy coding!"
