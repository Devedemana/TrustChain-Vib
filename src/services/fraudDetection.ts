import { FraudDetectionResult, FraudFlag, AdvancedCredential, InstitutionMetrics, DigitalSignature } from '../types/advanced';

export class AIFraudDetectionService {
  private static instance: AIFraudDetectionService;
  private readonly API_ENDPOINT = process.env.REACT_APP_AI_API_ENDPOINT || 'http://localhost:8080/ai';
  
  public static getInstance(): AIFraudDetectionService {
    if (!AIFraudDetectionService.instance) {
      AIFraudDetectionService.instance = new AIFraudDetectionService();
    }
    return AIFraudDetectionService.instance;
  }

  /**
   * Analyze credential for potential fraud using AI/ML models
   */
  public async analyzeCredential(credential: AdvancedCredential): Promise<FraudDetectionResult> {
    try {
      const features = this.extractFeatures(credential);
      
      // In a real implementation, this would call your AI service
      // For now, we'll implement sophisticated rule-based detection
      const flags = await this.runFraudChecks(credential, features);
      const riskScore = this.calculateRiskScore(flags);
      
      return {
        riskScore,
        riskLevel: this.getRiskLevel(riskScore),
        flags,
        confidence: this.calculateConfidence(flags),
        recommendations: this.generateRecommendations(flags)
      };
    } catch (error) {
      console.error('Fraud detection error:', error);
      return {
        riskScore: 50,
        riskLevel: 'medium',
        flags: [{
          type: 'anomalous_pattern',
          description: 'Unable to complete fraud analysis',
          severity: 'warning'
        }],
        confidence: 0.1,
        recommendations: ['Manual review required']
      };
    }
  }

  /**
   * Extract features for ML analysis
   */
  private extractFeatures(credential: AdvancedCredential) {
    const currentTime = Date.now();
    const issueTime = credential.issueDate;
    
    return {
      // Temporal features
      timeSinceIssue: currentTime - issueTime,
      issueHour: new Date(issueTime).getHours(),
      isWeekend: [0, 6].includes(new Date(issueTime).getDay()),
      
      // Text features
      titleLength: credential.title.length,
      metadataComplexity: this.calculateTextComplexity(credential.metadata),
      institutionLength: credential.institution.length,
      
      // Behavioral features
      hasSignature: !!credential.digitalSignature,
      hasMultisig: !!credential.multisigApprovals?.length,
      hasExpiration: !!credential.expirationDate,
      skillCount: credential.skillsVerified?.length || 0,
      endorsementCount: credential.endorsements?.length || 0,
      
      // Pattern features
      credentialTypeFrequency: this.getCredentialTypeFrequency(credential.credentialType),
      institutionReputation: this.getInstitutionReputation(credential.institution),
    };
  }

  /**
   * Run comprehensive fraud checks
   */
  private async runFraudChecks(credential: AdvancedCredential, features: any): Promise<FraudFlag[]> {
    const flags: FraudFlag[] = [];

    // Check 1: Duplicate detection
    if (await this.isDuplicate(credential)) {
      flags.push({
        type: 'duplicate',
        description: 'Similar credential already exists',
        severity: 'error'
      });
    }

    // Check 2: Suspicious timing
    if (this.isSuspiciousTiming(features)) {
      flags.push({
        type: 'suspicious_timing',
        description: 'Credential issued at unusual time',
        severity: 'warning'
      });
    }

    // Check 3: Invalid signature
    if (credential.digitalSignature && !await this.verifySignature(credential.digitalSignature)) {
      flags.push({
        type: 'invalid_signature',
        description: 'Digital signature verification failed',
        severity: 'critical'
      });
    }

    // Check 4: Anomalous patterns
    const anomalyScore = this.detectAnomalies(features);
    if (anomalyScore > 0.7) {
      flags.push({
        type: 'anomalous_pattern',
        description: `Unusual pattern detected (score: ${anomalyScore.toFixed(2)})`,
        severity: anomalyScore > 0.9 ? 'critical' : 'warning',
        metadata: { anomalyScore, features: Object.keys(features) }
      });
    }

    return flags;
  }

  private calculateTextComplexity(text: string): number {
    if (!text) return 0;
    
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
    const avgWordLength = words > 0 ? text.replace(/\s/g, '').length / words : 0;
    
    return (sentences * 0.1) + (uniqueWords / words) + (avgWordLength * 0.1);
  }

  private getCredentialTypeFrequency(type: string): number {
    // In real implementation, this would query the database
    const commonTypes = ['certificate', 'diploma', 'badge', 'transcript'];
    return commonTypes.includes(type.toLowerCase()) ? 0.8 : 0.2;
  }

  private getInstitutionReputation(institution: string): number {
    // Simplified reputation scoring
    const prestigiousInstitutions = [
      'MIT', 'Stanford', 'Harvard', 'Oxford', 'Cambridge', 'Caltech',
      'Princeton', 'Yale', 'Columbia', 'Chicago', 'NYU', 'Berkeley'
    ];
    
    const isPrestigious = prestigiousInstitutions.some(pi => 
      institution.toLowerCase().includes(pi.toLowerCase())
    );
    
    return isPrestigious ? 0.9 : 0.5;
  }

  private async isDuplicate(credential: AdvancedCredential): Promise<boolean> {
    // Simple duplicate detection based on hash
    const hash = await this.generateCredentialHash(credential);
    
    // In real implementation, this would check against stored hashes
    return Math.random() < 0.05; // 5% chance of duplicate for demo
  }

  private isSuspiciousTiming(features: any): boolean {
    // Flag if issued during non-business hours consistently
    return features.issueHour < 6 || features.issueHour > 22;
  }

  private async verifySignature(signature: DigitalSignature): Promise<boolean> {
    // Simplified signature verification
    // In production, use proper cryptographic libraries
    return signature.signature.length > 10 && signature.publicKey.length > 10;
  }

  private detectAnomalies(features: any): number {
    let anomalyScore = 0;
    
    // Check for unusual combinations
    if (features.titleLength < 5 || features.titleLength > 100) {
      anomalyScore += 0.3;
    }
    
    if (features.metadataComplexity < 0.1) {
      anomalyScore += 0.2;
    }
    
    if (features.institutionReputation < 0.3) {
      anomalyScore += 0.4;
    }
    
    if (features.timeSinceIssue < 60000) { // Less than 1 minute ago
      anomalyScore += 0.3;
    }
    
    return Math.min(anomalyScore, 1.0);
  }

  private calculateRiskScore(flags: FraudFlag[]): number {
    const weights = {
      duplicate: 40,
      suspicious_timing: 15,
      invalid_signature: 35,
      anomalous_pattern: 25
    };
    
    const severityMultipliers = {
      info: 0.5,
      warning: 1.0,
      error: 1.5,
      critical: 2.0
    };
    
    let totalScore = 0;
    flags.forEach(flag => {
      const baseWeight = weights[flag.type] || 10;
      const multiplier = severityMultipliers[flag.severity] || 1;
      totalScore += baseWeight * multiplier;
    });
    
    return Math.min(totalScore, 100);
  }

  private getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  private calculateConfidence(flags: FraudFlag[]): number {
    const flagCount = flags.length;
    const criticalFlags = flags.filter(f => f.severity === 'critical').length;
    const errorFlags = flags.filter(f => f.severity === 'error').length;
    
    let confidence = 0.5; // Base confidence
    confidence += flagCount * 0.1;
    confidence += criticalFlags * 0.3;
    confidence += errorFlags * 0.2;
    
    return Math.min(confidence, 1.0);
  }

  private generateRecommendations(flags: FraudFlag[]): string[] {
    const recommendations: string[] = [];
    
    if (flags.some(f => f.type === 'duplicate')) {
      recommendations.push('Review for potential duplicate credentials');
      recommendations.push('Contact institution for verification');
    }
    
    if (flags.some(f => f.type === 'invalid_signature')) {
      recommendations.push('Request re-signing of credential');
      recommendations.push('Verify institution identity');
    }
    
    if (flags.some(f => f.severity === 'critical')) {
      recommendations.push('Manual review required immediately');
      recommendations.push('Consider suspending credential');
    }
    
    if (flags.some(f => f.type === 'anomalous_pattern')) {
      recommendations.push('Additional verification steps recommended');
      recommendations.push('Monitor for similar patterns');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Credential appears legitimate');
    }
    
    return recommendations;
  }

  private async generateCredentialHash(credential: AdvancedCredential): Promise<string> {
    const data = `${credential.studentId}-${credential.institution}-${credential.title}-${credential.issueDate}`;
    
    // Simple hash for demo - use proper crypto in production
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `hash_${Math.abs(hash)}`;
  }

  /**
   * Analyze institution metrics for anomalies
   */
  public async analyzeInstitutionMetrics(metrics: InstitutionMetrics): Promise<FraudDetectionResult> {
    const flags: FraudFlag[] = [];
    
    // Check for unusual issuance patterns
    if (metrics.credentialsIssued > 1000 && metrics.verificationRequests < 10) {
      flags.push({
        type: 'anomalous_pattern',
        description: 'High credential issuance with low verification requests',
        severity: 'warning'
      });
    }
    
    // Check fraud attempts ratio
    if (metrics.fraudAttempts > 0 && metrics.fraudAttempts / metrics.credentialsIssued > 0.1) {
      flags.push({
        type: 'anomalous_pattern',
        description: 'High fraud attempt ratio',
        severity: 'error'
      });
    }
    
    const riskScore = this.calculateRiskScore(flags);
    
    return {
      riskScore,
      riskLevel: this.getRiskLevel(riskScore),
      flags,
      confidence: this.calculateConfidence(flags),
      recommendations: this.generateRecommendations(flags)
    };
  }
}

// Singleton export
export const fraudDetectionService = AIFraudDetectionService.getInstance();
