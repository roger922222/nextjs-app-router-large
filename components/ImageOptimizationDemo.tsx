// components/ImageOptimizationDemo.tsx
"use client";

import { useState, useEffect } from 'react';
import { OptimizedImage, LazyImage, PriorityImage, ResponsiveImage } from './OptimizedImage';
import { formatFileSize, compressImage, isWebPSupported } from '@/lib/image-optimization';
import './ImageOptimizationDemo.css';

/**
 * 图片优化演示组件
 * 展示各种图片优化技术的使用效果
 */
export function ImageOptimizationDemo() {
  const [webpSupported, setWebPSupported] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [compressionResult, setCompressionResult] = useState<{
    originalSize: number;
    compressedSize: number;
    ratio: number;
  } | null>(null);

  // 示例图片数据
  const demoImages = [
    {
      id: 1,
      title: '示例图片 1',
      originalUrl: 'https://picsum.photos/800/600?random=1',
      description: '高分辨率风景图片'
    },
    {
      id: 2,
      title: '示例图片 2', 
      originalUrl: 'https://picsum.photos/600/400?random=2',
      description: '中等分辨率图片'
    },
    {
      id: 3,
      title: '示例图片 3',
      originalUrl: 'https://picsum.photos/400/300?random=3',
      description: '低分辨率图片'
    }
  ];

  useEffect(() => {
    setWebPSupported(isWebPSupported());
  }, []);

  // 模拟图片压缩
  const handleCompressImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const originalSize = blob.size;
      
      // 压缩图片
      const compressedBlob = await compressImage(blob, {
        quality: 75,
        maxWidth: 800,
        maxHeight: 600,
        format: 'webp'
      });
      
      const compressedSize = compressedBlob.size;
      const ratio = ((originalSize - compressedSize) / originalSize) * 100;
      
      setCompressionResult({
        originalSize,
        compressedSize,
        ratio
      });
      
      setSelectedImage(imageUrl);
    } catch (error) {
      console.error('压缩失败:', error);
    }
  };

  return (
    <div className="image-optimization-demo">
      <div className="demo-header">
        <h2>图片优化技术演示</h2>
        <div className="webp-status">
          WebP支持: <span className={webpSupported ? 'supported' : 'unsupported'}>
            {webpSupported ? '✅ 支持' : '❌ 不支持'}
          </span>
        </div>
      </div>

      {/* 优化技术对比 */}
      <section className="optimization-comparison">
        <h3>优化技术对比</h3>
        <div className="comparison-grid">
          {/* 普通图片 */}
          <div className="comparison-item">
            <h4>普通图片</h4>
            <img 
              src="https://picsum.photos/400/300?random=10" 
              alt="普通图片"
              style={{ width: '100%', height: 'auto' }}
            />
            <p>无优化，直接加载</p>
          </div>

          {/* 优化的图片 */}
          <div className="comparison-item">
            <h4>优化图片</h4>
            <OptimizedImage
              src="https://picsum.photos/400/300?random=11"
              alt="优化图片"
              width={400}
              height={300}
              quality={75}
              placeholder="blur"
            />
            <p>WebP格式、懒加载、模糊占位</p>
          </div>

          {/* 响应式图片 */}
          <div className="comparison-item">
            <h4>响应式图片</h4>
            <ResponsiveImage
              src="https://picsum.photos/400/300?random=12"
              alt="响应式图片"
              width={400}
              height={300}
              sizes="(max-width: 640px) 100vw, 400px"
            />
            <p>根据屏幕尺寸加载不同大小</p>
          </div>
        </div>
      </section>

      {/* 懒加载演示 */}
      <section className="lazy-loading-demo">
        <h3>懒加载演示</h3>
        <p>向下滚动查看懒加载效果：</p>
        
        <div className="lazy-images-container">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="lazy-image-item">
              <LazyImage
                src={`https://picsum.photos/300/200?random=${20 + i}`}
                alt={`懒加载图片 ${i + 1}`}
                width={300}
                height={200}
                placeholder="blur"
              />
              <p>图片 {i + 1} - 懒加载</p>
            </div>
          ))}
        </div>
      </section>

      {/* 压缩效果演示 */}
      <section className="compression-demo">
        <h3>压缩效果演示</h3>
        
        <div className="demo-images">
          {demoImages.map((image) => (
            <div key={image.id} className="demo-image-item">
              <h4>{image.title}</h4>
              <OptimizedImage
                src={image.originalUrl}
                alt={image.description}
                width={300}
                height={200}
                quality={75}
                placeholder="blur"
              />
              <p>{image.description}</p>
              
              <button 
                onClick={() => handleCompressImage(image.originalUrl)}
                className="compress-button"
              >
                测试压缩效果
              </button>
            </div>
          ))}
        </div>

        {/* 压缩结果展示 */}
        {compressionResult && (
          <div className="compression-result">
            <h4>压缩结果</h4>
            <div className="result-stats">
              <div className="stat-item">
                <span className="stat-label">原始大小:</span>
                <span className="stat-value">{formatFileSize(compressionResult.originalSize)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">压缩后大小:</span>
                <span className="stat-value">{formatFileSize(compressionResult.compressedSize)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">压缩率:</span>
                <span className="stat-value">{compressionResult.ratio.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 性能指标 */}
      <section className="performance-metrics">
        <h3>性能指标</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>加载时间</h4>
            <p>优化后图片加载时间减少 40-60%</p>
          </div>
          <div className="metric-card">
            <h4>文件大小</h4>
            <p>WebP格式可减少 25-35% 文件大小</p>
          </div>
          <div className="metric-card">
            <h4>用户体验</h4>
            <p>模糊占位图提升感知性能</p>
          </div>
          <div className="metric-card">
            <h4>带宽节省</h4>
            <p>综合优化可节省 50%+ 带宽</p>
          </div>
        </div>
      </section>

      {/* 使用建议 */}
      <section className="usage-recommendations">
        <h3>使用建议</h3>
        <div className="recommendations-list">
          <div className="recommendation-item">
            <h4>🎯 优先加载图片</h4>
            <p>对于首屏关键图片，使用 PriorityImage 组件确保优先加载</p>
          </div>
          <div className="recommendation-item">
            <h4>🔄 懒加载策略</h4>
            <p>非首屏图片使用 LazyImage 组件，减少初始加载时间</p>
          </div>
          <div className="recommendation-item">
            <h4>📱 响应式适配</h4>
            <p>使用 ResponsiveImage 组件，根据屏幕尺寸加载合适大小的图片</p>
          </div>
          <div className="recommendation-item">
            <h4>⚡ 格式优化</h4>
            <p>优先使用 WebP 格式，提供更好的压缩效果</p>
          </div>
        </div>
      </section>
    </div>
  );
}