// Global test setup for TrustChain backend tests

// Setup test environment
console.log('Setting up TrustChain test environment...');

// Mock data for testing
export const mockCredentials = [
  {
    studentName: 'John Doe',
    institution: 'MIT',
    degree: 'Computer Science',
    date: '2024-01-15',
    credentialId: 'mock-credential-1'
  },
  {
    studentName: 'Jane Smith',
    institution: 'Stanford',
    degree: 'Engineering',
    date: '2024-02-20',
    credentialId: 'mock-credential-2'
  }
];

// Test utilities
export const createMockCredential = (overrides: Partial<any> = {}) => ({
  studentName: 'Test Student',
  institution: 'Test University',
  degree: 'Test Degree',
  date: '2024-01-01',
  credentialId: 'test-credential',
  ...overrides
});

console.log('TrustChain test environment ready');
