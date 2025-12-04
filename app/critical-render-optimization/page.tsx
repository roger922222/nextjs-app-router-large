// app/critical-render-optimization/page.tsx
import { CriticalRenderDemo } from '@/components/CriticalRenderDemo';
import '@/components/CriticalRenderDemo.css';

export const metadata = {
  title: '关键渲染路径优化',
  description: '展示Next.js关键渲染路径优化技术的演示页面',
};

/**
 * 关键渲染路径优化演示页面
 * 展示如何优化首屏渲染性能，减少阻塞资源
 */
export default function CriticalRenderOptimizationPage() {
  return (
    <div className="critical-render-optimization-page">
      <div className="container">
        <header className="page-header">
          <h1>关键渲染路径优化</h1>
          <p>
            本页面展示了基于Next.js的关键渲染路径优化技术，包括关键CSS提取、
            字体优化、资源预加载、布局偏移预防等策略。
          </p>
        </header>

        <main className="page-content">
          <CriticalRenderDemo />
        </main>

        <footer className="page-footer">
          <div className="optimization-summary">
            <h3>优化效果总结</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <h4>🚀 加载速度提升</h4>
                <p>通过关键CSS内联和资源预加载，首屏渲染时间减少40-60%</p>
              </div>
              <div className="summary-item">
                <h4>🎯 用户体验改善</h4>
                <p>布局偏移预防和无闪烁字体加载，提升视觉稳定性</p>
              </div>
              <div className="summary-item">
                <h4>📱 移动端优化</h4>
                <p>响应式关键CSS和自适应资源加载，移动端性能提升显著</p>
              </div>
              <div className="summary-item">
                <h4>🔧 实施简便</h4>
                <p>基于Next.js的内置优化功能，配置简单，效果显著</p>
              </div>
            </div>
          </div>

          <div className="best-practices">
            <h3>最佳实践建议</h3>
            <div className="practices-list">
              <div className="practice-item">
                <h4>1. 优先加载关键资源</h4>
                <p>使用rel="preload"预加载字体、关键CSS和JavaScript文件</p>
              </div>
              <div className="practice-item">
                <h4>2. 内联关键CSS</h4>
                <p>将首屏渲染所需的关键CSS直接内联到HTML中，减少HTTP请求</p>
              </div>
              <div className="practice-item">
                <h4>3. 异步加载非关键资源</h4>
                <p>使用async和defer属性异步加载非关键JavaScript文件</p>
              </div>
              <div className="practice-item">
                <h4>4. 优化字体加载</h4>
                <p>使用font-display: swap避免FOIT（Flash of Invisible Text）</p>
              </div>
              <div className="practice-item">
                <h4>5. 预防布局偏移</h4>
                <p>为图片、广告和动态内容预留空间，减少CLS指标</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .critical-render-optimization-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
          padding: 2rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          color: white;
        }

        .page-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .page-header p {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .page-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .page-footer {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .optimization-summary {
          margin-bottom: 3rem;
        }

        .optimization-summary h3 {
          color: #333;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          text-align: center;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .summary-item {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          border-left: 4px solid #ff6b6b;
          transition: transform 0.3s ease;
        }

        .summary-item:hover {
          transform: translateY(-5px);
        }

        .summary-item h4 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .summary-item p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
        }

        .best-practices h3 {
          color: #333;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          text-align: center;
        }

        .practices-list {
          display: grid;
          gap: 1.5rem;
        }

        .practice-item {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          border-left: 4px solid #feca57;
          transition: transform 0.3s ease;
        }

        .practice-item:hover {
          transform: translateX(5px);
        }

        .practice-item h4 {
          color: #333;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .practice-item p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2rem;
          }

          .page-content,
          .page-footer {
            padding: 1.5rem;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .optimization-summary h3,
          .best-practices h3 {
            font-size: 1.5rem;
          }
        }

        @media (prefers-color-scheme: dark) {
          .critical-render-optimization-page {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          }

          .page-header h1 {
            color: #ffffff;
          }

          .page-header p {
            color: #cccccc;
          }

          .page-content,
          .page-footer {
            background: #2a2a2a;
            color: #ffffff;
          }

          .optimization-summary h3,
          .best-practices h3 {
            color: #ffffff;
          }

          .summary-item,
          .practice-item {
            background: #333;
            border-color: #feca57;
          }

          .summary-item h4,
          .practice-item h4 {
            color: #ffffff;
          }

          .summary-item p,
          .practice-item p {
            color: #cccccc;
          }
        }
      `}</style>
    </div>
  );
}