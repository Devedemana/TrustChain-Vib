import React from 'react';
import { RealtimeNotification } from '../types/advanced';

export class RealtimeNotificationService {
  private static instance: RealtimeNotificationService;
  private websocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private listeners: Map<string, Array<(notification: RealtimeNotification) => void>> = new Map();

  public static getInstance(): RealtimeNotificationService {
    if (!RealtimeNotificationService.instance) {
      RealtimeNotificationService.instance = new RealtimeNotificationService();
    }
    return RealtimeNotificationService.instance;
  }

  /**
   * Initialize WebSocket connection
   */
  public connect(userId: string): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/notifications';
    
    try {
      this.websocket = new WebSocket(`${wsUrl}?userId=${userId}`);
      
      this.websocket.onopen = () => {
        console.log('🔌 WebSocket connected');
        this.reconnectAttempts = 0;
        
        // Send authentication
        this.send({
          type: 'auth',
          userId,
          timestamp: Date.now()
        });
      };

      this.websocket.onmessage = (event) => {
        try {
          const notification: RealtimeNotification = JSON.parse(event.data);
          this.handleNotification(notification);
        } catch (error) {
          console.error('Failed to parse notification:', error);
        }
      };

      this.websocket.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code);
        this.attemptReconnect(userId);
      };

      this.websocket.onerror = (error) => {
        console.error('🔌 WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.attemptReconnect(userId);
    }
  }

  /**
   * Attempt to reconnect WebSocket
   */
  private attemptReconnect(userId: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(userId);
    }, this.reconnectInterval);
  }

  /**
   * Send message through WebSocket
   */
  private send(message: any): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
    }
  }

  /**
   * Handle incoming notification
   */
  private handleNotification(notification: RealtimeNotification): void {
    console.log('📨 Received notification:', notification);
    
    // Store notification locally
    this.storeNotification(notification);
    
    // Trigger listeners
    const typeListeners = this.listeners.get(notification.type) || [];
    const allListeners = this.listeners.get('*') || [];
    
    [...typeListeners, ...allListeners].forEach(listener => {
      try {
        listener(notification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });

    // Show browser notification if permission granted
    this.showBrowserNotification(notification);
  }

  /**
   * Store notification locally
   */
  private storeNotification(notification: RealtimeNotification): void {
    const key = 'trustchain_notifications';
    const stored = localStorage.getItem(key);
    const notifications: RealtimeNotification[] = stored ? JSON.parse(stored) : [];
    
    notifications.unshift(notification);
    
    // Keep only last 100 notifications
    if (notifications.length > 100) {
      notifications.splice(100);
    }
    
    localStorage.setItem(key, JSON.stringify(notifications));
  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(notification: RealtimeNotification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        
        // Emit click event
        this.emit('notification-click', notification);
      };

      // Auto close after 5 seconds for non-urgent notifications
      if (notification.priority !== 'urgent') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    }
  }

  /**
   * Subscribe to notification events
   */
  public subscribe(
    type: string | '*',
    listener: (notification: RealtimeNotification) => void
  ): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    
    this.listeners.get(type)!.push(listener);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit custom events
   */
  private emit(eventType: string, data: any): void {
    const event = new CustomEvent(`trustchain-${eventType}`, { detail: data });
    window.dispatchEvent(event);
  }

  /**
   * Request browser notification permission
   */
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission;
    }
    return 'denied';
  }

  /**
   * Get stored notifications
   */
  public getStoredNotifications(): RealtimeNotification[] {
    const key = 'trustchain_notifications';
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Mark notification as read
   */
  public markAsRead(notificationId: string): void {
    const notifications = this.getStoredNotifications();
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    localStorage.setItem('trustchain_notifications', JSON.stringify(updated));
    this.emit('notification-read', { id: notificationId });
  }

  /**
   * Clear all notifications
   */
  public clearAll(): void {
    localStorage.removeItem('trustchain_notifications');
    this.emit('notifications-cleared', {});
  }

  /**
   * Disconnect WebSocket
   */
  public disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.listeners.clear();
    this.reconnectAttempts = 0;
  }

  /**
   * Send notification (for institution/admin use)
   */
  public sendNotification(notification: Omit<RealtimeNotification, 'id' | 'timestamp'>): void {
    const fullNotification: RealtimeNotification = {
      ...notification,
      id: this.generateId(),
      timestamp: Date.now()
    };

    this.send({
      type: 'send_notification',
      notification: fullNotification
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Custom React hook for notifications
export function useRealtimeNotifications(userId?: string) {
  const [notifications, setNotifications] = React.useState<RealtimeNotification[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const service = RealtimeNotificationService.getInstance();

  React.useEffect(() => {
    if (userId) {
      service.connect(userId);
      
      // Load stored notifications
      setNotifications(service.getStoredNotifications());
      
      // Subscribe to new notifications
      const unsubscribe = service.subscribe('*', (notification) => {
        setNotifications(prev => [notification, ...prev].slice(0, 50));
      });

      // Listen for connection status
      const handleOpen = () => setIsConnected(true);
      const handleClose = () => setIsConnected(false);
      
      window.addEventListener('trustchain-websocket-open', handleOpen);
      window.addEventListener('trustchain-websocket-close', handleClose);

      return () => {
        unsubscribe();
        window.removeEventListener('trustchain-websocket-open', handleOpen);
        window.removeEventListener('trustchain-websocket-close', handleClose);
      };
    }
  }, [userId]);

  const markAsRead = (notificationId: string) => {
    service.markAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const clearAll = () => {
    service.clearAll();
    setNotifications([]);
  };

  return {
    notifications,
    isConnected,
    markAsRead,
    clearAll,
    requestPermission: service.requestNotificationPermission.bind(service)
  };
}

// Export singleton
export const notificationService = RealtimeNotificationService.getInstance();
