// lib/smart-cache-manager.ts
/**
 * 智能缓存管理器
 * 实现三层缓存架构：请求级、数据级、页面级缓存
 */

import { revalidateTag, revalidatePath } from 'next/cache';

// 缓存配置接口
interface CacheConfig {
  ttl: number;                    // 缓存时间（秒）
  tags: string[];                 // 缓存标签
  priority: 'high' | 'medium' | 'low';
  staleWhileRevalidate?: number;  // 后台重新验证时间
}

// 缓存统计接口
interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  avgResponseTime: number;
  hitRate: number;
}

// 请求级缓存管理器
export class RequestCacheManager {
  private static instance: RequestCacheManager;
  private requestCache = new Map<string, Promise<any>>();
  private stats = { hits: 0, misses: 0, total: 0 };

  static getInstance(): RequestCacheManager {
    if (!RequestCacheManager.instance) {
      RequestCacheManager.instance = new RequestCacheManager();
    }
    return RequestCacheManager.instance;
  }

  /**
   * 智能请求缓存
   */
  async cachedFetch<T>(
    url: string,
    options: RequestInit = {},
    config: Partial<CacheConfig> = {}
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(url, options);
    
    // 检查缓存命中
    if (this.requestCache.has(cacheKey)) {
      this.stats.hits++;
      this.stats.total++;
      console.log(`[Request Cache] Hit: ${cacheKey} (Rate: ${this.getHitRate().toFixed(2)}%)`);
      return this.requestCache.get(cacheKey);
    }

    // 创建新的请求
    this.stats.misses++;
    this.stats.total++;
    console.log(`[Request Cache] Miss: ${cacheKey}`);

    const fetchPromise = this.performFetch<T>(url, options, config);
    this.requestCache.set(cacheKey, fetchPromise);

    // 自动清理过期缓存
    this.cleanupExpiredCache();

    return fetchPromise;
  }

  private async performFetch<T>(
    url: string,
    options: RequestInit,
    config: Partial<CacheConfig>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(url, {
        ...options,
        next: {
          tags: config.tags || ['request-cache'],
          revalidate: config.ttl || 60
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const duration = performance.now() - startTime;
      
      console.log(`[Request Cache] Fetch completed in ${duration.toFixed(2)}ms`);
      return data;
    } catch (error) {
      // 失败时从缓存中移除
      this.requestCache.delete(this.generateCacheKey(url, options));
      throw error;
    }
  }

  private generateCacheKey(url: string, options: RequestInit): string {
    const params = new URL(url, 'http://localhost').searchParams.toString();
    const body = options.body ? JSON.stringify(options.body) : '';
    const method = options.method || 'GET';
    return `${method}:${url}${params ? `?${params}` : ''}${body ? `:${body}` : ''}`;
  }

  private cleanupExpiredCache(): void {
    if (this.requestCache.size > 100) {
      const keysToDelete = Array.from(this.requestCache.keys()).slice(0, 20);
      keysToDelete.forEach(key => this.requestCache.delete(key));
      console.log(`[Request Cache] Cleaned up ${keysToDelete.length} entries`);
    }
  }

  getStats(): { hitRate: number; totalRequests: number; cacheSize: number } {
    return {
      hitRate: this.stats.total > 0 ? (this.stats.hits / this.stats.total) * 100 : 0,
      totalRequests: this.stats.total,
      cacheSize: this.requestCache.size
    };
  }

  getHitRate(): number {
    return this.stats.total > 0 ? this.stats.hits / this.stats.total : 0;
  }

  clearCache(): void {
    this.requestCache.clear();
    this.stats = { hits: 0, misses: 0, total: 0 };
    console.log('[Request Cache] Cache cleared');
  }
}

// 数据级缓存管理器
export class DataCacheManager {
  private cacheStats: Record<string, CacheStats> = {};
  private cacheConfig: Record<string, CacheConfig> = {};

  /**
   * 智能数据缓存获取
   */
  async getCachedData<T>(
    key: string,
    fetchFn: () => Promise<T>,
    config: CacheConfig
  ): Promise<T> {
    const startTime = performance.now();
    
    // 初始化统计
    if (!this.cacheStats[key]) {
      this.cacheStats[key] = {
        hits: 0,
        misses: 0,
        evictions: 0,
        avgResponseTime: 0,
        hitRate: 0
      };
      this.cacheConfig[key] = config;
    }

    const stats = this.cacheStats[key];
    
    try {
      // 执行数据获取（这里会触发Next.js的数据缓存）
      const data = await fetchFn();
      const duration = performance.now() - startTime;
      
      // 更新统计
      stats.misses++;
      stats.avgResponseTime = (stats.avgResponseTime * (stats.misses - 1) + duration) / stats.misses;
      stats.hitRate = stats.hits / (stats.hits + stats.misses);
      
      console.log(`[Data Cache] Miss for key: ${key} (${duration.toFixed(2)}ms)`);
      
      return data;
    } catch (error) {
      console.error(`[Data Cache] Error fetching data for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * 批量缓存失效
   */
  async invalidateByTags(tags: string[]): Promise<void> {
    console.log(`[Data Cache] Invalidating tags: ${tags.join(', ')}`);
    
    for (const tag of tags) {
      await revalidateTag(tag);
      
      // 更新相关统计
      Object.keys(this.cacheStats).forEach(key => {
        const config = this.cacheConfig[key];
        if (config && config.tags.includes(tag)) {
          this.cacheStats[key].evictions++;
        }
      });
    }
  }

  /**
   * 智能缓存配置
   */
  getOptimalCacheConfig(
    dataType: string,
    accessPattern: 'frequent' | 'moderate' | 'rare',
    dataSize: 'small' | 'medium' | 'large'
  ): CacheConfig {
    const baseConfig: Record<string, CacheConfig> = {
      'user-profile': {
        ttl: 300, // 5分钟
        tags: ['user', 'profile'],
        priority: 'high',
        staleWhileRevalidate: 60
      },
      'post-list': {
        ttl: 120, // 2分钟
        tags: ['posts', 'content'],
        priority: 'medium',
        staleWhileRevalidate: 30
      },
      'static-content': {
        ttl: 3600, // 1小时
        tags: ['static', 'content'],
        priority: 'low',
        staleWhileRevalidate: 300
      }
    };

    const config = baseConfig[dataType] || {
      ttl: 60,
      tags: ['default'],
      priority: 'medium'
    };

    // 根据访问模式调整
    if (accessPattern === 'frequent') {
      config.ttl = Math.min(config.ttl * 2, 3600); // 最多1小时
      config.priority = 'high';
    } else if (accessPattern === 'rare') {
      config.ttl = Math.max(config.ttl / 2, 30); // 最少30秒
      config.priority = 'low';
    }

    // 根据数据大小调整
    if (dataSize === 'large') {
      config.ttl = Math.max(config.ttl / 2, 30); // 大数据减少缓存时间
    }

    return config;
  }

  getStats(): Record<string, CacheStats> {
    return { ...this.cacheStats };
  }

  getOverallStats(): CacheStats {
    const allStats = Object.values(this.cacheStats);
    if (allStats.length === 0) {
      return {
        hits: 0,
        misses: 0,
        evictions: 0,
        avgResponseTime: 0,
        hitRate: 0
      };
    }

    const total = allStats.reduce((acc, stat) => ({
      hits: acc.hits + stat.hits,
      misses: acc.misses + stat.misses,
      evictions: acc.evictions + stat.evictions,
      avgResponseTime: acc.avgResponseTime + stat.avgResponseTime * stat.misses
    }), { hits: 0, misses: 0, evictions: 0, avgResponseTime: 0 });

    const totalRequests = total.hits + total.misses;
    return {
      hits: total.hits,
      misses: total.misses,
      evictions: total.evictions,
      avgResponseTime: totalRequests > 0 ? total.avgResponseTime / totalRequests : 0,
      hitRate: totalRequests > 0 ? total.hits / totalRequests : 0
    };
  }
}

// 页面级缓存管理器
export class PageCacheManager {
  private pageConfigs: Map<string, { revalidate: number; tags: string[] }> = new Map();

  /**
   * 设置页面缓存配置
   */
  setPageConfig(path: string, config: { revalidate: number; tags: string[] }): void {
    this.pageConfigs.set(path, config);
    console.log(`[Page Cache] Config set for path: ${path}`, config);
  }

  /**
   * 获取最优页面缓存时间
   */
  getOptimalRevalidateTime(
    path: string,
    contentType: 'static' | 'dynamic' | 'user-generated',
    updateFrequency: 'rarely' | 'sometimes' | 'frequently'
  ): number {
    const baseTimes = {
      'static-rarely': 3600,    // 1小时
      'static-sometimes': 1800, // 30分钟
      'static-frequently': 600, // 10分钟
      'dynamic-rarely': 300,   // 5分钟
      'dynamic-sometimes': 120,  // 2分钟
      'dynamic-frequently': 60,  // 1分钟
      'user-generated-rarely': 60,
      'user-generated-sometimes': 30,
      'user-generated-frequently': 10
    };

    const key = `${contentType}-${updateFrequency}` as keyof typeof baseTimes;
    return baseTimes[key] || 60;
  }

  /**
   * 智能页面缓存失效
   */
  async invalidatePageCache(
    path: string,
    options: { cascade?: boolean; relatedTags?: string[] } = {}
  ): Promise<void> {
    const { cascade = false, relatedTags = [] } = options;

    console.log(`[Page Cache] Invalidating path: ${path}`);

    // 直接路径失效
    await revalidatePath(path, 'page');

    // 级联失效相关页面
    if (cascade) {
      const relatedPaths = this.getRelatedPaths(path);
      for (const relatedPath of relatedPaths) {
        await revalidatePath(relatedPath, 'page');
      }
    }

    // 标签失效
    if (relatedTags.length > 0) {
      for (const tag of relatedTags) {
        await revalidateTag(tag);
      }
    }

    console.log(`[Page Cache] Invalidation completed for: ${path}`);
  }

  /**
   * 获取相关路径（用于级联失效）
   */
  private getRelatedPaths(path: string): string[] {
    const relatedPaths: string[] = [];
    
    // 父路径
    const segments = path.split('/').filter(Boolean);
    for (let i = 1; i < segments.length; i++) {
      const parentPath = '/' + segments.slice(0, i).join('/');
      relatedPaths.push(parentPath);
    }

    // 同级路径（基于配置）
    const config = this.pageConfigs.get(path);
    if (config) {
      // 这里可以根据标签找到相关路径
      const tagRelatedPaths = Array.from(this.pageConfigs.entries())
        .filter(([_, cfg]) => cfg.tags.some(tag => config.tags.includes(tag)))
        .map(([p, _]) => p);
      
      relatedPaths.push(...tagRelatedPaths);
    }

    return [...new Set(relatedPaths)]; // 去重
  }

  /**
   * 批量页面缓存失效
   */
  async batchInvalidatePages(
    paths: string[],
    options: { batchSize?: number; delay?: number } = {}
  ): Promise<void> {
    const { batchSize = 10, delay = 100 } = options;

    console.log(`[Page Cache] Batch invalidating ${paths.length} paths`);

    for (let i = 0; i < paths.length; i += batchSize) {
      const batch = paths.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(path => this.invalidatePageCache(path))
      );

      // 避免过载，添加延迟
      if (i + batchSize < paths.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log(`[Page Cache] Batch invalidation completed`);
  }

  /**
   * 获取页面缓存配置
   */
  getPageConfig(path: string): { revalidate: number; tags: string[] } | undefined {
    return this.pageConfigs.get(path);
  }

  /**
   * 获取所有页面缓存配置
   */
  getAllPageConfigs(): Map<string, { revalidate: number; tags: string[] }> {
    return new Map(this.pageConfigs);
  }
}

// 智能缓存策略组合器
export class SmartCacheStrategy {
  private requestManager = RequestCacheManager.getInstance();
  private dataManager = new DataCacheManager();
  private pageManager = new PageCacheManager();

  /**
   * 获取完整的缓存统计
   */
  getOverallStats() {
    const requestStats = this.requestManager.getStats();
    const dataStats = this.dataManager.getOverallStats();
    
    return {
      requestLevel: requestStats,
      dataLevel: dataStats,
      overallHitRate: ((requestStats.hitRate / 100) + dataStats.hitRate) / 2,
      totalCacheSize: requestStats.cacheSize
    };
  }

  /**
   * 智能缓存清理
   */
  async smartCleanup(): Promise<void> {
    console.log('[Smart Cache] Starting cleanup...');
    
    // 清理请求缓存
    if (this.requestManager.getStats().cacheSize > 50) {
      this.requestManager.clearCache();
    }

    console.log('[Smart Cache] Cleanup completed');
  }
}