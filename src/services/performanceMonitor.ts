// Performance monitoring and optimization service
export interface PerformanceMetrics {
  id: string;
  timestamp: number;
  type: 'page_load' | 'api_call' | 'component_render' | 'user_interaction';
  name: string;
  duration: number;
  size?: number;
  success: boolean;
  url?: string;
  userAgent: string;
  connectionType?: string;
  memoryUsage?: number;
  metadata?: Record<string, any>;
}

export interface PerformanceBudget {
  pageLoad: number;
  apiCall: number;
  componentRender: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  bundleSize: number;
}

export interface PerformanceAlert {
  id: string;
  type: 'budget_exceeded' | 'slow_network' | 'memory_leak' | 'error_rate_high';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  metadata: Record<string, any>;
}

class PerformanceMonitorService {
  private metrics: PerformanceMetrics[] = [];
  private observer: PerformanceObserver | null = null;
  private budget: PerformanceBudget;
  private alertCallbacks: Array<(alert: PerformanceAlert) => void> = [];
  private isEnabled: boolean = true;
  private measurementId: string;

  constructor(budget?: Partial<PerformanceBudget>) {
    this.budget = {
      pageLoad: 3000,
      apiCall: 5000,
      componentRender: 100,
      firstContentfulPaint: 1500,
      largestContentfulPaint: 2500,
      firstInputDelay: 100,
      cumulativeLayoutShift: 0.1,
      bundleSize: 500000, // 500KB
      ...budget
    };
    
    this.measurementId = this.generateId();
    this.initialize();
  }

  private initialize(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Set up Performance Observer
    if ('PerformanceObserver' in window) {
      this.setupPerformanceObserver();
    }

    // Monitor Core Web Vitals
    this.monitorWebVitals();

    // Monitor memory usage
    this.monitorMemoryUsage();

    // Monitor network conditions
    this.monitorNetworkConditions();

    // Set up error tracking
    this.setupErrorTracking();

    // Monitor bundle size
    this.monitorBundleSize();
  }

  private setupPerformanceObserver(): void {
    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.processPerformanceEntry(entry);
        });
      });

      // Observe different types of performance entries
      this.observer.observe({ entryTypes: ['navigation', 'resource', 'measure', 'paint'] });
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error);
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry): void {
    const metric: PerformanceMetrics = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: this.getMetricType(entry),
      name: entry.name,
      duration: entry.duration,
      success: true,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType(),
      memoryUsage: this.getMemoryUsage()
    };

    // Add specific data based on entry type
    if (entry.entryType === 'resource') {
      const resourceEntry = entry as PerformanceResourceTiming;
      metric.size = resourceEntry.transferSize;
      metric.url = resourceEntry.name;
    }

    this.addMetric(metric);
    this.checkBudget(metric);
  }

  private getMetricType(entry: PerformanceEntry): PerformanceMetrics['type'] {
    if (entry.entryType === 'navigation') return 'page_load';
    if (entry.entryType === 'resource') return 'api_call';
    if (entry.entryType === 'measure') return 'component_render';
    return 'user_interaction';
  }

  private monitorWebVitals(): void {
    // First Contentful Paint
    this.observeWebVital('first-contentful-paint', this.budget.firstContentfulPaint);

    // Largest Contentful Paint
    this.observeLCP();

    // First Input Delay
    this.observeFID();

    // Cumulative Layout Shift
    this.observeCLS();
  }

  private observeWebVital(name: string, budget: number): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === name) {
              const metric: PerformanceMetrics = {
                id: this.generateId(),
                timestamp: Date.now(),
                type: 'page_load',
                name: entry.name,
                duration: entry.startTime,
                success: entry.startTime <= budget,
                userAgent: navigator.userAgent,
                connectionType: this.getConnectionType()
              };
              
              this.addMetric(metric);
              
              if (entry.startTime > budget) {
                this.createAlert({
                  type: 'budget_exceeded',
                  message: `${name} exceeded budget: ${entry.startTime}ms > ${budget}ms`,
                  severity: 'high',
                  metadata: { metric: name, value: entry.startTime, budget }
                });
              }
            }
          });
        });
        
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn(`Failed to observe ${name}:`, error);
      }
    }
  }

  private observeLCP(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          if (lastEntry) {
            const metric: PerformanceMetrics = {
              id: this.generateId(),
              timestamp: Date.now(),
              type: 'page_load',
              name: 'largest-contentful-paint',
              duration: lastEntry.startTime,
              success: lastEntry.startTime <= this.budget.largestContentfulPaint,
              userAgent: navigator.userAgent,
              connectionType: this.getConnectionType()
            };
            
            this.addMetric(metric);
            
            if (lastEntry.startTime > this.budget.largestContentfulPaint) {
              this.createAlert({
                type: 'budget_exceeded',
                message: `LCP exceeded budget: ${lastEntry.startTime}ms > ${this.budget.largestContentfulPaint}ms`,
                severity: 'high',
                metadata: { value: lastEntry.startTime, budget: this.budget.largestContentfulPaint }
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('Failed to observe LCP:', error);
      }
    }
  }

  private observeFID(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fidEntry = entry as any; // PerformanceEventTiming not fully typed
            
            const metric: PerformanceMetrics = {
              id: this.generateId(),
              timestamp: Date.now(),
              type: 'user_interaction',
              name: 'first-input-delay',
              duration: fidEntry.processingStart - fidEntry.startTime,
              success: (fidEntry.processingStart - fidEntry.startTime) <= this.budget.firstInputDelay,
              userAgent: navigator.userAgent,
              connectionType: this.getConnectionType()
            };
            
            this.addMetric(metric);
            
            if (metric.duration > this.budget.firstInputDelay) {
              this.createAlert({
                type: 'budget_exceeded',
                message: `FID exceeded budget: ${metric.duration}ms > ${this.budget.firstInputDelay}ms`,
                severity: 'medium',
                metadata: { value: metric.duration, budget: this.budget.firstInputDelay }
              });
            }
          });
        });
        
        observer.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('Failed to observe FID:', error);
      }
    }
  }

  private observeCLS(): void {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const layoutShiftEntry = entry as any; // PerformanceEntry type issue
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          });
          
          const metric: PerformanceMetrics = {
            id: this.generateId(),
            timestamp: Date.now(),
            type: 'page_load',
            name: 'cumulative-layout-shift',
            duration: clsValue,
            success: clsValue <= this.budget.cumulativeLayoutShift,
            userAgent: navigator.userAgent,
            connectionType: this.getConnectionType()
          };
          
          this.addMetric(metric);
          
          if (clsValue > this.budget.cumulativeLayoutShift) {
            this.createAlert({
              type: 'budget_exceeded',
              message: `CLS exceeded budget: ${clsValue.toFixed(3)} > ${this.budget.cumulativeLayoutShift}`,
              severity: 'medium',
              metadata: { value: clsValue, budget: this.budget.cumulativeLayoutShift }
            });
          }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Failed to observe CLS:', error);
      }
    }
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usage = memory.usedJSHeapSize;
        const limit = memory.jsHeapSizeLimit;
        
        const metric: PerformanceMetrics = {
          id: this.generateId(),
          timestamp: Date.now(),
          type: 'page_load',
          name: 'memory-usage',
          duration: 0,
          success: usage < limit * 0.8, // Alert if using more than 80%
          userAgent: navigator.userAgent,
          memoryUsage: usage,
          metadata: { limit, usage, percentage: (usage / limit) * 100 }
        };
        
        this.addMetric(metric);
        
        if (usage > limit * 0.8) {
          this.createAlert({
            type: 'memory_leak',
            message: `High memory usage: ${(usage / 1024 / 1024).toFixed(2)}MB (${((usage / limit) * 100).toFixed(1)}%)`,
            severity: 'high',
            metadata: { usage, limit, percentage: (usage / limit) * 100 }
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  private monitorNetworkConditions(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const checkConnection = () => {
        const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                               connection.effectiveType === '2g';
        
        if (isSlowConnection) {
          this.createAlert({
            type: 'slow_network',
            message: `Slow network detected: ${connection.effectiveType}`,
            severity: 'medium',
            metadata: { 
              effectiveType: connection.effectiveType,
              downlink: connection.downlink,
              rtt: connection.rtt
            }
          });
        }
      };
      
      connection.addEventListener('change', checkConnection);
      checkConnection(); // Initial check
    }
  }

  private setupErrorTracking(): void {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.createAlert({
        type: 'error_rate_high',
        message: `Console error: ${args.join(' ')}`,
        severity: 'medium',
        metadata: { error: args }
      });
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('error', (event) => {
      this.createAlert({
        type: 'error_rate_high',
        message: `JavaScript error: ${event.message}`,
        severity: 'high',
        metadata: { 
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.stack
        }
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.createAlert({
        type: 'error_rate_high',
        message: `Unhandled promise rejection: ${event.reason}`,
        severity: 'high',
        metadata: { reason: event.reason }
      });
    });
  }

  private monitorBundleSize(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let totalSize = 0;
          
          entries.forEach((entry) => {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.name.includes('.js') || resourceEntry.name.includes('.css')) {
              totalSize += resourceEntry.transferSize || 0;
            }
          });
          
          if (totalSize > this.budget.bundleSize) {
            this.createAlert({
              type: 'budget_exceeded',
              message: `Bundle size exceeded: ${(totalSize / 1024).toFixed(2)}KB > ${(this.budget.bundleSize / 1024).toFixed(2)}KB`,
              severity: 'medium',
              metadata: { size: totalSize, budget: this.budget.bundleSize }
            });
          }
        });
        
        observer.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('Failed to monitor bundle size:', error);
      }
    }
  }

  public measureApiCall<T>(
    promise: Promise<T>,
    name: string,
    url?: string
  ): Promise<T> {
    const startTime = performance.now();
    
    return promise
      .then((result) => {
        const duration = performance.now() - startTime;
        
        const metric: PerformanceMetrics = {
          id: this.generateId(),
          timestamp: Date.now(),
          type: 'api_call',
          name,
          duration,
          success: true,
          url,
          userAgent: navigator.userAgent,
          connectionType: this.getConnectionType()
        };
        
        this.addMetric(metric);
        this.checkBudget(metric);
        
        return result;
      })
      .catch((error) => {
        const duration = performance.now() - startTime;
        
        const metric: PerformanceMetrics = {
          id: this.generateId(),
          timestamp: Date.now(),
          type: 'api_call',
          name,
          duration,
          success: false,
          url,
          userAgent: navigator.userAgent,
          connectionType: this.getConnectionType(),
          metadata: { error: error.message }
        };
        
        this.addMetric(metric);
        
        throw error;
      });
  }

  public measureComponentRender(componentName: string, renderFunction: () => void): void {
    const startTime = performance.now();
    
    renderFunction();
    
    const duration = performance.now() - startTime;
    
    const metric: PerformanceMetrics = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: 'component_render',
      name: componentName,
      duration,
      success: duration <= this.budget.componentRender,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType(),
      memoryUsage: this.getMemoryUsage()
    };
    
    this.addMetric(metric);
    this.checkBudget(metric);
  }

  private addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  private checkBudget(metric: PerformanceMetrics): void {
    let budgetValue: number | undefined;
    
    switch (metric.type) {
      case 'page_load':
        budgetValue = this.budget.pageLoad;
        break;
      case 'api_call':
        budgetValue = this.budget.apiCall;
        break;
      case 'component_render':
        budgetValue = this.budget.componentRender;
        break;
    }
    
    if (budgetValue && metric.duration > budgetValue) {
      this.createAlert({
        type: 'budget_exceeded',
        message: `${metric.name} exceeded budget: ${metric.duration.toFixed(2)}ms > ${budgetValue}ms`,
        severity: metric.duration > budgetValue * 2 ? 'high' : 'medium',
        metadata: { metric: metric.name, value: metric.duration, budget: budgetValue }
      });
    }
  }

  private createAlert(alert: Omit<PerformanceAlert, 'id' | 'timestamp'>): void {
    const fullAlert: PerformanceAlert = {
      id: this.generateId(),
      timestamp: Date.now(),
      ...alert
    };
    
    this.alertCallbacks.forEach(callback => {
      try {
        callback(fullAlert);
      } catch (error) {
        console.error('Performance alert callback error:', error);
      }
    });
  }

  private getConnectionType(): string {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  private generateId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getMetricsByType(type: PerformanceMetrics['type']): PerformanceMetrics[] {
    return this.metrics.filter(metric => metric.type === type);
  }

  public getAverageMetric(name: string): number {
    const relevantMetrics = this.metrics.filter(metric => metric.name === name);
    if (relevantMetrics.length === 0) return 0;
    
    const sum = relevantMetrics.reduce((acc, metric) => acc + metric.duration, 0);
    return sum / relevantMetrics.length;
  }

  public onAlert(callback: (alert: PerformanceAlert) => void): () => void {
    this.alertCallbacks.push(callback);
    
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  public exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      budget: this.budget,
      summary: {
        totalMetrics: this.metrics.length,
        averagePageLoad: this.getAverageMetric('navigation'),
        averageApiCall: this.getAverageMetric('api_call'),
        averageComponentRender: this.getAverageMetric('component_render'),
        successRate: (this.metrics.filter(m => m.success).length / this.metrics.length) * 100
      }
    }, null, 2);
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public disable(): void {
    this.isEnabled = false;
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

export default PerformanceMonitorService;
