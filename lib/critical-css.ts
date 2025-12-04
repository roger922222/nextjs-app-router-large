// lib/critical-css.ts
/**
 * 关键CSS提取和优化工具
 * 用于提取首屏关键CSS，优化渲染性能
 */

export interface CriticalCSSConfig {
  width?: number;
  height?: number;
  timeout?: number;
  penthouse?: {
    timeout?: number;
    maxEmbeddedBase64Length?: number;
    userAgent?: string;
  };
}

/**
 * 关键CSS配置
 */
export const defaultCriticalConfig: CriticalCSSConfig = {
  width: 1300,
  height: 900,
  timeout: 30000,
  penthouse: {
    timeout: 30000,
    maxEmbeddedBase64Length: 1000,
    userAgent: 'Mozilla/5.0 (compatible; critical)'
  }
};

/**
 * 内联关键CSS样式
 */
export const criticalInlineStyles = `
  /* 关键渲染路径CSS */
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.5;
    color: #111827;
    background-color: #f7f7f9;
  }
  
  /* 导航栏关键样式 */
  nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: white;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .nav-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    padding: 0.75rem 1rem;
  }
  
  .nav-link {
    color: #111827;
    text-decoration: none;
    padding: 0.35rem 0.6rem;
    border-radius: 0.4rem;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    transition: background-color 0.2s ease;
  }
  
  .nav-link:hover {
    background: #f3f4f6;
  }
  
  /* 主要内容区域 */
  .main-content {
    padding: 1rem;
    max-width: 960px;
    margin: 0 auto;
  }
  
  .content-section {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.6rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  /* 标题样式 */
  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 0.5rem 0;
    font-weight: 600;
    line-height: 1.25;
  }
  
  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.5rem; }
  
  /* 按钮和表单 */
  button {
    cursor: pointer;
    padding: 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.4rem;
    background: #ffffff;
    color: #111827;
    transition: all 0.2s ease;
  }
  
  button:hover {
    background: #f3f4f6;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.4rem;
    font-family: inherit;
  }
  
  /* 加载状态 */
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* 响应式基础 */
  @media (max-width: 768px) {
    h1 { font-size: 2rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
    
    .main-content {
      padding: 0.5rem;
    }
    
    .nav-container {
      padding: 0.5rem;
    }
  }
`;

/**
 * 字体优化配置
 */
export const fontOptimizationConfig = {
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  css: `
    @font-face {
      font-family: 'CustomFont';
      src: url('/fonts/custom-font.woff2') format('woff2');
      font-display: swap;
      font-weight: 400 700;
      font-style: normal;
    }
  `
};

/**
 * 关键资源预加载配置
 */
export const criticalPreloadConfig = {
  fonts: [
    { href: '/fonts/inter-var.woff2', type: 'font/woff2', crossOrigin: 'anonymous' },
    { href: '/fonts/inter-var-italic.woff2', type: 'font/woff2', crossOrigin: 'anonymous' }
  ],
  scripts: [
    { href: '/js/critical.js', type: 'text/javascript' }
  ],
  styles: [
    { href: '/css/critical.css', type: 'text/css' }
  ]
};

/**
 * 生成关键CSS链接标签
 */
export function generateCriticalPreloadTags(): string {
  const tags: string[] = [];
  
  // 预加载关键字体
  criticalPreloadConfig.fonts.forEach(font => {
    tags.push(`<link rel="preload" href="${font.href}" as="font" type="${font.type}" crossorigin="${font.crossOrigin}">`);
  });
  
  // 预加载关键脚本
  criticalPreloadConfig.scripts.forEach(script => {
    tags.push(`<link rel="preload" href="${script.href}" as="script" type="${script.type}">`);
  });
  
  // 预加载关键样式
  criticalPreloadConfig.styles.forEach(style => {
    tags.push(`<link rel="preload" href="${style.href}" as="style" type="${style.type}">`);
  });
  
  return tags.join('\n');
}

/**
 * 生成关键CSS内联样式
 */
export function generateCriticalInlineStyles(): string {
  return `<style>${criticalInlineStyles}</style>`;
}

/**
 * 关键渲染路径优化配置
 */
export const criticalRenderPathConfig = {
  // 关键CSS提取配置
  criticalCSS: {
    enabled: true,
    inlineThreshold: 50000, // 50KB
    minimumExternalSize: 1000, // 1KB
    extractCriticalCSS: true
  },
  
  // 字体优化配置
  fontOptimization: {
    enabled: true,
    display: 'swap',
    preload: true,
    fallback: true
  },
  
  // 脚本优化配置
  scriptOptimization: {
    deferNonCritical: true,
    asyncThirdParty: true,
    preloadCritical: true
  },
  
  // 图片优化配置
  imageOptimization: {
    lazyLoad: true,
    webpConversion: true,
    responsiveImages: true,
    blurPlaceholder: true
  }
};

/**
 * 性能指标目标
 */
export const performanceTargets = {
  firstContentfulPaint: 1800, // 1.8s
  largestContentfulPaint: 2500, // 2.5s
  firstInputDelay: 100, // 100ms
  cumulativeLayoutShift: 0.1,
  timeToFirstByte: 800, // 800ms
  speedIndex: 3400 // 3.4s
};

/**
 * 渲染阻塞资源检测
 */
export function detectRenderBlockingResources(): string[] {
  const blockingResources: string[] = [];
  
  // 检测大型CSS文件
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  stylesheets.forEach(link => {
    // 这里应该有实际的检测逻辑
    blockingResources.push(link.href);
  });
  
  // 检测同步JavaScript
  const scripts = document.querySelectorAll('script[src]:not([async]):not([defer])');
  scripts.forEach(script => {
    blockingResources.push(script.src);
  });
  
  return blockingResources;
}

/**
 * 关键资源加载优化
 */
export function optimizeCriticalResources(): void {
  // 字体预加载
  const fontLinks = document.querySelectorAll('link[as="font"]');
  fontLinks.forEach(link => {
    link.setAttribute('rel', 'preload');
    link.setAttribute('crossorigin', 'anonymous');
  });
  
  // 关键脚本异步加载
  const criticalScripts = document.querySelectorAll('script[data-critical]');
  criticalScripts.forEach(script => {
    if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
      script.setAttribute('defer', '');
    }
  });
}

/**
 * 布局偏移预防
 */
export function preventLayoutShift(): void {
  // 为图片预留空间
  const images = document.querySelectorAll('img:not([width]):not([height])');
  images.forEach(img => {
    // 设置默认宽高比
    img.style.aspectRatio = '16/9';
  });
  
  // 为广告位预留空间
  const adSlots = document.querySelectorAll('[data-ad-slot]');
  adSlots.forEach(slot => {
    const height = slot.getAttribute('data-ad-height') || '250';
    slot.style.minHeight = `${height}px`;
  });
}