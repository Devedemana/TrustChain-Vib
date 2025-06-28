import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Int "mo:base/Int";
import Result "mo:base/Result";

actor TrustChain {
    // Enhanced Credential record type to match frontend expectations
    public type Credential = {
        id: Text;
        studentId: Text;
        institution: Text;
        credentialType: Text;
        title: Text;
        issueDate: Int;
        verificationHash: Text;
        metadata: Text;
    };

    // Simple array to store credentials
    private stable var credentialArray : [Credential] = [];

    // System functions for upgrade persistence
    system func preupgrade() {
        // credentialArray is already stable, no action needed
    };

    system func postupgrade() {
        // credentialArray is already stable, no action needed
    };    // Helper function to get current time as Int (Unix timestamp)
    private func getCurrentTime() : Int {
        Time.now()
    };

    // Helper function to generate unique ID
    private func generateId() : Text {
        let timestamp = Int.abs(Time.now());
        let arrayLength = credentialArray.size();
        Nat.toText(timestamp) # "_" # Nat.toText(arrayLength)
    };    // Helper function to generate verification hash
    private func generateVerificationHash(studentId: Text, institution: Text, title: Text) : Text {
        let timestamp = Int.abs(Time.now());
        let hashInput = studentId # institution # title # Nat.toText(timestamp);
        // Simple hash - in production you'd use a proper cryptographic hash
        "hash_" # Nat.toText(Nat32.toNat(Text.hash(hashInput)))
    };

    // Get all credentials (for debugging/admin purposes)
    public query func getAllCredentials() : async [Credential] {
        credentialArray
    };

    // Get credential count
    public query func getCredentialCount() : async Nat {
        credentialArray.size()
    };

    // Find credential by ID
    public query func findCredentialById(id: Text) : async ?Credential {
        Array.find<Credential>(credentialArray, func(cred: Credential) : Bool {
            cred.id == id
        })
    };    // Get credentials by student ID (what frontend expects)
    public query func getStudentCredentials(studentId: Text) : async [Credential] {
        Array.filter<Credential>(credentialArray, func(cred: Credential) : Bool {
            Text.equal(cred.studentId, studentId)
        })
    };

    // Get credentials by owner (keep for backwards compatibility)
    public query func getCredentialsByOwner(studentId: Text) : async [Credential] {
        Array.filter<Credential>(credentialArray, func(cred: Credential) : Bool {
            Text.equal(cred.studentId, studentId)
        })
    };

    // PROMPT #3: Add the two required public shared functions with empty bodies
      // Issue a new credential with enhanced parameters
    public shared func issueCredential(
        studentId: Text, 
        institution: Text, 
        credentialType: Text, 
        title: Text, 
        metadata: Text
    ) : async Result.Result<Credential, Text> {
        // Check if a credential with the same details already exists
        let existingCredential = Array.find<Credential>(credentialArray, func(cred: Credential) : Bool {
            Text.equal(cred.studentId, studentId) and 
            Text.equal(cred.institution, institution) and 
            Text.equal(cred.title, title)
        });
        
        // If duplicate found, return error
        switch (existingCredential) {
            case (?existing) {
                #err("Credential with the same details already exists. Existing ID: " # existing.id)
            };
            case null {
                // No duplicate found, proceed with creation
                
                // Generate a unique ID
                let uniqueId = generateId();
                
                // Generate verification hash
                let verificationHash = generateVerificationHash(studentId, institution, title);
                
                // Record current time
                let currentTime = getCurrentTime();
                
                // Create new credential record
                let newCredential: Credential = {
                    id = uniqueId;
                    studentId = studentId;
                    institution = institution;
                    credentialType = credentialType;
                    title = title;
                    issueDate = currentTime;
                    verificationHash = verificationHash;
                    metadata = metadata;
                };
                
                // Store credential in the array
                credentialArray := Array.append(credentialArray, [newCredential]);
                
                // Return success with the credential
                #ok(newCredential)
            };
        }
    };    // Enhanced verification result type
    public type VerificationResult = {
        isValid: Bool;
        credential: ?Credential;
        message: Text;
    };

    // Verify a credential by ID - returns enhanced verification result
    public query func verifyCredential(id: Text) : async VerificationResult {
        // Log the verification attempt
        Debug.print("Verification attempt for credential ID: " # id);
        
        // Look up the credential by ID in the array
        let foundCredential = Array.find<Credential>(credentialArray, func(cred: Credential) : Bool {
            Text.equal(cred.id, id)
        });
        
        // Return verification result
        switch (foundCredential) {
            case (?credential) {
                Debug.print("Credential found - ID: " # credential.id # " | Student: " # credential.studentId);
                {
                    isValid = true;
                    credential = ?credential;
                    message = "Credential verified successfully";
                }
            };
            case null {
                Debug.print("Credential not found for ID: " # id);
                {
                    isValid = false;
                    credential = null;
                    message = "Credential not found";
                }
            };
        }
    };    // Institution authorization storage
    private stable var authorizedInstitutions : [Text] = [];

    // Authorize an institution to issue credentials
    public shared func authorizeInstitution(institution: Text) : async Result.Result<(), Text> {
        // Check if already authorized
        let isAlreadyAuthorized = Array.find<Text>(authorizedInstitutions, func(inst: Text) : Bool {
            Text.equal(inst, institution)
        });
          switch (isAlreadyAuthorized) {
            case (?_existing) {
                #err("Institution " # institution # " is already authorized")
            };
            case null {
                authorizedInstitutions := Array.append(authorizedInstitutions, [institution]);
                #ok(())
            };
        }
    };

    // Check if an institution is authorized
    public query func isAuthorizedInstitution(institution: Text) : async Bool {        switch (Array.find<Text>(authorizedInstitutions, func(inst: Text) : Bool {
            Text.equal(inst, institution)
        })) {
            case (?_found) { true };
            case null { false };
        }
    };

    // Get all authorized institutions
    public query func getAuthorizedInstitutions() : async [Text] {
        authorizedInstitutions
    };

    // System info
    public query func getSystemInfo() : async Text {
        "TrustChain Credential Canister - Total Credentials: " # Nat.toText(credentialArray.size()) # 
        " | Authorized Institutions: " # Nat.toText(authorizedInstitutions.size())
    };
}
