// Organization Management Types
export interface OrganizationProfile {
  id: string;
  name: string;
  displayName: string;
  type: 'university' | 'corporation' | 'government' | 'nonprofit' | 'individual' | 'startup' | 'enterprise';
  industry: string;
  subIndustry?: string;
  size: 'solo' | 'small' | 'medium' | 'large' | 'enterprise';
  foundedYear?: number;
  headquarters: {
    country: string;
    state?: string;
    city?: string;
    timezone: string;
  };
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: number;
    documents: VerificationDocument[];
    trustScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    // Additional verification properties
    status?: 'verified' | 'pending' | 'rejected';
    verificationLevel?: 'basic' | 'enhanced' | 'premium';
    verificationNotes?: string;
  };
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    customDomain?: string;
    whiteLabel: boolean;
  };
  compliance: {
    certifications: string[];
    regulations: string[];
    auditSchedule: string;
    lastAudit?: number;
    nextAudit?: number;
    // Additional compliance properties
    gdprCompliant?: boolean;
    hipaaCompliant?: boolean;
    soc2Compliant?: boolean;
    auditingEnabled?: boolean;
  };
  integrations: {
    sso: boolean;
    ldap: boolean;
    apis: string[];
    webhooks: string[];
    thirdPartyConnections: ThirdPartyConnection[];
  };
  subscription: OrganizationSubscription;
  settings: OrganizationSettings;
  metadata: { [key: string]: any };
  createdAt: number;
  updatedAt: number;
}

// Core Organization Types
export interface Organization extends OrganizationProfile {
  // Additional properties needed by services
  description?: string;
  website?: string;
  contactEmail?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  members?: OrganizationMember[];
  stats?: OrganizationStats;
  status?: 'active' | 'inactive' | 'suspended' | 'pending' | 'archived';
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: TeamRole;
  accessLevel: AccessLevel;
  permissions: TrustBoardPermission[];
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  invitedBy?: string;
  joinedAt: number;
  lastActiveAt?: number;
  
  // Direct access properties for backward compatibility
  name?: string;
  email?: string;
  
  profile: {
    name: string;
    email: string;
    avatar?: string;
    title?: string;
    department?: string;
    bio?: string;
  };
  settings: {
    notifications: boolean;
    emailAlerts: boolean;
    accessHours?: { start: string; end: string; timezone: string };
    ipWhitelist?: string[];
  };
}

// TeamRole as union type for direct usage
export type TeamRole = 'owner' | 'admin' | 'manager' | 'editor' | 'viewer' | 'guest';

// TeamRoleConfig interface for role configuration
export interface TeamRoleConfig {
  id: string;
  name: TeamRole;
  displayName: string;
  description: string;
  permissions: string[];
  hierarchy: number; // 0 = highest
  canInviteMembers: boolean;
  canManageRoles: boolean;
  canAccessBilling: boolean;
  canManageSettings: boolean;
}

// AccessLevel as union type for direct usage  
export type AccessLevel = 'full' | 'restricted' | 'read-only' | 'custom';

// AccessLevelConfig interface for access level configuration
export interface AccessLevelConfig {
  id: string;
  name: AccessLevel;
  boardAccess: 'all' | 'assigned' | 'none';
  dataAccess: 'full' | 'partial' | 'anonymized' | 'none';
  apiAccess: boolean;
  exportAccess: boolean;
  auditAccess: boolean;
  customPermissions?: string[];
}

export interface TrustBoardPermission {
  boardId: string;
  permissions: ('read' | 'write' | 'admin' | 'export' | 'share')[];
  restrictions?: {
    fields?: string[];
    timeRange?: { start: number; end: number };
    queryLimit?: number;
  };
}

export interface OrganizationStats {
  // Add direct access properties for backward compatibility
  totalMembers?: number;
  activeMembers?: number;
  totalTrustBoards?: number;
  totalRecords?: number;
  totalVerifications?: number;
  
  overview: {
    totalMembers: number;
    activeMembers: number;
    totalTrustBoards: number;
    totalRecords: number;
    totalVerifications: number;
    monthlyGrowth: number;
  };
  activity: {
    verificationsToday: number;
    verificationsThisWeek: number;
    verificationsThisMonth: number;
    averageResponseTime: number;
    successRate: number;
  };
  usage: {
    storageUsed: number;
    storageLimit: number;
    apiCallsUsed: number;
    apiCallsLimit: number;
    bandwidthUsed: number;
    bandwidthLimit: number;
  };
  billing: {
    currentPlan: string;
    monthlySpend: number;
    yearlySpend: number;
    nextBillingDate: number;
    paymentStatus: 'current' | 'overdue' | 'suspended';
  };
}

export interface MemberInvitation {
  id: string;
  organizationId: string;
  email: string;
  name?: string; // Additional property for display
  role: TeamRole;
  accessLevel: AccessLevel;
  permissions: TrustBoardPermission[];
  invitedBy: string;
  invitedAt: number;
  expiresAt: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  createdAt?: number; // Additional property needed by services
  onboarding?: {
    welcomeMessage: string;
    resources: string[];
    trainingRequired: boolean;
  };
}

export interface OrganizationTemplate {
  id: string;
  name: string;
  category: 'university' | 'corporation' | 'government' | 'nonprofit' | 'healthcare' | 'financial' | 'legal';
  description: string;
  industry: string;
  features: string[];
  trustBoards: {
    name: string;
    schema: any;
    defaultData?: any[];
    permissions: any;
  }[];
  settings: Partial<OrganizationSettings>;
  workflows: any[];
  integrations: string[];
  usageCount: number;
  rating: number;
  isPremium: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  // Additional properties needed by services
  defaultSettings?: Partial<OrganizationSettings>;
  trustBoardTemplates?: {
    name: string;
    description: string;
    schema: any;
    settings: any;
  }[];
  sampleData?: any[];
}

export interface ComplianceSettings {
  framework: 'SOC2' | 'ISO27001' | 'GDPR' | 'HIPAA' | 'FERPA' | 'CCPA' | 'Custom';
  requirements: ComplianceRequirement[];
  auditSchedule: {
    frequency: 'monthly' | 'quarterly' | 'annually';
    nextAudit: number;
    auditor?: string;
    reportingRequired: boolean;
  };
  dataRetention: {
    policy: string;
    retentionPeriod: number; // days
    deletionSchedule: 'automatic' | 'manual';
    backupRequired: boolean;
  };
  encryption: {
    atRest: boolean;
    inTransit: boolean;
    keyManagement: 'internal' | 'external' | 'hsm';
    algorithms: string[];
  };
  accessControls: {
    mfaRequired: boolean;
    sessionTimeout: number; // minutes
    ipRestrictions: string[];
    geoRestrictions: string[];
  };
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'compliant' | 'non-compliant' | 'pending' | 'na';
  lastChecked: number;
  evidence?: string[];
  remediation?: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: { [key: string]: any };
  outcome: 'success' | 'failure' | 'partial';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  geolocation?: {
    country: string;
    region: string;
    city: string;
  };
}

export interface VerificationDocument {
  id: string;
  type: 'business_license' | 'tax_id' | 'accreditation' | 'certification' | 'insurance';
  name: string;
  url: string;
  hash: string;
  uploadedAt: number;
  expiresAt?: number;
  verifiedBy?: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
}

export interface ThirdPartyConnection {
  id: string;
  provider: string;
  type: 'data_source' | 'identity_provider' | 'payment_processor' | 'analytics';
  configuration: { [key: string]: any };
  status: 'active' | 'inactive' | 'error';
  lastSync?: number;
  syncFrequency: number;
}

export interface OrganizationSubscription {
  plan: 'free' | 'basic' | 'professional' | 'enterprise' | 'custom';
  status: 'active' | 'inactive' | 'suspended' | 'cancelled';
  billingCycle: 'monthly' | 'yearly';
  startDate: number;
  endDate?: number;
  autoRenewal: boolean;
  limits: SubscriptionLimits;
  features: SubscriptionFeatures;
  billing: BillingInformation;
  usage: UsageTracking;
  billingEmail?: string; // Additional property for billing
}

export interface SubscriptionLimits {
  trustBoards: number;
  records: number;
  verifications: number;
  apiCalls: number;
  storage: number; // in GB
  users: number;
  widgets: number;
  customBranding: boolean;
  prioritySupport: boolean;
  slaGuarantee: boolean;
  // Additional properties needed by services
  maxTrustBoards?: number;
  maxMembers?: number;
  maxRecords?: number;
}

export interface SubscriptionFeatures {
  advancedAnalytics: boolean;
  crossVerification: boolean;
  aiAssistance: boolean;
  customWorkflows: boolean;
  enterpriseIntegrations: boolean;
  whiteLabel: boolean;
  dedicatedSupport: boolean;
  customDomains: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  bulkOperations: boolean;
  dataExport: boolean;
  auditLogs: boolean;
  complianceReporting: boolean;
}

export interface BillingInformation {
  currency: string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'invoice' | 'crypto' | 'wire_transfer';
  billingAddress: Address;
  taxId?: string;
  vatNumber?: string;
  invoiceEmail: string;
  billingContact: ContactPerson;
  autoPayment: boolean;
  creditLimit?: number;
  currentBalance: number;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface ContactPerson {
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface UsageTracking {
  currentPeriod: UsagePeriod;
  previousPeriod: UsagePeriod;
  yearToDate: UsagePeriod;
  overages: { [metric: string]: number };
  alerts: UsageAlert[];
}

export interface UsagePeriod {
  start: number;
  end: number;
  trustBoards: number;
  records: number;
  verifications: number;
  apiCalls: number;
  storage: number;
  activeUsers: number;
  widgets: number;
  dataTransfer: number;
}

export interface UsageAlert {
  id: string;
  metric: string;
  threshold: number;
  currentUsage: number;
  severity: 'warning' | 'critical';
  triggered: boolean;
  notifiedAt?: number;
}

export interface OrganizationSettings {
  general: {
    timezone: string;
    dateFormat: string;
    language: string;
    currency: string;
    logoUrl?: string;
    theme: 'light' | 'dark' | 'auto';
  };
  security: {
    twoFactorRequired: boolean;
    passwordPolicy: PasswordPolicy;
    sessionTimeout: number;
    ipWhitelist: string[];
    ssoEnabled: boolean;
    auditLogging: boolean;
  };
  notifications: {
    email: NotificationSettings;
    sms: NotificationSettings;
    webhook: NotificationSettings;
    inApp: NotificationSettings;
  };
  privacy: {
    dataRetention: number; // days
    anonymization: boolean;
    gdprCompliance: boolean;
    ccpaCompliance: boolean;
    dataProcessingAgreement: boolean;
  };
  api: {
    enabled: boolean;
    rateLimit: number;
    keyRotation: boolean;
    webhooksEnabled: boolean;
    ipWhitelist: string[];
  };
  collaboration: {
    allowGuestUsers: boolean;
    defaultUserRole: string;
    approvalRequired: boolean;
    maxConcurrentUsers: number;
  };
  // Additional properties needed by services
  verificationLevel?: 'basic' | 'enhanced' | 'premium';
  allowPublicVerification?: boolean;
  requireMemberApproval?: boolean;
  dataRetention?: number;
  maxMembers?: number;
  allowedDomains?: string[];
  features?: string[];
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxAge: number; // days
  preventReuse: number; // number of previous passwords
}

export interface NotificationSettings {
  enabled: boolean;
  events: string[];
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string; // HH:MM
    timezone: string;
  };
}

// Team Management Types
export interface TeamMember {
  id: string;
  organizationId: string;
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  role: OrganizationRole;
  permissions: TeamPermissions;
  department?: string;
  title?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastLogin?: number;
  invitedBy: string;
  invitedAt: number;
  joinedAt?: number;
  metadata: { [key: string]: any };
}

export interface OrganizationRole {
  id: string;
  name: string;
  description: string;
  isCustom: boolean;
  permissions: string[];
  trustBoardAccess: { [boardId: string]: TrustBoardPermission };
  systemPermissions: SystemPermissions;
  restrictions: RoleRestrictions;
}

export interface SystemPermissions {
  canManageOrganization: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManageBilling: boolean;
  canManageIntegrations: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canManageCompliance: boolean;
  canAccessApi: boolean;
  canManageWebhooks: boolean;
}

export interface TeamPermissions {
  trustBoards: { [boardId: string]: TrustBoardPermission };
  system: SystemPermissions;
  restrictions: UserRestrictions;
}

export interface UserRestrictions {
  ipWhitelist?: string[];
  timeRestrictions?: TimeRestriction[];
  dataAccessLimits?: DataAccessLimits;
  operationLimits?: OperationLimits;
}

export interface TimeRestriction {
  daysOfWeek: number[]; // 0-6, Sunday = 0
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  timezone: string;
}

export interface DataAccessLimits {
  maxRecordsPerQuery: number;
  maxExportSize: number;
  allowBulkOperations: boolean;
  allowDataExport: boolean;
}

export interface OperationLimits {
  maxApiCallsPerHour: number;
  maxVerificationsPerDay: number;
  maxRecordsPerDay: number;
  allowAsyncOperations: boolean;
}

export interface RoleRestrictions {
  maxUsers: number;
  trustBoardLimits: { [category: string]: number };
  featureAccess: { [feature: string]: boolean };
  dataAccess: { [dataType: string]: 'none' | 'read' | 'write' | 'admin' };
}

// Invitation and Onboarding Types
export interface TeamInvitation {
  id: string;
  organizationId: string;
  inviterUserId: string;
  inviterName: string;
  email: string;
  role: string;
  permissions: TeamPermissions;
  message?: string;
  expiresAt: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'revoked';
  sentAt: number;
  acceptedAt?: number;
  declinedAt?: number;
  token: string;
  metadata: { [key: string]: any };
}

export interface OnboardingProgress {
  userId: string;
  organizationId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  skippedSteps: string[];
  startedAt: number;
  completedAt?: number;
  estimatedCompletion: number;
  personalizedFlow: boolean;
  assistanceLevel: 'none' | 'basic' | 'guided' | 'full';
}

export interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  type: 'setup' | 'configuration' | 'tutorial' | 'verification' | 'integration';
  required: boolean;
  estimatedTime: number; // minutes
  dependencies: string[];
  resources: OnboardingResource[];
  validationCriteria: any[];
  autoComplete: boolean;
}

export interface OnboardingResource {
  type: 'video' | 'document' | 'tutorial' | 'template' | 'tool';
  title: string;
  url: string;
  duration?: number; // for videos, in seconds
  description: string;
  tags: string[];
}
