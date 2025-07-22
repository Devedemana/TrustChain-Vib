import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import EnhancedBlockchainService from '../services/enhancedBlockchain';
import realtimeService, { RealtimeEvent } from '../services/realtime';
import { AdvancedCredential, AnalyticsData, FraudDetectionResult } from '../types/advanced';

interface RealtimeContextType {
  // Blockchain service
  blockchainService: EnhancedBlockchainService | null;
  isBlockchainConnected: boolean;
  
  // Real-time connection
  isRealtimeConnected: boolean;
  connectionLatency: number | null;
  
  // User data
  userPrincipal: string | null;
  userCredentials: AdvancedCredential[];
  userAnalytics: AnalyticsData | null;
  
  // Real-time events
  recentEvents: RealtimeEvent[];
  unreadNotifications: number;
  
  // Actions
  authenticate: (identity: Identity) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  markNotificationsRead: () => void;
  subscribeToEvent: (eventType: string, callback: (event: RealtimeEvent) => void) => () => void;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

interface RealtimeProviderProps {
  children: ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  // Core services
  const [blockchainService, setBlockchainService] = useState<EnhancedBlockchainService | null>(null);
  const [isBlockchainConnected, setIsBlockchainConnected] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [connectionLatency, setConnectionLatency] = useState<number | null>(null);
  
  // User data
  const [userPrincipal, setUserPrincipal] = useState<string | null>(null);
  const [userCredentials, setUserCredentials] = useState<AdvancedCredential[]>([]);
  const [userAnalytics, setUserAnalytics] = useState<AnalyticsData | null>(null);
  
  // Real-time events
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize services on mount
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize blockchain service
        const service = new EnhancedBlockchainService();
        setBlockchainService(service);
        
        console.log('[RealtimeContext] Services initialized');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize services');
        console.error('[RealtimeContext] Initialization error:', err);
      }
    };

    initializeServices();

    // Set up real-time connection monitoring
    const unsubscribeConnect = realtimeService.onConnect(() => {
      setIsRealtimeConnected(true);
      console.log('[RealtimeContext] Real-time service connected');
    });

    const unsubscribeDisconnect = realtimeService.onDisconnect(() => {
      setIsRealtimeConnected(false);
      console.log('[RealtimeContext] Real-time service disconnected');
    });

    const unsubscribeError = realtimeService.onError((error) => {
      console.error('[RealtimeContext] Real-time service error:', error);
      setError('Real-time connection error');
    });

    // Monitor connection stats
    const statsInterval = setInterval(() => {
      const stats = realtimeService.getConnectionStats();
      setConnectionLatency(stats.latency || null);
    }, 5000);

    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeError();
      clearInterval(statsInterval);
      
      // Cleanup services
      if (blockchainService) {
        blockchainService.disconnect();
      }
    };
  }, [blockchainService]);

  // Set up event subscriptions when connected
  useEffect(() => {
    if (!isRealtimeConnected || !userPrincipal) return;

    // Subscribe to all relevant event types
    const eventTypes = ['credential_update', 'fraud_alert', 'verification_complete', 'multisig_update'];
    
    const unsubscribers = eventTypes.map(eventType => {
      return realtimeService.subscribe(eventType, (event: RealtimeEvent) => {
        // Add to recent events (keep last 100)
        setRecentEvents(prev => [event, ...prev.slice(0, 99)]);
        
        // Increment unread count
        setUnreadNotifications(prev => prev + 1);
        
        // Handle specific event types
        handleRealtimeEvent(event);
      });
    });

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [isRealtimeConnected, userPrincipal]);

  // Handle different types of real-time events
  const handleRealtimeEvent = (event: RealtimeEvent) => {
    switch (event.type) {
      case 'credential_update':
        handleCredentialUpdate(event);
        break;
      case 'fraud_alert':
        handleFraudAlert(event);
        break;
      case 'verification_complete':
        handleVerificationComplete(event);
        break;
      case 'multisig_update':
        handleMultisigUpdate(event);
        break;
      default:
        console.log('[RealtimeContext] Unhandled event type:', event.type);
    }
  };

  const handleCredentialUpdate = (event: RealtimeEvent) => {
    const { credentialId, action, credential } = event.data;
    
    setUserCredentials(prev => {
      switch (action) {
        case 'created':
          return credential ? [credential, ...prev] : prev;
        case 'updated':
          return prev.map(cred => 
            cred.id === credentialId 
              ? { ...cred, ...credential }
              : cred
          );
        case 'deleted':
          return prev.filter(cred => cred.id !== credentialId);
        default:
          return prev;
      }
    });

    console.log(`[RealtimeContext] Credential ${action}: ${credentialId}`);
  };

  const handleFraudAlert = (event: RealtimeEvent) => {
    console.warn('[RealtimeContext] Fraud alert:', event.data);
    
    // Show browser notification for high-priority alerts
    if ((event.priority === 'high' || event.priority === 'critical') &&
        'Notification' in window && 
        Notification.permission === 'granted') {
      
      new Notification('Security Alert - TrustChain', {
        body: event.data?.message || 'Suspicious activity detected',
        icon: '/icons/icon-192x192.png',
        tag: 'fraud-alert'
      });
    }
  };

  const handleVerificationComplete = (event: RealtimeEvent) => {
    console.log('[RealtimeContext] Verification completed:', event.data);
    
    // Update analytics if needed
    if (event.data?.updateAnalytics) {
      refreshUserAnalytics();
    }
  };

  const handleMultisigUpdate = (event: RealtimeEvent) => {
    console.log('[RealtimeContext] Multisig update:', event.data);
    
    // Handle multisig credential updates
    const { credentialId, remainingSignatures } = event.data;
    
    if (remainingSignatures === 0) {
      // Refresh credentials when multisig is complete
      refreshUserCredentials();
    }
  };

  // Authentication function
  const authenticate = async (identity: Identity): Promise<boolean> => {
    if (!blockchainService) {
      setError('Blockchain service not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Authenticate with blockchain service
      const success = await blockchainService.authenticate(identity);
      
      if (success) {
        const principal = identity.getPrincipal().toText();
        setUserPrincipal(principal);
        setIsBlockchainConnected(true);
        
        // Set principal for real-time service
        realtimeService.setUserPrincipal(principal);
        
        // Load initial user data
        await refreshUserData();
        
        console.log('[RealtimeContext] Authentication successful');
        return true;
      } else {
        setError('Authentication failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication error';
      setError(errorMessage);
      console.error('[RealtimeContext] Authentication error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user data
  const refreshUserData = async (): Promise<void> => {
    if (!blockchainService || !isBlockchainConnected) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Load user credentials and analytics in parallel
      await Promise.all([
        refreshUserCredentials(),
        refreshUserAnalytics()
      ]);
      
    } catch (err) {
      console.error('[RealtimeContext] Refresh user data error:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserCredentials = async (): Promise<void> => {
    if (!blockchainService || !userPrincipal) return;

    try {
      // Search for user's credentials
      const credentials = await blockchainService.searchCredentials({
        recipient: userPrincipal
      });
      
      setUserCredentials(credentials);
    } catch (err) {
      console.error('[RealtimeContext] Failed to refresh credentials:', err);
    }
  };

  const refreshUserAnalytics = async (): Promise<void> => {
    if (!blockchainService || !isBlockchainConnected) return;

    try {
      const analytics = await blockchainService.getAnalyticsDashboard('30d');
      setUserAnalytics(analytics);
    } catch (err) {
      console.error('[RealtimeContext] Failed to refresh analytics:', err);
    }
  };

  // Mark notifications as read
  const markNotificationsRead = (): void => {
    setUnreadNotifications(0);
    
    // Update events to mark as read
    setRecentEvents(prev => 
      prev.map(event => ({
        ...event,
        data: { ...event.data, read: true }
      }))
    );
  };

  // Subscribe to specific events
  const subscribeToEvent = (
    eventType: string, 
    callback: (event: RealtimeEvent) => void
  ): (() => void) => {
    return realtimeService.subscribe(eventType, callback);
  };

  const contextValue: RealtimeContextType = {
    // Services
    blockchainService,
    isBlockchainConnected,
    isRealtimeConnected,
    connectionLatency,
    
    // User data
    userPrincipal,
    userCredentials,
    userAnalytics,
    
    // Events
    recentEvents,
    unreadNotifications,
    
    // Actions
    authenticate,
    refreshUserData,
    markNotificationsRead,
    subscribeToEvent,
    
    // Loading states
    isLoading,
    error
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
};

// Hook to use the realtime context
export const useRealtime = (): RealtimeContextType => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export default RealtimeContext;
