import { trustChainService } from './trustChainService';
import { mockTrustChainService } from '../utils/mockData';

// Use mock service if REACT_APP_MOCK_DATA is true, otherwise use real service
export const getTrustChainService = () => {
  if (process.env.REACT_APP_MOCK_DATA === 'true') {
    return mockTrustChainService;
  }
  return trustChainService;
};
