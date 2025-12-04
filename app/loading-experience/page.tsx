'use client';

import { useState, useEffect } from 'react';

export default function SimpleLoadingExperienceDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeDemo, setActiveDemo] = useState('');

  // 模拟骨架屏加载
  const simulateSkeletonLoading = () => {
    setActiveDemo('skeleton');
    setIsLoading(true);
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // 模拟渐进式加载
  const simulateProgressiveLoading = () => {
    setActiveDemo('progressive');
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // 模拟智能加载状态
  const simulateSmartLoading = () => {
    setActiveDemo('smart');
    setIsLoading(true);
    setLoadingProgress(0);
    
    const stages = [
      { progress: 25, delay: 500, stage: '初始化' },
      { progress: 50, delay: 1000, stage: '加载数据' },
      { progress: 75, delay: 1500, stage: '处理中' },
      { progress: 100, delay: 2000, stage: '完成' }
    ];

    stages.forEach(({ progress, delay, stage }) => {
      setTimeout(() => {
        setLoadingProgress(progress);
        if (progress === 100) {
          setTimeout(() => setIsLoading(false), 500);
        }
      }, delay);
    });
  };

  // 骨架屏组件
  const SkeletonLoader = ({ type = 'card' }: { type?: 'card' | 'list' | 'text' }) => {
    if (type === 'card') {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          <div className="flex mt-4 space-x-2">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      );
    }
    
    if (type === 'list') {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6 animate-pulse"></div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">加载体验优化演示</h1>
        <p className="text-gray-600">
          展示骨架屏、渐进式加载和智能加载状态管理
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">骨架屏演示</h3>
          <p className="text-sm text-gray-600 mb-4">展示内容加载前的占位效果</p>
          <button 
            onClick={simulateSkeletonLoading}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            开始骨架屏演示
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">渐进式加载</h3>
          <p className="text-sm text-gray-600 mb-4">图片从模糊到清晰的加载过程</p>
          <button 
            onClick={simulateProgressiveLoading}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          >
            开始渐进式演示
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">智能加载状态</h3>
          <p className="text-sm text-gray-600 mb-4">分阶段显示加载进度</p>
          <button 
            onClick={simulateSmartLoading}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            开始智能加载演示
          </button>
        </div>
      </div>

      {/* 演示区域 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">演示区域</h3>
        
        {isLoading && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">加载进度</span>
              <span className="text-sm font-medium">{loadingProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 骨架屏效果 */}
          <div>
            <h4 className="font-medium mb-3">骨架屏效果</h4>
            {activeDemo === 'skeleton' && isLoading ? (
              <div className="space-y-4">
                <SkeletonLoader type="card" />
                <SkeletonLoader type="list" />
                <SkeletonLoader type="text" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-6">
                  <h5 className="font-semibold mb-2">内容已加载</h5>
                  <p className="text-gray-600 text-sm">这是实际的内容，骨架屏会在加载时显示占位效果。</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">A</span>
                    </div>
                    <div>
                      <h5 className="font-medium">用户头像</h5>
                      <p className="text-gray-600 text-sm">列表项内容</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 渐进式图片 */}
          <div>
            <h4 className="font-medium mb-3">渐进式图片加载</h4>
            {activeDemo === 'progressive' && isLoading ? (
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="text-gray-500 mb-2">图片加载中...</div>
                  <div className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold">示例图片</span>
                  </div>
                  <div className="p-4">
                    <h5 className="font-semibold">图片已加载</h5>
                    <p className="text-gray-600 text-sm">渐进式加载会先显示模糊版本，然后逐渐清晰。</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 加载动画效果 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">加载动画效果</h3>
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="flex space-x-1 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '100ms'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></div>
            </div>
            <p className="text-sm text-gray-600">点状动画</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-600">旋转动画</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse mb-2"></div>
            <p className="text-sm text-gray-600">脉冲动画</p>
          </div>
        </div>
      </div>

      {/* 技术说明 */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">技术实现说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">骨架屏原理</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 使用CSS动画创建脉冲效果</li>
              <li>• 模拟内容结构的占位符</li>
              <li>• 提升用户感知性能</li>
              <li>• 减少加载焦虑</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">渐进式加载</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 先显示低质量占位图</li>
              <li>• 逐步替换为高质量图片</li>
              <li>• 平滑的过渡动画</li>
              <li>• 优化视觉体验</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}