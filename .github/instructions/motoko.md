# Motoko Development Instructions

These instructions apply to all Motoko files (*.mo) in the TrustChain project.

## Motoko Best Practices
- Use stable variables for data that must persist across upgrades
- Implement proper error handling with Result<T, Error> types
- Use actor-based architecture for scalability
- Follow Motoko naming conventions (camelCase for functions, PascalCase for types)

## TrustChain Specific Guidelines
- All credential operations should validate input data
- Use cryptographic hashing for credential IDs
- Implement proper access control for institutional operations
- Store credentials in stable arrays for persistence

## Code Structure
- Keep actor interfaces clean and minimal
- Use helper functions for complex operations
- Implement proper logging for debugging
- Use type annotations for better code clarity

## Security Considerations
- Validate all inputs from external calls
- Use caller() function to check authentication
- Implement rate limiting for sensitive operations
- Never expose internal implementation details

## Performance Guidelines
- Use efficient data structures (HashMap for lookups)
- Minimize stable variable access in loops
- Use async operations appropriately
- Consider memory limits for large datasets
