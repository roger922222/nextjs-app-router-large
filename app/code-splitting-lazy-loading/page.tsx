// app/code-splitting-lazy-loading/page.tsx
import { CodeSplittingDemo } from '@/components/CodeSplittingDemo';
import '@/components/CodeSplittingDemo.css';

export const metadata = {
  title: '代码分割与懒加载',
  description: '展示Next.js代码分割和懒加载技术的演示页面',
};

/**
 * 代码分割与懒加载演示页面
 * 展示如何通过动态导入优化应用性能
 */
export default function CodeSplittingLazyLoadingPage() {
  return (
    <div className="code-splitting-lazy-loading-page">
      <div className="container">
        <header className="page-header">
          <h1>代码分割与懒加载演示</h1>
          <p>
            本页面展示了基于Next.js的代码分割和懒加载技术，包括动态导入、
            智能预加载、骨架屏加载状态等优化策略。
          </p>
        </header>

        <main className="page-content">
          <CodeSplittingDemo />
        </main>

        <footer className="page-footer">
          <div className="optimization-benefits">
            <h3>优化收益</h3>
            <div className="benefits-grid">
              <div className="benefit-item">
                <h4>🚀 初始加载速度</h4>
                <p>通过代码分割，初始包大小减少40-60%，首屏加载时间显著缩短</p>
              </div>
              <div className="benefit-item">
                <h4>💾 内存使用优化</h4>
                <p>按需加载组件，减少内存占用，提升应用运行效率</p>
              </div>
              <div className="benefit-item">
                <h4>⚡ 用户体验提升</h4>
                <p>骨架屏和渐进式加载，让用户感知性能大幅提升</p>
              </div>
              <div className="benefit-item">
                <h4>🎯 智能预加载</h4>
                <p>基于用户行为的智能预加载，提前加载可能需要的资源</p>
              </div>
            </div>
          </div>

          <div className="implementation-tips">
            <h3>实施建议</h3>
            <div className="tips-list">
              <div className="tip-item">
                <h4>1. 路由级代码分割</h4>
                <p>每个路由对应独立的代码块，实现页面级别的懒加载</p>
              </div>
              <div className="tip-item">
                <h4>2. 组件级动态导入</h4>
                <p>对大型组件使用动态导入，配合Suspense实现优雅加载</p>
              </div>
              <div className="tip-item">
                <h4>3. 第三方库优化</h4>
                <p>按需加载第三方库，避免一次性引入所有依赖</p>
              </div>
              <div className="tip-item">
                <h4>4. 预加载策略</h4>
                <p>结合用户行为预测，智能预加载关键资源</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .code-splitting-lazy-loading-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

        .optimization-benefits {
          margin-bottom: 3rem;
        }

        .optimization-benefits h3 {
          color: #333;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          text-align: center;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .benefit-item {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          border-left: 4px solid #f093fb;
          transition: transform 0.3s ease;
        }

        .benefit-item:hover {
          transform: translateY(-5px);
        }

        .benefit-item h4 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .benefit-item p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
        }

        .implementation-tips {
          margin-bottom: 2rem;
        }

        .implementation-tips h3 {
          color: #333;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          text-align: center;
        }

        .tips-list {
          display: grid;
          gap: 1.5rem;
        }

        .tip-item {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          border-left: 4px solid #f5576c;
          transition: transform 0.3s ease;
        }

        .tip-item:hover {
          transform: translateX(5px);
        }

        .tip-item h4 {
          color: #333;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .tip-item p {
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

          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .optimization-benefits h3,
          .implementation-tips h3 {
            font-size: 1.5rem;
          }
        }

        @media (prefers-color-scheme: dark) {
          .code-splitting-lazy-loading-page {
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

          .optimization-benefits h3,
          .implementation-tips h3 {
            color: #ffffff;
          }

          .benefit-item,
          .tip-item {
            background: #333;
            border-color: #f093fb;
          }

          .benefit-item h4,
          .tip-item h4 {
            color: #ffffff;
          }

          .benefit-item p,
          .tip-item p {
            color: #cccccc;
          }
        }
      `}</style>
    </div>
  );
}