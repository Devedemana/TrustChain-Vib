// =============================================================================
// COMPLETE TRUSTCHAIN MOTOKO BACKEND COLLECTION
// For IC Ninja Playground Testing
// =============================================================================

// Note: In IC Ninja playground, copy each actor separately since you can only 
// deploy one actor at a time. Start with TrustChainUniversal for main functionality.

// =============================================================================
// 1. UNIVERSAL BACKEND - Primary TrustBoard Infrastructure
// =============================================================================

import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";

actor TrustChainUniversal {
    
    // Universal TrustBoard Types
    public type FieldDefinition = {
        name: Text;
        fieldType: Text; // "text", "number", "date", "boolean", "email", "url"
        required: Bool;
        isPrivate: Bool;
        description: ?Text;
    };

    public type VerificationRule = {
        id: Text;
        name: Text;
        action: Text; // "allow", "deny", "require_approval"
        description: Text;
    };

    public type TrustBoardPermission = {
        userId: Text;
        role: Text; // "owner", "admin", "editor", "viewer"
        canRead: Bool;
        canWrite: Bool;
        canVerify: Bool;
        canManageUsers: Bool;
        canDelete: Bool;
    };

    public type TrustBoard = {
        id: Text;
        organizationId: Text;
        name: Text;
        description: Text;
        category: Text;
        fields: [FieldDefinition];
        verificationRules: [VerificationRule];
        permissions: [TrustBoardPermission];
        isActive: Bool;
        createdAt: Int;
        updatedAt: Int;
    };

    public type TrustRecord = {
        id: Text;
        boardId: Text;
        submitter: Text;
        submitterType: Text; // "organization", "individual", "system"
        timestamp: Int;
        verificationStatus: Text; // "pending", "verified", "rejected", "expired"
        verificationHash: Text;
        dataHash: Text; // Hash of the actual data for privacy
    };

    public type Organization = {
        id: Text;
        name: Text;
        orgType: Text; // "university", "corporation", "government", etc.
        industry: Text;
        verified: Bool;
        trustScore: Nat;
        allowCrossVerification: Bool;
        publicProfile: Bool;
        apiAccess: Bool;
        createdAt: Int;
        lastActive: Int;
    };

    public type VerificationRequest = {
        id: Text;
        searchQuery: Text;
        requesterId: Text;
        requesterType: Text;
        anonymousMode: Bool;
        urgency: Text;
        timestamp: Int;
    };

    public type VerificationResponse = {
        requestId: Text;
        verified: Bool;
        confidence: Nat;
        timestamp: Int;
        responseTime: Nat;
        source: Text;
        organizationName: Text;
        boardId: Text;
        boardName: Text;
    };

    // Storage
    private stable var trustBoardEntries: [(Text, TrustBoard)] = [];
    private stable var trustRecordEntries: [(Text, TrustRecord)] = [];
    private stable var organizationEntries: [(Text, Organization)] = [];
    private stable var verificationRequestEntries: [(Text, VerificationRequest)] = [];

    private var trustBoards = HashMap.HashMap<Text, TrustBoard>(10, Text.equal, Text.hash);
    private var trustRecords = HashMap.HashMap<Text, TrustRecord>(100, Text.equal, Text.hash);
    private var organizations = HashMap.HashMap<Text, Organization>(10, Text.equal, Text.hash);
    private var verificationRequests = HashMap.HashMap<Text, VerificationRequest>(100, Text.equal, Text.hash);

    // Initialize from stable storage
    system func preupgrade() {
        trustBoardEntries := Iter.toArray(trustBoards.entries());
        trustRecordEntries := Iter.toArray(trustRecords.entries());
        organizationEntries := Iter.toArray(organizations.entries());
        verificationRequestEntries := Iter.toArray(verificationRequests.entries());
    };

    system func postupgrade() {
        trustBoards := HashMap.fromIter<Text, TrustBoard>(trustBoardEntries.vals(), trustBoardEntries.size(), Text.equal, Text.hash);
        trustRecords := HashMap.fromIter<Text, TrustRecord>(trustRecordEntries.vals(), trustRecordEntries.size(), Text.equal, Text.hash);
        organizations := HashMap.fromIter<Text, Organization>(organizationEntries.vals(), organizationEntries.size(), Text.equal, Text.hash);
        verificationRequests := HashMap.fromIter<Text, VerificationRequest>(verificationRequestEntries.vals(), verificationRequestEntries.size(), Text.equal, Text.hash);
    };

    // Helper function to generate unique IDs
    private func generateId(prefix: Text): Text {
        let timestamp = Int.abs(Time.now());
        prefix # "_" # Nat.toText(timestamp)
    };

    // Organization Management
    public func createOrganization(org: Organization): async Result.Result<Organization, Text> {
        switch (organizations.get(org.id)) {
            case (?existing) { #err("Organization already exists") };
            case null {
                organizations.put(org.id, org);
                #ok(org)
            };
        }
    };

    public query func getOrganization(id: Text): async ?Organization {
        organizations.get(id)
    };

    public func updateOrganization(id: Text, updates: Organization): async Result.Result<Organization, Text> {
        switch (organizations.get(id)) {
            case null { #err("Organization not found") };
            case (?existing) {
                let updated: Organization = {
                    id = existing.id;
                    name = updates.name;
                    orgType = updates.orgType;
                    industry = updates.industry;
                    verified = updates.verified;
                    trustScore = updates.trustScore;
                    allowCrossVerification = updates.allowCrossVerification;
                    publicProfile = updates.publicProfile;
                    apiAccess = updates.apiAccess;
                    createdAt = existing.createdAt;
                    lastActive = Time.now();
                };
                organizations.put(id, updated);
                #ok(updated)
            };
        }
    };

    // TrustBoard Management
    public func createTrustBoard(board: TrustBoard): async Result.Result<TrustBoard, Text> {
        switch (trustBoards.get(board.id)) {
            case (?existing) { #err("TrustBoard already exists") };
            case null {
                trustBoards.put(board.id, board);
                #ok(board)
            };
        }
    };

    public query func getTrustBoard(id: Text): async ?TrustBoard {
        trustBoards.get(id)
    };

    public query func listTrustBoards(organizationId: Text): async [TrustBoard] {
        let boards = Array.filter<TrustBoard>(
            Iter.toArray(trustBoards.vals()), 
            func(board: TrustBoard): Bool {
                board.organizationId == organizationId and board.isActive
            }
        );
        boards
    };

    public func updateTrustBoard(id: Text, updates: TrustBoard): async Result.Result<TrustBoard, Text> {
        switch (trustBoards.get(id)) {
            case null { #err("TrustBoard not found") };
            case (?existing) {
                let updated: TrustBoard = {
                    id = existing.id;
                    organizationId = existing.organizationId;
                    name = updates.name;
                    description = updates.description;
                    category = updates.category;
                    fields = updates.fields;
                    verificationRules = updates.verificationRules;
                    permissions = updates.permissions;
                    isActive = updates.isActive;
                    createdAt = existing.createdAt;
                    updatedAt = Time.now();
                };
                trustBoards.put(id, updated);
                #ok(updated)
            };
        }
    };

    public func deleteTrustBoard(id: Text): async Result.Result<Bool, Text> {
        switch (trustBoards.get(id)) {
            case null { #err("TrustBoard not found") };
            case (?existing) {
                // Soft delete by marking as inactive
                let updated: TrustBoard = {
                    id = existing.id;
                    organizationId = existing.organizationId;
                    name = existing.name;
                    description = existing.description;
                    category = existing.category;
                    fields = existing.fields;
                    verificationRules = existing.verificationRules;
                    permissions = existing.permissions;
                    isActive = false;
                    createdAt = existing.createdAt;
                    updatedAt = Time.now();
                };
                trustBoards.put(id, updated);
                #ok(true)
            };
        }
    };

    // Record Management
    public func addRecord(boardId: Text, record: TrustRecord): async Result.Result<TrustRecord, Text> {
        switch (trustBoards.get(boardId)) {
            case null { #err("TrustBoard not found") };
            case (?board) {
                if (not board.isActive) {
                    return #err("TrustBoard is not active");
                };
                trustRecords.put(record.id, record);
                #ok(record)
            };
        }
    };

    public func batchAddRecords(boardId: Text, records: [TrustRecord]): async {
        successful: [TrustRecord];
        failed: [{ index: Nat; error: Text }];
    } {
        var successful: [TrustRecord] = [];
        var failed: [{ index: Nat; error: Text }] = [];

        switch (trustBoards.get(boardId)) {
            case null {
                // All records fail if board doesn't exist
                failed := Array.tabulate<{ index: Nat; error: Text }>(
                    records.size(),
                    func(i: Nat): { index: Nat; error: Text } {
                        { index = i; error = "TrustBoard not found" }
                    }
                );
            };
            case (?board) {
                if (not board.isActive) {
                    failed := Array.tabulate<{ index: Nat; error: Text }>(
                        records.size(),
                        func(i: Nat): { index: Nat; error: Text } {
                            { index = i; error = "TrustBoard is not active" }
                        }
                    );
                } else {
                    for (i in Iter.range(0, records.size() - 1)) {
                        let record = records[i];
                        trustRecords.put(record.id, record);
                        successful := Array.append(successful, [record]);
                    };
                };
            };
        };

        { successful = successful; failed = failed }
    };

    public query func getRecord(boardId: Text, recordId: Text): async ?TrustRecord {
        switch (trustRecords.get(recordId)) {
            case null { null };
            case (?record) {
                if (record.boardId == boardId) {
                    ?record
                } else {
                    null
                }
            };
        }
    };

    public query func searchRecords(boardId: Text): async [TrustRecord] {
        let records = Array.filter<TrustRecord>(
            Iter.toArray(trustRecords.vals()),
            func(record: TrustRecord): Bool {
                record.boardId == boardId
            }
        );
        records
    };

    // Universal Verification System
    public func verifyTrustGate(request: VerificationRequest): async VerificationResponse {
        let startTime = Time.now();
        
        // Store the verification request
        verificationRequests.put(request.id, request);
        
        // Simple verification logic (enhanced in production)
        var verified = false;
        var confidence: Nat = 0;
        var sourceBoardId = "";
        var sourceBoardName = "";
        var sourceOrgName = "";

        // Search across all records for the query
        for ((recordId, record) in trustRecords.entries()) {
            // Simple text matching - check if query matches record data
            if (Text.equal(record.dataHash, request.searchQuery) or 
                Text.equal(record.submitter, request.searchQuery)) {
                verified := true;
                confidence := 85; // Basic confidence score
                sourceBoardId := record.boardId;
                
                // Get board and organization details
                switch (trustBoards.get(record.boardId)) {
                    case (?board) {
                        sourceBoardName := board.name;
                        switch (organizations.get(board.organizationId)) {
                            case (?org) { sourceOrgName := org.name };
                            case null { sourceOrgName := "Unknown Organization" };
                        };
                    };
                    case null {
                        sourceBoardName := "Unknown Board";
                    };
                };
                
                // Break on first match for now
            };
        };

        let endTime = Time.now();
        let responseTimeNanos = Int.abs(endTime - startTime);
        let responseTimeMs = responseTimeNanos / 1000000; // Convert to milliseconds

        {
            requestId = request.id;
            verified = verified;
            confidence = confidence;
            timestamp = endTime;
            responseTime = Int.abs(responseTimeMs);
            source = sourceBoardId;
            organizationName = sourceOrgName;
            boardId = sourceBoardId;
            boardName = sourceBoardName;
        }
    };

    // Analytics
    public query func getUniversalAnalytics(organizationId: Text): async {
        totalTrustBoards: Nat;
        totalRecords: Nat;
        totalVerifications: Nat;
        totalOrganizations: Nat;
        systemUptime: Nat;
    } {
        let orgBoards = Array.filter<TrustBoard>(
            Iter.toArray(trustBoards.vals()),
            func(board: TrustBoard): Bool {
                board.organizationId == organizationId
            }
        );

        let orgRecords = Array.filter<TrustRecord>(
            Iter.toArray(trustRecords.vals()),
            func(record: TrustRecord): Bool {
                switch (trustBoards.get(record.boardId)) {
                    case (?board) { board.organizationId == organizationId };
                    case null { false };
                }
            }
        );

        {
            totalTrustBoards = orgBoards.size();
            totalRecords = orgRecords.size();
            totalVerifications = verificationRequests.size();
            totalOrganizations = organizations.size();
            systemUptime = 99; // Mock uptime percentage
        }
    };

    // Test data initialization for playground
    public func initializeTestData(): async Text {
        // Create a sample organization
        let sampleOrg: Organization = {
            id = "university_demo";
            name = "Demo University";
            orgType = "university";
            industry = "education";
            verified = true;
            trustScore = 95;
            allowCrossVerification = true;
            publicProfile = true;
            apiAccess = true;
            createdAt = Time.now();
            lastActive = Time.now();
        };

        // Create a sample field definition
        let sampleField: FieldDefinition = {
            name = "Student Name";
            fieldType = "text";
            required = true;
            isPrivate = false;
            description = ?"Student's full name";
        };

        // Create a sample verification rule
        let sampleRule: VerificationRule = {
            id = "rule_auto_approve";
            name = "Auto Approve Degrees";
            action = "allow";
            description = "Automatically approve degree verifications";
        };

        // Create a sample permission
        let samplePermission: TrustBoardPermission = {
            userId = "admin_demo";
            role = "admin";
            canRead = true;
            canWrite = true;
            canVerify = true;
            canManageUsers = true;
            canDelete = false;
        };

        // Create a sample TrustBoard
        let sampleBoard: TrustBoard = {
            id = "board_degrees_demo";
            organizationId = "university_demo";
            name = "Demo Degree Verification";
            description = "Demonstration board for degree credentials";
            category = "Education";
            fields = [sampleField];
            verificationRules = [sampleRule];
            permissions = [samplePermission];
            isActive = true;
            createdAt = Time.now();
            updatedAt = Time.now();
        };

        // Create a sample record
        let sampleRecord: TrustRecord = {
            id = "record_demo_1";
            boardId = "board_degrees_demo";
            submitter = "Alice Johnson";
            submitterType = "individual";
            timestamp = Time.now();
            verificationStatus = "verified";
            verificationHash = "hash_alice_degree_2024";
            dataHash = "data_alice_johnson_cs_degree";
        };

        // Store all sample data
        organizations.put(sampleOrg.id, sampleOrg);
        trustBoards.put(sampleBoard.id, sampleBoard);
        trustRecords.put(sampleRecord.id, sampleRecord);

        "Demo data initialized: Organization (" # sampleOrg.id # 
        "), TrustBoard (" # sampleBoard.id # 
        "), Record (" # sampleRecord.id # ")"
    };

    // System Info
    public query func getSystemInfo(): async Text {
        "TrustChain Universal Verification Infrastructure v2.0 - " # 
        Nat.toText(trustBoards.size()) # " TrustBoards, " #
        Nat.toText(trustRecords.size()) # " Records, " #
        Nat.toText(organizations.size()) # " Organizations"
    };

    // Debug functions for development
    public query func debugGetAllBoards(): async [(Text, TrustBoard)] {
        Iter.toArray(trustBoards.entries())
    };

    public query func debugGetAllRecords(): async [(Text, TrustRecord)] {
        Iter.toArray(trustRecords.entries())
    };

    public query func debugGetAllOrganizations(): async [(Text, Organization)] {
        Iter.toArray(organizations.entries())
    };
}

/*
=============================================================================
USAGE INSTRUCTIONS FOR IC NINJA PLAYGROUND:

1. Copy the TrustChainUniversal actor above to IC Ninja playground
2. Deploy it
3. Test with these example calls:

// Initialize demo data first
await TrustChainUniversal.initializeTestData()

// Get system info
await TrustChainUniversal.getSystemInfo()

// Test verification with demo data
let testRequest = {
  id = "test_verification_1";
  searchQuery = "Alice Johnson";
  requesterId = "external_verifier";
  requesterType = "external";
  anonymousMode = false;
  urgency = "normal";
  timestamp = 1642678800000;
};
await TrustChainUniversal.verifyTrustGate(testRequest)

// Get analytics
await TrustChainUniversal.getUniversalAnalytics("university_demo")

// List TrustBoards
await TrustChainUniversal.listTrustBoards("university_demo")

// Search records
await TrustChainUniversal.searchRecords("board_degrees_demo")

// Debug: See all data
await TrustChainUniversal.debugGetAllOrganizations()
await TrustChainUniversal.debugGetAllBoards()
await TrustChainUniversal.debugGetAllRecords()

=============================================================================
*/