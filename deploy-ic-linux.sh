#!/bin/bash
# TrustChain IC Deployment for Linux/WSL

echo "=========================================="
echo "🚀 TrustChain IC Deployment (Linux/WSL)"
echo "=========================================="
echo ""

echo "📋 Step 1: Creating secure IC identity..."
dfx identity new trustchain-mainnet 2>/dev/null || echo "Identity may already exist"
dfx identity use trustchain-mainnet

echo ""
echo "✅ Active Identity:"
dfx identity whoami

echo ""
echo "🔐 Your IC Principal:"
dfx identity get-principal

echo ""
echo "📋 Step 2: Building production frontend..."
npm run build:production

echo ""
echo "📋 Step 3: Checking cycles balance..."
echo "⚠️ Make sure you have cycles in your wallet!"
echo "If this fails, you need to add cycles using your IC token."
dfx wallet balance --network ic || echo "No wallet found - you may need to create one"

echo ""
echo "📋 Step 4: Ready to deploy!"
echo "This will deploy both backend (Motoko) and frontend (React) to IC blockchain"
echo ""
read -p "Continue with deployment? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🌟 Deploying TrustChain to Internet Computer..."
    echo "This may take several minutes..."
    
    # Deploy with cycles
    dfx deploy --network ic --with-cycles 1000000000000
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 SUCCESS! TrustChain deployed to IC blockchain!"
        echo ""
        echo "🌐 Your app is now live on the decentralized web!"
        echo "📝 Check the canister URLs above to access your live app"
        echo ""
        echo "🏆 You now have a fully decentralized blockchain application!"
    else
        echo ""
        echo "❌ Deployment failed!"
        echo ""
        echo "Common solutions:"
        echo "1. Add cycles: dfx wallet send [WALLET_ID] --amount 1.0"
        echo "2. Create wallet: dfx ledger create-canister [PRINCIPAL] --amount 0.25"
        echo "3. Check your IC token documentation for getting cycles"
    fi
else
    echo "Deployment cancelled."
fi
