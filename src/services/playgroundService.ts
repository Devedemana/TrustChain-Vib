import { Principal } from '@dfinity/principal';

// Realistic blockchain simulation with mainnet-like behavior
class PlaygroundMainnetSimulator {
  private networkLatency = { min: 200, max: 800 }; // Realistic IC network delays
  private blockTime = 2000; // Approximate IC block time
  private gasUsage = { verification: 0.0001, issuance: 0.0005 }; // Realistic costs
  
  // Simulate realistic mainnet credential data
  private mainnetCredentials = [
    {
      id: 'cred_IC_0x1a2b3c4d5e6f7890',
      studentName: 'Alexandra Chen',
      institution: 'MIT - Massachusetts Institute of Technology',
      degree: 'Master of Science in Computer Science',
      graduationDate: '2024-05-15',
      gpa: '3.89/4.0',
      verificationHash: '0x8f4e2a9b7c1d3e5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
      timestamp: new Date('2024-05-20T10:30:00Z').toISOString(),
      status: 'verified',
      canisterId: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
      blockHeight: 245892,
      fees: 0.0001,
      institutionSignature: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b'
    },
    {
      id: 'cred_IC_0x2b3c4d5e6f789012',
      studentName: 'Marcus Johnson',
      institution: 'Stanford University',
      degree: 'Bachelor of Science in Artificial Intelligence',
      graduationDate: '2024-06-10',
      gpa: '3.92/4.0',
      verificationHash: '0x7e3d1a8b6c9d2e4f5a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
      timestamp: new Date('2024-06-12T14:45:00Z').toISOString(),
      status: 'verified',
      canisterId: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
      blockHeight: 248156,
      fees: 0.0001,
      institutionSignature: '0x8b7c6d5e4f3a2b1c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c'
    },
    {
      id: 'cred_IC_0x3c4d5e6f78901234',
      studentName: 'Sarah Williams',
      institution: 'Harvard University',
      degree: 'Doctor of Philosophy in Data Science',
      graduationDate: '2024-05-25',
      gpa: '3.95/4.0',
      verificationHash: '0x6d2c0a9b8c7d1e3f4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
      timestamp: new Date('2024-05-28T09:20:00Z').toISOString(),
      status: 'verified',
      canisterId: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
      blockHeight: 246734,
      fees: 0.0001,
      institutionSignature: '0x7c6d5e4f3a2b1c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d'
    }
  ];

  // Simulate realistic mainnet institutions
  private verifiedInstitutions = [
    {
      id: 'inst_IC_MIT_001',
      name: 'MIT - Massachusetts Institute of Technology',
      principal: 'be2us-64aaa-aaaah-qabeq-cai',
      country: 'United States',
      accreditation: 'NECHE Accredited',
      totalCredentials: 15420,
      verificationRate: 99.97,
      lastActivity: new Date().toISOString(),
      publicKey: '0x04a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890'
    },
    {
      id: 'inst_IC_STANFORD_001', 
      name: 'Stanford University',
      principal: 'br5f7-7uaaa-aaaah-qaacq-cai',
      country: 'United States',
      accreditation: 'WASC Accredited',
      totalCredentials: 12890,
      verificationRate: 99.95,
      lastActivity: new Date().toISOString(),
      publicKey: '0x04b2c3d4e5f6789012345678901234567890123456789012345678901234567890ab'
    },
    {
      id: 'inst_IC_HARVARD_001',
      name: 'Harvard University', 
      principal: 'bkyz2-fmaaa-aaaah-qaaaq-cai',
      country: 'United States',
      accreditation: 'NECHE Accredited',
      totalCredentials: 18750,
      verificationRate: 99.98,
      lastActivity: new Date().toISOString(),
      publicKey: '0x04c3d4e5f6789012345678901234567890123456789012345678901234567890abcd'
    }
  ];

  // Simulate realistic network activity
  private simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * (this.networkLatency.max - this.networkLatency.min) + this.networkLatency.min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Simulate blockchain transaction with realistic behavior
  private async simulateBlockchainTransaction(type: 'verify' | 'issue'): Promise<any> {
    await this.simulateNetworkDelay();
    
    // Simulate occasional network congestion
    if (Math.random() < 0.05) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Extra delay for congestion
    }

    const blockHeight = 245000 + Math.floor(Math.random() * 10000);
    const fees = this.gasUsage[type === 'verify' ? 'verification' : 'issuance'];
    
    return {
      transactionHash: this.generateRealisticHash(),
      blockHeight,
      fees,
      timestamp: new Date().toISOString(),
      canisterId: 'rdmx6-jaaaa-aaaah-qcaiq-cai'
    };
  }

  private generateRealisticHash(): string {
    return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  // Public API methods that simulate real mainnet behavior
  async verifyCredential(credentialId: string): Promise<any> {
    await this.simulateNetworkDelay();
    
    const credential = this.mainnetCredentials.find(c => c.id === credentialId);
    
    if (!credential) {
      // Simulate realistic error for invalid credential
      throw new Error('Credential not found on Internet Computer mainnet');
    }

    const transaction = await this.simulateBlockchainTransaction('verify');
    
    return {
      ...credential,
      verificationResult: {
        isValid: true,
        verifiedAt: new Date().toISOString(),
        networkFees: transaction.fees,
        blockHeight: transaction.blockHeight,
        canisterResponse: {
          status: 'success',
          message: 'Credential verified successfully on IC mainnet',
          computeUnits: Math.floor(Math.random() * 1000) + 500
        }
      }
    };
  }

  async issueCredential(credentialData: any): Promise<any> {
    await this.simulateNetworkDelay();
    
    // Simulate validation process
    if (!credentialData.studentName || !credentialData.institution || !credentialData.degree) {
      throw new Error('Invalid credential data provided');
    }

    const transaction = await this.simulateBlockchainTransaction('issue');
    
    const newCredential = {
      id: `cred_IC_${this.generateRealisticHash().substring(0, 18)}`,
      ...credentialData,
      verificationHash: this.generateRealisticHash(),
      timestamp: new Date().toISOString(),
      status: 'verified',
      ...transaction
    };

    // Simulate adding to mainnet storage
    this.mainnetCredentials.push(newCredential);
    
    return {
      credential: newCredential,
      issuanceResult: {
        success: true,
        transactionHash: transaction.transactionHash,
        networkFees: transaction.fees,
        estimatedConfirmationTime: '2-3 seconds',
        canisterResponse: {
          status: 'credential_issued',
          credentialId: newCredential.id,
          storageUsed: Math.floor(Math.random() * 500) + 200 + ' bytes'
        }
      }
    };
  }

  async getInstitutionStats(institutionId?: string): Promise<any> {
    await this.simulateNetworkDelay();
    
    if (institutionId) {
      const institution = this.verifiedInstitutions.find(i => i.id === institutionId);
      if (!institution) {
        throw new Error('Institution not found on mainnet');
      }
      return institution;
    }

    return {
      totalInstitutions: this.verifiedInstitutions.length,
      totalCredentials: this.mainnetCredentials.length,
      last24hTransactions: Math.floor(Math.random() * 500) + 200,
      networkHealth: {
        status: 'healthy',
        uptime: 99.97,
        avgResponseTime: Math.floor(Math.random() * 300) + 200 + 'ms',
        activeNodes: Math.floor(Math.random() * 50) + 150
      }
    };
  }

  async getNetworkMetrics(): Promise<any> {
    await this.simulateNetworkDelay();
    
    return {
      totalTransactions: 1245892 + Math.floor(Math.random() * 1000),
      blockHeight: 245000 + Math.floor(Math.random() * 10000),
      avgBlockTime: '2.1s',
      totalCredentialsIssued: this.mainnetCredentials.length + Math.floor(Math.random() * 10000),
      verificationSuccessRate: 99.94 + (Math.random() * 0.05),
      networkCongestion: Math.random() < 0.1 ? 'high' : Math.random() < 0.3 ? 'medium' : 'low',
      estimatedFees: {
        verification: this.gasUsage.verification,
        issuance: this.gasUsage.issuance
      }
    };
  }

  // Simulate real-time updates
  subscribeToRealTimeUpdates(callback: (update: any) => void): () => void {
    const interval = setInterval(() => {
      const updateType = Math.random();
      let update;
      
      if (updateType < 0.4) {
        // New credential verified
        update = {
          type: 'credential_verified',
          data: {
            credentialId: `cred_IC_${Date.now()}`,
            institution: this.verifiedInstitutions[Math.floor(Math.random() * this.verifiedInstitutions.length)].name,
            timestamp: new Date().toISOString()
          }
        };
      } else if (updateType < 0.7) {
        // Network metrics update
        update = {
          type: 'network_update',
          data: {
            blockHeight: 245000 + Math.floor(Math.random() * 10000),
            activeTransactions: Math.floor(Math.random() * 50) + 20,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        // Institution activity
        update = {
          type: 'institution_activity',
          data: {
            institutionName: this.verifiedInstitutions[Math.floor(Math.random() * this.verifiedInstitutions.length)].name,
            action: 'credential_issued',
            timestamp: new Date().toISOString()
          }
        };
      }
      
      callback(update);
    }, 3000 + Math.random() * 5000); // Random intervals between 3-8 seconds
    
    return () => clearInterval(interval);
  }

  // Simulate sample credential IDs for testing
  getSampleCredentialIds(): string[] {
    return this.mainnetCredentials.map(c => c.id);
  }

  // Get all institutions for dropdown/selection
  getVerifiedInstitutions(): any[] {
    return this.verifiedInstitutions;
  }
}

// Export singleton instance
export const playgroundMainnet = new PlaygroundMainnetSimulator();

// Enhanced blockchain service with playground integration
export const enhancedBlockchainService = {
  async verifyCredential(credentialId: string) {
    try {
      return await playgroundMainnet.verifyCredential(credentialId);
    } catch (error) {
      console.error('Verification failed:', error);
      throw error;
    }
  },

  async issueCredential(data: any) {
    try {
      return await playgroundMainnet.issueCredential(data);
    } catch (error) {
      console.error('Credential issuance failed:', error);
      throw error;
    }
  },

  async getNetworkStatus() {
    try {
      return await playgroundMainnet.getNetworkMetrics();
    } catch (error) {
      console.error('Failed to get network status:', error);
      throw error;
    }
  },

  subscribeToUpdates: playgroundMainnet.subscribeToRealTimeUpdates.bind(playgroundMainnet),
  getSampleCredentials: playgroundMainnet.getSampleCredentialIds.bind(playgroundMainnet),
  getInstitutions: playgroundMainnet.getVerifiedInstitutions.bind(playgroundMainnet)
};
