import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';
import { 
  AdvancedCredential, 
  VerificationResult, 
  AnalyticsData, 
  FraudDetectionResult,
  ZKProof,
  DigitalSignature,
  AuditTrail
} from '../types/advanced';

// IC Canister Interface - Enhanced for competition features
export interface TrustChainCanister {
  // Enhanced credential operations
  issueAdvancedCredential: (credential: AdvancedCredential) => Promise<{ 
    success: boolean; 
    credentialId: string; 
    blockHash: string; 
    timestamp: bigint;
    gasUsed: bigint;
  }>;
  
  verifyCredentialWithProof: (credentialId: string, zkProof?: ZKProof) => Promise<{
    isValid: boolean;
    verificationResult: VerificationResult;
    fraudScore: number;
    auditTrail: AuditTrail[];
    confidence: number;
  }>;
  
  // Batch operations for performance
  batchIssueCredentials: (credentials: AdvancedCredential[]) => Promise<{
    successful: string[];
    failed: { id: string; error: string }[];
    totalGasUsed: bigint;
  }>;
  
  batchVerifyCredentials: (credentialIds: string[]) => Promise<VerificationResult[]>;
  
  // Advanced analytics
  getAnalyticsDashboard: (principalId: Principal, timeframe: string) => Promise<AnalyticsData>;
  getFraudDetectionReport: (principalId: Principal) => Promise<FraudDetectionResult>;
  getNetworkStatistics: () => Promise<{
    totalCredentials: bigint;
    totalInstitutions: bigint;
    totalVerifications: bigint;
    averageVerificationTime: number;
    networkHealth: number;
  }>;
  
  // Real-time subscriptions
  subscribeToCredentialUpdates: (principalId: Principal) => Promise<void>;
  subscribeToFraudAlerts: (principalId: Principal) => Promise<void>;
  
  // Multi-signature operations
  createMultisigCredential: (credential: AdvancedCredential, signers: Principal[]) => Promise<{
    credentialId: string;
    requiredSignatures: number;
    currentSignatures: number;
  }>;
  
  signMultisigCredential: (credentialId: string, signature: DigitalSignature) => Promise<{
    success: boolean;
    remainingSignatures: number;
    isComplete: boolean;
  }>;
  
  // NFT and tokenization
  mintCredentialNFT: (credentialId: string, metadata: any) => Promise<{
    tokenId: bigint;
    contractAddress: string;
    transactionHash: string;
  }>;
  
  // Advanced search and filtering
  searchCredentials: (query: {
    issuer?: Principal;
    recipient?: Principal;
    credentialType?: string;
    dateRange?: { from: bigint; to: bigint };
    tags?: string[];
    verified?: boolean;
  }) => Promise<AdvancedCredential[]>;
  
  // Backup and recovery
  exportUserData: (principalId: Principal) => Promise<{
    credentials: AdvancedCredential[];
    verifications: VerificationResult[];
    analytics: AnalyticsData;
    encryptedBackup: string;
  }>;
  
  importUserData: (encryptedBackup: string, decryptionKey: string) => Promise<{
    success: boolean;
    importedCredentials: number;
    errors: string[];
  }>;
}

class EnhancedBlockchainService {
  private actor: TrustChainCanister | null = null;
  private agent: HttpAgent | null = null;
  private identity: Identity | null = null;
  private canisterId: string;
  private wsConnection: WebSocket | null = null;
  private subscriptions: Map<string, (data: any) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(canisterId?: string) {
    this.canisterId = canisterId || process.env.REACT_APP_CANISTER_ID || 'rrkah-fqaaa-aaaah-qarkq-cai';
    this.initializeService();
  }

  private async initializeService(): Promise<void> {
    try {
      // Initialize HTTP Agent with enhanced configuration
      this.agent = new HttpAgent({
        host: process.env.REACT_APP_IC_HOST || 'https://ic0.app',
        retryTimes: 3,
        verifyQuerySignatures: true
      });

      // Fetch root key in development
      if (process.env.NODE_ENV === 'development') {
        await this.agent.fetchRootKey();
      }

      console.log('[Blockchain] Service initialized successfully');
    } catch (error) {
      console.error('[Blockchain] Service initialization failed:', error);
      throw error;
    }
  }

  public async authenticate(identity: Identity): Promise<boolean> {
    try {
      this.identity = identity;
      
      if (this.agent) {
        this.agent.replaceIdentity(identity);
      }

      // Create actor with enhanced error handling
      this.actor = Actor.createActor<TrustChainCanister>(
        this.getIDL(),
        {
          agent: this.agent!,
          canisterId: this.canisterId,
        }
      );

      // Initialize WebSocket connection for real-time features
      await this.initializeWebSocket();

      console.log('[Blockchain] Authentication successful');
      return true;
    } catch (error) {
      console.error('[Blockchain] Authentication failed:', error);
      return false;
    }
  }

  private async initializeWebSocket(): Promise<void> {
    try {
      const wsUrl = process.env.REACT_APP_WS_URL || 'wss://ic-websocket-gateway.com';
      this.wsConnection = new WebSocket(`${wsUrl}/${this.canisterId}`);

      this.wsConnection.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        this.reconnectAttempts = 0;
        
        // Authenticate WebSocket connection
        this.wsConnection?.send(JSON.stringify({
          type: 'authenticate',
          principal: this.identity?.getPrincipal().toText()
        }));
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('[WebSocket] Message parsing error:', error);
        }
      };

      this.wsConnection.onclose = () => {
        console.log('[WebSocket] Connection closed');
        this.handleWebSocketReconnection();
      };

      this.wsConnection.onerror = (error) => {
        console.error('[WebSocket] Connection error:', error);
      };
    } catch (error) {
      console.error('[WebSocket] Initialization failed:', error);
    }
  }

  private handleWebSocketMessage(data: any): void {
    const { type, payload } = data;
    
    switch (type) {
      case 'credential_update':
        this.notifySubscribers('credential_update', payload);
        break;
      case 'fraud_alert':
        this.notifySubscribers('fraud_alert', payload);
        break;
      case 'verification_complete':
        this.notifySubscribers('verification_complete', payload);
        break;
      case 'multisig_update':
        this.notifySubscribers('multisig_update', payload);
        break;
      case 'network_stats':
        this.notifySubscribers('network_stats', payload);
        break;
      default:
        console.log('[WebSocket] Unknown message type:', type);
    }
  }

  private notifySubscribers(eventType: string, payload: any): void {
    const callback = this.subscriptions.get(eventType);
    if (callback) {
      try {
        callback(payload);
      } catch (error) {
        console.error(`[WebSocket] Subscription callback error for ${eventType}:`, error);
      }
    }
  }

  private handleWebSocketReconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.initializeWebSocket();
      }, delay);
    } else {
      console.error('[WebSocket] Max reconnection attempts reached');
    }
  }

  // Enhanced credential operations
  public async issueAdvancedCredential(credential: AdvancedCredential): Promise<{
    success: boolean;
    credentialId: string;
    blockHash: string;
    timestamp: number;
  }> {
    if (!this.actor) {
      throw new Error('Blockchain service not authenticated');
    }

    try {
      const result = await this.actor.issueAdvancedCredential(credential);
      
      // Notify WebSocket subscribers
      if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
        this.wsConnection.send(JSON.stringify({
          type: 'credential_issued',
          credentialId: result.credentialId,
          timestamp: Number(result.timestamp)
        }));
      }

      return {
        success: result.success,
        credentialId: result.credentialId,
        blockHash: result.blockHash,
        timestamp: Number(result.timestamp)
      };
    } catch (error) {
      console.error('[Blockchain] Issue credential failed:', error);
      throw error;
    }
  }

  public async verifyCredentialWithProof(
    credentialId: string, 
    zkProof?: ZKProof
  ): Promise<VerificationResult> {
    if (!this.actor) {
      throw new Error('Blockchain service not authenticated');
    }

    try {
      const result = await this.actor.verifyCredentialWithProof(credentialId, zkProof);
      
      const verificationResult: VerificationResult = {
        isValid: result.isValid,
        credentialId,
        verificationTimestamp: Date.now(),
        verifierPrincipal: this.identity?.getPrincipal().toText() || '',
        fraudScore: result.fraudScore,
        confidence: result.confidence,
        auditTrail: result.auditTrail,
        metadata: {
          zkProofUsed: !!zkProof,
          verificationMethod: zkProof ? 'zero-knowledge' : 'standard'
        }
      };

      // Notify real-time subscribers
      if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
        this.wsConnection.send(JSON.stringify({
          type: 'verification_completed',
          result: verificationResult
        }));
      }

      return verificationResult;
    } catch (error) {
      console.error('[Blockchain] Verify credential failed:', error);
      throw error;
    }
  }

  // Batch operations for performance
  public async batchIssueCredentials(credentials: AdvancedCredential[]): Promise<{
    successful: string[];
    failed: { id: string; error: string }[];
    totalGasUsed: number;
  }> {
    if (!this.actor) {
      throw new Error('Blockchain service not authenticated');
    }

    try {
      const result = await this.actor.batchIssueCredentials(credentials);
      
      return {
        successful: result.successful,
        failed: result.failed,
        totalGasUsed: Number(result.totalGasUsed)
      };
    } catch (error) {
      console.error('[Blockchain] Batch issue failed:', error);
      throw error;
    }
  }

  // Analytics operations
  public async getAnalyticsDashboard(timeframe: string = '30d'): Promise<AnalyticsData> {
    if (!this.actor || !this.identity) {
      throw new Error('Blockchain service not authenticated');
    }

    try {
      return await this.actor.getAnalyticsDashboard(this.identity.getPrincipal(), timeframe);
    } catch (error) {
      console.error('[Blockchain] Get analytics failed:', error);
      throw error;
    }
  }

  public async getFraudDetectionReport(): Promise<FraudDetectionResult> {
    if (!this.actor || !this.identity) {
      throw new Error('Blockchain service not authenticated');
    }

    try {
      return await this.actor.getFraudDetectionReport(this.identity.getPrincipal());
    } catch (error) {
      console.error('[Blockchain] Get fraud report failed:', error);
      throw error;
    }
  }

  public async getNetworkStatistics(): Promise<{
    totalCredentials: number;
    totalInstitutions: number;
    totalVerifications: number;
    averageVerificationTime: number;
    networkHealth: number;
  }> {
    if (!this.actor) {
      throw new Error('Blockchain service not authenticated');
    }

    try {
      const stats = await this.actor.getNetworkStatistics();
      
      return {
        totalCredentials: Number(stats.totalCredentials),
        totalInstitutions: Number(stats.totalInstitutions),
        totalVerifications: Number(stats.totalVerifications),
        averageVerificationTime: stats.averageVerificationTime,
        networkHealth: stats.networkHealth
      };
    } catch (error) {
      console.error('[Blockchain] Get network stats failed:', error);
      throw error;
    }
  }

  // Real-time subscription management
  public subscribe(eventType: string, callback: (data: any) => void): () => void {
    this.subscriptions.set(eventType, callback);
    
    // Subscribe on the IC side if WebSocket is connected
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        type: 'subscribe',
        eventType,
        principal: this.identity?.getPrincipal().toText()
      }));
    }

    // Return unsubscribe function
    return () => {
      this.subscriptions.delete(eventType);
      if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
        this.wsConnection.send(JSON.stringify({
          type: 'unsubscribe',
          eventType,
          principal: this.identity?.getPrincipal().toText()
        }));
      }
    };
  }

  // Multi-signature operations
  public async createMultisigCredential(
    credential: AdvancedCredential, 
    signers: Principal[]
  ): Promise<{
    credentialId: string;
    requiredSignatures: number;
    currentSignatures: number;
  }> {
    if (!this.actor) {
      throw new Error('Blockchain service not authenticated');
    }

    try {
      return await this.actor.createMultisigCredential(credential, signers);
    } catch (error) {
      console.error('[Blockchain] Create multisig credential failed:', error);
      throw error;
    }
  }

  // Advanced search
  public async searchCredentials(query: {
    issuer?: string;
    recipient?: string;
    credentialType?: string;
    dateRange?: { from: number; to: number };
    tags?: string[];
    verified?: boolean;
  }): Promise<AdvancedCredential[]> {
    if (!this.actor) {
      throw new Error('Blockchain service not authenticated');
    }

    try {
      const searchQuery = {
        ...query,
        issuer: query.issuer ? Principal.fromText(query.issuer) : undefined,
        recipient: query.recipient ? Principal.fromText(query.recipient) : undefined,
        dateRange: query.dateRange ? {
          from: BigInt(query.dateRange.from),
          to: BigInt(query.dateRange.to)
        } : undefined
      };

      return await this.actor.searchCredentials(searchQuery);
    } catch (error) {
      console.error('[Blockchain] Search credentials failed:', error);
      throw error;
    }
  }

  // Utility methods
  public isConnected(): boolean {
    return this.actor !== null && this.identity !== null;
  }

  public isWebSocketConnected(): boolean {
    return this.wsConnection?.readyState === WebSocket.OPEN;
  }

  public getPrincipal(): string {
    return this.identity?.getPrincipal().toText() || '';
  }

  // Mock IDL for development - replace with actual IDL
  private getIDL(): any {
    return {
      // This would be your actual Candid interface
      // For now, returning empty object for compilation
    };
  }

  // Cleanup
  public disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
    
    this.subscriptions.clear();
    this.actor = null;
    this.identity = null;
    
    console.log('[Blockchain] Service disconnected');
  }
}

export default EnhancedBlockchainService;
