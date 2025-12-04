// lib/image-optimization.ts
/**
 * 图片优化工具函数
 * 提供图片压缩、格式转换、懒加载等优化功能
 */

export interface ImageOptimizationOptions {
  quality?: number;      // 压缩质量 1-100
  maxWidth?: number;     // 最大宽度
  maxHeight?: number;    // 最大高度
  format?: 'webp' | 'jpeg' | 'png'; // 输出格式
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * 压缩图片
 */
export async function compressImage(
  file: File | Blob,
  options: ImageOptimizationOptions = {}
): Promise<Blob> {
  const {
    quality = 85,
    maxWidth = 1920,
    maxHeight = 1080,
    format = 'webp',
    fit = 'inside'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          // 计算压缩后的尺寸
          let { width, height } = calculateDimensions(
            img.width,
            img.height,
            maxWidth,
            maxHeight,
            fit
          );
          
          // 设置canvas尺寸
          canvas.width = width;
          canvas.height = height;
          
          // 绘制压缩后的图片
          ctx.drawImage(img, 0, 0, width, height);
          
          // 转换为指定格式
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            `image/${format}`,
            quality / 100
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * 计算压缩后的尺寸
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  fit: string
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;
  
  if (fit === 'inside' || fit === 'contain') {
    // 保持宽高比，确保图片在指定尺寸内
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const ratio = Math.min(widthRatio, heightRatio);
    
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  } else if (fit === 'outside' || fit === 'cover') {
    // 保持宽高比，确保图片覆盖指定区域
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const ratio = Math.max(widthRatio, heightRatio);
    
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  } else if (fit === 'fill') {
    // 不保持宽高比，直接填充到指定尺寸
    width = maxWidth;
    height = maxHeight;
  }
  
  return { width, height };
}

/**
 * 生成WebP格式的图片URL
 */
export function getWebPUrl(originalUrl: string): string {
  // 如果已经是WebP格式，直接返回
  if (originalUrl.includes('.webp')) {
    return originalUrl;
  }
  
  // 添加WebP转换参数
  const url = new URL(originalUrl, window.location.origin);
  url.searchParams.set('format', 'webp');
  return url.toString();
}

/**
 * 生成响应式图片srcset
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [640, 768, 1024, 1280, 1920]
): string {
  return widths
    .map(width => `${baseUrl}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * 生成模糊占位图
 */
export function generateBlurDataURL(
  width: number,
  height: number,
  color: string = '#f0f0f0'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * 检查浏览器是否支持WebP
 */
export function isWebPSupported(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('webp') > -1;
}

/**
 * 图片预加载
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 批量预加载图片
 */
export async function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  const promises = srcs.map(src => preloadImage(src));
  return Promise.all(promises);
}

/**
 * 计算图片文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 获取图片优化建议
 */
export function getOptimizationSuggestions(
  originalSize: number,
  compressedSize: number,
  originalFormat: string,
  compressedFormat: string
): string[] {
  const suggestions: string[] = [];
  const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
  
  if (compressionRatio > 50) {
    suggestions.push(`压缩效果优秀，节省了 ${compressionRatio.toFixed(1)}% 的空间`);
  } else if (compressionRatio > 30) {
    suggestions.push(`压缩效果良好，节省了 ${compressionRatio.toFixed(1)}% 的空间`);
  } else {
    suggestions.push(`压缩效果一般，建议调整压缩参数`);
  }
  
  if (originalFormat !== 'webp' && compressedFormat === 'webp') {
    suggestions.push('已转换为WebP格式，可进一步减少文件大小');
  }
  
  if (compressedSize > 100 * 1024) { // 100KB
    suggestions.push('文件仍然较大，建议进一步压缩或减小尺寸');
  }
  
  return suggestions;
}