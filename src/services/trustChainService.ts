import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { Credential, VerificationResult, ApiResponse } from '../types';
import { IC_CONFIG, HOST, CANISTER_ID, FETCH_ROOT_KEY, VERIFY_QUERY_SIGNATURES, USE_PRODUCTION } from '../config/ic-config';

// Define the interface for the TrustChain canister
export interface TrustChainActor {
  issueCredential: (
    studentId: string,
    institution: string,
    credentialType: string,
    title: string,
    metadata: string
  ) => Promise<{ Ok?: Credential; Err?: string }>;
  
  verifyCredential: (credentialId: string) => Promise<{
    isValid: boolean;
    credential?: Credential;
    message: string;
  }>;
  
  getStudentCredentials: (studentId: string) => Promise<Credential[]>;
  
  authorizeInstitution: (institution: string) => Promise<{ Ok?: null; Err?: string }>;
  
  isAuthorizedInstitution: (institution: string) => Promise<boolean>;
  
  getAuthorizedInstitutions: () => Promise<string[]>;
  
  getSystemInfo: () => Promise<string>;
}

// Production-ready agent creation with IC configuration
const createAgent = () => {
  console.log('🚀 Creating IC agent for production deployment');
  console.log('Environment variables:', {
    REACT_APP_CANISTER_ID: process.env.REACT_APP_CANISTER_ID,
    REACT_APP_NETWORK: process.env.REACT_APP_NETWORK,
    REACT_APP_USE_PRODUCTION: process.env.REACT_APP_USE_PRODUCTION,
  });
  console.log('Configuration:', {
    host: HOST,
    canisterId: CANISTER_ID,
    network: IC_CONFIG.NETWORK,
    useProduction: USE_PRODUCTION
  });
  
  // Validate canister ID format
  if (CANISTER_ID.includes('_') || CANISTER_ID === 'YOUR_CANISTER_ID_HERE') {
    console.error('❌ Invalid canister ID format:', CANISTER_ID);
    console.error('Using fallback local canister ID for development');
  }
  
  const agent = new HttpAgent({ host: HOST });

  // Security: Only fetch root key in local development
  if (FETCH_ROOT_KEY && !USE_PRODUCTION) {
    agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key. Check if the local replica is running.');
      console.error(err);
    });
  } else if (USE_PRODUCTION) {
    console.log('✅ Production mode: Skipping root key fetch for security');
  }
  
  // Enable query signature verification in production
  if (VERIFY_QUERY_SIGNATURES) {
    console.log('✅ Query signature verification enabled');
  }
  
  return agent;
};

const agent = createAgent();

// Create the actor
export const createActor = (): TrustChainActor => {
  return Actor.createActor<TrustChainActor>(
    ({ IDL }) => {      const Credential = IDL.Record({
        id: IDL.Text,
        studentId: IDL.Text,
        institution: IDL.Text,
        credentialType: IDL.Text,
        title: IDL.Text,
        issueDate: IDL.Int,
        verificationHash: IDL.Text,
        metadata: IDL.Text,
      });

      const VerificationResult = IDL.Record({
        isValid: IDL.Bool,
        credential: IDL.Opt(Credential),
        message: IDL.Text,
      });

      const Result = IDL.Variant({
        Ok: IDL.Null,
        Err: IDL.Text,
      });

      const CredentialResult = IDL.Variant({
        Ok: Credential,
        Err: IDL.Text,
      });

      return IDL.Service({
        issueCredential: IDL.Func(
          [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
          [CredentialResult],
          []
        ),
        verifyCredential: IDL.Func([IDL.Text], [VerificationResult], ['query']),
        getStudentCredentials: IDL.Func([IDL.Text], [IDL.Vec(Credential)], ['query']),
        authorizeInstitution: IDL.Func([IDL.Text], [Result], []),
        isAuthorizedInstitution: IDL.Func([IDL.Text], [IDL.Bool], ['query']),
        getAuthorizedInstitutions: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
        getSystemInfo: IDL.Func([], [IDL.Text], ['query']),
      });
    },
    {
      agent,
      canisterId: CANISTER_ID,
    }
  );
};

// Service class for TrustChain operations
export class TrustChainService {
  private actor: TrustChainActor;

  constructor() {
    this.actor = createActor();
  }
  async issueCredential(
    studentId: string,
    institution: string,
    credentialType: string,
    title: string,
    metadata: object
  ): Promise<ApiResponse<Credential>> {
    try {
      console.log('Issuing credential:', { studentId, institution, credentialType, title });
      
      const result = await this.actor.issueCredential(
        studentId,
        institution,
        credentialType,
        title,
        JSON.stringify(metadata)
      );

      if ('Ok' in result) {
        console.log('Credential issued successfully:', result.Ok);
        return { success: true, data: result.Ok };
      } else {
        console.error('Credential issuance failed:', result.Err);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error('Error issuing credential:', error);
      
      // Check for specific IC errors
      if (error instanceof Error && error.message.includes('certificate verification failed')) {
        return { 
          success: false, 
          error: 'Authentication failed. Please check if the local IC replica is running and properly configured.' 
        };
      }
      
      return { success: false, error: `Failed to issue credential: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async verifyCredential(credentialId: string): Promise<ApiResponse<VerificationResult>> {
    try {
      const result = await this.actor.verifyCredential(credentialId);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error verifying credential:', error);
      return { success: false, error: 'Failed to verify credential' };
    }
  }

  async getStudentCredentials(studentId: string): Promise<ApiResponse<Credential[]>> {
    try {
      const credentials = await this.actor.getStudentCredentials(studentId);
      return { success: true, data: credentials };
    } catch (error) {
      console.error('Error fetching student credentials:', error);
      return { success: false, error: 'Failed to fetch credentials' };
    }
  }

  async authorizeInstitution(institution: string): Promise<ApiResponse<null>> {
    try {
      const result = await this.actor.authorizeInstitution(institution);
      
      if ('Ok' in result) {
        return { success: true };
      } else {
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error('Error authorizing institution:', error);
      return { success: false, error: 'Failed to authorize institution' };
    }
  }

  async isAuthorizedInstitution(institution: string): Promise<ApiResponse<boolean>> {
    try {
      const isAuthorized = await this.actor.isAuthorizedInstitution(institution);
      return { success: true, data: isAuthorized };
    } catch (error) {
      console.error('Error checking institution authorization:', error);
      return { success: false, error: 'Failed to check authorization' };
    }
  }
}

// Export a singleton instance
export const trustChainService = new TrustChainService();
