# Add Feature Prompt for TrustChain

## Objective
Implement new features for the TrustChain credential verification system following a spec-driven development workflow.

## Workflow Steps

### 1. Clarification Phase
- Update CHANGELOG.md with the proposed feature
- Ask clarifying questions about requirements
- Identify which components need modification (backend/frontend)

### 2. Test First Approach
- Generate comprehensive test cases that cover the new feature
- Ensure tests fail initially (red phase of TDD)
- Cover both positive and negative test scenarios

### 3. Human Confirmation
**CRITICAL PAUSE POINT**: Wait for human review and approval of:
- Feature specification
- Test cases
- Implementation approach

### 4. Implementation Phase
- Implement the feature in Motoko backend if needed
- Update React frontend components as required
- Self-check for compilation errors
- Run tests to ensure they pass (green phase)
- Format and lint code
- Update documentation

## TrustChain Specific Considerations
- Consider impact on credential verification flow
- Ensure backwards compatibility with existing credentials
- Update canister interfaces if needed
- Test multi-role functionality (students, institutions, verifiers)

## Commands to Run
```bash
# Backend tests
npm run test:backend

# Frontend tests  
npm run test:frontend

# Full test suite
npm test

# Build project
npm run build

# Deploy to local replica
dfx deploy
```

## Quality Checklist
- [ ] Tests written and passing
- [ ] Code formatted and linted
- [ ] Documentation updated
- [ ] Backwards compatibility maintained
- [ ] Error handling implemented
- [ ] Security considerations addressed
