// lib/dynamic-imports.ts
/**
 * 动态导入和代码分割工具
 * 实现路由级、组件级的懒加载优化
 */

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';

// 加载状态组件接口
interface LoadingComponentProps {
  error?: Error;
  retry?: () => void;
  isLoading?: boolean;
  pastDelay?: boolean;
}

/**
 * 骨架屏组件映射
 */
const SkeletonComponents = {
  chart: () => import('@/components/skeletons/ChartSkeleton'),
  table: () => import('@/components/skeletons/TableSkeleton'),
  form: () => import('@/components/skeletons/FormSkeleton'),
  card: () => import('@/components/skeletons/CardSkeleton'),
  list: () => import('@/components/skeletons/ListSkeleton'),
  editor: () => import('@/components/skeletons/EditorSkeleton'),
  default: () => import('@/components/skeletons/DefaultSkeleton')
};

/**
 * 动态组件配置接口
 */
interface DynamicComponentConfig {
  loading?: ComponentType<LoadingComponentProps>;
  ssr?: boolean;
  delay?: number;
  timeout?: number;
  retry?: boolean;
  maxRetries?: number;
  skeletonType?: keyof typeof SkeletonComponents;
}

/**
 * 创建动态加载的组件
 */
export function createDynamicComponent<T extends {}>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  config: DynamicComponentConfig = {}
): ComponentType<T> {
  const {
    ssr = true,
    delay = 200,
    timeout = 10000,
    retry = true,
    maxRetries = 3,
    skeletonType = 'default'
  } = config;

  // 创建加载组件
  const LoadingComponent: ComponentType<LoadingComponentProps> = ({ 
    error, 
    retry: retryFn,
    isLoading,
    pastDelay 
  }) => {
    if (error) {
      return (
        <div className="dynamic-component-error">
          <div className="error-content">
            <h3>组件加载失败</h3>
            <p>{error.message}</p>
            {retry && retryFn && (
              <button onClick={retryFn} className="retry-button">
                重新加载
              </button>
            )}
          </div>
        </div>
      );
    }

    if (pastDelay || isLoading) {
      const SkeletonComponent = SkeletonComponents[skeletonType];
      return <SkeletonComponent />;
    }

    return null;
  };

  return dynamic(importFunc, {
    loading: LoadingComponent,
    ssr,
    delay
  });
}

/**
 * 预定义的动态组件
 */
export const DynamicComponents = {
  // 图表组件
  Chart: createDynamicComponent(
    () => import('@/components/Chart'),
    { skeletonType: 'chart', delay: 300 }
  ),

  // 数据表格组件
  DataTable: createDynamicComponent(
    () => import('@/components/DataTable'),
    { skeletonType: 'table', delay: 250 }
  ),

  // 富文本编辑器
  RichEditor: createDynamicComponent(
    () => import('@/components/RichEditor'),
    { skeletonType: 'editor', delay: 400, ssr: false }
  ),

  // 表单组件
  ComplexForm: createDynamicComponent(
    () => import('@/components/ComplexForm'),
    { skeletonType: 'form', delay: 200 }
  ),

  // 卡片组件
  InfoCard: createDynamicComponent(
    () => import('@/components/InfoCard'),
    { skeletonType: 'card', delay: 150 }
  ),

  // 列表组件
  ItemList: createDynamicComponent(
    () => import('@/components/ItemList'),
    { skeletonType: 'list', delay: 200 }
  ),

  // 地图组件（客户端专用）
  Map: createDynamicComponent(
    () => import('@/components/Map'),
    { skeletonType: 'default', delay: 500, ssr: false }
  ),

  // 视频播放器（客户端专用）
  VideoPlayer: createDynamicComponent(
    () => import('@/components/VideoPlayer'),
    { skeletonType: 'default', delay: 300, ssr: false }
  )
};

/**
 * 路由级代码分割配置
 */
export interface RouteSplitConfig {
  path: string;
  component: () => Promise<any>;
  loading?: ReactNode;
  errorBoundary?: ReactNode;
  preload?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * 路由预加载管理器
 */
export class RoutePreloadManager {
  private static instance: RoutePreloadManager;
  private preloadedRoutes = new Set<string>();
  private preloadQueue: string[] = [];
  private isPreloading = false;

  static getInstance(): RoutePreloadManager {
    if (!RoutePreloadManager.instance) {
      RoutePreloadManager.instance = new RoutePreloadManager();
    }
    return RoutePreloadManager.instance;
  }

  /**
   * 预加载路由组件
   */
  async preloadRoute(path: string): Promise<void> {
    if (this.preloadedRoutes.has(path)) {
      return;
    }

    this.preloadQueue.push(path);
    this.processPreloadQueue();
  }

  /**
   * 批量预加载路由
   */
  async preloadRoutes(paths: string[]): Promise<void> {
    const uniquePaths = [...new Set(paths)];
    
    for (const path of uniquePaths) {
      if (!this.preloadedRoutes.has(path)) {
        this.preloadQueue.push(path);
      }
    }

    this.processPreloadQueue();
  }

  /**
   * 处理预加载队列
   */
  private async processPreloadQueue(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }

    this.isPreloading = true;

    // 使用requestIdleCallback在浏览器空闲时预加载
    const preloadNext = async () => {
      if (this.preloadQueue.length === 0) {
        this.isPreloading = false;
        return;
      }

      const path = this.preloadQueue.shift()!;
      
      try {
        // 这里应该根据路径动态导入对应的组件
        console.log(`[Route Preload] Preloading route: ${path}`);
        
        // 模拟预加载延迟
        await new Promise(resolve => setTimeout(resolve, 100));
        
        this.preloadedRoutes.add(path);
        console.log(`[Route Preload] Successfully preloaded: ${path}`);
      } catch (error) {
        console.error(`[Route Preload] Failed to preload route: ${path}`, error);
      }

      // 继续处理队列
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => preloadNext());
      } else {
        setTimeout(preloadNext, 50);
      }
    };

    preloadNext();
  }

  /**
   * 检查路由是否已预加载
   */
  isRoutePreloaded(path: string): boolean {
    return this.preloadedRoutes.has(path);
  }

  /**
   * 获取预加载统计
   */
  getPreloadStats() {
    return {
      preloadedCount: this.preloadedRoutes.size,
      queueLength: this.preloadQueue.length,
      isPreloading: this.isPreloading
    };
  }

  /**
   * 清除预加载缓存
   */
  clearPreloadedRoutes(): void {
    this.preloadedRoutes.clear();
    this.preloadQueue = [];
    this.isPreloading = false;
  }
}

/**
 * 智能预加载Hook
 */
export function useSmartPreload() {
  const preloadManager = RoutePreloadManager.getInstance();

  /**
   * 基于用户行为的预加载
   */
  const preloadBasedOnBehavior = (currentPath: string) => {
    // 获取可能的下一步路径
    const likelyNextPaths = getLikelyNextPaths(currentPath);
    
    // 预加载这些路径
    preloadManager.preloadRoutes(likelyNextPaths);
  };

  /**
   * 基于可见性的预加载
   */
  const preloadBasedOnVisibility = (element: HTMLElement, path: string) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            preloadManager.preloadRoute(path);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    
    return () => observer.disconnect();
  };

  /**
   * 基于鼠标悬停的预加载
   */
  const preloadBasedOnHover = (path: string) => {
    preloadManager.preloadRoute(path);
  };

  return {
    preloadBasedOnBehavior,
    preloadBasedOnVisibility,
    preloadBasedOnHover,
    getPreloadStats: () => preloadManager.getPreloadStats()
  };
}

/**
 * 获取可能的下一步路径
 */
function getLikelyNextPaths(currentPath: string): string[] {
  const pathMap: Record<string, string[]> = {
    '/': ['/server', '/streaming', '/client-swr', '/mutations'],
    '/server': ['/server/parallel', '/server/serial', '/server/dedup'],
    '/client-swr': ['/client-react-query'],
    '/mutations': ['/on-demand-revalidate']
  };

  return pathMap[currentPath] || [];
}

/**
 * 代码分割性能监控
 */
export class CodeSplitMonitor {
  private static instance: CodeSplitMonitor;
  private loadTimes: Map<string, number> = new Map();
  private errors: Map<string, Error> = new Map();

  static getInstance(): CodeSplitMonitor {
    if (!CodeSplitMonitor.instance) {
      CodeSplitMonitor.instance = new CodeSplitMonitor();
    }
    return CodeSplitMonitor.instance;
  }

  /**
   * 记录组件加载时间
   */
  recordLoadTime(componentName: string, loadTime: number): void {
    this.loadTimes.set(componentName, loadTime);
    console.log(`[Code Split] ${componentName} loaded in ${loadTime}ms`);
  }

  /**
   * 记录加载错误
   */
  recordError(componentName: string, error: Error): void {
    this.errors.set(componentName, error);
    console.error(`[Code Split] Error loading ${componentName}:`, error);
  }

  /**
   * 获取加载统计
   */
  getLoadStats() {
    const stats = {
      totalComponents: this.loadTimes.size,
      averageLoadTime: 0,
      slowestComponent: '',
      fastestComponent: '',
      errorCount: this.errors.size,
      errors: Array.from(this.errors.entries())
    };

    if (this.loadTimes.size > 0) {
      const times = Array.from(this.loadTimes.values());
      stats.averageLoadTime = times.reduce((a, b) => a + b, 0) / times.length;
      
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);
      
      stats.slowestComponent = Array.from(this.loadTimes.entries())
        .find(([_, time]) => time === maxTime)?.[0] || '';
      
      stats.fastestComponent = Array.from(this.loadTimes.entries())
        .find(([_, time]) => time === minTime)?.[0] || '';
    }

    return stats;
  }

  /**
   * 清除统计
   */
  clearStats(): void {
    this.loadTimes.clear();
    this.errors.clear();
  }
}