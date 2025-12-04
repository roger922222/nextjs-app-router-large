// components/ThreeLayerCacheDemo.tsx
"use client";

import { useState, useEffect } from 'react';
import { 
  RequestCacheManager, 
  DataCacheManager, 
  PageCacheManager,
  SmartCacheStrategy 
} from '@/lib/smart-cache-manager';
import './ThreeLayerCacheDemo.css';

/**
 * 三层缓存架构演示组件
 * 展示请求级、数据级、页面级缓存的工作原理和优化效果
 */
export function ThreeLayerCacheDemo() {
  const [requestStats, setRequestStats] = useState({ hitRate: 0, totalRequests: 0, cacheSize: 0 });
  const [dataStats, setDataStats] = useState({ hitRate: 0, avgResponseTime: 0, totalRequests: 0 });
  const [pageStats, setPageStats] = useState({ revalidateTime: 60, tags: [] as string[] });
  const [isLoading, setIsLoading] = useState(false);
  const [demoResults, setDemoResults] = useState<any[]>([]);

  const requestManager = RequestCacheManager.getInstance();
  const dataManager = new DataCacheManager();
  const pageManager = new PageCacheManager();
  const cacheStrategy = new SmartCacheStrategy();

  // 更新统计信息
  useEffect(() => {
    const interval = setInterval(() => {
      setRequestStats(requestManager.getStats());
      setDataStats(dataManager.getOverallStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 演示请求级缓存（Request Memoization）
  const demoRequestCache = async () => {
    setIsLoading(true);
    const results: any[] = [];
    
    try {
      const baseUrl = 'https://jsonplaceholder.typicode.com';
      const endpoint = '/posts/1';
      
      // 第一次请求（会实际执行）
      const start1 = performance.now();
      const result1 = await requestManager.cachedFetch(`${baseUrl}${endpoint}`);
      const time1 = performance.now() - start1;
      results.push({
        type: 'Request Cache - First',
        duration: time1.toFixed(2),
        status: 'Cache Miss',
        data: result1.title.substring(0, 50) + '...'
      });

      // 第二次相同请求（应该命中缓存）
      const start2 = performance.now();
      const result2 = await requestManager.cachedFetch(`${baseUrl}${endpoint}`);
      const time2 = performance.now() - start2;
      results.push({
        type: 'Request Cache - Second',
        duration: time2.toFixed(2),
        status: 'Cache Hit',
        data: result2.title.substring(0, 50) + '...'
      });

    } catch (error) {
      results.push({
        type: 'Request Cache - Error',
        duration: '0',
        status: 'Error',
        data: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setDemoResults(prev => [...prev, ...results]);
    setIsLoading(false);
  };

  // 演示数据级缓存（Data Cache）
  const demoDataCache = async () => {
    setIsLoading(true);
    const results: any[] = [];
    
    try {
      // 模拟数据获取函数
      const fetchUserData = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        return response.json();
      };

      // 获取最优缓存配置
      const config = dataManager.getOptimalCacheConfig('user-profile', 'frequent', 'small');
      
      // 第一次数据获取
      const start1 = performance.now();
      const data1 = await dataManager.getCachedData('user-1', fetchUserData, config);
      const time1 = performance.now() - start1;
      results.push({
        type: 'Data Cache - First Fetch',
        duration: time1.toFixed(2),
        status: 'Cache Miss',
        data: `${data1.name} (${data1.email})`
      });

    } catch (error) {
      results.push({
        type: 'Data Cache - Error',
        duration: '0',
        status: 'Error',
        data: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setDemoResults(prev => [...prev, ...results]);
    setIsLoading(false);
  };

  // 清除演示结果
  const clearResults = () => {
    setDemoResults([]);
    requestManager.clearCache();
  };

  return (
    <div className="three-layer-cache-demo">
      <div className="demo-header">
        <h2>三层缓存架构演示</h2>
        <p>展示请求级、数据级、页面级缓存的工作原理和优化效果</p>
      </div>

      {/* 缓存统计面板 */}
      <section className="cache-stats-panel">
        <h3>缓存性能统计</h3>
        <div className="stats-grid">
          <div className="stat-card request-cache">
            <h4>请求级缓存</h4>
            <div className="stat-item">
              <span className="stat-label">命中率:</span>
              <span className="stat-value">{(requestStats.hitRate * 100).toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">总请求:</span>
              <span className="stat-value">{requestStats.totalRequests}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">缓存大小:</span>
              <span className="stat-value">{requestStats.cacheSize}</span>
            </div>
          </div>

          <div className="stat-card data-cache">
            <h4>数据级缓存</h4>
            <div className="stat-item">
              <span className="stat-label">命中率:</span>
              <span className="stat-value">{(dataStats.hitRate * 100).toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">平均响应:</span>
              <span className="stat-value">{dataStats.avgResponseTime.toFixed(0)}ms</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">总请求:</span>
              <span className="stat-value">{dataStats.totalRequests}</span>
            </div>
          </div>

          <div className="stat-card page-cache">
            <h4>页面级缓存</h4>
            <div className="stat-item">
              <span className="stat-label">重新验证:</span>
              <span className="stat-value">{pageStats.revalidateTime}s</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">标签数:</span>
              <span className="stat-value">{pageStats.tags.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">状态:</span>
              <span className="stat-value status-active">活跃</span>
            </div>
          </div>
        </div>
      </section>

      {/* 演示控制面板 */}
      <section className="demo-control-panel">
        <h3>缓存演示控制</h3>
        <div className="control-buttons">
          <button 
            onClick={demoRequestCache} 
            disabled={isLoading}
            className="demo-button request-demo"
          >
            {isLoading ? '演示中...' : '演示请求级缓存'}
          </button>
          
          <button 
            onClick={demoDataCache} 
            disabled={isLoading}
            className="demo-button data-demo"
          >
            {isLoading ? '演示中...' : '演示数据级缓存'}
          </button>
          
          <button 
            onClick={clearResults} 
            className="demo-button clear-demo"
          >
            清除结果
          </button>
        </div>
      </section>

      {/* 演示结果 */}
      {demoResults.length > 0 && (
        <section className="demo-results">
          <h3>演示结果</h3>
          <div className="results-list">
            {demoResults.map((result, index) => (
              <div key={index} className={`result-item ${result.status.toLowerCase()}`}>
                <div className="result-header">
                  <span className="result-type">{result.type}</span>
                  <span className="result-status">{result.status}</span>
                </div>
                <div className="result-details">
                  <span className="result-duration">{result.duration}ms</span>
                  <span className="result-data">{result.data}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}