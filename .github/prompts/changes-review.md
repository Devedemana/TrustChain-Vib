# Changes Review Prompt for TrustChain

## Objective
Perform a comprehensive review of current git changes before committing to ensure code quality, security, and functionality.

## Review Process

### 1. Analyze Git Diffs
- Review all modified files in the current working directory
- Identify the scope and impact of changes
- Check for any unintended modifications

### 2. Context Analysis
- Reference related files for better understanding
- Check consistency with existing codebase patterns
- Verify alignment with TrustChain architecture

### 3. Focus Areas

#### Business Logic Review
- **Credential Operations**: Verify issuance, verification, and storage logic
- **Authentication Flow**: Check Internet Identity integration
- **Data Validation**: Ensure proper input sanitization
- **Edge Cases**: Identify missing error handling scenarios

#### Code Quality Assessment
- **TypeScript**: Check type safety and interfaces
- **Motoko**: Review actor patterns and stable storage usage
- **React**: Verify component lifecycle and state management
- **Performance**: Identify potential bottlenecks

#### Security & Performance
- **Access Control**: Verify proper authentication checks
- **Input Validation**: Check for injection vulnerabilities
- **Rate Limiting**: Ensure protection against abuse
- **Memory Usage**: Review efficient data structure usage
- **Async Operations**: Check for proper error handling

### 4. TrustChain Specific Checks
- **Credential Integrity**: Ensure tamper-proof storage
- **Multi-role Support**: Verify institution/student/verifier workflows
- **QR Code Security**: Check for proper encoding/decoding
- **NFT Functionality**: Verify badge minting logic
- **Bulk Operations**: Review CSV processing security

## Output Format
Provide a structured report covering:
1. **Summary of Changes**
2. **Potential Issues Found**
3. **Security Considerations**
4. **Performance Impact**
5. **Recommended Actions**

## Commands for Verification
```bash
# Run full test suite
npm test

# Check TypeScript compilation
npm run build

# Lint code
npm run lint

# Security audit
npm audit

# Deploy and test locally
dfx deploy --network local
```

Remember: You are the senior developer - validate AI findings and ensure the review meets TrustChain's high standards for credential verification systems.
