import { trustChainService } from './trustChainService';
import { mockTrustChainService } from '../utils/mockData';
import { USE_PRODUCTION, IC_CONFIG } from '../config/ic-config';

// Production-ready service selector with proper IC integration
export const getTrustChainService = () => {
  try {
    // Force real service in production mode
    if (USE_PRODUCTION) {
      console.log('🚀 Production mode: Using real TrustChain service with IC canister');
      console.log(`📡 Connected to canister: ${IC_CONFIG.CANISTER_ID}`);
      return trustChainService;
    }
    
    // Development mode logic
    const useMockData = 
      // Direct environment variable check
      process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
      // Default to mock in development if not explicitly set to false
      (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_DATA !== 'false');
    
    console.log('Development mode environment check:', {
      REACT_APP_USE_MOCK_DATA: process.env.REACT_APP_USE_MOCK_DATA,
      NODE_ENV: process.env.NODE_ENV,
      USE_PRODUCTION: USE_PRODUCTION,
      useMockData
    });
    
    if (useMockData) {
      console.log('🎭 Development mode: Using mock TrustChain service');
      return mockTrustChainService;
    }
    
    console.log('🌐 Development mode: Using real TrustChain service');
    return trustChainService;
  } catch (error) {
    console.error('❌ Error in service selector:', error);
    
    // Fallback logic
    if (USE_PRODUCTION) {
      console.error('🚨 Production mode cannot fall back to mock service!');
      throw new Error('Production service initialization failed');
    }
    
    console.warn('⚠️ Development mode: Falling back to mock service');
    return mockTrustChainService;
  }
};
