# Test Commands for TrustChain IC Deployment

## 1. System Information Check
```bash
dfx canister --network ic call emnyw-syaaa-aaaaa-qajoq-cai getSystemInfo
```

## 2. Initialize Test Data (First Time Setup)
```bash
dfx canister --network ic call emnyw-syaaa-aaaaa-qajoq-cai initializeTestData

## 3. Create TrustBoard
```bash
dfx canister --network ic call emnyw-syaaa-aaaaa-qajoq-cai createTrustBoard '(
  record {
    id = "healthcare_licenses_test";
    name = "Healthcare Professional Licenses - Test";
    description = opt "Medical license verification board for testing";
    organizationId = "health_org_001";
    category = "Healthcare";
    isPublic = true;
    fields = vec {
      record {
        name = "license_number";
        fieldType = "text";
        required = true;
        isPrivate = false;
        description = opt "Medical license number";
      };
      record {
        name = "specialty";
        fieldType = "text";
        required = true;
        isPrivate = false;
        description = opt "Medical specialty";
      };
      record {
        name = "expiry_date";
        fieldType = "date";
        required = true;
        isPrivate = false;
        description = opt "License expiry date";
      }
    };
    permissions = vec {};
    verificationRules = vec {};
    createdAt = 0;
    updatedAt = 0;
  }
)'
```

## 👨‍⚕️ Step 4: Add a Healthcare Record
```bash
dfx canister --network ic call emnyw-syaaa-aaaaa-qajoq-cai addRecord '(
  "healthcare_licenses_test",
  record {
    id = "dr_johnson_2025";
    fields = vec {
      record { key = "license_number"; value = "MD789012" };
      record { key = "specialty"; value = "Emergency Medicine" };
      record { key = "full_name"; value = "Dr. Sarah Johnson" };
      record { key = "expiry_date"; value = "2026-12-31" };
      record { key = "institution"; value = "Metro General Hospital" }
    };
    status = "verified";
    isPrivate = false;
    verifiedBy = opt "health_org_001";
    verificationDate = opt 1721865600; # July 25, 2025
    expiryDate = opt 1735689600; # Dec 31, 2026
    createdAt = 1721865600;
    updatedAt = 1721865600;
  }
)'
```

## 🔍 Step 5: Test TrustGate Verification
```bash
dfx canister --network ic call emnyw-syaaa-aaaaa-qajoq-cai verifyTrustGate '(
  record {
    boardId = "healthcare_licenses_test";
    searchQuery = "MD789012";
    requesterInfo = record {
      organizationId = "metro_hospital_hr";
      purpose = "Employment verification for new hire";
      requesterId = "hr_manager_001";
    };
  }
)'
```

## 📊 Step 6: Get Analytics
```bash
dfx canister --network ic call emnyw-syaaa-aaaaa-qajoq-cai getUniversalAnalytics '("health_org_001")'
```

## 📋 Step 7: List TrustBoards
```bash
dfx canister --network ic call emnyw-syaaa-aaaaa-qajoq-cai listTrustBoards '("health_org_001")'
```

## 🔍 Step 8: Search Records
```bash
dfx canister --network ic call emnyw-syaaa-aaaaa-qajoq-cai searchRecords '("healthcare_licenses_test")'
```

## 📈 Step 9: Check System Status Again
```bash
dfx canister --network ic call emnyw-syaaa-aaaaa-qajoq-cai getSystemInfo
```
**Expected Result**: Should show increased counts for TrustBoards, Records, and Organizations

---

## 🎯 Testing Progress
- [x] ✅ Step 1: Basic system check - SUCCESS
- [ ] 🔄 Step 2: Initialize test data - IN PROGRESS
- [ ] ⏳ Step 3: Create healthcare TrustBoard
- [ ] ⏳ Step 4: Add healthcare record
- [ ] ⏳ Step 5: Test verification
- [ ] ⏳ Step 6: Get analytics
- [ ] ⏳ Step 7: List TrustBoards
- [ ] ⏳ Step 8: Search records
- [ ] ⏳ Step 9: Final system check

## 🚀 What This Testing Demonstrates
- **Universal TrustBoard Creation**: Custom verification frameworks
- **Record Management**: Adding and verifying credentials
- **TrustGate Engine**: Universal verification across organizations
- **Analytics**: Real-time insights and reporting
- **Scalability**: Multiple TrustBoards and organizations
- **Security**: Verification rules and permissions
