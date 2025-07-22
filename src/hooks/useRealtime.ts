import { useState, useEffect, useCallback, useRef } from 'react';
import realtimeService, { RealtimeEvent, ConnectionStats } from '../services/realtime';
import EnhancedBlockchainService from '../services/enhancedBlockchain';

// Hook for real-time credential updates
export function useCredentialUpdates(credentialId?: string) {
  const [updates, setUpdates] = useState<RealtimeEvent[]>([]);
  const [latestUpdate, setLatestUpdate] = useState<RealtimeEvent | null>(null);

  useEffect(() => {
    const handleCredentialUpdate = (event: RealtimeEvent) => {
      // Filter by credential ID if specified
      if (credentialId && event.data?.credentialId !== credentialId) {
        return;
      }

      setLatestUpdate(event);
      setUpdates(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 updates
    };

    const unsubscribe = realtimeService.subscribe('credential_update', handleCredentialUpdate);

    return () => {
      unsubscribe();
    };
  }, [credentialId]);

  return { updates, latestUpdate };
}

// Hook for fraud alerts
export function useFraudAlerts() {
  const [alerts, setAlerts] = useState<RealtimeEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [highPriorityAlerts, setHighPriorityAlerts] = useState<RealtimeEvent[]>([]);

  useEffect(() => {
    const handleFraudAlert = (event: RealtimeEvent) => {
      setAlerts(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 alerts
      setUnreadCount(prev => prev + 1);

      if (event.priority === 'high' || event.priority === 'critical') {
        setHighPriorityAlerts(prev => [event, ...prev.slice(0, 9)]); // Keep last 10 high priority
        
        // Show browser notification for critical alerts
        if (event.priority === 'critical' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Critical Security Alert', {
            body: event.data?.message || 'Potential fraud detected in your credentials',
            icon: '/icons/icon-192x192.png',
            tag: 'fraud-alert'
          });
        }
      }
    };

    const unsubscribe = realtimeService.subscribe('fraud_alert', handleFraudAlert);

    return () => {
      unsubscribe();
    };
  }, []);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setHighPriorityAlerts([]);
    setUnreadCount(0);
  }, []);

  return { 
    alerts, 
    unreadCount, 
    highPriorityAlerts, 
    markAsRead, 
    clearAlerts 
  };
}

// Hook for verification completions
export function useVerificationUpdates() {
  const [verifications, setVerifications] = useState<RealtimeEvent[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleVerificationComplete = (event: RealtimeEvent) => {
      setVerifications(prev => [event, ...prev.slice(0, 99)]);
      
      // Remove from pending if it was there
      if (event.data?.verificationId) {
        setPendingVerifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(event.data.verificationId);
          return newSet;
        });
      }
    };

    const unsubscribe = realtimeService.subscribe('verification_complete', handleVerificationComplete);

    return () => {
      unsubscribe();
    };
  }, []);

  const addPendingVerification = useCallback((verificationId: string) => {
    setPendingVerifications(prev => new Set(prev).add(verificationId));
  }, []);

  return { 
    verifications, 
    pendingVerifications: Array.from(pendingVerifications),
    addPendingVerification 
  };
}

// Hook for network statistics
export function useNetworkStats() {
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<Array<{ timestamp: number; stats: any }>>([]);

  useEffect(() => {
    const handleNetworkStats = (event: RealtimeEvent) => {
      setStats(event.data);
      setHistory(prev => [
        { timestamp: event.timestamp, stats: event.data },
        ...prev.slice(0, 99) // Keep last 100 data points
      ]);
    };

    const unsubscribe = realtimeService.subscribe('network_stats', handleNetworkStats);

    return () => {
      unsubscribe();
    };
  }, []);

  return { stats, history };
}

// Hook for multi-signature updates
export function useMultisigUpdates() {
  const [updates, setUpdates] = useState<RealtimeEvent[]>([]);
  const [pendingSignatures, setPendingSignatures] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const handleMultisigUpdate = (event: RealtimeEvent) => {
      setUpdates(prev => [event, ...prev.slice(0, 49)]);
      
      const { credentialId, remainingSignatures } = event.data || {};
      if (credentialId) {
        setPendingSignatures(prev => {
          const newMap = new Map(prev);
          if (remainingSignatures === 0) {
            newMap.delete(credentialId);
          } else {
            newMap.set(credentialId, remainingSignatures);
          }
          return newMap;
        });
      }
    };

    const unsubscribe = realtimeService.subscribe('multisig_update', handleMultisigUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  return { 
    updates, 
    pendingSignatures: Object.fromEntries(pendingSignatures) 
  };
}

// Hook for connection status
export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState(realtimeService.isConnected());
  const [stats, setStats] = useState<ConnectionStats>(realtimeService.getConnectionStats());
  const [reconnectCount, setReconnectCount] = useState(0);

  useEffect(() => {
    const unsubscribeConnect = realtimeService.onConnect(() => {
      setIsConnected(true);
      setStats(realtimeService.getConnectionStats());
    });

    const unsubscribeDisconnect = realtimeService.onDisconnect(() => {
      setIsConnected(false);
      setStats(realtimeService.getConnectionStats());
    });

    const unsubscribeReconnect = realtimeService.onReconnect(() => {
      setReconnectCount(prev => prev + 1);
      setStats(realtimeService.getConnectionStats());
    });

    // Update stats periodically
    const statsInterval = setInterval(() => {
      setStats(realtimeService.getConnectionStats());
    }, 5000);

    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeReconnect();
      clearInterval(statsInterval);
    };
  }, []);

  return { isConnected, stats, reconnectCount };
}

// Hook for real-time analytics
export function useRealtimeAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const blockchainService = useRef<EnhancedBlockchainService | null>(null);

  useEffect(() => {
    // Initialize blockchain service if not already done
    if (!blockchainService.current) {
      blockchainService.current = new EnhancedBlockchainService();
    }

    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (blockchainService.current?.isConnected()) {
          const data = await blockchainService.current.getAnalyticsDashboard('7d');
          setAnalytics(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
        console.error('Analytics loading error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Load initial data
    loadAnalytics();

    // Subscribe to real-time analytics updates
    const unsubscribe = realtimeService.subscribe('analytics_update', (event: RealtimeEvent) => {
      setAnalytics(event.data);
    });

    // Refresh analytics periodically
    const refreshInterval = setInterval(loadAnalytics, 300000); // Every 5 minutes

    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  const refresh = useCallback(async () => {
    if (blockchainService.current?.isConnected()) {
      try {
        setIsLoading(true);
        const data = await blockchainService.current.getAnalyticsDashboard('7d');
        setAnalytics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh analytics');
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  return { analytics, isLoading, error, refresh };
}

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<RealtimeEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to all event types for notifications
    const eventTypes = ['credential_update', 'fraud_alert', 'verification_complete', 'multisig_update'];
    
    const unsubscribers = eventTypes.map(eventType => {
      return realtimeService.subscribe(eventType, (event: RealtimeEvent) => {
        // Create notification object
        const notification: RealtimeEvent = {
          ...event,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        setNotifications(prev => [notification, ...prev.slice(0, 99)]);
        setUnreadCount(prev => prev + 1);

        // Show browser notification for high priority events
        if ((event.priority === 'high' || event.priority === 'critical') && 
            'Notification' in window && 
            Notification.permission === 'granted') {
          
          let title = 'TrustChain Update';
          let body = 'You have a new update';
          
          switch (event.type) {
            case 'credential_update':
              title = 'Credential Updated';
              body = 'One of your credentials has been updated';
              break;
            case 'fraud_alert':
              title = 'Security Alert';
              body = 'Suspicious activity detected';
              break;
            case 'verification_complete':
              title = 'Verification Complete';
              body = 'Credential verification has finished';
              break;
            case 'multisig_update':
              title = 'Signature Required';
              body = 'Multi-signature credential needs your approval';
              break;
          }

          new Notification(title, {
            body,
            icon: '/icons/icon-192x192.png',
            tag: event.type,
            data: event.data
          });
        }
      });
    });

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const markAsRead = useCallback((notificationId?: string) => {
    if (notificationId) {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, data: { ...notif.data, read: true } }
            : notif
        )
      );
    } else {
      setUnreadCount(0);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, data: { ...notif.data, read: true } }))
      );
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notif => !notif.data?.read);
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    getUnreadNotifications
  };
}

// Custom hook for blockchain service integration
export function useBlockchainService() {
  const [service] = useState(() => new EnhancedBlockchainService());
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Wait for authentication from AuthContext or similar
        const identity = null; // This would come from your auth context
        
        if (identity) {
          await service.authenticate(identity);
          setIsInitialized(true);
          
          // Set user principal for real-time service
          realtimeService.setUserPrincipal(service.getPrincipal());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize blockchain service');
      }
    };

    initialize();

    return () => {
      service.disconnect();
    };
  }, [service]);

  return { service, isInitialized, error };
}

export default {
  useCredentialUpdates,
  useFraudAlerts,
  useVerificationUpdates,
  useNetworkStats,
  useMultisigUpdates,
  useConnectionStatus,
  useRealtimeAnalytics,
  useRealtimeNotifications,
  useBlockchainService
};
