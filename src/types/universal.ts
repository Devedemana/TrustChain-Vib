// Universal TrustChain Types - Core Infrastructure
export interface FieldDefinition {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'email' | 'url';
  required: boolean;
  isPrivate: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  description?: string;
}

export interface TrustBoardSchema {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  category: 'education' | 'employment' | 'finance' | 'healthcare' | 'real-estate' | 'government' | 'other';
  fields: FieldDefinition[];
  verificationRules: VerificationRule[];
  permissions: TrustBoardPermission[];
  isActive: boolean;
  recordCount?: number;
  verificationCount?: number;
  data?: { [fieldName: string]: any }[];
  createdAt: number;
  updatedAt: number;
}

export interface TrustRecord {
  id: string;
  boardId: string;
  data: { [fieldName: string]: string | number | boolean };
  verificationHash: string;
  submitter: string;
  submitterType: 'organization' | 'individual' | 'system';
  timestamp: number;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  metadata?: {
    ipfsHash?: string;
    encryptionKey?: string;
    digitalSignature?: string;
    auditTrail: AuditEvent[];
  };
}

export interface VerificationRule {
  id: string;
  name: string;
  condition: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'in_range';
    value: any;
  }[];
  action: 'allow' | 'deny' | 'require_approval';
  description: string;
}

export interface TrustBoardPermission {
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canVerify: boolean;
    canManageUsers: boolean;
    canDelete: boolean;
  };
}

export interface Organization {
  id: string;
  name: string;
  type: 'university' | 'corporation' | 'government' | 'nonprofit' | 'individual';
  industry: string;
  verified: boolean;
  trustScore: number;
  contact: {
    email: string;
    phone?: string;
    website?: string;
    address?: string;
  };
  settings: {
    allowCrossVerification: boolean;
    publicProfile: boolean;
    apiAccess: boolean;
    webhookUrl?: string;
  };
  subscription: {
    plan: 'free' | 'basic' | 'professional' | 'enterprise';
    maxTrustBoards: number;
    maxRecords: number;
    maxVerifications: number;
    customBranding: boolean;
  };
  createdAt: number;
  lastActive: number;
}

export interface AuditEvent {
  id: string;
  timestamp: number;
  actor: string;
  action: string;
  resourceType: 'trustboard' | 'record' | 'verification' | 'organization';
  resourceId: string;
  outcome: 'success' | 'failure' | 'pending';
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
  requestId: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Universal Verification Types (extending existing)
export interface UniversalVerificationRequest {
  query: string;
  boardIds?: string[];
  organizationIds?: string[];
  crossVerification?: boolean;
  anonymousMode?: boolean;
  requiredConfidence?: number;
  filters?: {
    dateRange?: { from: number; to: number };
    recordTypes?: string[];
    verified?: boolean;
  };
}

export interface UniversalVerificationResponse {
  verified: boolean;
  confidence: number;
  sources: VerificationSource[];
  timestamp: number;
  queryId: string;
  ttl: number; // Time to live for cached result
  metadata?: {
    crossVerificationUsed: boolean;
    totalSourcesChecked: number;
    averageResponseTime: number;
  };
}

export interface VerificationSource {
  boardId: string;
  organizationId: string;
  organizationName: string;
  verified: boolean;
  confidence: number;
  timestamp: number;
  recordId?: string; // Only if not anonymous
}

// Widget & Integration Types
export interface TrustWidget {
  id: string;
  type: 'verification-button' | 'trust-badge' | 'verification-form' | 'analytics-dashboard';
  boardId: string;
  settings: {
    style: 'default' | 'minimal' | 'modern' | 'custom';
    size: 'small' | 'medium' | 'large';
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    showLogo: boolean;
    showTimestamp: boolean;
    anonymousMode: boolean;
    customCSS?: string;
  };
  permissions: {
    domains: string[];
    ipWhitelist?: string[];
    requireAuth: boolean;
  };
  analytics: {
    totalViews: number;
    totalVerifications: number;
    successRate: number;
    lastUsed: number;
  };
  createdAt: number;
  isActive: boolean;
}

// Template System
export interface TrustBoardTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  schema: FieldDefinition[];
  sampleData: any[];
  verificationRules: VerificationRule[];
  popularity: number;
  tags: string[];
  createdBy: string;
  isOfficial: boolean;
}

// Analytics Types
export interface UniversalAnalytics {
  overview: {
    totalTrustBoards: number;
    totalRecords: number;
    totalVerifications: number;
    totalOrganizations: number;
    averageVerificationTime: number;
    systemUptime: number;
  };
  usage: {
    dailyVerifications: { date: string; count: number }[];
    topCategories: { category: string; count: number }[];
    topOrganizations: { name: string; verifications: number }[];
    geographicDistribution: { country: string; count: number }[];
  };
  performance: {
    averageResponseTime: number;
    errorRate: number;
    cacheHitRate: number;
    apiCallsPerMinute: number;
  };
  trends: {
    growthRate: number;
    adoptionRate: number;
    retentionRate: number;
    satisfactionScore: number;
  };
}
