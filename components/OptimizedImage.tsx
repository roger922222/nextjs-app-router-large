// components/OptimizedImage.tsx
"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  getWebPUrl, 
  generateBlurDataURL, 
  isWebPSupported,
  preloadImage 
} from '@/lib/image-optimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  srcSet?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * 优化的图片组件
 * 支持WebP格式、懒加载、模糊占位图等功能
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  className = '',
  objectFit = 'cover',
  placeholder = 'blur',
  blurDataURL,
  sizes,
  srcSet,
  loading = 'lazy'
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [webpSupported, setWebpSupported] = useState(true);

  // 检查WebP支持
  useEffect(() => {
    setWebpSupported(isWebPSupported());
  }, []);

  // 优先加载图片
  useEffect(() => {
    if (priority) {
      const optimizedSrc = webpSupported ? getWebPUrl(src) : src;
      preloadImage(optimizedSrc)
        .then(() => {
          setImageSrc(optimizedSrc);
          setIsLoading(false);
        })
        .catch(() => {
          setImageSrc(src);
          setError(true);
        });
    }
  }, [src, priority, webpSupported]);

  // 处理图片加载错误
  const handleError = () => {
    if (imageSrc !== src) {
      // 如果WebP加载失败，回退到原格式
      setImageSrc(src);
    } else {
      setError(true);
    }
  };

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoading(false);
  };

  // 生成模糊占位图
  const getPlaceholderBlur = () => {
    if (blurDataURL) return blurDataURL;
    if (width && height) {
      return generateBlurDataURL(width, height);
    }
    return undefined;
  };

  // 生成响应式srcset
  const getSrcSet = () => {
    if (srcSet) return srcSet;
    
    // 如果没有提供srcset，根据width生成不同尺寸
    if (width && !src.includes('?')) {
      const widths = [320, 640, 768, 1024, 1280, 1920];
      const validWidths = widths.filter(w => w <= width);
      
      return validWidths
        .map(w => `${src}?w=${w} ${w}w`)
        .join(', ');
    }
    
    return undefined;
  };

  // 生成sizes属性
  const getSizes = () => {
    if (sizes) return sizes;
    
    // 默认的响应式尺寸策略
    if (width) {
      return `
        (max-width: 640px) 100vw,
        (max-width: 768px) 90vw,
        (max-width: 1024px) 80vw,
        (max-width: 1280px) 70vw,
        ${width}px
      `.replace(/\s+/g, ' ').trim();
    }
    
    return '100vw';
  };

  if (error) {
    return (
      <div className={`optimized-image-error ${className}`}>
        <div className="error-placeholder">
          <span>图片加载失败</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`optimized-image-container ${className}`}>
      {isLoading && placeholder === 'blur' && (
        <div 
          className="image-blur-placeholder"
          style={{
            backgroundImage: `url(${getPlaceholderBlur()})`,
            backgroundSize: objectFit,
            backgroundPosition: 'center'
          }}
        />
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        loading={loading}
        placeholder={placeholder}
        blurDataURL={getPlaceholderBlur()}
        sizes={getSizes()}
        srcSet={getSrcSet()}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit,
          visibility: isLoading ? 'hidden' : 'visible'
        }}
      />
      
      {isLoading && (
        <div className="image-loading-indicator">
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  );
}

/**
 * 图片懒加载包装组件
 */
export function LazyImage(props: Omit<OptimizedImageProps, 'loading'>) {
  return <OptimizedImage {...props} loading="lazy" />;
}

/**
 * 优先加载的图片组件
 */
export function PriorityImage(props: Omit<OptimizedImageProps, 'loading' | 'priority'>) {
  return <OptimizedImage {...props} loading="eager" priority={true} />;
}

/**
 * 响应式图片组件
 */
export function ResponsiveImage({
  src,
  alt,
  sizes = '100vw',
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      sizes={sizes}
      {...props}
    />
  );
}