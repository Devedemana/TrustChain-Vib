import { Credential, StudentProfile, InstitutionProfile } from '../types';

// Mock data for development when IC backend is not available
export const mockCredentials: Credential[] = [
  {
    id: 'cred_001',
    studentId: 'student_123',
    institution: 'MIT',
    credentialType: 'certificate',
    title: 'Computer Science Degree',
    issueDate: Date.now() - (365 * 24 * 60 * 60 * 1000), // 1 year ago
    verificationHash: 'a1b2c3d4e5f6',
    metadata: JSON.stringify({
      gpa: 3.8,
      courses: ['CS101', 'CS102', 'CS201', 'CS301'],
      honors: ['Magna Cum Laude'],
      issuerContact: 'registrar@mit.edu'
    })
  },
  {
    id: 'cred_002',
    studentId: 'student_123',
    institution: 'Stanford University',
    credentialType: 'badge',
    title: 'Blockchain Development Certification',
    issueDate: Date.now() - (180 * 24 * 60 * 60 * 1000), // 6 months ago
    verificationHash: 'f6e5d4c3b2a1',
    metadata: JSON.stringify({
      skillsVerified: ['Smart Contracts', 'DeFi', 'Web3'],
      issuerContact: 'blockchain-cert@stanford.edu'
    })
  },
  {
    id: 'cred_003',
    studentId: 'student_456',
    institution: 'Harvard University',
    credentialType: 'transcript',
    title: 'MBA Program Transcript',
    issueDate: Date.now() - (90 * 24 * 60 * 60 * 1000), // 3 months ago
    verificationHash: '123abc456def',
    metadata: JSON.stringify({
      gpa: 3.9,
      courses: ['MBA501', 'MBA502', 'MBA601'],
      honors: ['Dean\'s List'],
      issuerContact: 'mba-office@harvard.edu'
    })
  }
];

export const mockStudents: StudentProfile[] = [
  {
    id: 'student_123',
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    institution: 'MIT',
    credentials: mockCredentials.filter(c => c.studentId === 'student_123')
  },
  {
    id: 'student_456',
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    institution: 'Harvard University',
    credentials: mockCredentials.filter(c => c.studentId === 'student_456')
  }
];

export const mockInstitutions: InstitutionProfile[] = [
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    contact: 'registrar@mit.edu',
    isAuthorized: true,
    credentialsIssued: 1250
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    contact: 'records@stanford.edu',
    isAuthorized: true,
    credentialsIssued: 980
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    contact: 'credentials@harvard.edu',
    isAuthorized: true,
    credentialsIssued: 1580
  }
];

// Utility functions for development
export const generateMockCredentialId = (): string => {
  return `cred_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMockVerificationHash = (): string => {
  return Math.random().toString(36).substr(2, 12);
};

// Function to simulate network delay for realistic testing
export const simulateNetworkDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock service for development (when IC backend is not available)
export class MockTrustChainService {
  async issueCredential(
    studentId: string,
    institution: string,
    credentialType: string,
    title: string,
    metadata: object
  ) {
    await simulateNetworkDelay(800);
    
    const newCredential: Credential = {
      id: generateMockCredentialId(),
      studentId,
      institution,
      credentialType: credentialType as any,
      title,
      issueDate: Date.now(),
      verificationHash: generateMockVerificationHash(),
      metadata: JSON.stringify(metadata)
    };

    mockCredentials.push(newCredential);
    
    return { success: true, data: newCredential };
  }

  async verifyCredential(credentialId: string) {
    await simulateNetworkDelay(500);
    
    const credential = mockCredentials.find(c => c.id === credentialId);
    
    if (credential) {
      return {
        success: true,
        data: {
          isValid: true,
          credential,
          message: 'Credential successfully verified'
        }
      };
    } else {
      return {
        success: true,
        data: {
          isValid: false,
          credential: undefined,
          message: 'Credential not found or invalid'
        }
      };
    }
  }

  async getStudentCredentials(studentId: string) {
    await simulateNetworkDelay(600);
    
    const credentials = mockCredentials.filter(c => c.studentId === studentId);
    return { success: true, data: credentials };
  }

  async authorizeInstitution(institution: string) {
    await simulateNetworkDelay(700);
    
    const existing = mockInstitutions.find(i => i.name === institution);
    if (existing) {
      existing.isAuthorized = true;
      return { success: true };
    }
    
    return { success: false, error: 'Institution not found' };
  }

  async isAuthorizedInstitution(institution: string) {
    await simulateNetworkDelay(300);
    
    const institutionData = mockInstitutions.find(i => i.name === institution);
    return { success: true, data: institutionData?.isAuthorized || false };
  }
}

export const mockTrustChainService = new MockTrustChainService();
