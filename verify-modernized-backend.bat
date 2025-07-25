@echo off
echo.
echo ==========================================
echo   TrustChain Backend Verification Tests
echo ==========================================
echo.

echo 🧪 Testing Universal Backend Functionality...
echo.

echo 📊 Test 1: System Information
dfx canister call universal_backend getSystemInfo
echo.

echo 🏢 Test 2: Creating Test Organization
dfx canister call universal_backend createOrganization "(record {id=\"test-org-1\"; name=\"Test University\"; orgType=\"university\"; industry=\"education\"; verified=true; trustScore=95; allowCrossVerification=true; publicProfile=true; apiAccess=true; createdAt=1640995200000; lastActive=1640995200000})"
echo.

echo 🔍 Test 3: Retrieving Organization
dfx canister call universal_backend getOrganization "(\"test-org-1\")"
echo.

echo 📋 Test 4: Creating Test TrustBoard
dfx canister call universal_backend createTrustBoard "(record {id=\"test-board-1\"; organizationId=\"test-org-1\"; name=\"Academic Credentials\"; description=\"University degree verification\"; category=\"education\"; fields=vec {}; verificationRules=vec {}; permissions=vec {}; isActive=true; createdAt=1640995200000; updatedAt=1640995200000})"
echo.

echo 📝 Test 5: Listing TrustBoards
dfx canister call universal_backend listTrustBoards "(\"test-org-1\")"
echo.

echo 📈 Test 6: Analytics
dfx canister call universal_backend getUniversalAnalytics "(\"test-org-1\")"
echo.

echo ==========================================
echo   Credential Backend Tests
echo ==========================================
echo.

echo 🏛️ Test 7: Authorized Institutions
dfx canister call trustchain_backend getAuthorizedInstitutions
echo.

echo 🎓 Test 8: Authorizing Test Institution
dfx canister call trustchain_backend authorizeInstitution "(\"Test University\")"
echo.

echo 📜 Test 9: Issuing Test Credential
dfx canister call trustchain_backend issueCredential "(\"student123\", \"Test University\", \"degree\", \"Bachelor of Science\", \"Computer Science degree from Test University\")"
echo.

echo ✅ Test 10: Verifying All Systems
echo.
echo 🔗 Canister Status:
echo   Universal Backend:
dfx canister status universal_backend
echo.
echo   Credential Backend:
dfx canister status trustchain_backend
echo.

echo 🆔 Canister IDs:
echo   Universal Backend: 
dfx canister id universal_backend
echo   Credential Backend: 
dfx canister id trustchain_backend
echo   Frontend: 
dfx canister id trustchain_frontend
echo.

echo ==========================================
echo   Frontend Integration Test
echo ==========================================
echo.

echo 🌐 Frontend URL:
echo   http://127.0.0.1:8000/?canisterId=
dfx canister id trustchain_frontend
echo.

echo 📋 Manual Frontend Tests:
echo   1. Open Universal Dashboard
echo   2. Navigate to TrustBoards tab
echo   3. Click "Create New TrustBoard"
echo   4. Verify no "actor.createTrustBoard is not a function" error
echo   5. Check Analytics tab for real data
echo   6. Verify Organization Management works
echo.

echo ✅ Backend modernization verification complete!
echo.
echo 🎯 Success Criteria:
echo   ✓ Universal backend responds to all calls
echo   ✓ Credential backend maintains functionality  
echo   ✓ TrustBoard creation works
echo   ✓ Analytics return structured data
echo   ✓ Organization management operational
echo.
pause
