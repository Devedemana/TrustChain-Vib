// Production IC Configuration for Deployed Backend
export const IC_PRODUCTION_CONFIG = {
  // Your deployed canister on IC mainnet
  UNIVERSAL_BACKEND_CANISTER_ID: 'tneh2-tiaaa-aaaaa-qaktq-cai',
  
  // IC mainnet configuration
  IC_HOST: 'https://ic0.app',
  IC_AGENT_HOST: 'https://ic0.app',
  
  // Backend URL for direct access
  BACKEND_URL: 'https://a4gq6-oaaaa-aaaab-qaa4q-cai.icp0.io/?id=tneh2-tiaaa-aaaaa-qaktq-cai',
  
  // Network configuration
  NETWORK: 'ic' as const,
  
  // Environment
  ENVIRONMENT: 'production' as const,
  
  // Feature flags for production
  FEATURES: {
    ENABLE_ANALYTICS: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_REALTIME_UPDATES: true,
    ENABLE_ADVANCED_SECURITY: true,
  },
  
  // API endpoints
  ENDPOINTS: {
    CREATE_ORGANIZATION: 'createOrganization',
    CREATE_TRUSTBOARD: 'createTrustBoard',
    ADD_RECORD: 'addRecord',
    VERIFY_TRUSTGATE: 'verifyTrustGate',
    GET_ANALYTICS: 'getUniversalAnalytics',
    SEARCH_RECORDS: 'searchRecords',
    BATCH_ADD_RECORDS: 'batchAddRecords',
    INIT_TEST_DATA: 'initializeTestData',
    GET_SYSTEM_INFO: 'getSystemInfo',
  }
};

// Interface definition for the Universal TrustBoard backend
export interface UniversalTrustBoardActor {
  createOrganization: (org: any) => Promise<any>;
  createTrustBoard: (board: any) => Promise<any>;
  addRecord: (boardId: string, record: any) => Promise<any>;
  verifyTrustGate: (request: any) => Promise<any>;
  getUniversalAnalytics: (organizationId: string) => Promise<any>;
  searchRecords: (boardId: string) => Promise<any>;
  batchAddRecords: (boardId: string, records: any[]) => Promise<any>;
  initializeTestData: () => Promise<string>;
  getSystemInfo: () => Promise<string>;
  listTrustBoards: (organizationId: string) => Promise<any[]>;
  updateTrustBoard: (id: string, updates: any) => Promise<any>;
  deleteTrustBoard: (id: string) => Promise<any>;
}

// Helper function to get canister actor
export const getUniversalActor = async (): Promise<UniversalTrustBoardActor> => {
  const { Actor, HttpAgent } = await import('@dfinity/agent');
  
  const agent = new HttpAgent({
    host: IC_PRODUCTION_CONFIG.IC_HOST,
  });
  
  // Only fetch root key in development
  if (IC_PRODUCTION_CONFIG.ENVIRONMENT !== 'production') {
    await agent.fetchRootKey();
  }
  
  // Create actor with the deployed canister ID
  // Note: For production, you'll interact directly with the canister using dfx or IC SDK
  return {
    createOrganization: async (org: any) => {
      // This will be handled by your frontend service layer
      throw new Error('Use dfx or IC SDK for direct canister calls');
    },
    createTrustBoard: async (board: any) => {
      throw new Error('Use dfx or IC SDK for direct canister calls');
    },
    addRecord: async (boardId: string, record: any) => {
      throw new Error('Use dfx or IC SDK for direct canister calls');
    },
    verifyTrustGate: async (request: any) => {
      throw new Error('Use dfx or IC SDK for direct canister calls');
    },
    getUniversalAnalytics: async (organizationId: string) => {
      throw new Error('Use dfx or IC SDK for direct canister calls');
    },
    searchRecords: async (boardId: string) => {
      throw new Error('Use dfx or IC SDK for direct canister calls');
    },
    batchAddRecords: async (boardId: string, records: any[]) => {
      throw new Error('Use dfx or IC SDK for direct canister calls');
    },
    initializeTestData: async () => {
      throw new Error('Use dfx or IC SDK for direct canister calls');
    },
    getSystemInfo: async () => {
      throw new Error('Use dfx or IC SDK for direct canister calls');
    },
    listTrustBoards: async (organizationId: string) => {
      throw new Error('Use dfx or IC SDK for direct canister calls');
    },
    updateTrustBoard: async (id: string, updates: any) => {
      throw new Error('Use dfx or IC SDK for direct canister calls');
    },
    deleteTrustBoard: async (id: string) => {
      throw new Error('Use dfx or IC SDK for direct canister calls');
    }
  } as UniversalTrustBoardActor;
};

// Production deployment info
export const DEPLOYMENT_INFO = {
  DEPLOYED_AT: '2025-08-06',
  CANISTER_ID: 'tneh2-tiaaa-aaaaa-qaktq-cai',
  VERSION: '1.0.0',
  NETWORK: 'Internet Computer Mainnet',
  STATUS: 'LIVE',
  FEATURES_ENABLED: [
    'Universal TrustBoard Creation',
    'TrustGate Verification Engine',
    'Cross-Organization Verification',
    'Real-time Analytics',
    'Batch Record Processing',
    'Advanced Security Features',
    'Test Data Initialization'
  ]
};
