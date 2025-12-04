// components/CriticalRenderDemo.tsx
"use client";

import { useState, useEffect } from 'react';
import { 
  criticalInlineStyles, 
  performanceTargets,
  detectRenderBlockingResources,
  optimizeCriticalResources,
  preventLayoutShift
} from '@/lib/critical-css';
import './CriticalRenderDemo.css';

/**
 * 关键渲染路径优化演示组件
 * 展示如何优化首屏渲染性能
 */
export function CriticalRenderDemo() {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    cls: 0,
    ttfb: 0
  });
  const [blockingResources, setBlockingResources] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // 测量核心Web指标
  useEffect(() => {
    const measureMetrics = () => {
      if ('performance' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: Math.round(entry.startTime) }));
            } else if (entry.name === 'largest-contentful-paint') {
              setMetrics(prev => ({ ...prev, lcp: Math.round(entry.startTime) }));
            } else if (entry.entryType === 'layout-shift') {
              setMetrics(prev => ({ ...prev, cls: prev.cls + (entry as any).value }));
            }
          }
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });

        // 测量TTFB
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          setMetrics(prev => ({ ...prev, ttfb: navigation.responseStart - navigation.requestStart }));
        }

        return () => observer.disconnect();
      }
    };

    measureMetrics();
  }, []);

  // 检测渲染阻塞资源
  const detectBlockingResources = () => {
    const resources = detectRenderBlockingResources();
    setBlockingResources(resources);
  };

  // 应用关键渲染优化
  const applyOptimizations = () => {
    setIsOptimizing(true);
    
    // 应用关键资源优化
    optimizeCriticalResources();
    
    // 预防布局偏移
    preventLayoutShift();
    
    setTimeout(() => {
      setIsOptimizing(false);
      // 重新测量指标
      detectBlockingResources();
    }, 2000);
  };

  // 检查性能是否达标
  const isPerformanceGood = () => {
    return (
      metrics.fcp <= performanceTargets.firstContentfulPaint &&
      metrics.lcp <= performanceTargets.largestContentfulPaint &&
      metrics.cls <= performanceTargets.cumulativeLayoutShift &&
      metrics.ttfb <= performanceTargets.timeToFirstByte
    );
  };

  return (
    <div className="critical-render-demo">
      <div className="demo-header">
        <h2>关键渲染路径优化演示</h2>
        <p>展示如何优化首屏渲染性能，减少阻塞资源，提升用户体验</p>
      </div>

      {/* 性能指标监控 */}
      <section className="performance-metrics">
        <h3>核心Web指标</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">First Contentful Paint</div>
            <div className="metric-value">
              {metrics.fcp}ms
              <span className={`metric-status ${metrics.fcp <= performanceTargets.firstContentfulPaint ? 'good' : 'poor'}`}>
                {metrics.fcp <= performanceTargets.firstContentfulPaint ? '✅ 达标' : '❌ 超标'}
              </span>
            </div>
            <div className="metric-target">目标: ≤{performanceTargets.firstContentfulPaint}ms</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Largest Contentful Paint</div>
            <div className="metric-value">
              {metrics.lcp}ms
              <span className={`metric-status ${metrics.lcp <= performanceTargets.largestContentfulPaint ? 'good' : 'poor'}`}>
                {metrics.lcp <= performanceTargets.largestContentfulPaint ? '✅ 达标' : '❌ 超标'}
              </span>
            </div>
            <div className="metric-target">目标: ≤{performanceTargets.largestContentfulPaint}ms</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Cumulative Layout Shift</div>
            <div className="metric-value">
              {metrics.cls.toFixed(3)}
              <span className={`metric-status ${metrics.cls <= performanceTargets.cumulativeLayoutShift ? 'good' : 'poor'}`}>
                {metrics.cls <= performanceTargets.cumulativeLayoutShift ? '✅ 达标' : '❌ 超标'}
              </span>
            </div>
            <div className="metric-target">目标: ≤{performanceTargets.cumulativeLayoutShift}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Time to First Byte</div>
            <div className="metric-value">
              {metrics.ttfb}ms
              <span className={`metric-status ${metrics.ttfb <= performanceTargets.timeToFirstByte ? 'good' : 'poor'}`}>
                {metrics.ttfb <= performanceTargets.timeToFirstByte ? '✅ 达标' : '❌ 超标'}
              </span>
            </div>
            <div className="metric-target">目标: ≤{performanceTargets.timeToFirstByte}ms</div>
          </div>
        </div>

        <div className={`overall-performance ${isPerformanceGood() ? 'good' : 'poor'}`}>
          <h4>整体性能评估</h4>
          <p>{isPerformanceGood() ? '🎉 性能表现良好！' : '⚠️ 需要优化提升'}</p>
        </div>
      </section>

      {/* 渲染阻塞资源检测 */}
      <section className="blocking-resources">
        <h3>渲染阻塞资源检测</h3>
        <button onClick={detectBlockingResources} className="detect-button">
          检测阻塞资源
        </button>
        
        {blockingResources.length > 0 && (
          <div className="resources-list">
            <h4>发现的阻塞资源 ({blockingResources.length}):</h4>
            <ul>
              {blockingResources.map((resource, index) => (
                <li key={index} className="resource-item">
                  <span className="resource-type">{resource.includes('.css') ? '🎨 CSS' : '⚡ JS'}</span>
                  <span className="resource-url">{resource}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 优化建议 */}
      <section className="optimization-suggestions">
        <h3>关键渲染优化建议</h3>
        <div className="suggestions-grid">
          <div className="suggestion-card">
            <h4>🚀 内联关键CSS</h4>
            <p>将首屏渲染所需的关键CSS内联到HTML中，减少额外的HTTP请求</p>
            <div className="code-example">
              <pre>{`<style>
  /* 关键样式 */
  .header { background: #fff; }
  .nav { display: flex; }
</style>`}</pre>
            </div>
          </div>

          <div className="suggestion-card">
            <h4>🔄 异步加载非关键CSS</h4>
            <p>使用media属性或JavaScript异步加载非关键CSS文件</p>
            <div className="code-example">
              <pre>{`<link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">`}</pre>
            </div>
          </div>

          <div className="suggestion-card">
            <h4>⚡ 优化JavaScript加载</h4>
            <p>将非关键JavaScript设置为async或defer，避免阻塞渲染</p>
            <div className="code-example">
              <pre>{`<script src="app.js" defer></script>
<script src="analytics.js" async></script>`}</pre>
            </div>
          </div>

          <div className="suggestion-card">
            <h4>🎯 字体显示优化</h4>
            <p>使用font-display: swap优化字体加载，避免FOIT</p>
            <div className="code-example">
              <pre>{`@font-face {
  font-family: 'Custom';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}`}</pre>
            </div>
          </div>

          <div className="suggestion-card">
            <h4>📏 预防布局偏移</h4>
            <p>为图片和动态内容预留空间，减少CLS指标</p>
            <div className="code-example">
              <pre>{`<img width="300" height="200" alt="..." />
<div style="min-height: 250px">动态内容</div>`}</pre>
            </div>
          </div>

          <div className="suggestion-card">
            <h4>🗂️ 资源预加载</h4>
            <p>使用rel="preload"预加载关键资源</p>
            <div className="code-example">
              <pre>{`<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* 应用优化 */}
      <section className="apply-optimizations">
        <h3>应用关键渲染优化</h3>
        <button 
          onClick={applyOptimizations} 
          className="optimize-button"
          disabled={isOptimizing}
        >
          {isOptimizing ? '优化中...' : '应用优化'}
        </button>
        
        {isOptimizing && (
          <div className="optimization-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <p>正在应用关键渲染优化...</p>
          </div>
        )}
      </section>

      {/* 关键CSS展示 */}
      <section className="critical-css-showcase">
        <h3>关键CSS示例</h3>
        <div className="css-showcase">
          <div className="css-example">
            <h4>内联关键CSS</h4>
            <div className="code-block">
              <pre>{`<style>
  /* 导航栏关键样式 */
  .nav {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  /* 主要内容区域 */
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  /* 基础排版 */
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #fff;
  }
</style>`}</pre>
            </div>
          </div>

          <div className="css-example">
            <h4>优化后的CSS加载</h4>
            <div className="code-block">
              <pre>{`<!-- 关键CSS内联 -->
<style>
  /* 首屏关键样式 */
  .header { /* ... */ }
  .nav { /* ... */ }
  .hero { /* ... */ }
</style>

<!-- 非关键CSS异步加载 -->
<link rel="preload" 
      href="/css/components.css" 
      as="style" 
      onload="this.onload=null;this.rel='stylesheet'">

<!-- 字体预加载 -->
<link rel="preload" 
      href="/fonts/inter.woff2" 
      as="font" 
      type="font/woff2" 
      crossorigin>`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* 性能提升对比 */}
      <section className="performance-comparison">
        <h3>优化前后对比</h3>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>指标</th>
                <th>优化前</th>
                <th>优化后</th>
                <th>提升</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>First Contentful Paint</td>
                <td>~2500ms</td>
                <td>~1200ms</td>
                <td className="improvement">52% ⬇️</td>
              </tr>
              <tr>
                <td>Largest Contentful Paint</td>
                <td>~3500ms</td>
                <td>~1800ms</td>
                <td className="improvement">49% ⬇️</td>
              </tr>
              <tr>
                <td>Cumulative Layout Shift</td>
                <td>~0.25</td>
                <td>~0.05</td>
                <td className="improvement">80% ⬇️</td>
              </tr>
              <tr>
                <td>Time to Interactive</td>
                <td>~4000ms</td>
                <td>~2200ms</td>
                <td className="improvement">45% ⬇️</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}