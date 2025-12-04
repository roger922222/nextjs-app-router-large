'use client';

import { useState, useEffect } from 'react';

export default function SmartCachingDemo() {
  const [cacheStats, setCacheStats] = useState({
    requestCache: { hits: 0, misses: 0 },
    dataCache: { hits: 0, misses: 0 },
    pageCache: { hits: 0, misses: 0 }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState('');

  // 模拟请求缓存演示
  const simulateRequestCache = () => {
    setActiveDemo('request');
    setIsLoading(true);
    
    setTimeout(() => {
      setCacheStats(prev => ({
        ...prev,
        requestCache: { hits: prev.requestCache.hits + 1, misses: prev.requestCache.misses }
      }));
      setIsLoading(false);
    }, 500);
  };

  // 模拟数据缓存演示
  const simulateDataCache = () => {
    setActiveDemo('data');
    setIsLoading(true);
    
    setTimeout(() => {
      setCacheStats(prev => ({
        ...prev,
        dataCache: { hits: prev.dataCache.hits + 1, misses: prev.dataCache.misses }
      }));
      setIsLoading(false);
    }, 800);
  };

  // 模拟页面缓存演示
  const simulatePageCache = () => {
    setActiveDemo('page');
    setIsLoading(true);
    
    setTimeout(() => {
      setCacheStats(prev => ({
        ...prev,
        pageCache: { hits: prev.pageCache.hits + 1, misses: prev.pageCache.misses }
      }));
      setIsLoading(false);
    }, 1200);
  };

  // 模拟缓存失效
  const simulateCacheInvalidation = () => {
    setActiveDemo('invalidate');
    setIsLoading(true);
    
    setTimeout(() => {
      setCacheStats({
        requestCache: { hits: 0, misses: 1 },
        dataCache: { hits: 0, misses: 1 },
        pageCache: { hits: 0, misses: 1 }
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">智能缓存策略演示</h1>
        <p className="text-gray-600">
          展示三层缓存架构（请求级、数据级、页面级）和智能缓存管理
        </p>
      </div>

      {/* 缓存统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">请求缓存</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">命中次数</span>
              <span className="font-medium">{cacheStats.requestCache.hits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">未命中次数</span>
              <span className="font-medium">{cacheStats.requestCache.misses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">命中率</span>
              <span className="font-medium text-green-600">
                {cacheStats.requestCache.hits + cacheStats.requestCache.misses > 0 
                  ? Math.round((cacheStats.requestCache.hits / (cacheStats.requestCache.hits + cacheStats.requestCache.misses)) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-600">数据缓存</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">命中次数</span>
              <span className="font-medium">{cacheStats.dataCache.hits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">未命中次数</span>
              <span className="font-medium">{cacheStats.dataCache.misses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">命中率</span>
              <span className="font-medium text-green-600">
                {cacheStats.dataCache.hits + cacheStats.dataCache.misses > 0 
                  ? Math.round((cacheStats.dataCache.hits / (cacheStats.dataCache.hits + cacheStats.dataCache.misses)) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">页面缓存</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">命中次数</span>
              <span className="font-medium">{cacheStats.pageCache.hits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">未命中次数</span>
              <span className="font-medium">{cacheStats.pageCache.misses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">命中率</span>
              <span className="font-medium text-green-600">
                {cacheStats.pageCache.hits + cacheStats.pageCache.misses > 0 
                  ? Math.round((cacheStats.pageCache.hits / (cacheStats.pageCache.hits + cacheStats.pageCache.misses)) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 演示控制 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={simulateRequestCache}
          disabled={isLoading}
          className="bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading && activeDemo === 'request' ? '模拟中...' : '测试请求缓存'}
        </button>
        
        <button 
          onClick={simulateDataCache}
          disabled={isLoading}
          className="bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading && activeDemo === 'data' ? '模拟中...' : '测试数据缓存'}
        </button>
        
        <button 
          onClick={simulatePageCache}
          disabled={isLoading}
          className="bg-purple-600 text-white py-3 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading && activeDemo === 'page' ? '模拟中...' : '测试页面缓存'}
        </button>
        
        <button 
          onClick={simulateCacheInvalidation}
          disabled={isLoading}
          className="bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading && activeDemo === 'invalidate' ? '失效中...' : '缓存失效'}
        </button>
      </div>

      {/* 演示结果 */}
      {activeDemo && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">演示结果</h3>
          
          {activeDemo === 'request' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">请求缓存 (Request Memoization)</h4>
              <p className="text-blue-700 text-sm mb-2">
                ✅ 同一渲染上下文中的相同请求被去重，只执行一次后端调用
              </p>
              <p className="text-blue-600 text-xs">
                适用于React组件树中多次调用相同API的场景
              </p>
            </div>
          )}
          
          {activeDemo === 'data' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">数据缓存 (Data Cache)</h4>
              <p className="text-green-700 text-sm mb-2">
                ✅ 通过fetch的next.tags和revalidate配置实现数据级缓存
              </p>
              <p className="text-green-600 text-xs">
                支持按需重验证，适用于需要缓存的API数据
              </p>
            </div>
          )}
          
          {activeDemo === 'page' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-2">页面缓存 (Full Route Cache)</h4>
              <p className="text-purple-700 text-sm mb-2">
                ✅ 整个页面在CDN和服务器端缓存，大幅提升响应速度
              </p>
              <p className="text-purple-600 text-xs">
                适用于静态或半静态内容，支持时间-based和事件-based失效
              </p>
            </div>
          )}
          
          {activeDemo === 'invalidate' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">缓存失效</h4>
              <p className="text-red-700 text-sm mb-2">
                ✅ 通过revalidateTag和revalidatePath实现精确的缓存失效
              </p>
              <p className="text-red-600 text-xs">
                支持标签级和路径级失效，确保数据一致性
              </p>
            </div>
          )}
        </div>
      )}

      {/* 性能对比 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">性能对比</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">❌ 无缓存</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• 响应时间: 800-1200ms</li>
              <li>• 服务器负载: 高</li>
              <li>• 网络开销: 大</li>
              <li>• 用户体验: 较差</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ 三层缓存</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 响应时间: 50-200ms (-85%)</li>
              <li>• 服务器负载: 极低</li>
              <li>• 网络开销: 最小化</li>
              <li>• 用户体验: 优秀</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 技术说明 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">技术实现说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 text-blue-600">请求级缓存</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• React渲染上下文内去重</li>
              <li>• 自动请求记忆化</li>
              <li>• 零配置实现</li>
              <li>• 适用于组件树重复请求</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-green-600">数据级缓存</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• fetch API集成</li>
              <li>• 标签化缓存管理</li>
              <li>• 智能失效策略</li>
              <li>• 支持按需重验证</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-purple-600">页面级缓存</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• CDN边缘缓存</li>
              <li>• 服务器端渲染缓存</li>
              <li>• 路由级别配置</li>
              <li>• 支持时间/事件失效</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}