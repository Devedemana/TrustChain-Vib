import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { Credential, VerificationResult, ApiResponse } from '../types';

// Define the interface for the TrustChain canister
export interface TrustChainActor {
  issueCredential: (
    studentId: string,
    institution: string,
    credentialType: string,
    title: string,
    metadata: string
  ) => Promise<{ Ok?: Credential; Err?: string }>;
  
  verifyCredential: (credentialId: string) => Promise<VerificationResult>;
  
  getStudentCredentials: (studentId: string) => Promise<Credential[]>;
  
  authorizeInstitution: (institution: string) => Promise<{ Ok?: null; Err?: string }>;
  
  isAuthorizedInstitution: (institution: string) => Promise<boolean>;
}

// Canister ID - this will be set after deployment
const CANISTER_ID = process.env.CANISTER_ID_TRUSTCHAIN_BACKEND || 'uxrrr-q7777-77774-qaaaq-cai';

// Create the agent for local development
const agent = new HttpAgent({
  host: process.env.DFX_NETWORK === 'local' ? 'http://127.0.0.1:4943' : 'https://ic0.app',
});

// For local development, fetch the root key
if (process.env.DFX_NETWORK === 'local') {
  agent.fetchRootKey().catch(err => {
    console.warn('Unable to fetch root key. Check if the local replica is running.');
    console.error(err);
  });
}

// Create the actor
export const createActor = (): TrustChainActor => {
  return Actor.createActor<TrustChainActor>(
    ({ IDL }) => {
      const Credential = IDL.Record({
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
      const result = await this.actor.issueCredential(
        studentId,
        institution,
        credentialType,
        title,
        JSON.stringify(metadata)
      );

      if ('Ok' in result) {
        return { success: true, data: result.Ok };
      } else {
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error('Error issuing credential:', error);
      return { success: false, error: 'Failed to issue credential' };
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
