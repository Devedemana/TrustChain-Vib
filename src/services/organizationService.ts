// Organization Management Service - Phase 4 Implementation
import { 
  Organization, 
  OrganizationMember, 
  OrganizationSettings, 
  TeamRole,
  AccessLevel,
  OrganizationStats,
  MemberInvitation,
  OrganizationTemplate,
  TrustBoardPermission,
  ComplianceSettings,
  AuditLog 
} from '../types/organizations';
import { ApiResponse, PaginatedResponse } from '../types/universal';
import { UniversalTrustService } from './universalTrust';

export class OrganizationService {
  private static instance: OrganizationService;
  private universalService: UniversalTrustService;

  private constructor() {
    this.universalService = UniversalTrustService.getInstance();
  }

  static getInstance(): OrganizationService {
    if (!OrganizationService.instance) {
      OrganizationService.instance = new OrganizationService();
    }
    return OrganizationService.instance;
  }

  // ==========================================
  // ORGANIZATION MANAGEMENT
  // ==========================================

  async createOrganization(organization: Partial<Organization>): Promise<ApiResponse<Organization>> {
    try {
      const newOrg: Organization = {
        // Basic organization profile
        id: this.generateId(),
        name: organization.name || '',
        displayName: organization.displayName || organization.name || '',
        type: organization.type || 'corporation',
        industry: organization.industry || '',
        subIndustry: organization.subIndustry,
        size: organization.size || 'small',
        foundedYear: organization.foundedYear,
        
        // Additional properties
        description: organization.description || '',
        website: organization.website || '',
        contactEmail: organization.contactEmail || '',
        
        // Organization profile properties
        headquarters: {
          country: 'US',
          timezone: 'UTC'
        },
        
        verification: {
          verified: false,
          documents: [],
          trustScore: 0,
          riskLevel: 'medium' as const
        },
        
        branding: {
          primaryColor: '#1976d2',
          secondaryColor: '#424242',
          whiteLabel: false
        },
        
        compliance: {
          certifications: [],
          regulations: [],
          auditSchedule: 'annually',
          gdprCompliant: false,
          hipaaCompliant: false,
          soc2Compliant: false,
          auditingEnabled: false
        },
        
        integrations: {
          sso: false,
          ldap: false,
          apis: [],
          webhooks: [],
          thirdPartyConnections: []
        },
        
        subscription: {
          plan: 'free' as const,
          status: 'active' as const,
          billingCycle: 'monthly' as const,
          startDate: Date.now(),
          autoRenewal: false,
          limits: {
            trustBoards: 1,
            records: 1000,
            verifications: 100,
            apiCalls: 1000,
            storage: 1,
            users: 5,
            widgets: 0,
            customBranding: false,
            prioritySupport: false,
            slaGuarantee: false
          },
          features: {
            advancedAnalytics: false,
            crossVerification: false,
            aiAssistance: false,
            customWorkflows: false,
            enterpriseIntegrations: false,
            whiteLabel: false,
            dedicatedSupport: false,
            customDomains: false,
            apiAccess: false,
            webhooks: false,
            bulkOperations: false,
            dataExport: false,
            auditLogs: false,
            complianceReporting: false
          },
          billing: {
            currency: 'USD',
            paymentMethod: 'credit_card' as const,
            billingAddress: {
              street: '',
              city: '',
              postalCode: '',
              country: 'US'
            },
            invoiceEmail: organization.contactEmail || '',
            billingContact: {
              name: '',
              email: organization.contactEmail || '',
              role: 'Owner'
            },
            autoPayment: false,
            currentBalance: 0
          },
          usage: {
            currentPeriod: {
              start: Date.now(),
              end: Date.now() + 30 * 24 * 60 * 60 * 1000,
              trustBoards: 0,
              records: 0,
              verifications: 0,
              apiCalls: 0,
              storage: 0,
              activeUsers: 1,
              widgets: 0,
              dataTransfer: 0
            },
            previousPeriod: {
              start: Date.now() - 30 * 24 * 60 * 60 * 1000,
              end: Date.now(),
              trustBoards: 0,
              records: 0,
              verifications: 0,
              apiCalls: 0,
              storage: 0,
              activeUsers: 0,
              widgets: 0,
              dataTransfer: 0
            },
            yearToDate: {
              start: Date.now(),
              end: Date.now() + 365 * 24 * 60 * 60 * 1000,
              trustBoards: 0,
              records: 0,
              verifications: 0,
              apiCalls: 0,
              storage: 0,
              activeUsers: 1,
              widgets: 0,
              dataTransfer: 0
            },
            overages: {},
            alerts: []
          }
        },
        
        settings: {
          general: {
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            language: 'en',
            currency: 'USD',
            theme: 'light' as const
          },
          security: {
            twoFactorRequired: false,
            passwordPolicy: {
              minLength: 8,
              requireUppercase: true,
              requireLowercase: true,
              requireNumbers: true,
              requireSymbols: false,
              maxAge: 90,
              preventReuse: 5
            },
            sessionTimeout: 30,
            ipWhitelist: [],
            ssoEnabled: false,
            auditLogging: true
          },
          notifications: {
            email: { 
              enabled: true, 
              events: ['security', 'billing'],
              frequency: 'immediate',
              quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' }
            },
            sms: { 
              enabled: false, 
              events: [],
              frequency: 'immediate',
              quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' }
            },
            webhook: { 
              enabled: false, 
              events: [],
              frequency: 'immediate',
              quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' }
            },
            inApp: { 
              enabled: true, 
              events: ['all'],
              frequency: 'immediate',
              quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' }
            }
          },
          privacy: {
            dataRetention: 365,
            anonymization: false,
            gdprCompliance: true,
            ccpaCompliance: false,
            dataProcessingAgreement: false
          },
          api: {
            enabled: false,
            rateLimit: 1000,
            keyRotation: false,
            webhooksEnabled: false,
            ipWhitelist: []
          },
          collaboration: {
            allowGuestUsers: false,
            defaultUserRole: 'viewer',
            approvalRequired: true,
            maxConcurrentUsers: 10
          }
        },
        
        metadata: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
        
        // Organization extensions
        members: [],
        stats: {
          overview: {
            totalMembers: 1,
            activeMembers: 1,
            totalTrustBoards: 0,
            totalRecords: 0,
            totalVerifications: 0,
            monthlyGrowth: 0
          },
          activity: {
            verificationsToday: 0,
            verificationsThisWeek: 0,
            verificationsThisMonth: 0,
            averageResponseTime: 0,
            successRate: 100
          },
          usage: {
            storageUsed: 0,
            storageLimit: 1000,
            apiCallsUsed: 0,
            apiCallsLimit: 1000,
            bandwidthUsed: 0,
            bandwidthLimit: 10000
          },
          billing: {
            currentPlan: 'free',
            monthlySpend: 0,
            yearlySpend: 0,
            nextBillingDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
            paymentStatus: 'current' as const
          }
        },
        status: 'active' as const
      };

      return {
        success: true,
        data: newOrg,
        timestamp: Date.now(),
        requestId: this.generateRequestId()
      };
    } catch (error) {
      return this.handleError('Failed to create organization', error);
    }
  }

  async getOrganization(organizationId: string): Promise<ApiResponse<Organization>> {
    try {
      // In production, this would fetch from backend
      const organization = await this.fetchOrganization(organizationId);
      
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      return {
        success: true,
        data: organization,
        timestamp: Date.now(),
        requestId: this.generateRequestId()
      };
    } catch (error) {
      return this.handleError('Failed to get organization', error);
    }
  }

  async updateOrganization(organizationId: string, updates: Partial<Organization>): Promise<ApiResponse<Organization>> {
    try {
      const existing = await this.fetchOrganization(organizationId);
      if (!existing) {
        return {
          success: false,
          error: 'Organization not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      const updated: Organization = {
        ...existing,
        ...updates,
        id: organizationId, // Ensure ID doesn't change
        updatedAt: Date.now()
      };

      await this.saveOrganization(updated);
      await this.logActivity(organizationId, 'organization_updated', 'system', updates);

      return {
        success: true,
        data: updated,
        timestamp: Date.now(),
        requestId: this.generateRequestId()
      };
    } catch (error) {
      return this.handleError('Failed to update organization', error);
    }
  }

  async deleteOrganization(organizationId: string): Promise<ApiResponse<boolean>> {
    try {
      // Get organization first
      const organization = await this.fetchOrganization(organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      // Archive organization (soft delete)
      await this.updateOrganization(organizationId, { 
        status: 'archived',
        updatedAt: Date.now()
      });

      await this.logActivity(organizationId, 'organization_deleted', 'system', {});

      return {
        success: true,
        data: true,
        timestamp: Date.now(),
        requestId: this.generateRequestId()
      };
    } catch (error) {
      return this.handleError('Failed to delete organization', error);
    }
  }

  // ==========================================
  // MEMBER MANAGEMENT
  // ==========================================

  async inviteMember(
    organizationId: string, 
    invitation: Omit<MemberInvitation, 'id' | 'createdAt' | 'status'>
  ): Promise<ApiResponse<MemberInvitation>> {
    try {
      const organization = await this.fetchOrganization(organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      // Check member limits
      if (!organization.members) {
        organization.members = [];
      }
      if (organization.members.length >= (organization.subscription.limits.maxMembers || 10)) {
        return {
          success: false,
          error: 'Member limit reached for current subscription',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      // Check if already a member
      const existingMember = organization.members.find((m: OrganizationMember) => m.profile.email === invitation.email);
      if (existingMember) {
        return {
          success: false,
          error: 'User is already a member',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      const newInvitation: MemberInvitation = {
        id: this.generateId(),
        organizationId,
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        accessLevel: invitation.accessLevel,
        permissions: [], // Will be set based on role when accepted
        invitedBy: invitation.invitedBy,
        invitedAt: Date.now(),
        message: invitation.message,
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: Date.now(),
        status: 'pending'
      };

      // Save invitation (simulate)
      await this.saveInvitation(newInvitation);

      // Send invitation email (simulate)
      await this.sendInvitationEmail(newInvitation);

      await this.logActivity(organizationId, 'member_invited', invitation.invitedBy, {
        email: invitation.email,
        role: invitation.role
      });

      return {
        success: true,
        data: newInvitation,
        timestamp: Date.now(),
        requestId: this.generateRequestId()
      };
    } catch (error) {
      return this.handleError('Failed to invite member', error);
    }
  }

  async acceptInvitation(invitationId: string, userId: string): Promise<ApiResponse<OrganizationMember>> {
    try {
      const invitation = await this.fetchInvitation(invitationId);
      if (!invitation) {
        return {
          success: false,
          error: 'Invitation not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      if (invitation.status !== 'pending') {
        return {
          success: false,
          error: 'Invitation is no longer valid',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      if (invitation.expiresAt < Date.now()) {
        return {
          success: false,
          error: 'Invitation has expired',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      // Create new member
      const newMember: OrganizationMember = {
        id: this.generateId(),
        userId,
        organizationId: invitation.organizationId,
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        accessLevel: invitation.accessLevel,
        permissions: this.convertToTrustBoardPermissions(invitation.role),
        status: 'active',
        joinedAt: Date.now(),
        profile: {
          name: invitation.name || invitation.email,
          email: invitation.email,
          avatar: undefined,
          title: undefined,
          department: undefined,
          bio: undefined
        },
        settings: {
          notifications: true,
          emailAlerts: true,
          accessHours: undefined,
          ipWhitelist: []
        }
      };

      // Add member to organization
      const organization = await this.fetchOrganization(invitation.organizationId);
      if (organization) {
        if (!organization.members) organization.members = [];
        if (!organization.stats) organization.stats = {} as any;
        
        organization.members.push(newMember);
        if (organization.stats?.overview) {
          organization.stats.overview.totalMembers = organization.members.length;
        }
        // Also set direct access property for backward compatibility
        if (organization.stats) {
          organization.stats.totalMembers = organization.members.length;
        }
        organization.updatedAt = Date.now();
        await this.saveOrganization(organization);
      }

      // Update invitation status
      invitation.status = 'accepted';
      await this.saveInvitation(invitation);

      await this.logActivity(invitation.organizationId, 'member_joined', userId, {
        email: invitation.email,
        role: invitation.role
      });

      return {
        success: true,
        data: newMember,
        timestamp: Date.now(),
        requestId: this.generateRequestId()
      };
    } catch (error) {
      return this.handleError('Failed to accept invitation', error);
    }
  }

  async updateMember(
    organizationId: string, 
    userId: string, 
    updates: Partial<OrganizationMember>
  ): Promise<ApiResponse<OrganizationMember>> {
    try {
      const organization = await this.fetchOrganization(organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      if (!organization.members) {
        return {
          success: false,
          error: 'No members found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      const memberIndex = organization.members.findIndex(m => m.userId === userId);
      if (memberIndex === -1) {
        return {
          success: false,
          error: 'Member not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      // Update member
      const updatedMember = {
        ...organization.members[memberIndex],
        ...updates,
        userId, // Ensure userId doesn't change
        permissions: updates.role ? this.convertToTrustBoardPermissions(updates.role) : organization.members![memberIndex].permissions
      };

      organization.members[memberIndex] = updatedMember;
      organization.updatedAt = Date.now();
      await this.saveOrganization(organization);

      await this.logActivity(organizationId, 'member_updated', 'system', {
        userId,
        updates
      });

      return {
        success: true,
        data: updatedMember,
        timestamp: Date.now(),
        requestId: this.generateRequestId()
      };
    } catch (error) {
      return this.handleError('Failed to update member', error);
    }
  }

  async removeMember(organizationId: string, userId: string): Promise<ApiResponse<boolean>> {
    try {
      const organization = await this.fetchOrganization(organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      if (!organization.members) {
        return {
          success: false,
          error: 'No members found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      const memberIndex = organization.members.findIndex(m => m.userId === userId);
      if (memberIndex === -1) {
        return {
          success: false,
          error: 'Member not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      // Don't allow removing the last owner
      const owners = organization.members.filter((m: OrganizationMember) => m.role === 'owner');
      if (owners.length === 1 && organization.members[memberIndex].role === 'owner') {
        return {
          success: false,
          error: 'Cannot remove the last owner',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      // Remove member
      const removedMember = organization.members[memberIndex];
      organization.members.splice(memberIndex, 1);
      
      if (!organization.stats) organization.stats = {} as any;
      if (organization.stats?.overview) {
        organization.stats.overview.totalMembers = organization.members.length;
      }
      if (organization.stats) {
        organization.stats.totalMembers = organization.members.length;
      }
      
      organization.updatedAt = Date.now();
      await this.saveOrganization(organization);

      await this.logActivity(organizationId, 'member_removed', 'system', {
        userId,
        email: removedMember.email || removedMember.profile?.email,
        role: removedMember.role
      });

      return {
        success: true,
        data: true,
        timestamp: Date.now(),
        requestId: this.generateRequestId()
      };
    } catch (error) {
      return this.handleError('Failed to remove member', error);
    }
  }

  // ==========================================
  // ANALYTICS AND INSIGHTS
  // ==========================================

  async getOrganizationStats(organizationId: string): Promise<ApiResponse<OrganizationStats & {
    insights: {
      memberGrowth: number[];
      verificationTrends: number[];
      popularTrustBoards: { name: string; verifications: number }[];
      recentActivity: { action: string; timestamp: number; user: string }[];
    }
  }>> {
    try {
      const organization = await this.fetchOrganization(organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      // Get TrustBoards for this organization
      const trustBoardsResult = await this.universalService.listTrustBoards(organizationId);
      const trustBoards = trustBoardsResult.success ? trustBoardsResult.data?.items || [] : [];

      // Calculate enhanced stats
      const totalRecords = trustBoards.reduce((sum, board) => sum + (board.recordCount || 0), 0);
      const totalVerifications = trustBoards.reduce((sum, board) => sum + (board.verificationCount || 0), 0);

      // Generate insights (mock data for demo)
      const insights = {
        memberGrowth: this.generateMemberGrowthData(organization.createdAt),
        verificationTrends: this.generateVerificationTrends(),
        popularTrustBoards: trustBoards
          .map(board => ({
            name: board.name,
            verifications: board.verificationCount || 0
          }))
          .sort((a, b) => b.verifications - a.verifications)
          .slice(0, 5),
        recentActivity: await this.getRecentActivity(organizationId)
      };

      const enhancedStats = {
        ...organization.stats,
        totalTrustBoards: trustBoards.length,
        totalRecords,
        totalVerifications,
        overview: {
          totalMembers: organization.members?.length || 0,
          activeMembers: organization.members?.filter(m => m.status === 'active').length || 0,
          totalTrustBoards: trustBoards.length,
          totalRecords,
          totalVerifications,
          monthlyGrowth: 12.5 // Mock data
        },
        activity: {
          verificationsToday: Math.floor(totalVerifications * 0.05),
          verificationsThisWeek: Math.floor(totalVerifications * 0.2),
          verificationsThisMonth: Math.floor(totalVerifications * 0.6),
          averageResponseTime: 1200, // milliseconds
          successRate: 95.5 // percentage
        },
        usage: {
          storageUsed: Math.floor(totalRecords * 0.5), // MB
          storageLimit: 10000, // MB
          apiCallsUsed: Math.floor(totalVerifications * 1.2),
          apiCallsLimit: 10000,
          bandwidthUsed: Math.floor(totalRecords * 0.1), // GB
          bandwidthLimit: 100 // GB
        },
        billing: organization.stats?.billing || {
          currentPlan: 'free',
          monthlySpend: 0,
          yearlySpend: 0,
          nextBillingDate: Date.now() + (30 * 24 * 60 * 60 * 1000),
          paymentStatus: 'current' as const
        },
        insights
      };

      return {
        success: true,
        data: enhancedStats,
        timestamp: Date.now(),
        requestId: this.generateRequestId()
      };
    } catch (error) {
      return this.handleError('Failed to get organization stats', error);
    }
  }

  // ==========================================
  // TEMPLATE AND CONFIGURATION MANAGEMENT
  // ==========================================

  async getOrganizationTemplates(organizationId: string): Promise<ApiResponse<OrganizationTemplate[]>> {
    try {
      // Fetch industry-specific templates
      const organization = await this.fetchOrganization(organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      const templates = this.getTemplatesForIndustry(organization.industry);

      return {
        success: true,
        data: templates,
        timestamp: Date.now(),
        requestId: this.generateRequestId()
      };
    } catch (error) {
      return this.handleError('Failed to get templates', error);
    }
  }

  async applyTemplate(organizationId: string, templateId: string): Promise<ApiResponse<boolean>> {
    try {
      const organization = await this.fetchOrganization(organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      const template = this.getTemplateById(templateId);
      if (!template) {
        return {
          success: false,
          error: 'Template not found',
          timestamp: Date.now(),
          requestId: this.generateRequestId()
        };
      }

      // Apply template configurations
      const updatedSettings = {
        ...organization.settings,
        ...template.defaultSettings
      };

      await this.updateOrganization(organizationId, { settings: updatedSettings });

      // Create default TrustBoards from template
      if (template.trustBoardTemplates) {
        for (const boardTemplate of template.trustBoardTemplates) {
          await this.universalService.createTrustBoard({
            organizationId,
            name: boardTemplate.name,
            description: boardTemplate.description,
            fields: boardTemplate.schema || [],
            category: 'other' as const,
            verificationRules: [],
            permissions: [],
            isActive: true
          });
        }
      }

      await this.logActivity(organizationId, 'template_applied', 'system', {
        templateId,
        templateName: template.name
      });

      return {
        success: true,
        data: true,
        timestamp: Date.now(),
        requestId: this.generateRequestId()
      };
    } catch (error) {
      return this.handleError('Failed to apply template', error);
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  private getRolePermissions(role: TeamRole): string[] {
    const permissions = {
      owner: [
        'manage_organization',
        'manage_members',
        'manage_trustboards',
        'manage_billing',
        'view_analytics',
        'manage_compliance',
        'export_data'
      ],
      admin: [
        'manage_members',
        'manage_trustboards',
        'view_analytics',
        'manage_compliance'
      ],
      manager: [
        'manage_trustboards',
        'view_analytics',
        'add_records',
        'verify_records'
      ],
      editor: [
        'add_records',
        'edit_records',
        'verify_records'
      ],
      viewer: [
        'view_records',
        'view_analytics'
      ]
    };

    return permissions[role as keyof typeof permissions] || permissions.viewer;
  }

  private convertToTrustBoardPermissions(role: TeamRole): TrustBoardPermission[] {
    // For now, return empty array as permissions are organization-level
    // In a real implementation, this would map to specific TrustBoard permissions
    return [];
  }

  private getTemplatesForIndustry(industry: string): OrganizationTemplate[] {
    // Industry-specific templates
    const baseTemplates: OrganizationTemplate[] = [
      {
        id: 'education_basic',
        name: 'Education - Basic Setup',
        description: 'Basic academic credential verification',
        industry: 'education',
        category: 'university' as const,
        features: ['trustBoards', 'crossVerification', 'analytics'],
        trustBoards: [],
        settings: {},
        workflows: [],
        integrations: ['lms', 'sis'],
        usageCount: 0,
        rating: 4.5,
        isPremium: false,
        createdBy: 'system',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        defaultSettings: {
          privacy: {
            dataRetention: 365,
            anonymization: false,
            gdprCompliance: true,
            ccpaCompliance: false,
            dataProcessingAgreement: true
          },
          general: {
            timezone: 'UTC',
            dateFormat: 'YYYY-MM-DD',
            language: 'en',
            currency: 'USD',
            theme: 'light' as const
          },
          security: {
            twoFactorRequired: false,
            passwordPolicy: {
              minLength: 8,
              requireUppercase: true,
              requireLowercase: true,
              requireNumbers: true,
              requireSymbols: false,
              maxAge: 90,
              preventReuse: 5
            },
            sessionTimeout: 30,
            ipWhitelist: [],
            ssoEnabled: false,
            auditLogging: true
          },
          notifications: {
            email: {
              enabled: true,
              events: ['security', 'updates'],
              frequency: 'immediate' as const,
              quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' }
            },
            sms: {
              enabled: false,
              events: [],
              frequency: 'immediate' as const,
              quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' }
            },
            webhook: {
              enabled: false,
              events: [],
              frequency: 'immediate' as const,
              quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' }
            },
            inApp: {
              enabled: true,
              events: ['all'],
              frequency: 'immediate' as const,
              quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' }
            }
          },
          api: {
            enabled: true,
            rateLimit: 1000,
            keyRotation: true,
            webhooksEnabled: false,
            ipWhitelist: []
          },
          allowPublicVerification: true,
          requireMemberApproval: false,
          dataRetention: 365,
          maxMembers: 50,
          features: ['trustBoards', 'crossVerification', 'analytics']
        },
        trustBoardTemplates: [
          {
            name: 'Student Records',
            description: 'Academic transcripts and credentials',
            schema: {
              fields: [
                { name: 'student_id', type: 'text', required: true },
                { name: 'student_name', type: 'text', required: true },
                { name: 'degree', type: 'select', required: true, options: ['Bachelor', 'Master', 'PhD'] },
                { name: 'gpa', type: 'number', required: false },
                { name: 'graduation_date', type: 'date', required: true }
              ]
            },
            settings: {
              allowPublicVerification: true,
              requireApproval: true,
              expirationEnabled: false
            }
          }
        ]
      },
      {
        id: 'business_hr',
        name: 'Business - HR Records',
        description: 'Employee verification and HR management',
        industry: 'business',
        category: 'corporation' as const,
        features: ['trustBoards', 'analytics', 'apiAccess', 'customBranding', 'ssoIntegration'],
        trustBoards: [],
        settings: {},
        workflows: [],
        integrations: ['hris', 'ats', 'sso'],
        usageCount: 0,
        rating: 4.2,
        isPremium: true,
        createdBy: 'system',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        defaultSettings: {
          privacy: {
            dataRetention: 2555, // 7 years
            anonymization: true,
            gdprCompliance: true,
            ccpaCompliance: true,
            dataProcessingAgreement: true
          },
          general: {
            timezone: 'UTC',
            dateFormat: 'YYYY-MM-DD',
            language: 'en',
            currency: 'USD',
            theme: 'light' as const
          },
          security: {
            twoFactorRequired: true,
            passwordPolicy: {
              minLength: 12,
              requireUppercase: true,
              requireLowercase: true,
              requireNumbers: true,
              requireSymbols: true,
              maxAge: 60,
              preventReuse: 10
            },
            sessionTimeout: 15,
            ipWhitelist: [],
            ssoEnabled: true,
            auditLogging: true
          },
          notifications: {
            email: {
              enabled: true,
              events: ['security', 'compliance'],
              frequency: 'immediate' as const,
              quietHours: { enabled: true, start: '18:00', end: '08:00', timezone: 'UTC' }
            },
            sms: {
              enabled: false,
              events: [],
              frequency: 'immediate' as const,
              quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' }
            },
            webhook: {
              enabled: true,
              events: ['verification', 'updates'],
              frequency: 'immediate' as const,
              quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' }
            },
            inApp: {
              enabled: true,
              events: ['all'],
              frequency: 'immediate' as const,
              quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' }
            }
          },
          api: {
            enabled: true,
            rateLimit: 500,
            keyRotation: true,
            webhooksEnabled: true,
            ipWhitelist: []
          },
          allowPublicVerification: false,
          requireMemberApproval: true,
          dataRetention: 2555,
          maxMembers: 100,
          features: ['trustBoards', 'analytics', 'apiAccess', 'customBranding', 'ssoIntegration']
        },
        trustBoardTemplates: [
          {
            name: 'Employment Records',
            description: 'Employee verification and history',
            schema: {
              fields: [
                { name: 'employee_id', type: 'text', required: true },
                { name: 'full_name', type: 'text', required: true },
                { name: 'position', type: 'text', required: true },
                { name: 'start_date', type: 'date', required: true },
                { name: 'end_date', type: 'date', required: false },
                { name: 'salary', type: 'number', required: false }
              ]
            },
            settings: {
              allowPublicVerification: false,
              requireApproval: true,
              expirationEnabled: true
            }
          }
        ]
      }
    ];

    return baseTemplates.filter(template => 
      template.industry === industry || template.industry === 'general'
    );
  }

  private getTemplateById(templateId: string): OrganizationTemplate | null {
    const allTemplates = [
      ...this.getTemplatesForIndustry('education'),
      ...this.getTemplatesForIndustry('business'),
      ...this.getTemplatesForIndustry('healthcare'),
      ...this.getTemplatesForIndustry('finance')
    ];

    return allTemplates.find(template => template.id === templateId) || null;
  }

  private generateMemberGrowthData(createdAt: number): number[] {
    // Generate 12 months of member growth data
    const data = [];
    const startDate = new Date(createdAt);
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(startDate);
      month.setMonth(month.getMonth() + i);
      
      if (month <= now) {
        data.push(Math.floor(Math.random() * 10) + i);
      } else {
        data.push(0);
      }
    }
    
    return data;
  }

  private generateVerificationTrends(): number[] {
    // Generate 30 days of verification trends
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push(Math.floor(Math.random() * 50) + 10);
    }
    return data;
  }

  private async getRecentActivity(organizationId: string): Promise<{ action: string; timestamp: number; user: string }[]> {
    // In production, this would fetch from audit logs
    return [
      { action: 'Member invited', timestamp: Date.now() - 3600000, user: 'Admin' },
      { action: 'TrustBoard created', timestamp: Date.now() - 7200000, user: 'Manager' },
      { action: 'Records verified', timestamp: Date.now() - 10800000, user: 'Editor' },
      { action: 'Settings updated', timestamp: Date.now() - 14400000, user: 'Owner' }
    ];
  }

  private async saveOrganization(organization: Organization): Promise<void> {
    // In production, save to backend/database
    console.log('Saving organization:', organization.id);
  }

  private async fetchOrganization(organizationId: string): Promise<Organization | null> {
    // In production, fetch from backend/database
    // For demo, return mock data
    return null;
  }

  private async saveInvitation(invitation: MemberInvitation): Promise<void> {
    // In production, save to backend/database
    console.log('Saving invitation:', invitation.id);
  }

  private async fetchInvitation(invitationId: string): Promise<MemberInvitation | null> {
    // In production, fetch from backend/database
    return null;
  }

  private async sendInvitationEmail(invitation: MemberInvitation): Promise<void> {
    // In production, send actual email
    console.log('Sending invitation email to:', invitation.email);
  }

  private async logActivity(
    organizationId: string, 
    action: string, 
    userId: string, 
    details: any
  ): Promise<void> {
    // In production, save to audit log
    console.log('Logging activity:', { organizationId, action, userId, details });
  }

  private generateId(): string {
    return `org_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private handleError(message: string, error: any): ApiResponse<any> {
    console.error(message, error);
    return {
      success: false,
      error: `${message}: ${error.message || error}`,
      timestamp: Date.now(),
      requestId: this.generateRequestId()
    };
  }
}
