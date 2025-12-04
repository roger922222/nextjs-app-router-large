// app/three-layer-cache/page.tsx
import { ThreeLayerCacheDemo } from '@/components/ThreeLayerCacheDemo';
import '@/components/ThreeLayerCacheDemo.css';

export const metadata = {
  title: '三层缓存架构',
  description: '展示Next.js三层缓存架构的演示页面',
};

/**
 * 三层缓存架构演示页面
 * 展示请求级、数据级、页面级缓存的工作原理和优化效果
 */
export default function ThreeLayerCachePage() {
  return (
    <div className="three-layer-cache-page">
      <div className="container">
        <header className="page-header">
          <h1>三层缓存架构演示</h1>
          <p>
            本页面展示了基于Next.js的三层缓存架构：请求级缓存（Request Memoization）、
            数据级缓存（Data Cache）、页面级缓存（Full Route Cache）的工作原理和优化效果。
          </p>
        </header>

        <main className="page-content">
          <ThreeLayerCacheDemo />
        </main>

        <footer className="page-footer">
          <div className="cache-benefits">
            <h3>缓存架构优势</h3>
            <div className="benefits-grid">
              <div className="benefit-item">
                <h4>🚀 性能提升</h4>
                <p>通过多层缓存机制，响应时间减少60-80%，显著提升用户体验</p>
              </div>
              <div className="benefit-item">
                <h4>💰 成本降低</h4>
                <p>减少服务器负载和带宽消耗，降低运营成本和基础设施投入</p>
              </div>
              <div className="benefit-item">
                <h4>⚡ 扩展性增强</h4>
                <p>智能缓存策略支持高并发访问，提升系统的可扩展性</p>
              </div>
              <div className="benefit-item">
                <h4>🎯 精准控制</h4>
                <p>标签化缓存和智能失效机制，实现精确的缓存控制和管理</p>
              </div>
            </div>
          </div>

          <div className="implementation-guide">
            <h3>实施指南</h3>
            <div className="guide-steps">
              <div className="step-item">
                <h4>第一步：请求级缓存</h4>
                <p>自动去重相同请求，减少重复网络调用，适用于组件内多次数据获取</p>
              </div>
              <div className="step-item">
                <h4>第二步：数据级缓存</h4>
                <p>配置fetch的next.tags和revalidate参数，实现跨请求的数据缓存</p>
              </div>
              <div className="step-item">
                <h4>第三步：页面级缓存</h4>
                <p>设置export const revalidate，缓存整个页面输出，最大化性能收益</p>
              </div>
              <div className="step-item">
                <h4>第四步：智能失效</h4>
                <p>使用revalidateTag和revalidatePath，实现按需缓存失效和更新</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .three-layer-cache-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

        .cache-benefits {
          margin-bottom: 3rem;
        }

        .cache-benefits h3 {
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
          border-left: 4px solid #667eea;
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

        .implementation-guide {
          margin-bottom: 2rem;
        }

        .implementation-guide h3 {
          color: #333;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          text-align: center;
        }

        .guide-steps {
          display: grid;
          gap: 1.5rem;
        }

        .step-item {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          border-left: 4px solid #764ba2;
          transition: transform 0.3s ease;
        }

        .step-item:hover {
          transform: translateX(5px);
        }

        .step-item h4 {
          color: #333;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .step-item p {
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

          .cache-benefits h3,
          .implementation-guide h3 {
            font-size: 1.5rem;
          }
        }

        @media (prefers-color-scheme: dark) {
          .three-layer-cache-page {
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

          .cache-benefits h3,
          .implementation-guide h3 {
            color: #ffffff;
          }

          .benefit-item,
          .step-item {
            background: #333;
            border-color: #667eea;
          }

          .benefit-item h4,
          .step-item h4 {
            color: #ffffff;
          }

          .benefit-item p,
          .step-item p {
            color: #cccccc;
          }
        }
      `}</style>
    </div>
  );
}