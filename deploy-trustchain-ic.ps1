# 🚀 One-Click IC Deployment
# Complete TrustChain blockchain deployment script

Write-Host ""
Write-Host "████████╗██████╗ ██╗   ██╗███████╗████████╗ ██████╗██╗  ██╗ █████╗ ██╗███╗   ██╗" -ForegroundColor Cyan
Write-Host "╚══██╔══╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔════╝██║  ██║██╔══██╗██║████╗  ██║" -ForegroundColor Cyan
Write-Host "   ██║   ██████╔╝██║   ██║███████╗   ██║   ██║     ███████║███████║██║██╔██╗ ██║" -ForegroundColor Cyan
Write-Host "   ██║   ██╔══██╗██║   ██║╚════██║   ██║   ██║     ██╔══██║██╔══██║██║██║╚██╗██║" -ForegroundColor Cyan
Write-Host "   ██║   ██║  ██║╚██████╔╝███████║   ██║   ╚██████╗██║  ██║██║  ██║██║██║ ╚████║" -ForegroundColor Cyan
Write-Host "   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌟 Internet Computer Blockchain Deployment" -ForegroundColor Yellow
Write-Host "   Deploy your entire TrustChain app to the decentralized web!" -ForegroundColor Gray
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = & node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    exit 1
}

# Check if this is the right directory
if (-not (Test-Path "dfx.json")) {
    Write-Host "❌ dfx.json not found. Are you in the TrustChain directory?" -ForegroundColor Red
    exit 1
}
Write-Host "✅ TrustChain project detected" -ForegroundColor Green

# Check/Install DFX
Write-Host ""
Write-Host "🔧 Setting up DFX CLI..." -ForegroundColor Yellow
try {
    $dfxVersion = & dfx --version 2>$null
    Write-Host "✅ DFX already installed: $dfxVersion" -ForegroundColor Green
} catch {
    Write-Host "📥 Installing DFX CLI..." -ForegroundColor Yellow
    try {
        Invoke-Expression "& { $(Invoke-RestMethod -Uri https://raw.githubusercontent.com/dfinity/sdk/master/public/install.ps1) }"
        $env:PATH += ";$env:USERPROFILE\bin"
        Write-Host "✅ DFX installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Automatic DFX installation failed." -ForegroundColor Red
        Write-Host "Please install DFX manually and run this script again." -ForegroundColor Yellow
        Write-Host "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/" -ForegroundColor Cyan
        exit 1
    }
}

# Build frontend
Write-Host ""
Write-Host "🏗️ Building production frontend..." -ForegroundColor Yellow
try {
    npm run build:production | Out-Null
    if (Test-Path "dist") {
        $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "✅ Frontend built successfully! Size: $([math]::Round($distSize, 2)) MB" -ForegroundColor Green
    } else {
        throw "Build completed but dist folder not found"
    }
} catch {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Gray
    exit 1
}

# Setup IC identity
Write-Host ""
Write-Host "🔐 Setting up IC identity..." -ForegroundColor Yellow
try {
    & dfx identity new trustchain-prod 2>$null | Out-Null
    & dfx identity use trustchain-prod
    $principal = & dfx identity get-principal
    Write-Host "✅ IC Principal: $principal" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Using existing identity" -ForegroundColor Yellow
}

# Check cycles (optional)
Write-Host ""
Write-Host "💰 Checking cycles balance..." -ForegroundColor Yellow
try {
    $balance = & dfx wallet balance --network ic 2>$null
    Write-Host "💎 Cycles balance: $balance" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not check balance. You may need to add cycles." -ForegroundColor Yellow
    Write-Host "   Use your IC token to add cycles before deployment." -ForegroundColor Gray
}

# Final confirmation
Write-Host ""
Write-Host "🚀 Ready to deploy TrustChain to Internet Computer!" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will deploy:" -ForegroundColor White
Write-Host "  📜 Backend Canister (Motoko smart contracts)" -ForegroundColor Gray
Write-Host "  🎨 Frontend Canister (React app on blockchain)" -ForegroundColor Gray
Write-Host ""
$confirm = Read-Host "Continue with deployment? (y/N)"

if ($confirm.ToLower() -ne "y") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Deploy to IC
Write-Host ""
Write-Host "🌟 Deploying to Internet Computer mainnet..." -ForegroundColor Cyan
Write-Host "   This may take several minutes..." -ForegroundColor Gray
Write-Host ""

try {
    & dfx deploy --network ic --with-cycles 1000000000000
    
    Write-Host ""
    Write-Host "🎉 SUCCESS! TrustChain deployed to IC blockchain!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your app is now live on the decentralized web!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Note the canister URLs from above output" -ForegroundColor White
    Write-Host "  2. Test your live application" -ForegroundColor White
    Write-Host "  3. Share your blockchain app with the world!" -ForegroundColor White
    Write-Host ""
    Write-Host "🏆 You now have a fully decentralized application!" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Common solutions:" -ForegroundColor Yellow
    Write-Host "  1. Add cycles to your wallet using your IC token" -ForegroundColor White
    Write-Host "  2. Check internet connection" -ForegroundColor White
    Write-Host "  3. Try: dfx identity get-wallet --network ic" -ForegroundColor White
    exit 1
}

Read-Host "Press Enter to exit..."
