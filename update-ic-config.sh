#!/bin/bash
# Update environment with real IC canister IDs after deployment

echo "🔧 Updating environment with real IC canister IDs..."

# Get canister IDs from DFX
BACKEND_CANISTER=$(dfx canister id trustchain_backend --network ic 2>/dev/null)
FRONTEND_CANISTER=$(dfx canister id trustchain_frontend --network ic 2>/dev/null)

if [ -z "$BACKEND_CANISTER" ] || [ -z "$FRONTEND_CANISTER" ]; then
    echo "❌ Could not get canister IDs. Make sure deployment was successful."
    echo "Run: dfx deploy --network ic"
    exit 1
fi

echo "✅ Found canister IDs:"
echo "Backend:  $BACKEND_CANISTER"
echo "Frontend: $FRONTEND_CANISTER"

# Update .env.local with real production values
cat > .env.local << EOF
# TrustChain Production Configuration
# Updated with real IC canister IDs on $(date)

# Production Settings - Real IC Deployment
REACT_APP_USE_PRODUCTION=true
REACT_APP_CANISTER_ID=$BACKEND_CANISTER
REACT_APP_NETWORK=ic
REACT_APP_IC_HOST=https://icp0.io

# Disable mock data in production
REACT_APP_USE_MOCK_DATA=false

# Optional Features
# REACT_APP_WEBSOCKET_URL=

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_FRAUD_DETECTION=true
REACT_APP_ENABLE_REALTIME=true

# Real IC Canister IDs
CANISTER_ID_TRUSTCHAIN_BACKEND=$BACKEND_CANISTER
CANISTER_ID_TRUSTCHAIN_FRONTEND=$FRONTEND_CANISTER
DFX_NETWORK=ic

# Canister URLs
REACT_APP_BACKEND_URL=https://$BACKEND_CANISTER.ic0.app
REACT_APP_FRONTEND_URL=https://$FRONTEND_CANISTER.ic0.app
EOF

echo ""
echo "🎉 Environment updated successfully!"
echo ""
echo "📝 Your live canister URLs:"
echo "Backend:  https://$BACKEND_CANISTER.ic0.app"
echo "Frontend: https://$FRONTEND_CANISTER.ic0.app"
echo ""
echo "🚀 Rebuild your app to use real IC canisters:"
echo "npm run build:production"
echo ""
echo "🌐 Your TrustChain is now fully deployed on Internet Computer!"
