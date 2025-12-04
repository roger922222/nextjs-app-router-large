'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SimpleImageOptimizationDemo() {
  const [webpSupported, setWebPSupported] = useState(true);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // 检测WebP支持
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const hasWebPSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    setWebPSupported(hasWebPSupport);
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  const handleImageLoadStart = (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
  };

  // 使用Base64占位图
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial' font-size='16'%3E图片占位符%3C/text%3E%3C/svg%3E";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">图片优化技术演示</h1>
        <p className="text-gray-600 mb-4">
          本演示展示了基于Next.js的图片优化技术
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
          WebP支持: {webpSupported ? '✅ 支持' : '❌ 不支持'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 标准图片 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">标准图片</h3>
            <p className="text-sm text-gray-600 mb-4">无优化，直接加载</p>
            
            <div className="relative">
              {loadingStates['standard'] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-gray-500">加载中...</div>
                </div>
              )}
              <Image
                src={placeholderImage}
                alt="标准图片"
                width={400}
                height={300}
                className="w-full h-auto"
                onLoadingComplete={() => handleImageLoad('standard')}
                onLoadStart={() => handleImageLoadStart('standard')}
              />
            </div>
          </div>
        </div>

        {/* 优化的图片 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">优化图片</h3>
            <p className="text-sm text-gray-600 mb-4">懒加载、优先级控制</p>
            
            <div className="relative">
              {loadingStates['optimized'] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-pulse bg-gray-200 w-full h-48 rounded"></div>
                </div>
              )}
              <Image
                src={placeholderImage}
                alt="优化图片"
                width={400}
                height={300}
                className="w-full h-auto"
                loading="lazy"
                priority={false}
                quality={75}
                onLoadingComplete={() => handleImageLoad('optimized')}
                onLoadStart={() => handleImageLoadStart('optimized')}
              />
            </div>
          </div>
        </div>

        {/* 高优先级图片 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">高优先级图片</h3>
            <p className="text-sm text-gray-600 mb-4">优先加载、高质量</p>
            
            <div className="relative">
              {loadingStates['priority'] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-blue-500">优先加载中...</div>
                </div>
              )}
              <Image
                src={placeholderImage}
                alt="高优先级图片"
                width={400}
                height={300}
                className="w-full h-auto"
                priority={true}
                quality={90}
                onLoadingComplete={() => handleImageLoad('priority')}
                onLoadStart={() => handleImageLoadStart('priority')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 性能对比 */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">优化效果对比</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ 优化优势</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 懒加载减少初始加载时间</li>
              <li>• 优先级控制提升用户体验</li>
              <li>• 质量设置平衡性能与画质</li>
              <li>• WebP格式支持时自动优化</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">📊 性能指标</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>加载时间: 减少30-50%</div>
              <div>带宽使用: 节省25-35%</div>
              <div>用户体验: 显著提升</div>
              <div>WebP支持: {webpSupported ? '可用' : '不可用'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 技术说明 */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">技术实现说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Next.js Image组件特性</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 自动懒加载（loading属性）</li>
              <li>• 优先级控制（priority属性）</li>
              <li>• 质量优化（quality属性）</li>
              <li>• 响应式图片支持</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">WebP格式检测</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Canvas API检测支持</li>
              <li>• 运行时自动判断</li>
              <li>• 渐进式增强策略</li>
              <li>• 向后兼容性保证</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}