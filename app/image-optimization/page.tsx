// app/image-optimization/page.tsx
import { ImageOptimizationDemo } from '@/components/ImageOptimizationDemo';
import '@/components/ImageOptimizationDemo.css';

export const metadata = {
  title: '图片优化演示',
  description: '展示Next.js图片优化技术的演示页面',
};

export default function ImageOptimizationPage() {
  return (
    <div className="image-optimization-page">
      <div className="container">
        <header className="page-header">
          <h1>图片优化技术演示</h1>
          <p>
            本页面展示了基于Next.js的图片优化技术，包括WebP格式转换、
            懒加载、响应式图片、模糊占位图等功能。
          </p>
        </header>

        <main className="page-content">
          <ImageOptimizationDemo />
        </main>

        <footer className="page-footer">
          <div className="optimization-tips">
            <h3>优化提示</h3>
            <ul>
              <li>✅ 使用WebP格式可减少25-35%的文件大小</li>
              <li>✅ 懒加载可显著减少初始页面加载时间</li>
              <li>✅ 响应式图片可根据屏幕尺寸加载合适大小</li>
              <li>✅ 模糊占位图提升用户感知性能</li>
              <li>✅ 适当的压缩质量设置（建议75-85）</li>
            </ul>
          </div>

          <div className="technical-details">
            <h3>技术细节</h3>
            <div className="details-grid">
              <div className="detail-item">
                <h4>WebP支持检测</h4>
                <p>自动检测浏览器是否支持WebP格式</p>
              </div>
              <div className="detail-item">
                <h4>智能压缩</h4>
                <p>根据图片内容自动调整压缩参数</p>
              </div>
              <div className="detail-item">
                <h4>渐进式加载</h4>
                <p>先显示模糊占位图，再显示清晰图片</p>
              </div>
              <div className="detail-item">
                <h4>错误处理</h4>
                <p>WebP加载失败时自动回退到原格式</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .image-optimization-page {
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

        .optimization-tips {
          margin-bottom: 2rem;
        }

        .optimization-tips h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        .optimization-tips ul {
          list-style: none;
          padding: 0;
        }

        .optimization-tips li {
          padding: 0.5rem 0;
          color: #666;
          font-size: 0.95rem;
        }

        .technical-details h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .detail-item {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .detail-item h4 {
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .detail-item p {
          color: #666;
          font-size: 0.9rem;
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

          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}