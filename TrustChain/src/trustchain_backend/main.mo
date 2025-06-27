import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Result "mo:base/Result";

actor TrustChain {
    // Define the Credential record type as requested
    public type Credential = {
        id: Text;
        owner: Principal;
        metadata: Text;
        issuedAt: Nat;
    };

    // Simple array to store credentials
    private stable var credentialArray : [Credential] = [];

    // System functions for upgrade persistence
    system func preupgrade() {
        // credentialArray is already stable, no action needed
    };

    system func postupgrade() {
        // credentialArray is already stable, no action needed
    };

    // Helper function to get current time as Nat
    private func getCurrentTime() : Nat {
        Int.abs(Time.now())
    };

    // Helper function to generate unique ID
    private func generateId() : Text {
        let timestamp = getCurrentTime();
        let arrayLength = credentialArray.size();
        Nat.toText(timestamp) # "_" # Nat.toText(arrayLength)
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
    };

    // Get credentials by owner
    public query func getCredentialsByOwner(owner: Principal) : async [Credential] {
        Array.filter<Credential>(credentialArray, func(cred: Credential) : Bool {
            Principal.equal(cred.owner, owner)
        })
    };

    // PROMPT #3: Add the two required public shared functions with empty bodies
    
    // Issue a new credential - returns the credential ID or error
    public shared func issueCredential(owner: Principal, metadata: Text) : async Result.Result<Text, Text> {
        // Check if a credential with the same metadata and owner already exists
        let existingCredential = Array.find<Credential>(credentialArray, func(cred: Credential) : Bool {
            Principal.equal(cred.owner, owner) and Text.equal(cred.metadata, metadata)
        });
        
        // If duplicate found, return error
        switch (existingCredential) {
            case (?existing) {
                #err("Credential with the same metadata and owner already exists. Existing ID: " # existing.id)
            };
            case null {
                // No duplicate found, proceed with creation
                
                // Generate a unique ID using current time and array length
                let uniqueId = generateId();
                
                // Record current time
                let currentTime = getCurrentTime();
                
                // Create new credential record
                let newCredential: Credential = {
                    id = uniqueId;
                    owner = owner;
                    metadata = metadata;
                    issuedAt = currentTime;
                };
                
                // Store credential in the array (create new array with the new credential)
                credentialArray := Array.append(credentialArray, [newCredential]);
                
                // Return success with the generated ID
                #ok(uniqueId)
            };
        }
    };

    // Verify a credential by ID - returns metadata if found
    public shared func verifyCredential(id: Text) : async ?Text {
        // Log the verification attempt
        Debug.print("Verification attempt for credential ID: " # id);
        
        // Look up the credential by ID in the array
        let foundCredential = Array.find<Credential>(credentialArray, func(cred: Credential) : Bool {
            Text.equal(cred.id, id)
        });
        
        // If found, return the metadata wrapped in ?Text, otherwise return null
        switch (foundCredential) {
            case (?credential) {
                Debug.print("Credential found - ID: " # credential.id # " | Owner: " # Principal.toText(credential.owner));
                ?credential.metadata
            };
            case null {
                Debug.print("Credential not found for ID: " # id);
                null
            };
        }
    };

    // System info
    public query func getSystemInfo() : async Text {
        "TrustChain Credential Canister - Total Credentials: " # Nat.toText(credentialArray.size())
    };
}
