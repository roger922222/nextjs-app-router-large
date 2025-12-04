'use client';

import { useState, useEffect } from 'react';
import {
  Skeleton,
  SkeletonPresets,
  LoadingProgress,
  StaggeredLoader,
  ContentPlaceholder,
  ProgressiveImage,
  useSmartLoading,
  LoadingStateManager
} from '@/lib/loading-experience';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoadingExperienceDemo() {
  const [loadingManager] = useState(() => new LoadingStateManager());
  const [loadingState, setLoadingState] = useState(loadingManager.getState());
  const [activeTab, setActiveTab] = useState('skeleton');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe(setLoadingState);
    return unsubscribe;
  }, [loadingManager]);

  const simulateLoading = () => {
    setIsSimulating(true);
    loadingManager.startLoading(3000);
    
    // Simulate progressive loading
    const stages = [
      { progress: 25, delay: 500, stage: '初始化' },
      { progress: 50, delay: 1000, stage: '加载数据' },
      { progress: 75, delay: 1500, stage: '处理中' },
      { progress: 100, delay: 2000, stage: '完成' }
    ];

    stages.forEach(({ progress, delay, stage }) => {
      setTimeout(() => {
        loadingManager.updateProgress(progress, stage);
        if (progress === 100) {
          setTimeout(() => {
            loadingManager.completeLoading();
            setIsSimulating(false);
          }, 500);
        }
      }, delay);
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">加载体验优化演示</h1>
        <p className="text-gray-600">展示骨架屏、渐进式加载和智能加载状态管理</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skeleton">骨架屏</TabsTrigger>
          <TabsTrigger value="progressive">渐进式加载</TabsTrigger>
          <TabsTrigger value="smart">智能加载</TabsTrigger>
          <TabsTrigger value="progress">进度条</TabsTrigger>
        </TabsList>

        <TabsContent value="skeleton">
          <Card>
            <CardHeader>
              <CardTitle>骨架屏组件</CardTitle>
              <CardDescription>不同类型的骨架屏加载效果</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">卡片骨架屏</h4>
                  <SkeletonPresets.Card />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">列表项骨架屏</h4>
                  <SkeletonPresets.ListItem />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">表格骨架屏</h4>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-3">ID</th>
                        <th className="text-left p-3">名称</th>
                        <th className="text-left p-3">状态</th>
                        <th className="text-left p-3">时间</th>
                        <th className="text-left p-3">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <SkeletonPresets.TableRow />
                      <SkeletonPresets.TableRow />
                      <SkeletonPresets.TableRow />
                    </tbody>
                  </table>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">标题骨架屏</h4>
                  <SkeletonPresets.Hero />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">内容占位符</h4>
                <ContentPlaceholder type="card" count={2} showHeader={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progressive">
          <Card>
            <CardHeader>
              <CardTitle>渐进式图片加载</CardTitle>
              <CardDescription>图片从模糊到清晰的渐进式加载效果</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">标准渐进式加载</h4>
                  <ProgressiveImage
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                    placeholder="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3C/svg%3E"
                    alt="示例图片"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">模糊占位符</h4>
                  <ProgressiveImage
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
                    placeholder="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Cdefs%3E%3Cfilter id='blur'%3E%3CfeGaussianBlur stdDeviation='5'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='400' height='300' fill='%23e0e0e0' filter='url(%23blur)'/%3E%3C/svg%3E"
                    blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Cdefs%3E%3Cfilter id='blur'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='400' height='300' fill='%23d0d0d0' filter='url(%23blur)'/%3E%3C/svg%3E"
                    alt="模糊占位符示例"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">加载动画</h4>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <StaggeredLoader items={3} />
                    <p className="text-sm text-gray-600 mt-2">点状动画</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-600 mt-2">旋转动画</p>
                  </div>
                  
                  <div className="text-center">
                    <Skeleton width={32} height={32} animated={true} borderRadius="50%" />
                    <p className="text-sm text-gray-600 mt-2">脉冲动画</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smart">
          <Card>
            <CardHeader>
              <CardTitle>智能加载状态</CardTitle>
              <CardDescription>根据加载阶段显示不同的UI状态</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-4">
                <Button 
                  onClick={simulateLoading}
                  disabled={isSimulating}
                  variant="outline"
                >
                  {isSimulating ? '加载中...' : '开始模拟加载'}
                </Button>
                
                <Button 
                  onClick={() => loadingManager.setError()}
                  disabled={isSimulating}
                  variant="outline"
                >
                  模拟错误状态
                </Button>
                
                <Button 
                  onClick={() => {
                    loadingManager.completeLoading();
                    setIsSimulating(false);
                  }}
                  disabled={!isSimulating}
                  variant="outline"
                >
                  强制完成
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">当前状态</span>
                  <Badge 
                    variant={loadingState.stage === 'error' ? 'destructive' : 'default'}
                  >
                    {loadingState.stage}
                  </Badge>
                </div>
                
                {loadingState.isLoading ? (
                  <div className="space-y-4">
                    <LoadingProgress loadingState={loadingState} showDetails={true} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <SkeletonPresets.Card />
                      </div>
                      
                      <div className="space-y-3">
                        <SkeletonPresets.ListItem />
                        <SkeletonPresets.ListItem />
                      </div>
                    </div>
                  </div>
                ) : loadingState.stage === 'error' ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h4 className="font-medium text-red-800 mb-2">加载失败</h4>
                    <p className="text-gray-600 mb-4">请检查网络连接或稍后重试</p>
                    <Button onClick={simulateLoading} size="sm">
                      重新加载
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-green-500 text-4xl mb-4">✅</div>
                    <h4 className="font-medium text-green-800 mb-2">加载完成</h4>
                    <p className="text-gray-600">所有内容已成功加载</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>进度条样式</CardTitle>
              <CardDescription>不同类型的加载进度条</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">基础进度条</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">彩色进度条</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">分段进度条</h4>
                  <div className="flex w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-green-500 h-2" style={{ width: '40%' }}></div>
                    <div className="bg-yellow-500 h-2" style={{ width: '35%' }}></div>
                    <div className="bg-red-500 h-2" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">带动画的进度条</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">智能进度条演示</h4>
                <LoadingProgress 
                  loadingState={{
                    isLoading: true,
                    progress: 65,
                    stage: 'loading',
                    estimatedTime: 2000
                  }}
                  showDetails={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}