import { mockTrustChainService } from './mockData';

describe('mockTrustChainService', () => {
  it('returns credentials for a known student', async () => {
    const response = await mockTrustChainService.getStudentCredentials('student_123');
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data[0].studentId).toBe('student_123');
  });

  it('returns empty array for unknown student', async () => {
    const response = await mockTrustChainService.getStudentCredentials('unknown_student');
    expect(response.success).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBe(0);
  });

  it('verifies a valid credential', async () => {
    const response = await mockTrustChainService.verifyCredential('cred_001');
    expect(response.success).toBe(true);
    expect(response.data.isValid).toBe(true);
  });

  it('fails to verify an invalid credential', async () => {
    const response = await mockTrustChainService.verifyCredential('invalid_cred');
    expect(response.success).toBe(true);
    expect(response.data.isValid).toBe(false);
  });
});
