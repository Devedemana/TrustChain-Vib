// TrustGate API Types - Verification System
export interface TrustGateQuery {
  id: string;
  query: string;
  type: 'simple' | 'complex' | 'cross-verification';
  boardId?: string;
  organizationId?: string;
  requesterId: string;
  requesterType: 'individual' | 'organization' | 'system';
  anonymousMode: boolean;
  urgency: 'low' | 'normal' | 'high' | 'critical';
  expiresAt?: number;
  metadata?: {
    purpose: string;
    context: string;
    referenceId?: string;
  };
}

export interface TrustGateResponse {
  queryId: string;
  verified: boolean;
  confidence: number;
  timestamp: number;
  responseTime: number;
  source: {
    organizationId: string;
    organizationName: string;
    boardId: string;
    boardName: string;
    verificationLevel: 'basic' | 'enhanced' | 'premium';
  };
  verification: {
    method: 'direct' | 'cross-reference' | 'ai-assisted';
    evidence: VerificationEvidence[];
    auditTrail: string[];
  };
  privacy: {
    dataShared: 'none' | 'minimal' | 'full';
    anonymized: boolean;
    encryptionUsed: boolean;
  };
  cost?: {
    amount: number;
    currency: string;
    billedTo: string;
  };
}

export interface VerificationEvidence {
  type: 'document' | 'witness' | 'biometric' | 'blockchain' | 'cross-reference';
  source: string;
  timestamp: number;
  confidence: number;
  details?: string;
  verifiable: boolean;
}

// TrustBridge Types - Cross-Verification System
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

// Webhook & Event Types
export interface WebhookEvent {
  id: string;
  type: 'verification.completed' | 'record.created' | 'board.updated' | 'fraud.detected' | 'system.alert';
  timestamp: number;
  organizationId: string;
  data: any;
  retry: {
    attempt: number;
    maxAttempts: number;
    nextRetryAt?: number;
  };
  signature: string; // HMAC signature for security
}

export interface WebhookConfig {
  id: string;
  organizationId: string;
  url: string;
  events: string[];
  secret: string;
  headers?: { [key: string]: string };
  retryAttempts?: number;
  timeout?: number;
  status?: 'active' | 'disabled';
  createdAt: number;
}

export interface ApiKeyConfig {
  key: string;
  organizationId: string;
  name: string;
  description?: string;
  permissions: string[];
  rateLimit: RateLimitConfig;
  allowedOrigins: string[];
  expiresAt?: number;
  createdAt: number;
  lastUsed?: number;
  status: 'active' | 'disabled' | 'expired';
}

export interface RateLimitConfig {
  requests: number;
  window: number; // seconds
}

export interface ApiUsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  topEndpoints: {
    endpoint: string;
    requests: number;
    successRate: number;
  }[];
  dailyUsage: {
    date: string;
    requests: number;
  }[];
  errorBreakdown: {
    error: string;
    count: number;
  }[];
  costBreakdown: {
    totalCost: number;
    verificationCosts: number;
    storageCosts: number;
    bandwidthCosts: number;
  };
}

// API Key & Authentication Types
export interface ApiKey {
  id: string;
  organizationId: string;
  name: string;
  keyHash: string; // Hashed version of the actual key
  permissions: {
    read: boolean;
    write: boolean;
    verify: boolean;
    admin: boolean;
  };
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
    burstLimit: number;
  };
  restrictions: {
    ipWhitelist?: string[];
    domainWhitelist?: string[];
    timeRestrictions?: {
      timezone: string;
      allowedHours: number[];
      allowedDays: number[];
    };
  };
  usage: {
    totalRequests: number;
    lastUsed: number;
    monthlyUsage: { [month: string]: number };
  };
  expiresAt?: number;
  isActive: boolean;
  createdAt: number;
}

// Billing & Usage Types
export interface UsageMetrics {
  organizationId: string;
  period: { from: number; to: number };
  trustBoards: {
    total: number;
    active: number;
    created: number;
    deleted: number;
  };
  records: {
    total: number;
    created: number;
    updated: number;
    verified: number;
  };
  verifications: {
    total: number;
    successful: number;
    failed: number;
    cached: number;
    crossVerifications: number;
  };
  api: {
    totalCalls: number;
    successfulCalls: number;
    errorRate: number;
    averageResponseTime: number;
  };
  storage: {
    totalSizeBytes: number;
    documentsCount: number;
    mediaCount: number;
  };
  bandwidth: {
    inboundBytes: number;
    outboundBytes: number;
  };
}

export interface BillingInfo {
  organizationId: string;
  currentPlan: 'free' | 'basic' | 'professional' | 'enterprise' | 'custom';
  billing: {
    currency: string;
    paymentMethod: 'credit_card' | 'bank_transfer' | 'invoice' | 'crypto';
    billingCycle: 'monthly' | 'yearly';
    nextBillingDate: number;
    currentBalance: number;
  };
  usage: UsageMetrics;
  limits: {
    trustBoards: number;
    records: number;
    verifications: number;
    apiCalls: number;
    storage: number;
    users: number;
  };
  overages: {
    [metric: string]: {
      amount: number;
      cost: number;
    };
  };
  history: BillingTransaction[];
}

export interface BillingTransaction {
  id: string;
  timestamp: number;
  type: 'subscription' | 'overage' | 'refund' | 'credit';
  description: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metadata?: any;
}
