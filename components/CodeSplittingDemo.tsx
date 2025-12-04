// components/CodeSplittingDemo.tsx
"use client";

import { useState, useEffect, Suspense, lazy } from 'react';
import { DynamicComponents, useSmartPreload, CodeSplitMonitor } from '@/lib/dynamic-imports';
import './CodeSplittingDemo.css';

// 动态导入的演示组件
const HeavyChart = lazy(() => import('./demo-components/HeavyChart'));
const DataTable = lazy(() => import('./demo-components/DataTable'));
const RichEditor = lazy(() => import('./demo-components/RichEditor'));
const ComplexForm = lazy(() => import('./demo-components/ComplexForm'));

/**
 * 代码分割与懒加载演示组件
 * 展示如何通过动态导入优化应用性能
 */
export function CodeSplittingDemo() {
  const [activeDemo, setActiveDemo] = useState<string>('');
  const [loadStats, setLoadStats] = useState({
    totalComponents: 0,
    averageLoadTime: 0,
    slowestComponent: '',
    errorCount: 0
  });

  const { preloadBasedOnHover, getPreloadStats } = useSmartPreload();
  const monitor = CodeSplitMonitor.getInstance();

  // 更新加载统计
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = monitor.getLoadStats();
      setLoadStats(stats);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 模拟组件加载
  const loadComponent = async (componentName: string) => {
    const startTime = performance.now();
    
    try {
      setActiveDemo(componentName);
      
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const loadTime = performance.now() - startTime;
      monitor.recordLoadTime(componentName, loadTime);
      
    } catch (error) {
      monitor.recordError(componentName, error as Error);
    }
  };

  // 预加载组件
  const preloadComponent = (componentName: string) => {
    preloadBasedOnHover(componentName);
    console.log(`预加载组件: ${componentName}`);
  };

  return (
    <div className="code-splitting-demo">
      <div className="demo-header">
        <h2>代码分割与懒加载演示</h2>
        <p>展示如何通过动态导入优化应用性能，减少初始包大小</p>
      </div>

      {/* 性能统计面板 */}
      <section className="performance-stats">
        <h3>代码分割性能统计</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>总组件数</h4>
            <div className="stat-value">{loadStats.totalComponents}</div>
          </div>
          <div className="stat-card">
            <h4>平均加载时间</h4>
            <div className="stat-value">{loadStats.averageLoadTime.toFixed(0)}ms</div>
          </div>
          <div className="stat-card">
            <h4>最慢组件</h4>
            <div className="stat-value">{loadStats.slowestComponent || 'N/A'}</div>
          </div>
          <div className="stat-card">
            <h4>错误数</h4>
            <div className="stat-value">{loadStats.errorCount}</div>
          </div>
        </div>
      </section>

      {/* 组件选择器 */}
      <section className="component-selector">
        <h3>选择要加载的组件</h3>
        <div className="component-buttons">
          <button 
            onClick={() => loadComponent('chart')}
            onMouseEnter={() => preloadComponent('chart')}
            className={`component-button ${activeDemo === 'chart' ? 'active' : ''}`}
          >
            📊 图表组件
          </button>
          
          <button 
            onClick={() => loadComponent('table')}
            onMouseEnter={() => preloadComponent('table')}
            className={`component-button ${activeDemo === 'table' ? 'active' : ''}`}
          >
            📋 数据表格
          </button>
          
          <button 
            onClick={() => loadComponent('editor')}
            onMouseEnter={() => preloadComponent('editor')}
            className={`component-button ${activeDemo === 'editor' ? 'active' : ''}`}
          >
            📝 富文本编辑器
          </button>
          
          <button 
            onClick={() => loadComponent('form')}
            onMouseEnter={() => preloadComponent('form')}
            className={`component-button ${activeDemo === 'form' ? 'active' : ''}`}
          >
            📝 复杂表单
          </button>
        </div>
      </section>

      {/* 动态组件展示区域 */}
      <section className="dynamic-components">
        <h3>动态组件展示</h3>
        <div className="components-container">
          <Suspense fallback={<div className="loading-placeholder">组件加载中...</div>}>
            {activeDemo === 'chart' && <HeavyChart />}
            {activeDemo === 'table' && <DataTable />}
            {activeDemo === 'editor' && <RichEditor />}
            {activeDemo === 'form' && <ComplexForm />}
            {!activeDemo && (
              <div className="empty-state">
                <p>请选择一个组件来查看懒加载效果</p>
              </div>
            )}
          </Suspense>
        </div>
      </section>

      {/* 预加载演示 */}
      <section className="preload-demo">
        <h3>智能预加载演示</h3>
        <div className="preload-controls">
          <button 
            onClick={() => {
              const stats = getPreloadStats();
              console.log('预加载统计:', stats);
            }}
            className="preload-button"
          >
            查看预加载统计
          </button>
          
          <button 
            onClick={() => {
              preloadComponent('chart');
              preloadComponent('table');
              preloadComponent('editor');
            }}
            className="preload-button"
          >
            批量预加载
          </button>
        </div>
      </section>

      {/* 代码分割优势 */}
      <section className="splitting-benefits">
        <h3>代码分割优势</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <h4>🚀 更快的初始加载</h4>
            <p>只加载当前页面需要的代码，减少初始包大小</p>
          </div>
          <div className="benefit-item">
            <h4>💾 更好的缓存策略</h4>
            <p>未修改的模块可以长期缓存，提高缓存命中率</p>
          </div>
          <div className="benefit-item">
            <h4>⚡ 按需加载</h4>
            <p>用户需要时才加载相关代码，减少不必要的网络请求</p>
          </div>
          <div className="benefit-item">
            <h4>🎯 智能预加载</h4>
            <p>基于用户行为预测，提前加载可能需要的组件</p>
          </div>
        </div>
      </section>

      {/* 最佳实践 */}
      <section className="best-practices">
        <h3>代码分割最佳实践</h3>
        <div className="practices-list">
          <div className="practice-item">
            <h4>1. 按路由分割</h4>
            <p>每个路由对应一个独立的代码块，实现路由级别的懒加载</p>
          </div>
          <div className="practice-item">
            <h4>2. 按功能模块分割</h4>
            <p>将大型功能模块拆分为独立的代码块，按需加载</p>
          </div>
          <div className="practice-item">
            <h4>3. 使用Suspense边界</h4>
            <p>为懒加载组件提供加载状态，改善用户体验</p>
          </div>
          <div className="practice-item">
            <h4>4. 合理设置加载延迟</h4>
            <p>避免加载过快的组件显示闪烁，设置适当的延迟时间</p>
          </div>
        </div>
      </section>
    </div>
  );
}