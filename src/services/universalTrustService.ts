// Service for interacting with deployed TrustChain Universal backend
import { IC_PRODUCTION_CONFIG } from '../config/ic-production';

export class UniversalTrustService {
  private canisterId: string;
  private networkFlag: string;

  constructor() {
    this.canisterId = IC_PRODUCTION_CONFIG.UNIVERSAL_BACKEND_CANISTER_ID;
    this.networkFlag = IC_PRODUCTION_CONFIG.NETWORK === 'ic' ? '--network ic' : '';
  }

  // Helper method to execute dfx commands (for development/testing)
  private async executeDfxCommand(method: string, args: string = ''): Promise<any> {
    const command = `dfx canister ${this.networkFlag} call ${this.canisterId} ${method} ${args}`;
    console.log('DFX Command:', command);
    
    // In a real application, you would use the IC SDK or agent-js
    // For now, return mock data or throw error for guidance
    throw new Error(`Execute this command manually: ${command}`);
  }

  // Initialize test data in the deployed canister
  async initializeTestData(): Promise<string> {
    return this.executeDfxCommand('initializeTestData');
  }

  // Get system information
  async getSystemInfo(): Promise<string> {
    return this.executeDfxCommand('getSystemInfo');
  }

  // Create a new organization
  async createOrganization(organization: any): Promise<any> {
    const orgRecord = this.formatRecord(organization);
    return this.executeDfxCommand('createOrganization', `(${orgRecord})`);
  }

  // Create a new TrustBoard
  async createTrustBoard(trustBoard: any): Promise<any> {
    const boardRecord = this.formatRecord(trustBoard);
    return this.executeDfxCommand('createTrustBoard', `(${boardRecord})`);
  }

  // Add a record to a TrustBoard
  async addRecord(boardId: string, record: any): Promise<any> {
    const recordData = this.formatRecord(record);
    return this.executeDfxCommand('addRecord', `("${boardId}", ${recordData})`);
  }

  // Verify using TrustGate
  async verifyTrustGate(verificationRequest: any): Promise<any> {
    const requestData = this.formatRecord(verificationRequest);
    return this.executeDfxCommand('verifyTrustGate', `(${requestData})`);
  }

  // Get analytics for an organization
  async getUniversalAnalytics(organizationId: string): Promise<any> {
    return this.executeDfxCommand('getUniversalAnalytics', `("${organizationId}")`);
  }

  // List TrustBoards for an organization
  async listTrustBoards(organizationId: string): Promise<any[]> {
    return this.executeDfxCommand('listTrustBoards', `("${organizationId}")`);
  }

  // Search records in a TrustBoard
  async searchRecords(boardId: string): Promise<any[]> {
    return this.executeDfxCommand('searchRecords', `("${boardId}")`);
  }

  // Batch add records
  async batchAddRecords(boardId: string, records: any[]): Promise<any> {
    const recordsData = records.map(r => this.formatRecord(r)).join('; ');
    return this.executeDfxCommand('batchAddRecords', `("${boardId}", vec { ${recordsData} })`);
  }

  // Helper method to format records for Motoko
  private formatRecord(obj: any): string {
    if (typeof obj === 'string') return `"${obj}"`;
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'boolean') return obj.toString();
    if (Array.isArray(obj)) {
      return `vec { ${obj.map(item => this.formatRecord(item)).join('; ')} }`;
    }
    if (typeof obj === 'object' && obj !== null) {
      const fields = Object.entries(obj)
        .map(([key, value]) => `${key} = ${this.formatRecord(value)}`)
        .join('; ');
      return `record { ${fields} }`;
    }
    return '""';
  }

  // Generate DFX commands for manual execution
  generateDfxCommands() {
    const baseCommand = `dfx canister ${this.networkFlag} call ${this.canisterId}`;
    
    return {
      // Basic commands
      getSystemInfo: `${baseCommand} getSystemInfo`,
      initTestData: `${baseCommand} initializeTestData`,
      
      // Example TrustBoard creation
      createHealthcareTrustBoard: `${baseCommand} createTrustBoard '(
        record {
          id = "healthcare_licenses";
          name = "Healthcare Professional Licenses";
          description = opt "Medical license verification board";
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
            }
          };
          permissions = vec {};
          verificationRules = vec {};
          createdAt = 0;
          updatedAt = 0;
        }
      )'`,
      
      // Example record addition
      addHealthcareRecord: `${baseCommand} addRecord '(
        "healthcare_licenses",
        record {
          id = "dr_smith_001";
          fields = vec {
            record { key = "license_number"; value = "MD123456" };
            record { key = "specialty"; value = "Cardiology" };
          };
          status = "verified";
          isPrivate = false;
          verifiedBy = opt "health_org_001";
          verificationDate = opt 0;
          expiryDate = opt 0;
          createdAt = 0;
          updatedAt = 0;
        }
      )'`,
      
      // Example verification
      verifyLicense: `${baseCommand} verifyTrustGate '(
        record {
          boardId = "healthcare_licenses";
          searchQuery = "MD123456";
          requesterInfo = record {
            organizationId = "hospital_001";
            purpose = "Employment verification";
            requesterId = "hr_manager_001";
          };
        }
      )'`
    };
  }
}

// Export singleton instance
export const universalTrustService = new UniversalTrustService();

// Export command generator for easy access
export const getDfxCommands = () => universalTrustService.generateDfxCommands();
