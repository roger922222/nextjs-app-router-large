'use client';

import { useState, useEffect } from 'react';

export default function CriticalRenderingDemo() {
  const [optimizationEnabled, setOptimizationEnabled] = useState(false);
  const [loadTime, setLoadTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟页面加载测试
  const simulatePageLoad = (optimized: boolean) => {
    setIsLoading(true);
    const startTime = Date.now();
    
    // 模拟不同的加载时间
    const baseTime = optimized ? 800 : 1500; // 优化后更快
    const randomDelay = Math.random() * 300;
    
    setTimeout(() => {
      const endTime = Date.now();
      setLoadTime(endTime - startTime);
      setIsLoading(false);
    }, baseTime + randomDelay);
  };

  const handleOptimizationToggle = () => {
    const newState = !optimizationEnabled;
    setOptimizationEnabled(newState);
    simulatePageLoad(newState);
  };

  const handleTestLoad = () => {
    simulatePageLoad(optimizationEnabled);
  };

  useEffect(() => {
    // 初始加载测试
    simulatePageLoad(false);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">关键渲染路径优化演示</h1>
        <p className="text-gray-600">
          展示关键CSS内联、资源预加载、渲染阻塞优化等技术
        </p>
      </div>

      {/* 控制面板 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">优化控制</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium">关键渲染路径优化</h3>
            <p className="text-sm text-gray-600">启用CSS内联、资源预加载等优化</p>
          </div>
          <button
            onClick={handleOptimizationToggle}
            className={`px-4 py-2 rounded font-medium ${
              optimizationEnabled 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {optimizationEnabled ? '优化已启用' : '启用优化'}
          </button>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleTestLoad}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '加载中...' : '测试页面加载'}
          </button>
        </div>
      </div>

      {/* 性能对比 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">优化前</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">首次内容绘制 (FCP)</span>
              <span className="font-medium">1.8s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">最大内容绘制 (LCP)</span>
              <span className="font-medium">2.5s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">累积布局偏移 (CLS)</span>
              <span className="font-medium">0.15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">总阻塞时间 (TBT)</span>
              <span className="font-medium">350ms</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">优化后</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">首次内容绘制 (FCP)</span>
              <span className="font-medium text-green-600">1.1s (-39%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">最大内容绘制 (LCP)</span>
              <span className="font-medium text-green-600">1.6s (-36%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">累积布局偏移 (CLS)</span>
              <span className="font-medium text-green-600">0.05 (-67%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">总阻塞时间 (TBT)</span>
              <span className="font-medium text-green-600">180ms (-49%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 当前测试结果 */}
      {loadTime > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">当前测试结果</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">模拟页面加载时间</p>
              <p className="text-2xl font-bold">
                {loadTime}ms
                {optimizationEnabled && (
                  <span className="text-green-600 text-sm ml-2">✓ 已优化</span>
                )}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              optimizationEnabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {optimizationEnabled ? '优化模式' : '标准模式'}
            </div>
          </div>
        </div>
      )}

      {/* 优化技术详解 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">优化技术详解</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3 text-blue-600">关键CSS内联</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 提取首屏关键CSS并内联到HTML中</li>
              <li>• 减少渲染阻塞资源数量</li>
              <li>• 提升首次内容绘制速度</li>
              <li>• 异步加载非关键CSS</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-green-600">资源预加载</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 使用link rel="preload"预加载关键资源</li>
              <li>• 智能预测用户行为预加载</li>
              <li>• DNS预解析和预连接</li>
              <li>• 优化资源加载优先级</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-purple-600">渲染阻塞优化</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 延迟加载非关键JavaScript</li>
              <li>• 异步加载第三方脚本</li>
              <li>• 优化字体加载策略</li>
              <li>• 减少重排和重绘</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-orange-600">布局优化</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 预留图片和广告空间</li>
              <li>• 使用CSS containment</li>
              <li>• 优化动画性能</li>
              <li>• 减少布局抖动</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 实施建议 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">实施建议</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-xl">1</span>
            </div>
            <h3 className="font-medium mb-2">分析关键路径</h3>
            <p className="text-sm text-gray-600">
              使用Chrome DevTools的Performance面板分析渲染阻塞资源
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold text-xl">2</span>
            </div>
            <h3 className="font-medium mb-2">优化CSS加载</h3>
            <p className="text-sm text-gray-600">
              内联关键CSS，异步加载非关键样式，使用媒体查询优化
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold text-xl">3</span>
            </div>
            <h3 className="font-medium mb-2">预加载关键资源</h3>
            <p className="text-sm text-gray-600">
              使用preload、prefetch、preconnect优化资源加载顺序
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}