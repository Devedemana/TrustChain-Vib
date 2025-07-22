import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Int "mo:base/Int";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";

actor TrustChainAdvanced {
    
    // Advanced Credential Types
    public type DigitalSignature = {
        signature: Text;
        publicKey: Text;
        algorithm: Text;
        timestamp: Int;
    };

    public type AdvancedCredential = {
        id: Text;
        studentId: Text;
        institution: Text;
        credentialType: Text;
        title: Text;
        issueDate: Int;
        verificationHash: Text;
        metadata: Text;
        // Advanced security features
        digitalSignature: ?DigitalSignature;
        multisigApprovals: [Text];
        expirationDate: ?Int;
        revocationStatus: Text; // "active", "revoked", "suspended"
        confidentialityLevel: Text; // "public", "private", "restricted"
        skillsVerified: [Text];
        blockchainTxHash: ?Text;
        auditTrail: [AuditEvent];
    };

    public type AuditEvent = {
        id: Text;
        timestamp: Int;
        actor: Text;
        action: Text;
        resourceId: Text;
        outcome: Text;
        metadata: Text;
    };

    public type InstitutionProfile = {
        id: Text;
        name: Text;
        accreditations: [Text];
        reputationScore: Nat;
        trustLevel: Text;
        isActive: Bool;
        credentialsIssued: Nat;
        lastAudit: ?Int;
    };

    public type MultiSigRequest = {
        id: Text;
        credentialId: Text;
        requiredApprovals: Nat;
        currentApprovals: [Text];
        status: Text; // "pending", "approved", "rejected"
        createdAt: Int;
        expiresAt: Int;
    };

    public type FraudAlert = {
        id: Text;
        credentialId: Text;
        alertType: Text;
        severity: Text;
        description: Text;
        timestamp: Int;
        resolved: Bool;
    };

    // Stable Storage
    private stable var credentialEntries : [(Text, AdvancedCredential)] = [];
    private stable var institutionEntries : [(Text, InstitutionProfile)] = [];
    private stable var auditEntries : [(Text, AuditEvent)] = [];
    private stable var multisigEntries : [(Text, MultiSigRequest)] = [];
    private stable var fraudAlertEntries : [(Text, FraudAlert)] = [];
    private stable var nextCredentialId : Nat = 0;
    private stable var nextAuditId : Nat = 0;

    // Working Storage
    private var credentials = HashMap.fromIter<Text, AdvancedCredential>(
        credentialEntries.vals(), credentialEntries.size(), Text.equal, Text.hash
    );
    
    private var institutions = HashMap.fromIter<Text, InstitutionProfile>(
        institutionEntries.vals(), institutionEntries.size(), Text.equal, Text.hash
    );
    
    private var auditLog = HashMap.fromIter<Text, AuditEvent>(
        auditEntries.vals(), auditEntries.size(), Text.equal, Text.hash
    );
    
    private var multisigRequests = HashMap.fromIter<Text, MultiSigRequest>(
        multisigEntries.vals(), multisigEntries.size(), Text.equal, Text.hash
    );
    
    private var fraudAlerts = HashMap.fromIter<Text, FraudAlert>(
        fraudAlertEntries.vals(), fraudAlertEntries.size(), Text.equal, Text.hash
    );

    // System functions for upgrade persistence
    system func preupgrade() {
        credentialEntries := Iter.toArray(credentials.entries());
        institutionEntries := Iter.toArray(institutions.entries());
        auditEntries := Iter.toArray(auditLog.entries());
        multisigEntries := Iter.toArray(multisigRequests.entries());
        fraudAlertEntries := Iter.toArray(fraudAlerts.entries());
    };

    system func postupgrade() {
        credentialEntries := [];
        institutionEntries := [];
        auditEntries := [];
        multisigEntries := [];
        fraudAlertEntries := [];
    };

    // Helper Functions
    private func generateCredentialId() : Text {
        nextCredentialId += 1;
        "cred_" # Nat.toText(nextCredentialId) # "_" # Nat.toText(Int.abs(Time.now()))
    };

    private func generateAuditId() : Text {
        nextAuditId += 1;
        "audit_" # Nat.toText(nextAuditId)
    };

    private func generateVerificationHash(studentId: Text, institution: Text, title: Text) : Text {
        let timestamp = Int.abs(Time.now());
        let hashInput = studentId # institution # title # Nat.toText(timestamp);
        "hash_" # Nat.toText(Nat32.toNat(Text.hash(hashInput)))
    };

    private func createAuditEvent(actor: Text, action: Text, resourceId: Text, outcome: Text, metadata: Text) : AuditEvent {
        {
            id = generateAuditId();
            timestamp = Time.now();
            actor = actor;
            action = action;
            resourceId = resourceId;
            outcome = outcome;
            metadata = metadata;
        }
    };

    private func logAudit(event: AuditEvent) {
        auditLog.put(event.id, event);
    };

    // Advanced Credential Management
    public shared(msg) func issueAdvancedCredential(
        studentId: Text,
        institution: Text,
        credentialType: Text,
        title: Text,
        metadata: Text,
        digitalSignature: ?DigitalSignature,
        confidentialityLevel: Text,
        skillsVerified: [Text],
        expirationDate: ?Int
    ) : async Result.Result<AdvancedCredential, Text> {
        
        let caller = Principal.toText(msg.caller);
        
        // Check if institution is registered and authorized
        switch (institutions.get(institution)) {
            case (null) {
                let audit = createAuditEvent(caller, "issue_credential", "", "failure", "Institution not registered: " # institution);
                logAudit(audit);
                return #err("Institution not registered: " # institution);
            };
            case (?inst) {
                if (not inst.isActive) {
                    let audit = createAuditEvent(caller, "issue_credential", "", "failure", "Institution not active: " # institution);
                    logAudit(audit);
                    return #err("Institution not active: " # institution);
                };
            };
        };

        // Check for duplicates
        let existingCredential = Array.find<AdvancedCredential>(
            Iter.toArray(credentials.vals()), 
            func(cred: AdvancedCredential) : Bool {
                Text.equal(cred.studentId, studentId) and 
                Text.equal(cred.institution, institution) and 
                Text.equal(cred.title, title) and
                Text.equal(cred.revocationStatus, "active")
            }
        );
        
        switch (existingCredential) {
            case (?existing) {
                let audit = createAuditEvent(caller, "issue_credential", existing.id, "failure", "Duplicate credential attempt");
                logAudit(audit);
                return #err("Similar active credential already exists. ID: " # existing.id);
            };
            case null {
                // Proceed with creation
            };
        };

        let credId = generateCredentialId();
        let auditEvent = createAuditEvent(caller, "create_credential", credId, "success", "Credential created");
        
        let newCredential: AdvancedCredential = {
            id = credId;
            studentId = studentId;
            institution = institution;
            credentialType = credentialType;
            title = title;
            issueDate = Time.now();
            verificationHash = generateVerificationHash(studentId, institution, title);
            metadata = metadata;
            digitalSignature = digitalSignature;
            multisigApprovals = [];
            expirationDate = expirationDate;
            revocationStatus = "active";
            confidentialityLevel = confidentialityLevel;
            skillsVerified = skillsVerified;
            blockchainTxHash = null;
            auditTrail = [auditEvent];
        };
        
        credentials.put(credId, newCredential);
        logAudit(auditEvent);
        
        // Update institution statistics
        switch (institutions.get(institution)) {
            case (?inst) {
                let updatedInst = {
                    inst with 
                    credentialsIssued = inst.credentialsIssued + 1
                };
                institutions.put(institution, updatedInst);
            };
            case null { /* Already checked above */ };
        };

        #ok(newCredential)
    };

    // Multi-signature approval system
    public shared(msg) func requestMultisigApproval(credentialId: Text, requiredApprovals: Nat) : async Result.Result<Text, Text> {
        let caller = Principal.toText(msg.caller);
        
        switch (credentials.get(credentialId)) {
            case (null) { return #err("Credential not found"); };
            case (?cred) {
                let requestId = "multisig_" # credentialId # "_" # Nat.toText(Int.abs(Time.now()));
                let request: MultiSigRequest = {
                    id = requestId;
                    credentialId = credentialId;
                    requiredApprovals = requiredApprovals;
                    currentApprovals = [];
                    status = "pending";
                    createdAt = Time.now();
                    expiresAt = Time.now() + (24 * 60 * 60 * 1_000_000_000); // 24 hours
                };
                
                multisigRequests.put(requestId, request);
                
                let audit = createAuditEvent(caller, "multisig_request", credentialId, "success", "Multisig request created: " # requestId);
                logAudit(audit);
                
                #ok(requestId)
            };
        }
    };

    public shared(msg) func approveMultisig(requestId: Text) : async Result.Result<Bool, Text> {
        let caller = Principal.toText(msg.caller);
        
        switch (multisigRequests.get(requestId)) {
            case (null) { return #err("Multisig request not found"); };
            case (?request) {
                if (request.status != "pending") {
                    return #err("Request is not pending");
                };
                
                if (Time.now() > request.expiresAt) {
                    let expiredRequest = { request with status = "expired" };
                    multisigRequests.put(requestId, expiredRequest);
                    return #err("Request has expired");
                };
                
                // Check if already approved by this caller
                let alreadyApproved = Array.find<Text>(request.currentApprovals, func(approval: Text) : Bool {
                    Text.equal(approval, caller)
                });
                
                switch (alreadyApproved) {
                    case (?_) { return #err("Already approved by this caller"); };
                    case null {
                        let newApprovals = Array.append(request.currentApprovals, [caller]);
                        let updatedRequest = {
                            request with
                            currentApprovals = newApprovals;
                            status = if (newApprovals.size() >= request.requiredApprovals) "approved" else "pending";
                        };
                        
                        multisigRequests.put(requestId, updatedRequest);
                        
                        let audit = createAuditEvent(caller, "multisig_approve", request.credentialId, "success", "Approval added to: " # requestId);
                        logAudit(audit);
                        
                        #ok(updatedRequest.status == "approved")
                    };
                };
            };
        }
    };

    // Fraud Detection and Alerts
    public shared(msg) func reportFraud(credentialId: Text, alertType: Text, description: Text) : async Result.Result<Text, Text> {
        let caller = Principal.toText(msg.caller);
        
        switch (credentials.get(credentialId)) {
            case (null) { return #err("Credential not found"); };
            case (?cred) {
                let alertId = "fraud_" # credentialId # "_" # Nat.toText(Int.abs(Time.now()));
                let alert: FraudAlert = {
                    id = alertId;
                    credentialId = credentialId;
                    alertType = alertType;
                    severity = "high";
                    description = description;
                    timestamp = Time.now();
                    resolved = false;
                };
                
                fraudAlerts.put(alertId, alert);
                
                let audit = createAuditEvent(caller, "fraud_report", credentialId, "success", "Fraud alert created: " # alertId);
                logAudit(audit);
                
                #ok(alertId)
            };
        }
    };

    // Institution Management
    public shared(msg) func registerInstitution(
        institutionName: Text,
        accreditations: [Text]
    ) : async Result.Result<InstitutionProfile, Text> {
        let caller = Principal.toText(msg.caller);
        
        switch (institutions.get(institutionName)) {
            case (?existing) { return #err("Institution already registered"); };
            case null {
                let institution: InstitutionProfile = {
                    id = institutionName;
                    name = institutionName;
                    accreditations = accreditations;
                    reputationScore = 50; // Default reputation
                    trustLevel = "bronze";
                    isActive = true;
                    credentialsIssued = 0;
                    lastAudit = null;
                };
                
                institutions.put(institutionName, institution);
                
                let audit = createAuditEvent(caller, "register_institution", institutionName, "success", "Institution registered");
                logAudit(audit);
                
                #ok(institution)
            };
        }
    };

    // Query Functions
    public query func getAdvancedCredential(id: Text) : async ?AdvancedCredential {
        credentials.get(id)
    };

    public query func getStudentAdvancedCredentials(studentId: Text) : async [AdvancedCredential] {
        let allCreds = Iter.toArray(credentials.vals());
        Array.filter<AdvancedCredential>(allCreds, func(cred: AdvancedCredential) : Bool {
            Text.equal(cred.studentId, studentId) and Text.equal(cred.revocationStatus, "active")
        })
    };

    public query func getInstitutionProfile(institutionName: Text) : async ?InstitutionProfile {
        institutions.get(institutionName)
    };

    public query func getFraudAlerts(resolved: ?Bool) : async [FraudAlert] {
        let allAlerts = Iter.toArray(fraudAlerts.vals());
        switch (resolved) {
            case (null) { allAlerts };
            case (?isResolved) {
                Array.filter<FraudAlert>(allAlerts, func(alert: FraudAlert) : Bool {
                    alert.resolved == isResolved
                })
            };
        }
    };

    public query func getAuditTrail(resourceId: Text) : async [AuditEvent] {
        let allAudits = Iter.toArray(auditLog.vals());
        Array.filter<AuditEvent>(allAudits, func(audit: AuditEvent) : Bool {
            Text.equal(audit.resourceId, resourceId)
        })
    };

    public query func getSystemStats() : async {
        totalCredentials: Nat;
        activeCredentials: Nat;
        totalInstitutions: Nat;
        totalAuditEvents: Nat;
        pendingMultisigRequests: Nat;
        unresolvedFraudAlerts: Nat;
    } {
        let allCreds = Iter.toArray(credentials.vals());
        let activeCreds = Array.filter<AdvancedCredential>(allCreds, func(cred: AdvancedCredential) : Bool {
            Text.equal(cred.revocationStatus, "active")
        });
        
        let allMultisig = Iter.toArray(multisigRequests.vals());
        let pendingMultisig = Array.filter<MultiSigRequest>(allMultisig, func(req: MultiSigRequest) : Bool {
            Text.equal(req.status, "pending")
        });
        
        let allAlerts = Iter.toArray(fraudAlerts.vals());
        let unresolvedAlerts = Array.filter<FraudAlert>(allAlerts, func(alert: FraudAlert) : Bool {
            not alert.resolved
        });

        {
            totalCredentials = credentials.size();
            activeCredentials = activeCreds.size();
            totalInstitutions = institutions.size();
            totalAuditEvents = auditLog.size();
            pendingMultisigRequests = pendingMultisig.size();
            unresolvedFraudAlerts = unresolvedAlerts.size();
        }
    };

    // Backwards compatibility
    public query func getAllCredentials() : async [Credential] {
        let advancedCreds = Iter.toArray(credentials.vals());
        Array.map<AdvancedCredential, Credential>(advancedCreds, func(advCred: AdvancedCredential) : Credential {
            {
                id = advCred.id;
                studentId = advCred.studentId;
                institution = advCred.institution;
                credentialType = advCred.credentialType;
                title = advCred.title;
                issueDate = advCred.issueDate;
                verificationHash = advCred.verificationHash;
                metadata = advCred.metadata;
            }
        })
    };

    public query func getStudentCredentials(studentId: Text) : async [Credential] {
        let advancedCreds = getStudentAdvancedCredentials(studentId);
        Array.map<AdvancedCredential, Credential>(advancedCreds, func(advCred: AdvancedCredential) : Credential {
            {
                id = advCred.id;
                studentId = advCred.studentId;
                institution = advCred.institution;
                credentialType = advCred.credentialType;
                title = advCred.title;
                issueDate = advCred.issueDate;
                verificationHash = advCred.verificationHash;
                metadata = advCred.metadata;
            }
        })
    };
}
