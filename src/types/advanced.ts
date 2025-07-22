// Advanced types for competition-winning features
export interface DigitalSignature {
  signature: string;
  publicKey: string;
  algorithm: 'Ed25519' | 'ECDSA' | 'RSA';
  timestamp: number;
}

export interface ZKProof {
  proof: string;
  publicInputs: string[];
  verificationKey: string;
  circuit: string;
}

export interface AdvancedCredential {
  id: string;
  studentId: string;
  institution: string;
  credentialType: string;
  title: string;
  issueDate: number;
  verificationHash: string;
  metadata: string;
  // Advanced features
  digitalSignature?: DigitalSignature;
  zkProof?: ZKProof;
  multisigApprovals?: string[];
  expirationDate?: number;
  revocationStatus: 'active' | 'revoked' | 'suspended';
  confidentialityLevel: 'public' | 'private' | 'restricted';
  skillsVerified?: string[];
  endorsements?: Endorsement[];
  blockchainTxHash?: string;
  auditTrail: AuditEvent[];
}

export interface Endorsement {
  endorserId: string;
  endorserName: string;
  endorserTitle: string;
  endorsementText: string;
  timestamp: number;
  signature: DigitalSignature;
}

export interface FraudDetectionResult {
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: FraudFlag[];
  confidence: number;
  recommendations: string[];
}

export interface FraudFlag {
  type: 'duplicate' | 'suspicious_timing' | 'invalid_signature' | 'anomalous_pattern';
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  metadata?: Record<string, any>;
}

export interface InstitutionMetrics {
  institutionId: string;
  credentialsIssued: number;
  verificationRequests: number;
  fraudAttempts: number;
  reputationScore: number;
  trustLevel: 'unverified' | 'bronze' | 'silver' | 'gold' | 'platinum';
  accreditations: string[];
}

export interface RealtimeNotification {
  id: string;
  userId: string;
  type: 'credential_issued' | 'verification_request' | 'fraud_alert' | 'system_update';
  title: string;
  message: string;
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired: boolean;
  read?: boolean;
  metadata?: Record<string, any>;
}

export interface AuditTrail {
  id: string;
  action: 'created' | 'verified' | 'modified' | 'revoked' | 'accessed';
  timestamp: number;
  actor: string; // Principal ID
  details: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface VerificationResult {
  isValid: boolean;
  credentialId: string;
  verificationTimestamp: number;
  verifierPrincipal: string;
  fraudScore?: number;
  confidence?: number;
  auditTrail?: AuditTrail[];
  metadata?: Record<string, any>;
  errors?: string[];
}

export interface AnalyticsData {
  credentialsIssued: TimeSeries;
  verificationRequests: TimeSeries;
  fraudAttempts: TimeSeries;
  userGrowth: TimeSeries;
  institutionGrowth: TimeSeries;
  networkHealth: NetworkMetrics;
}

export interface TimeSeries {
  data: Array<{ timestamp: number; value: number }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  growthRate: number;
}

export interface NetworkMetrics {
  totalUsers: number;
  activeUsers: number;
  totalInstitutions: number;
  totalCredentials: number;
  averageVerificationTime: number;
  systemUptime: number;
}

export interface ComplianceCheck {
  gdprCompliant: boolean;
  ferpaCompliant: boolean;
  coppaCompliant: boolean;
  dataRetentionPolicy: string;
  rightToErasure: boolean;
  consentManagement: boolean;
  auditTrail: AuditEvent[];
}

export interface AuditEvent {
  id: string;
  timestamp: number;
  actor: string;
  action: string;
  resourceId: string;
  resourceType: string;
  outcome: 'success' | 'failure' | 'partial';
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: number;
    requestId: string;
    processingTime: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
