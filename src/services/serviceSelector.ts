import { trustChainService } from './trustChainService';
import { mockTrustChainService } from '../utils/mockData';

// Use mock service if REACT_APP_USE_MOCK_DATA is true, otherwise use real service
export const getTrustChainService = () => {
  try {
    // Check for mock data flag more reliably
    const useMockData = 
      // Direct environment variable check
      process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
      // Default to mock in development if not explicitly set to false
      (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_DATA !== 'false');
    
    console.log('Environment check:', {
      REACT_APP_USE_MOCK_DATA: process.env.REACT_APP_USE_MOCK_DATA,
      NODE_ENV: process.env.NODE_ENV,
      useMockData
    });
    
    if (useMockData) {
      console.log('🎭 Using mock TrustChain service for development');
      return mockTrustChainService;
    }
    
    console.log('🌐 Using real TrustChain service');
    return trustChainService;
  } catch (error) {
    console.warn('Error accessing environment variables, defaulting to mock service:', error);
    return mockTrustChainService;
  }
};
