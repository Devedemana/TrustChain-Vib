// Production configuration for Internet Computer deployment
export const IC_CONFIG = {
  // Dynamic configuration based on environment
  NETWORK: process.env.REACT_APP_NETWORK || 'local', // Use 'local' for development, 'ic' for mainnet
  HOST: process.env.REACT_APP_IC_HOST || 'http://127.0.0.1:4943', // Local replica or IC mainnet
  
  // Canister ID with proper fallback for development
  CANISTER_ID: process.env.REACT_APP_CANISTER_ID || 'tneh2-tiaaa-aaaaa-qaktq-cai', // Your new IC Ninja canister ID
  
  // Internet Identity configuration
  INTERNET_IDENTITY_URL: 'https://identity.ic0.app',
  
  // Enable production features
  USE_PRODUCTION: process.env.NODE_ENV === 'production' || process.env.REACT_APP_USE_PRODUCTION === 'true',
  
  // Performance and reliability settings - dynamic based on environment
  FETCH_ROOT_KEY: process.env.REACT_APP_NETWORK !== 'ic', // Fetch root key only for local development
  VERIFY_QUERY_SIGNATURES: process.env.REACT_APP_NETWORK === 'ic', // Verify only in production
  
  // Real-time WebSocket endpoint (if you have one)
  WEBSOCKET_URL: process.env.REACT_APP_WEBSOCKET_URL || 'wss://your-websocket-endpoint.com',
  
  // Application settings
  APP_VERSION: '1.0.0',
  BUILD_TIMESTAMP: new Date().toISOString(),
  
  // Feature flags
  FEATURES: {
    REAL_TIME_UPDATES: true,
    FRAUD_DETECTION: true,
    MULTI_SIG: true,
    NFT_BADGES: true,
    ADVANCED_ANALYTICS: true,
    PWA_FEATURES: true,
  },
  
  // Network validation
  validateConfiguration() {
    if (this.USE_PRODUCTION) {
      if (this.CANISTER_ID === 'YOUR_CANISTER_ID_HERE') {
        throw new Error('🚨 Production mode requires a valid CANISTER_ID. Please set REACT_APP_CANISTER_ID environment variable.');
      }
      
      if (this.NETWORK !== 'ic') {
        console.warn('⚠️ Production mode should use NETWORK: "ic" for mainnet deployment.');
      }
      
      if (this.FETCH_ROOT_KEY) {
        throw new Error('🚨 FETCH_ROOT_KEY must be false in production for security.');
      }
      
      console.log('✅ Production configuration validated successfully!');
      console.log(`🚀 Connecting to IC mainnet with canister: ${this.CANISTER_ID}`);
    }
    
    return true;
  }
};

// Export configuration constants
export const {
  NETWORK,
  HOST,
  CANISTER_ID,
  INTERNET_IDENTITY_URL,
  USE_PRODUCTION,
  FETCH_ROOT_KEY,
  VERIFY_QUERY_SIGNATURES,
  WEBSOCKET_URL,
  FEATURES
} = IC_CONFIG;

// Validate configuration on import
IC_CONFIG.validateConfiguration();
