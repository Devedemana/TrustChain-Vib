#!/bin/bash
# Quick Fix for IC Deployment Security Warning

echo "🔧 Setting up secure IC deployment..."

# Create new secure identity
echo "Creating secure identity..."
dfx identity new trustchain-mainnet 2>/dev/null || echo "Identity already exists"

# Switch to the new identity  
echo "Switching to secure identity..."
dfx identity use trustchain-mainnet

echo ""
echo "✅ Secure identity configured!"
echo "Identity: $(dfx identity whoami)"
echo "Principal: $(dfx identity get-principal)"

echo ""
echo "🚀 Now you can deploy securely:"
echo "dfx deploy --network ic --identity trustchain-mainnet"

echo ""
echo "Or run the full deployment script:"
echo "chmod +x deploy-ic-linux.sh && ./deploy-ic-linux.sh"
