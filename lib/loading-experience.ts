import { useState, useEffect } from 'react';

interface SkeletonConfig {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  animated?: boolean;
  lines?: number;
  className?: string;
}

interface ProgressiveImageConfig {
  src: string;
  placeholder: string;
  blurDataURL?: string;
  threshold?: number;
}

interface LoadingState {
  isLoading: boolean;
  progress: number;
  stage: 'idle' | 'loading' | 'complete' | 'error';
  estimatedTime: number;
}

// Skeleton Screen Component
export function Skeleton({ 
  width = '100%', 
  height = 20, 
  borderRadius = '4px',
  animated = true,
  lines = 1,
  className = ''
}: SkeletonConfig) {
  const skeletonBase = `
    bg-gray-200 
    ${animated ? 'animate-pulse' : ''}
    ${className}
  `.trim();

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={skeletonBase}
            style={{ 
              width: typeof width === 'number' ? `${width}px` : width,
              height: typeof height === 'number' ? `${height}px` : height,
              borderRadius,
              opacity: lines > 1 ? 1 - (i * 0.1) : 1
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={skeletonBase}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius
      }}
    />
  );
}

// Skeleton Layout Presets
export const SkeletonPresets = {
  Card: () => (
    <div className="p-4 border rounded-lg space-y-3">
      <Skeleton width="60%" height={24} />
      <Skeleton lines={3} height={16} />
      <div className="flex space-x-2">
        <Skeleton width={80} height={32} borderRadius="16px" />
        <Skeleton width={60} height={32} borderRadius="16px" />
      </div>
    </div>
  ),
  
  ListItem: () => (
    <div className="flex items-center space-x-3 p-3">
      <Skeleton width={48} height={48} borderRadius="50%" />
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" height={16} />
        <Skeleton width="70%" height={12} />
      </div>
      <Skeleton width={24} height={24} borderRadius="4px" />
    </div>
  ),
  
  TableRow: () => (
    <tr className="border-b">
      {Array.from({ length: 5 }, (_, i) => (
        <td key={i} className="p-3">
          <Skeleton width={i === 0 ? 40 : i === 4 ? 80 : "80%"} height={16} />
        </td>
      ))}
    </tr>
  ),
  
  Hero: () => (
    <div className="space-y-4">
      <Skeleton width="60%" height={32} />
      <Skeleton lines={2} height={16} />
      <div className="flex space-x-3">
        <Skeleton width={120} height={40} borderRadius="8px" />
        <Skeleton width={100} height={40} borderRadius="8px" />
      </div>
    </div>
  )
};

// Progressive Image Loading Hook
export function useProgressiveImage(config: ProgressiveImageConfig) {
  const [imageSrc, setImageSrc] = useState(config.placeholder);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = config.src;
    img.onload = () => {
      setImageSrc(config.src);
      setIsLoaded(true);
    };
    setImageRef(img);

    return () => {
      if (imageRef) {
        imageRef.onload = null;
      }
    };
  }, [config.src, config.placeholder]);

  return {
    src: imageSrc,
    isLoaded,
    blurDataURL: config.blurDataURL
  };
}

// Smart Loading Hook with Progress Estimation
export function useSmartLoading(
  dependencies: any[] = [],
  config: {
    threshold?: number;
    timeout?: number;
    stages?: string[];
  } = {}
) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    progress: 0,
    stage: 'loading',
    estimatedTime: 0
  });

  const {
    threshold = 1000,
    timeout = 30000,
    stages = ['初始化', '加载数据', '处理中', '完成']
  } = config;

  useEffect(() => {
    let startTime = Date.now();
    let interval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const estimatedTotalTime = threshold * 2; // Estimate based on threshold
      const progress = Math.min((elapsed / estimatedTotalTime) * 100, 95); // Cap at 95% until complete
      
      const currentStageIndex = Math.floor((elapsed / estimatedTotalTime) * stages.length);
      const currentStage = currentStageIndex < stages.length ? stages[currentStageIndex] : stages[stages.length - 1];

      setLoadingState(prev => ({
        ...prev,
        progress,
        stage: 'loading',
        estimatedTime: Math.max(estimatedTotalTime - elapsed, 0)
      }));
    };

    // Start progress tracking
    interval = setInterval(updateProgress, 100);

    // Set timeout for edge cases
    timeoutId = setTimeout(() => {
      setLoadingState({
        isLoading: false,
        progress: 100,
        stage: 'complete',
        estimatedTime: 0
      });
    }, timeout);

    // Simulate loading completion based on dependencies
    const checkCompletion = async () => {
      // In a real scenario, this would check actual loading state
      await new Promise(resolve => setTimeout(resolve, threshold));
      
      clearInterval(interval);
      clearTimeout(timeoutId);
      
      setLoadingState({
        isLoading: false,
        progress: 100,
        stage: 'complete',
        estimatedTime: 0
      });
    };

    checkCompletion();

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, dependencies);

  return loadingState;
}

// Loading Progress Component
export function LoadingProgress({ 
  loadingState,
  showDetails = true,
  className = ''
}: { 
  loadingState: LoadingState;
  showDetails?: boolean;
  className?: string;
}) {
  const getProgressColor = () => {
    if (loadingState.progress < 30) return 'bg-red-500';
    if (loadingState.progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.ceil(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span>加载进度</span>
        <span>{Math.round(loadingState.progress)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${loadingState.progress}%` }}
        />
      </div>
      
      {showDetails && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>预计剩余时间: {formatTime(loadingState.estimatedTime)}</span>
          <span>状态: {loadingState.stage}</span>
        </div>
      )}
    </div>
  );
}

// Staggered Loading Animation
export function StaggeredLoader({ 
  items = 3,
  delay = 100,
  className = ''
}: {
  items?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {Array.from({ length: items }, (_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{
            animationDelay: `${i * delay}ms`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
}

// Content Placeholder with Skeleton
export function ContentPlaceholder({ 
  type = 'card',
  count = 1,
  showHeader = true,
  className = ''
}: {
  type?: 'card' | 'list' | 'table' | 'hero';
  count?: number;
  showHeader?: boolean;
  className?: string;
}) {
  const SkeletonComponent = SkeletonPresets[
    type.charAt(0).toUpperCase() + type.slice(1) as keyof typeof SkeletonPresets
  ] || SkeletonPresets.Card;

  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="animate-pulse">
          <Skeleton width="40%" height={24} className="mb-4" />
          <Skeleton width="60%" height={16} />
        </div>
      )}
      
      {Array.from({ length: count }, (_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}

// Progressive Image Component
export function ProgressiveImage({
  src,
  placeholder,
  blurDataURL,
  alt = '',
  className = '',
  threshold = 0.1
}: ProgressiveImageConfig & {
  alt?: string;
  className?: string;
  threshold?: number;
}) {
  const { src: currentSrc, isLoaded } = useProgressiveImage({
    src,
    placeholder,
    blurDataURL,
    threshold
  });

  return (
    <div className="relative overflow-hidden">
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} transition-all duration-500 ${
          isLoaded ? 'opacity-100 blur-0' : 'opacity-75 blur-sm'
        }`}
        loading="lazy"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <StaggeredLoader />
        </div>
      )}
    </div>
  );
}

// Loading State Manager
export class LoadingStateManager {
  private listeners: Set<(state: LoadingState) => void> = new Set();
  private state: LoadingState = {
    isLoading: false,
    progress: 0,
    stage: 'idle',
    estimatedTime: 0
  };

  subscribe(listener: (state: LoadingState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setState(newState: Partial<LoadingState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  startLoading(estimatedTime = 2000) {
    this.setState({
      isLoading: true,
      progress: 0,
      stage: 'loading',
      estimatedTime
    });
  }

  updateProgress(progress: number, stage?: string) {
    this.setState({
      progress: Math.min(progress, 100),
      stage: stage || this.state.stage
    });
  }

  completeLoading() {
    this.setState({
      isLoading: false,
      progress: 100,
      stage: 'complete',
      estimatedTime: 0
    });
  }

  setError() {
    this.setState({
      isLoading: false,
      progress: 0,
      stage: 'error',
      estimatedTime: 0
    });
  }

  getState() {
    return this.state;
  }
}