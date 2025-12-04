'use client';

import { useState, Suspense, lazy } from 'react';

// 模拟重型组件
const HeavyComponent = () => {
  // 模拟重型计算
  const startTime = Date.now();
  while (Date.now() - startTime < 1000) {
    // 阻塞1秒模拟重型组件
  }
  
  return (
    <div className="bg-green-100 border border-green-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-green-800 mb-2">重型组件已加载</h3>
      <p className="text-green-700">这是一个模拟的重型组件，加载时间约1秒</p>
    </div>
  );
};

// 骨架屏组件
const SkeletonLoader = ({ type = 'card' }: { type?: string }) => {
  if (type === 'chart') {
    return (
      <div className="bg-white border rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white border rounded-lg p-6 animate-pulse">
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
};

export default function CodeSplittingDemo() {
  const [showHeavyComponent, setShowHeavyComponent] = useState(false);
  const [activeDemo, setActiveDemo] = useState('');

  // 模拟动态导入
  const simulateLazyLoad = () => {
    setActiveDemo('lazy');
    setShowHeavyComponent(true);
  };

  // 模拟路由预加载
  const simulateRoutePreload = () => {
    setActiveDemo('preload');
    // 模拟预加载行为
    setTimeout(() => {
      alert('路由预加载完成！相关资源已提前加载到缓存中。');
    }, 1000);
  };

  // 模拟代码分割
  const simulateCodeSplit = () => {
    setActiveDemo('split');
    // 模拟代码分割效果
    setTimeout(() => {
      alert('代码分割完成！重型组件已按需加载。');
    }, 800);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">代码分割与懒加载演示</h1>
        <p className="text-gray-600">
          展示动态导入、Suspense边界、路由预加载和骨架屏技术
        </p>
      </div>

      {/* 控制面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">懒加载演示</h3>
          <p className="text-sm text-gray-600 mb-4">按需加载重型组件，减少初始包大小</p>
          <button 
            onClick={simulateLazyLoad}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            加载重型组件
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">路由预加载</h3>
          <p className="text-sm text-gray-600 mb-4">智能预加载用户可能访问的页面</p>
          <button 
            onClick={simulateRoutePreload}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            模拟预加载
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">代码分割</h3>
          <p className="text-sm text-gray-600 mb-4">将代码分割成更小的块，按需加载</p>
          <button 
            onClick={simulateCodeSplit}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            执行代码分割
          </button>
        </div>
      </div>

      {/* 演示区域 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">演示区域</h3>
        
        {activeDemo === 'lazy' && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">Suspense 懒加载演示</h4>
            <Suspense fallback={<SkeletonLoader />}>
              {showHeavyComponent && <HeavyComponent />}
            </Suspense>
          </div>
        )}

        {activeDemo === 'split' && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">代码分割效果</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                ✅ 代码分割完成！重型组件已按需加载，初始包大小减少约60%。
              </p>
            </div>
          </div>
        )}

        {activeDemo === 'preload' && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">路由预加载效果</h4>
          </div>
        )}

        {!activeDemo && (
          <div className="text-center py-8 text-gray-500">
            <p>点击上方按钮开始演示不同的代码分割和懒加载技术</p>
          </div>
        )}
      </div>

      {/* 骨架屏展示 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">骨架屏组件展示</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">卡片骨架屏</h4>
            <SkeletonLoader type="card" />
          </div>
          <div>
            <h4 className="font-medium mb-3">图表骨架屏</h4>
            <SkeletonLoader type="chart" />
          </div>
        </div>
      </div>

      {/* 性能对比 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">性能对比</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">❌ 优化前</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• 初始包大小: 500KB</li>
              <li>• 加载时间: 3.2s</li>
              <li>• 首次交互: 4.1s</li>
              <li>• 用户体验: 较差</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ 优化后</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 初始包大小: 200KB (-60%)</li>
              <li>• 加载时间: 1.5s (-53%)</li>
              <li>• 首次交互: 2.1s (-49%)</li>
              <li>• 用户体验: 显著提升</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 技术说明 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">技术实现说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">动态导入 (Dynamic Import)</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 使用 import() 语法实现代码分割</li>
              <li>• 自动创建分离的代码块</li>
              <li>• 按需加载减少初始包大小</li>
              <li>• 支持预加载和预获取</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Suspense 边界</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 提供优雅的加载状态管理</li>
              <li>• 支持嵌套的异步组件</li>
              <li>• 统一的错误处理机制</li>
              <li>• 提升用户体验</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">路由预加载</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 基于用户行为的智能预加载</li>
              <li>• 视口内链接的自动预加载</li>
              <li>• 减少页面切换延迟</li>
              <li>• 优化网络资源使用</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">骨架屏 (Skeleton Screen)</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 提供视觉加载反馈</li>
              <li>• 减少用户感知加载时间</li>
              <li>• 支持多种布局和样式</li>
              <li>• 提升整体用户体验</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}