import { useState, useEffect, useCallback } from 'react';

// Core Web Vitals Metrics
export interface WebVitalsMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  TBT?: number; // Total Blocking Time
  SI?: number; // Speed Index
}

// Performance Timeline Entry
export interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  entryType: string;
  size?: number;
  transferSize?: number;
  initiatorType?: string;
}

// Resource Loading Metrics
export interface ResourceMetrics {
  url: string;
  type: string;
  loadTime: number;
  size: number;
  cached: boolean;
  compressionRatio?: number;
}

// Network Information
export interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

// Performance Observer Configuration
export interface PerformanceConfig {
  webVitals: boolean;
  resourceTiming: boolean;
  navigationTiming: boolean;
  userTiming: boolean;
  paintTiming: boolean;
  longTasks: boolean;
}

// Performance Monitoring Class
export class PerformanceMonitor {
  private metrics: WebVitalsMetrics = {};
  private resources: ResourceMetrics[] = [];
  private networkInfo: NetworkInfo | null = null;
  private observers: Map<string, PerformanceObserver> = new Map();
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(private config: PerformanceConfig = {
    webVitals: true,
    resourceTiming: true,
    navigationTiming: true,
    userTiming: true,
    paintTiming: true,
    longTasks: true
  }) {
    this.initializeObservers();
    this.collectNetworkInfo();
  }

  // Initialize Performance Observers
  private initializeObservers() {
    if (this.config.paintTiming && 'PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.FCP = entry.startTime;
              this.emit('fcp', entry.startTime);
            } else if (entry.name === 'largest-contentful-paint') {
              this.metrics.LCP = entry.startTime;
              this.emit('lcp', entry.startTime);
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.set('paint', paintObserver);
      } catch (error) {
        console.warn('Paint timing observer failed:', error);
      }
    }

    if (this.config.resourceTiming && 'PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            const resource: ResourceMetrics = {
              url: entry.name,
              type: entry.initiatorType || 'unknown',
              loadTime: entry.duration,
              size: entry.transferSize || entry.decodedBodySize || 0,
              cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
              compressionRatio: entry.encodedBodySize && entry.decodedBodySize ? 
                (1 - entry.encodedBodySize / entry.decodedBodySize) * 100 : undefined
            };
            this.resources.push(resource);
            this.emit('resource', resource);
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (error) {
        console.warn('Resource timing observer failed:', error);
      }
    }

    if (this.config.longTasks && 'PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.emit('longtask', {
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', longTaskObserver);
      } catch (error) {
        console.warn('Long task observer failed:', error);
      }
    }
  }

  // Collect Network Information
  private collectNetworkInfo() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.networkInfo = {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      };
    }
  }

  // Subscribe to performance events
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  // Emit performance events
  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Get current metrics
  getMetrics(): WebVitalsMetrics {
    return { ...this.metrics };
  }

  // Get resource metrics
  getResourceMetrics(): ResourceMetrics[] {
    return [...this.resources];
  }

  // Get network information
  getNetworkInfo(): NetworkInfo | null {
    return this.networkInfo;
  }

  // Get performance report
  getPerformanceReport() {
    return {
      metrics: this.getMetrics(),
      resources: this.getResourceMetrics(),
      network: this.getNetworkInfo(),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
  }

  // Measure custom performance
  measure(name: string, startMark?: string, endMark?: string): number | null {
    try {
      if (startMark && endMark) {
        return performance.measure(name, startMark, endMark).duration;
      } else if (startMark) {
        return performance.measure(name, startMark).duration;
      } else {
        return performance.getEntriesByName(name)[0]?.duration || null;
      }
    } catch (error) {
      console.warn(`Performance measurement failed for ${name}:`, error);
      return null;
    }
  }

  // Mark performance timestamp
  mark(name: string): void {
    try {
      performance.mark(name);
    } catch (error) {
      console.warn(`Performance mark failed for ${name}:`, error);
    }
  }

  // Clear performance data
  clear(): void {
    this.metrics = {};
    this.resources = [];
    performance.clearMarks();
    performance.clearMeasures();
  }

  // Disconnect observers
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.listeners.clear();
  }
}

// React Hook for Performance Monitoring
export function usePerformanceMonitor(config?: Partial<PerformanceConfig>) {
  const [monitor] = useState(() => new PerformanceMonitor(config));
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({});
  const [resources, setResources] = useState<ResourceMetrics[]>([]);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);

  useEffect(() => {
    // Subscribe to performance updates
    const unsubscribeFCP = monitor.on('fcp', (time) => {
      setMetrics(prev => ({ ...prev, FCP: time }));
    });

    const unsubscribeLCP = monitor.on('lcp', (time) => {
      setMetrics(prev => ({ ...prev, LCP: time }));
    });

    const unsubscribeResource = monitor.on('resource', (resource) => {
      setResources(prev => [...prev, resource]);
    });

    // Set initial network info
    setNetworkInfo(monitor.getNetworkInfo());

    return () => {
      unsubscribeFCP();
      unsubscribeLCP();
      unsubscribeResource();
      monitor.disconnect();
    };
  }, [monitor]);

  const getPerformanceReport = useCallback(() => {
    return monitor.getPerformanceReport();
  }, [monitor]);

  const measure = useCallback((name: string, startMark?: string, endMark?: string) => {
    return monitor.measure(name, startMark, endMark);
  }, [monitor]);

  const mark = useCallback((name: string) => {
    monitor.mark(name);
  }, [monitor]);

  return {
    metrics,
    resources,
    networkInfo,
    getPerformanceReport,
    measure,
    mark,
    monitor
  };
}

// Performance Budget Checker
export class PerformanceBudget {
  private budgets: Map<string, number> = new Map();
  private violations: Map<string, number[]> = new Map();

  constructor(budgets: Record<string, number> = {}) {
    Object.entries(budgets).forEach(([metric, budget]) => {
      this.budgets.set(metric, budget);
    });
  }

  setBudget(metric: string, budget: number): void {
    this.budgets.set(metric, budget);
  }

  check(metric: string, value: number): boolean {
    const budget = this.budgets.get(metric);
    if (budget === undefined) return true;

    const isWithinBudget = value <= budget;
    
    if (!isWithinBudget) {
      if (!this.violations.has(metric)) {
        this.violations.set(metric, []);
      }
      this.violations.get(metric)!.push(value);
    }

    return isWithinBudget;
  }

  getViolations(): Record<string, number[]> {
    const result: Record<string, number[]> = {};
    this.violations.forEach((violations, metric) => {
      result[metric] = [...violations];
    });
    return result;
  }

  getReport(): {
    budgets: Record<string, number>;
    violations: Record<string, number[]>;
    violationCount: number;
  } {
    const budgets: Record<string, number> = {};
    this.budgets.forEach((budget, metric) => {
      budgets[metric] = budget;
    });

    const violations = this.getViolations();
    const violationCount = Object.values(violations).reduce((sum, arr) => sum + arr.length, 0);

    return {
      budgets,
      violations,
      violationCount
    };
  }
}

// Default Performance Budgets
export const DEFAULT_PERFORMANCE_BUDGETS = {
  FCP: 1800,  // First Contentful Paint
  LCP: 2500,  // Largest Contentful Paint
  FID: 100,   // First Input Delay
  CLS: 0.1,   // Cumulative Layout Shift
  TTFB: 800,  // Time to First Byte
  TBT: 300,   // Total Blocking Time
  SI: 3400    // Speed Index
};

// Performance Analytics Reporter
export class PerformanceAnalytics {
  private buffer: any[] = [];
  private maxBufferSize = 100;
  private flushInterval = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(
    private endpoint: string,
    private apiKey?: string
  ) {
    this.startFlushTimer();
  }

  track(event: string, data: any): void {
    const eventData = {
      event,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.buffer.push(eventData);

    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({ events })
      });

      if (!response.ok) {
        console.warn('Performance analytics flush failed:', response.status);
        // Re-add events to buffer on failure
        this.buffer.unshift(...events);
      }
    } catch (error) {
      console.warn('Performance analytics flush error:', error);
      // Re-add events to buffer on failure
      this.buffer.unshift(...events);
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  disconnect(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush();
  }
}