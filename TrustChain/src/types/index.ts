// TypeScript interfaces for TrustChain application
// These mirror the Motoko types in the backend

export interface Credential {
  id: string;
  studentId: string;
  institution: string;
  credentialType: 'transcript' | 'certificate' | 'badge';
  title: string;
  issueDate: number; // Unix timestamp
  verificationHash: string;
  metadata: string; // JSON string with additional data
}

export interface VerificationResult {
  isValid: boolean;
  credential?: Credential;
  message: string;
}

export interface CredentialMetadata {
  gpa?: number;
  courses?: string[];
  honors?: string[];
  skillsVerified?: string[];
  issuerContact?: string;
  additionalNotes?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  institution: string;
  credentials: Credential[];
}

export interface InstitutionProfile {
  id: string;
  name: string;
  contact: string;
  isAuthorized: boolean;
  credentialsIssued: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form types for credential issuance
export interface IssueCredentialRequest {
  studentId: string;
  credentialType: 'transcript' | 'certificate' | 'badge';
  title: string;
  metadata: CredentialMetadata;
}

// Navigation and UI types
export interface NavItem {
  label: string;
  path: string;
  icon?: React.ComponentType;
}

export interface NotificationProps {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  open: boolean;
  onClose: () => void;
}
