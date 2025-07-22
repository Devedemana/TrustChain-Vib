// Real-time WebSocket service for live updates
export interface RealtimeEvent {
  id: string;
  type: 'credential_update' | 'fraud_alert' | 'verification_complete' | 'network_stats' | 'multisig_update';
  timestamp: number;
  data: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ConnectionStats {
  connected: boolean;
  reconnectAttempts: number;
  lastConnected?: number;
  latency?: number;
  messagesReceived: number;
  messagesSent: number;
}

export interface RealtimeSubscription {
  id: string;
  eventType: string;
  callback: (event: RealtimeEvent) => void;
  filter?: (event: RealtimeEvent) => boolean;
  active: boolean;
}

class RealtimeService {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, RealtimeSubscription> = new Map();
  private messageQueue: any[] = [];
  private connectionStats: ConnectionStats = {
    connected: false,
    reconnectAttempts: 0,
    messagesReceived: 0,
    messagesSent: 0
  };
  
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingTimer: NodeJS.Timeout | null = null;
  private readonly maxReconnectAttempts = 10;
  private readonly reconnectDelay = 1000;
  private readonly pingInterval = 30000;
  
  private callbacks: {
    onConnect: Array<() => void>;
    onDisconnect: Array<() => void>;
    onError: Array<(error: Event) => void>;
    onReconnect: Array<() => void>;
  } = {
    onConnect: [],
    onDisconnect: [],
    onError: [],
    onReconnect: []
  };

  constructor(
    private wsUrl: string = process.env.REACT_APP_WS_URL || 'wss://ic-websocket-gateway.com',
    private canisterId: string = process.env.REACT_APP_CANISTER_ID || 'rrkah-fqaaa-aaaah-qarkq-cai'
  ) {
    this.connect();
  }

  private connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
      return; // Already connecting
    }

    try {
      const fullUrl = `${this.wsUrl}/${this.canisterId}?protocol=trustchain-v1`;
      console.log(`[Realtime] Connecting to ${fullUrl}`);
      
      this.ws = new WebSocket(fullUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error('[Realtime] Connection error:', error);
      this.handleReconnect();
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = (event) => {
      console.log('[Realtime] Connected successfully');
      
      this.connectionStats.connected = true;
      this.connectionStats.reconnectAttempts = 0;
      this.connectionStats.lastConnected = Date.now();
      
      // Send queued messages
      this.flushMessageQueue();
      
      // Start ping timer
      this.startPingTimer();
      
      // Notify callbacks
      this.callbacks.onConnect.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('[Realtime] Connect callback error:', error);
        }
      });

      // If this was a reconnection
      if (this.connectionStats.reconnectAttempts > 0) {
        this.callbacks.onReconnect.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('[Realtime] Reconnect callback error:', error);
          }
        });
      }
    };

    this.ws.onmessage = (event) => {
      this.connectionStats.messagesReceived++;
      
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('[Realtime] Message parsing error:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log(`[Realtime] Connection closed: ${event.code} - ${event.reason}`);
      
      this.connectionStats.connected = false;
      this.stopPingTimer();
      
      this.callbacks.onDisconnect.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('[Realtime] Disconnect callback error:', error);
        }
      });

      // Attempt reconnection unless manually closed
      if (event.code !== 1000) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (event) => {
      console.error('[Realtime] WebSocket error:', event);
      
      this.callbacks.onError.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('[Realtime] Error callback error:', error);
        }
      });
    };
  }

  private handleMessage(message: any): void {
    // Handle different message types
    switch (message.type) {
      case 'pong':
        this.updateLatency(message.timestamp);
        break;
      case 'event':
        this.processEvent(message.event);
        break;
      case 'error':
        console.error('[Realtime] Server error:', message.error);
        break;
      case 'auth_required':
        this.authenticate();
        break;
      default:
        console.warn('[Realtime] Unknown message type:', message.type);
    }
  }

  private processEvent(eventData: any): void {
    const event: RealtimeEvent = {
      id: eventData.id || this.generateEventId(),
      type: eventData.type,
      timestamp: eventData.timestamp || Date.now(),
      data: eventData.data,
      priority: eventData.priority || 'medium'
    };

    // Notify all relevant subscriptions
    this.subscriptions.forEach((subscription) => {
      if (subscription.active && 
          (subscription.eventType === event.type || subscription.eventType === '*')) {
        
        // Apply filter if present
        if (subscription.filter && !subscription.filter(event)) {
          return;
        }

        try {
          subscription.callback(event);
        } catch (error) {
          console.error(`[Realtime] Subscription callback error for ${subscription.id}:`, error);
        }
      }
    });
  }

  private handleReconnect(): void {
    if (this.connectionStats.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Realtime] Max reconnection attempts reached');
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.connectionStats.reconnectAttempts),
      30000 // Max 30 seconds
    );

    console.log(`[Realtime] Reconnecting in ${delay}ms (attempt ${this.connectionStats.reconnectAttempts + 1})`);

    this.reconnectTimer = setTimeout(() => {
      this.connectionStats.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  private startPingTimer(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
    }

    this.pingTimer = setInterval(() => {
      if (this.isConnected()) {
        this.sendMessage({
          type: 'ping',
          timestamp: Date.now()
        });
      }
    }, this.pingInterval);
  }

  private stopPingTimer(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private updateLatency(serverTimestamp: number): void {
    const now = Date.now();
    this.connectionStats.latency = now - serverTimestamp;
  }

  private authenticate(): void {
    // Get current user's identity from auth context
    const principal = localStorage.getItem('user_principal');
    
    if (principal) {
      this.sendMessage({
        type: 'authenticate',
        principal,
        timestamp: Date.now()
      });
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  private sendMessage(message: any): void {
    if (!this.isConnected()) {
      // Queue message for later
      this.messageQueue.push(message);
      return;
    }

    try {
      this.ws!.send(JSON.stringify(message));
      this.connectionStats.messagesSent++;
    } catch (error) {
      console.error('[Realtime] Send message error:', error);
      this.messageQueue.push(message); // Re-queue on error
    }
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public API
  public subscribe(
    eventType: string,
    callback: (event: RealtimeEvent) => void,
    filter?: (event: RealtimeEvent) => boolean
  ): (() => void) {
    const id = this.generateSubscriptionId();
    
    const subscription: RealtimeSubscription = {
      id,
      eventType,
      callback,
      filter,
      active: true
    };

    this.subscriptions.set(id, subscription);

    // Notify server about subscription
    if (this.isConnected()) {
      this.sendMessage({
        type: 'subscribe',
        eventType,
        subscriptionId: id,
        timestamp: Date.now()
      });
    }

    console.log(`[Realtime] Subscribed to ${eventType} with ID ${id}`);
    
    // Return unsubscribe function
    return () => {
      this.unsubscribe(id);
    };
  }

  public unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      console.warn(`[Realtime] Subscription ${subscriptionId} not found`);
      return;
    }

    subscription.active = false;
    this.subscriptions.delete(subscriptionId);

    // Notify server about unsubscription
    if (this.isConnected()) {
      this.sendMessage({
        type: 'unsubscribe',
        subscriptionId,
        timestamp: Date.now()
      });
    }

    console.log(`[Realtime] Unsubscribed from ${subscriptionId}`);
  }

  public emit(eventType: string, data: any, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const event = {
      type: 'emit',
      eventType,
      data,
      priority,
      timestamp: Date.now()
    };

    this.sendMessage(event);
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  public getConnectionStats(): ConnectionStats {
    return { ...this.connectionStats };
  }

  public getActiveSubscriptions(): RealtimeSubscription[] {
    return Array.from(this.subscriptions.values()).filter(sub => sub.active);
  }

  // Event listeners
  public onConnect(callback: () => void): () => void {
    this.callbacks.onConnect.push(callback);
    return () => {
      const index = this.callbacks.onConnect.indexOf(callback);
      if (index > -1) {
        this.callbacks.onConnect.splice(index, 1);
      }
    };
  }

  public onDisconnect(callback: () => void): () => void {
    this.callbacks.onDisconnect.push(callback);
    return () => {
      const index = this.callbacks.onDisconnect.indexOf(callback);
      if (index > -1) {
        this.callbacks.onDisconnect.splice(index, 1);
      }
    };
  }

  public onError(callback: (error: Event) => void): () => void {
    this.callbacks.onError.push(callback);
    return () => {
      const index = this.callbacks.onError.indexOf(callback);
      if (index > -1) {
        this.callbacks.onError.splice(index, 1);
      }
    };
  }

  public onReconnect(callback: () => void): () => void {
    this.callbacks.onReconnect.push(callback);
    return () => {
      const index = this.callbacks.onReconnect.indexOf(callback);
      if (index > -1) {
        this.callbacks.onReconnect.splice(index, 1);
      }
    };
  }

  // Advanced features
  public setUserPrincipal(principal: string): void {
    localStorage.setItem('user_principal', principal);
    
    if (this.isConnected()) {
      this.sendMessage({
        type: 'set_principal',
        principal,
        timestamp: Date.now()
      });
    }
  }

  public requestReplay(eventType: string, fromTimestamp?: number): void {
    this.sendMessage({
      type: 'replay_request',
      eventType,
      fromTimestamp: fromTimestamp || Date.now() - 3600000, // Last hour by default
      timestamp: Date.now()
    });
  }

  public getHealth(): Promise<{
    connected: boolean;
    latency?: number;
    serverTime?: number;
    version?: string;
  }> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        resolve({ connected: false });
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Health check timeout'));
      }, 5000);

      const healthCallback = (event: RealtimeEvent) => {
        if (event.data && event.data.healthResponse) {
          clearTimeout(timeout);
          resolve({
            connected: true,
            latency: this.connectionStats.latency,
            ...event.data
          });
        }
      };

      const unsubscribe = this.subscribe('network_stats', healthCallback);
      
      this.sendMessage({
        type: 'health_check',
        timestamp: Date.now()
      });

      // Clean up subscription after timeout
      setTimeout(() => {
        unsubscribe();
      }, 6000);
    });
  }

  // Cleanup
  public disconnect(): void {
    console.log('[Realtime] Disconnecting...');
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopPingTimer();
    
    // Clear all subscriptions
    this.subscriptions.clear();
    
    // Close WebSocket connection
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.connectionStats.connected = false;
    console.log('[Realtime] Disconnected');
  }
}

// Create singleton instance
const realtimeService = new RealtimeService();

export default realtimeService;
