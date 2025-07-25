// TrustBridge Cross-Verification Types
import { TrustGateQuery, TrustGateResponse } from './trustgate';
import { VerificationRule } from './universal';

export interface TrustBridgeRequest {
  id: string;
  queries: TrustGateQuery[];
  logic: 'AND' | 'OR' | 'WEIGHTED' | 'CUSTOM';
  weights?: { [queryId: string]: number };
  minimumConfidence: number;
  minimumSources: number;
  timeout: number;
  failureStrategy: 'fail-fast' | 'best-effort' | 'fallback';
  requesterId: string;
  metadata?: {
    purpose: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
    deadlineAt?: number;
  };
}

export interface TrustBridgeResponse {
  requestId: string;
  overallResult: 'verified' | 'not-verified' | 'partial' | 'inconclusive';
  confidence: number;
  consensus: number; // Percentage of sources agreeing
  responses: TrustGateResponse[];
  aggregation: {
    totalSources: number;
    successfulSources: number;
    averageConfidence: number;
    processingTime: number;
  };
  errors?: TrustBridgeError[];
  recommendations?: string[];
  nextSteps?: string[];
}

// TrustBoard Templates and Analytics
export interface TrustBoardTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  category: string;
  schema: any;
  defaultSettings: any;
  customizations: any[];
  usageCount: number;
  rating: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  // Additional properties needed by services
  data?: {
    name?: string;
    description?: string;
    category?: string;
    schema?: any;
    verificationRules?: VerificationRule[];
  };
  verificationRules?: VerificationRule[];
  sampleData?: any[];
}

export interface TrustBoardAnalytics {
  boardId: string;
  timeframe: string;
  metrics?: any; // Additional property for general metrics
  verificationMetrics: {
    totalQueries: number;
    successfulVerifications: number;
    failedVerifications: number;
    averageResponseTime: number;
    confidenceDistribution: { [range: string]: number };
  };
  usagePatterns: {
    peakHours: number[];
    topRequesters: { id: string; name: string; count: number }[];
    commonQueries: { query: string; count: number }[];
  };
  performanceMetrics: {
    uptime: number;
    throughput: number;
    errorRate: number;
    latency: {
      p50: number;
      p95: number;
      p99: number;
    };
  };
}

export interface DataImportResult {
  success: boolean;
  recordsProcessed: number;
  recordsImported: number;
  recordsFailed: number;
  errors: { line: number; message: string }[];
  warnings: string[];
  summary: {
    duplicates: number;
    invalid: number;
    successful: number;
  };
  importId: string;
  timestamp: number;
}

export interface BulkOperation {
  id: string;
  type: 'import' | 'export' | 'update' | 'delete' | 'verify';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalItems: number;
  processedItems: number;
  failedItems: number;
  result?: DataImportResult;
  createdAt: number;
  completedAt?: number;
  recordId?: string; // Additional property for record operations
}

export interface TrustBridgeError {
  code: string;
  message: string;
  source: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
}

export interface TrustBridgeAggregation {
  totalSources: number;
  successfulSources: number;
  averageConfidence: number;
  processingTime: number;
  riskAssessment: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: string[];
    recommendations: string[];
  };
  cost: {
    totalAmount: number;
    currency: string;
    breakdown: { [source: string]: number };
  };
  auditTrail: {
    startTime: number;
    endTime: number;
    steps: AuditStep[];
  };
}

export interface AuditStep {
  timestamp: number;
  action: string;
  source: string;
  duration: number;
  result: 'success' | 'failure' | 'timeout';
  details?: string;
}

// Cross-Verification Network Types
export interface VerificationNetwork {
  id: string;
  name: string;
  description: string;
  memberOrganizations: string[];
  trustBoards: string[];
  networkRules: NetworkRule[];
  governance: NetworkGovernance;
  metrics: NetworkMetrics;
  isActive: boolean;
  createdAt: number;
}

export interface NetworkRule {
  id: string;
  name: string;
  type: 'trust_threshold' | 'data_sharing' | 'verification_cost' | 'access_control';
  parameters: { [key: string]: any };
  appliesTo: string[]; // Organization IDs or TrustBoard IDs
  priority: number;
  isActive: boolean;
}

export interface NetworkGovernance {
  votingThreshold: number;
  consensusRequirement: number;
  disputeResolution: 'voting' | 'arbitration' | 'automatic';
  membershipRequirements: {
    minimumTrustScore: number;
    verificationRequired: boolean;
    stakingRequired: boolean;
  };
}

export interface NetworkMetrics {
  totalVerifications: number;
  averageResponseTime: number;
  trustScore: number;
  reliabilityScore: number;
  memberSatisfaction: number;
  dailyActiveUsers: number;
}

// Advanced Verification Types
export interface SmartContract {
  id: string;
  name: string;
  description: string;
  code: string;
  language: 'motoko' | 'rust' | 'javascript';
  version: string;
  deployedAt: number;
  trustBoardId: string;
  triggers: ContractTrigger[];
  permissions: ContractPermission[];
  gasLimit: number;
  isActive: boolean;
}

export interface ContractTrigger {
  id: string;
  type: 'record_added' | 'verification_request' | 'threshold_reached' | 'time_based';
  condition: any;
  action: 'verify' | 'notify' | 'transform' | 'validate';
  parameters: { [key: string]: any };
}

export interface ContractPermission {
  userId: string;
  canRead: boolean;
  canExecute: boolean;
  canModify: boolean;
  canDelete: boolean;
}

// Machine Learning & AI Types
export interface AIModel {
  id: string;
  name: string;
  type: 'fraud_detection' | 'pattern_recognition' | 'risk_assessment' | 'data_validation';
  algorithm: string;
  trainingData: string[];
  accuracy: number;
  confidence: number;
  lastTrained: number;
  trustBoardId: string;
  parameters: { [key: string]: any };
  isActive: boolean;
}

export interface PredictiveAnalysis {
  id: string;
  modelId: string;
  prediction: any;
  confidence: number;
  factors: { [factor: string]: number };
  recommendations: string[];
  timestamp: number;
  validUntil: number;
}

// Blockchain Integration Types
export interface BlockchainIntegration {
  id: string;
  network: 'ic' | 'ethereum' | 'polygon' | 'binance' | 'avalanche';
  contractAddress: string;
  abi?: string;
  gasOptimization: boolean;
  batchingEnabled: boolean;
  crossChainSupport: boolean;
  bridgeContracts: { [network: string]: string };
  fees: {
    baseFee: number;
    priorityFee: number;
    currency: string;
  };
}

export interface CrossChainVerification {
  id: string;
  sourceChain: string;
  targetChain: string;
  bridgeContract: string;
  verificationHash: string;
  confirmations: number;
  requiredConfirmations: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  fees: number;
}

// Privacy & Compliance Types
export interface PrivacySettings {
  dataMinimization: boolean;
  anonymization: boolean;
  encryption: {
    algorithm: string;
    keyRotation: boolean;
    rotationInterval: number;
  };
  accessControl: {
    roleBasedAccess: boolean;
    attributeBasedAccess: boolean;
    timeBasedAccess: boolean;
  };
  auditLogging: {
    enabled: boolean;
    level: 'basic' | 'detailed' | 'comprehensive';
    retention: number; // days
  };
  gdprCompliance: boolean;
  ccpaCompliance: boolean;
  rightsManagement: {
    rightToAccess: boolean;
    rightToCorrect: boolean;
    rightToDelete: boolean;
    rightToPortability: boolean;
  };
}

export interface ComplianceReport {
  id: string;
  organizationId: string;
  reportType: 'gdpr' | 'ccpa' | 'sox' | 'hipaa' | 'custom';
  period: { from: number; to: number };
  findings: ComplianceFinding[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  generatedAt: number;
  reviewedBy?: string;
  approvedAt?: number;
}

export interface ComplianceFinding {
  id: string;
  type: 'violation' | 'warning' | 'recommendation' | 'best_practice';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedRecords: string[];
  remediation: string;
  deadline?: number;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
}

// Enterprise Features
export interface EnterpriseIntegration {
  id: string;
  type: 'sso' | 'ldap' | 'active_directory' | 'saml' | 'oauth';
  configuration: { [key: string]: any };
  endpoints: string[];
  isActive: boolean;
  lastSync: number;
  syncInterval: number;
  mappings: { [externalField: string]: string };
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  trustBoardId: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  approvers: string[];
  timeouts: { [stepId: string]: number };
  isActive: boolean;
  createdAt: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'verification' | 'approval' | 'notification' | 'transformation' | 'validation';
  parameters: { [key: string]: any };
  nextSteps: string[];
  conditions: { [condition: string]: any };
  timeoutAction: 'escalate' | 'approve' | 'reject' | 'retry';
}

export interface WorkflowTrigger {
  id: string;
  type: 'record_added' | 'verification_failed' | 'threshold_reached' | 'scheduled';
  condition: any;
  parameters: { [key: string]: any };
}

// Global Registry Types
export interface GlobalRegistry {
  organizations: { [id: string]: PublicOrganizationProfile };
  trustBoards: { [id: string]: PublicTrustBoardProfile };
  verificationStats: GlobalVerificationStats;
  networkHealth: NetworkHealthMetrics;
  lastUpdated: number;
}

export interface PublicOrganizationProfile {
  id: string;
  name: string;
  type: string;
  industry: string;
  verified: boolean;
  trustScore: number;
  publicTrustBoards: string[];
  verificationCount: number;
  joinedAt: number;
  countryCode: string;
}

export interface PublicTrustBoardProfile {
  id: string;
  name: string;
  category: string;
  organizationId: string;
  isPublic: boolean;
  verificationCount: number;
  averageConfidence: number;
  lastActive: number;
}

export interface GlobalVerificationStats {
  totalVerifications: number;
  dailyVerifications: { [date: string]: number };
  topCategories: { [category: string]: number };
  averageResponseTime: number;
  successRate: number;
  globalTrustScore: number;
}

export interface NetworkHealthMetrics {
  activeNodes: number;
  networkLatency: number;
  consensusTime: number;
  errorRate: number;
  dataIntegrity: number;
  systemUptime: number;
}
