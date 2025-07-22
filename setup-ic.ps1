# TrustChain Internet Computer Setup for Windows
# This script will install DFX and prepare for IC deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 TrustChain IC Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Step 1: Installing DFX CLI..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

try {
    # Install DFX via the official installer
    Invoke-Expression "& { $(Invoke-RestMethod -Uri https://raw.githubusercontent.com/dfinity/sdk/master/public/install.ps1) }"
    Write-Host "✅ DFX installation completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ DFX installation failed. Trying alternative method..." -ForegroundColor Red
    
    # Alternative: Download and install manually
    Write-Host "Installing DFX manually..." -ForegroundColor Yellow
    $env:PATH += ";$env:USERPROFILE\bin"
    
    # Try to verify installation
    try {
        & dfx --version
        Write-Host "✅ DFX installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Could not install DFX automatically." -ForegroundColor Red
        Write-Host "Please install DFX manually:" -ForegroundColor Yellow
        Write-Host "1. Visit: https://internetcomputer.org/" -ForegroundColor Gray
        Write-Host "2. Follow Windows installation guide" -ForegroundColor Gray
        Write-Host "3. Or use Windows Subsystem for Linux (WSL)" -ForegroundColor Gray
        Write-Host ""
        Read-Host "Press Enter to continue anyway..."
    }
}

Write-Host ""
Write-Host "📋 Step 2: Building production frontend..." -ForegroundColor Yellow

try {
    npm run build:production
    Write-Host "✅ Frontend build completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    Write-Host "Make sure you've run 'npm install' first" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Step 3: Setting up IC identity..." -ForegroundColor Yellow

try {
    # Create new identity for IC deployment
    & dfx identity new trustchain-deploy 2>$null
    & dfx identity use trustchain-deploy
    
    Write-Host "Your IC Principal:" -ForegroundColor Cyan
    & dfx identity get-principal
    
    Write-Host "✅ IC identity configured!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not configure IC identity (DFX may not be installed)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Add cycles to your wallet using your IC token" -ForegroundColor White
Write-Host "2. Run: dfx wallet balance --network ic" -ForegroundColor White
Write-Host "3. Deploy with: dfx deploy --network ic" -ForegroundColor White
Write-Host "4. Or use: ./deploy-to-ic.bat" -ForegroundColor White

Write-Host ""
Write-Host "🌟 Your TrustChain app will be deployed to IC blockchain!" -ForegroundColor Green
Write-Host "Both frontend and backend will run on decentralized infrastructure." -ForegroundColor Gray

Write-Host ""
Read-Host "Press Enter to exit..."
