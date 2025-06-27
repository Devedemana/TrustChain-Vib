#!/bin/bash

# TrustChain Demo Automation Script
# This script demonstrates the full functionality of the TrustChain application

echo "🚀 TrustChain Demo Automation Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the TrustChain project directory"
    exit 1
fi

print_step "Step 1: Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

print_step "Step 2: Starting DFX local network..."
dfx start --background --clean
if [ $? -eq 0 ]; then
    print_success "DFX local network started"
else
    print_warning "DFX network might already be running or failed to start"
fi

print_step "Step 3: Deploying backend canister..."
dfx deploy trustchain_backend
if [ $? -eq 0 ]; then
    print_success "Backend canister deployed successfully"
    BACKEND_CANISTER=$(dfx canister id trustchain_backend)
    print_success "Backend Canister ID: $BACKEND_CANISTER"
else
    print_error "Failed to deploy backend canister"
    exit 1
fi

print_step "Step 4: Building frontend..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_error "Failed to build frontend"
    exit 1
fi

print_step "Step 5: Deploying frontend canister..."
dfx deploy trustchain_frontend
if [ $? -eq 0 ]; then
    print_success "Frontend canister deployed successfully"
    FRONTEND_CANISTER=$(dfx canister id trustchain_frontend)
    print_success "Frontend Canister ID: $FRONTEND_CANISTER"
else
    print_error "Failed to deploy frontend canister"
    exit 1
fi

print_step "Step 6: Testing backend functionality..."

# Test credential issuance
print_step "Testing credential issuance..."
OWNER_PRINCIPAL="rdmx6-jaaaa-aaaah-qacaa-cai"
METADATA='{"degree": "Bachelor of Computer Science", "institution": "MIT", "gpa": "3.8", "year": "2024"}'

dfx canister call trustchain_backend issueCredential "($OWNER_PRINCIPAL, \"$METADATA\")"
if [ $? -eq 0 ]; then
    print_success "Test credential issued successfully"
else
    print_warning "Credential issuance test failed"
fi

# Test credential verification
print_step "Testing credential verification..."
dfx canister call trustchain_backend getAllCredentials
if [ $? -eq 0 ]; then
    print_success "Credential verification test passed"
else
    print_warning "Credential verification test failed"
fi

print_step "Step 7: Demo scenario setup..."

# Issue multiple test credentials
print_step "Issuing demo credentials..."

CREDENTIALS=(
    "($OWNER_PRINCIPAL, \"{\\\"degree\\\": \\\"Bachelor of Computer Science\\\", \\\"institution\\\": \\\"MIT\\\", \\\"gpa\\\": \\\"3.8\\\", \\\"year\\\": \\\"2024\\\"}\")"
    "($OWNER_PRINCIPAL, \"{\\\"degree\\\": \\\"Master of AI\\\", \\\"institution\\\": \\\"Stanford\\\", \\\"gpa\\\": \\\"3.9\\\", \\\"year\\\": \\\"2024\\\"}\")"
    "($OWNER_PRINCIPAL, \"{\\\"certification\\\": \\\"Blockchain Developer\\\", \\\"institution\\\": \\\"IBM\\\", \\\"skills\\\": [\\\"Smart Contracts\\\", \\\"DeFi\\\"], \\\"year\\\": \\\"2024\\\"}\")"
)

for i in "${!CREDENTIALS[@]}"; do
    echo "Issuing credential $((i+1))..."
    dfx canister call trustchain_backend issueCredential "${CREDENTIALS[$i]}"
    sleep 1
done

print_success "Demo credentials issued"

print_step "Step 8: Starting development server..."
echo "Starting the development server on http://localhost:3000"
echo ""
echo "🎯 Demo Features Available:"
echo "  • Authentication with Internet Identity"
echo "  • Single credential issuance"
echo "  • Bulk CSV upload"
echo "  • QR code generation for credentials"
echo "  • QR code scanning for verification"
echo "  • NFT badge minting"
echo "  • Student credential management"
echo "  • Institution dashboard"
echo ""
echo "📝 Demo Scenarios:"
echo "  1. Login as Institution → Issue Credentials"
echo "  2. Upload CSV file with multiple credentials"
echo "  3. Generate QR codes for issued credentials"
echo "  4. Login as Student → View credentials"
echo "  5. Generate QR codes for sharing"
echo "  6. Verify credentials by scanning QR codes"
echo "  7. Mint NFT badges for achievements"
echo ""
echo "🔧 Backend Canister Commands:"
echo "  dfx canister call trustchain_backend getAllCredentials"
echo "  dfx canister call trustchain_backend getCredentialCount"
echo "  dfx canister call trustchain_backend getSystemInfo"
echo ""

# Start the development server
npm run dev
