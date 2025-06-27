# Testing Instructions for TrustChain

These instructions apply to all test files in the tests/ directory.

## Testing Framework
- Use Vitest for frontend tests
- Use PocketIC for backend/canister tests
- Maintain test coverage above 80%
- Write both unit and integration tests

## Test Structure
- Arrange-Act-Assert pattern
- Descriptive test names that explain the scenario
- Group related tests using describe blocks
- Use beforeEach/afterEach for setup/cleanup

## TrustChain Specific Testing
- Test credential issuance and verification flows
- Mock external dependencies (Internet Identity)
- Test error conditions and edge cases
- Verify data persistence across canister upgrades

## Backend Testing Guidelines
- Use PocketIC to test canister functionality
- Test both success and failure scenarios
- Verify state changes after operations
- Test actor-to-actor communication

## Frontend Testing Guidelines
- Test component rendering and user interactions
- Mock canister calls using jest.mock
- Test routing and navigation
- Verify form validation and error handling

## Security Testing
- Test authentication and authorization
- Verify input validation
- Test rate limiting functionality
- Check for potential vulnerabilities
