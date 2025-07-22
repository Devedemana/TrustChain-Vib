#!/bin/bash
# TrustChain Cycles Balance Checker and Helper

echo "=========================================="
echo "💰 TrustChain IC Cycles Helper"
echo "=========================================="
echo ""

echo "🔐 Your IC Identity Info:"
echo "Principal: $(dfx identity get-principal)"
echo "Account:   $(dfx ledger account-id)"

echo ""
echo "💰 Checking your balances..."

echo ""
echo "📊 ICP Balance:"
dfx ledger balance --network ic || echo "❌ Could not check ICP balance"

echo ""
echo "⚡ Cycles Balance:"
dfx wallet balance --network ic 2>/dev/null || echo "❌ No wallet found or no cycles"

echo ""
echo "🎯 Options to get cycles for deployment:"
echo ""
echo "1. 🆓 Free Cycles (Recommended for testing):"
echo "   Visit: https://faucet.dfinity.org/"
echo "   Enter your principal: $(dfx identity get-principal)"
echo ""
echo "2. 💳 Buy ICP and convert:"
echo "   - Send ICP to: $(dfx ledger account-id)"
echo "   - Run: dfx cycles convert --amount=1.0 --network ic"
echo ""
echo "3. 🎫 If you have a cycles voucher:"
echo "   - Check your IC token documentation"
echo "   - Look for voucher redemption instructions"
echo ""
echo "4. 💝 Request from IC community:"
echo "   - IC Discord: https://discord.gg/internetcomputer"
echo "   - IC Forum: https://forum.dfinity.org/"
echo ""

echo "📋 Once you have cycles, deploy with:"
echo "   dfx deploy --network ic"
echo ""

read -p "Would you like to try the free faucet? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Opening IC faucet in browser..."
    echo "Your principal to enter: $(dfx identity get-principal)"
    echo ""
    # Try to open browser (works in some WSL setups)
    explorer.exe "https://faucet.dfinity.org/" 2>/dev/null || echo "Please visit: https://faucet.dfinity.org/"
fi
