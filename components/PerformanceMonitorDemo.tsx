'use client';

import { useState, useEffect } from 'react';
import { usePerformanceMonitor, PerformanceBudget, DEFAULT_PERFORMANCE_BUDGETS } from '@/lib/performance-monitor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PerformanceMonitorDemo() {
  const { metrics, resources, networkInfo, getPerformanceReport, measure, mark, monitor } = usePerformanceMonitor();
  const [budget] = useState(() => new PerformanceBudget(DEFAULT_PERFORMANCE_BUDGETS));
  const [budgetReport, setBudgetReport] = useState(budget.getReport());
  const [activeTab, setActiveTab] = useState('vitals');
  const [customMetrics, setCustomMetrics] = useState<Record<string, number>>({});

  useEffect(() => {
    Object.entries(metrics).forEach(([metric, value]) => {
      if (value !== undefined) {
        budget.check(metric, value);
      }
    });
    setBudgetReport(budget.getReport());
  }, [metrics, budget]);

  const startCustomMeasurement = () => {
    mark('custom-start');
    
    setTimeout(() => {
      mark('custom-end');
      const duration = measure('custom-measurement', 'custom-start', 'custom-end');
      if (duration !== null) {
        setCustomMetrics(prev => ({
          ...prev,
          'Custom Operation': duration
        }));
      }
    }, 1000);
  };

  const formatMetricValue = (metric: string, value: number): string => {
    switch (metric) {
      case 'FCP':
      case 'LCP':
      case 'FID':
      case 'TTFB':
      case 'TBT':
      case 'SI':
        return `${value.toFixed(0)}ms`;
      case 'CLS':
        return value.toFixed(3);
      default:
        return value.toFixed(2);
    }
  };

  const getMetricStatus = (metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const budgets = DEFAULT_PERFORMANCE_BUDGETS as Record<string, number>;
    const budget = budgets[metric];
    
    if (!budget) return 'good';
    
    if (value <= budget) return 'good';
    if (value <= budget * 1.5) return 'needs-improvement';
    return 'poor';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">性能监控与测量系统</h1>
        <p className="text-gray-600">实时监控Web性能指标和资源加载情况</p>
      </div>

      <div className="flex justify-center space-x-4">
        <Button 
          onClick={() => {
            const report = getPerformanceReport();
            console.log('Performance Report:', report);
            alert('性能报告已生成，请查看控制台');
          }}
          variant="outline"
        >
          生成报告
        </Button>
        
        <Button 
          onClick={startCustomMeasurement}
          variant="outline"
        >
          自定义测量
        </Button>
        
        <Button 
          onClick={() => {
            monitor.clear();
            setCustomMetrics({});
          }}
          variant="outline"
        >
          清除数据
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vitals">核心指标</TabsTrigger>
          <TabsTrigger value="resources">资源加载</TabsTrigger>
          <TabsTrigger value="network">网络信息</TabsTrigger>
          <TabsTrigger value="budget">性能预算</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle>Web核心性能指标</CardTitle>
              <CardDescription>First Contentful Paint, Largest Contentful Paint, Cumulative Layout Shift等关键指标</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(metrics).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>等待性能数据收集...</p>
                  <p className="text-sm mt-2">刷新页面或等待页面加载完成</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {Object.entries(metrics).map(([metric, value]) => {
                    if (value === undefined) return null;
                    const status = getMetricStatus(metric, value);
                    return (
                      <div key={metric} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            status === 'good' ? 'bg-green-500' : 
                            status === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <div className="font-medium">{metric}</div>
                            <div className="text-sm text-gray-600">
                              {metric === 'FCP' && '首次内容绘制'}
                              {metric === 'LCP' && '最大内容绘制'}
                              {metric === 'FID' && '首次输入延迟'}
                              {metric === 'CLS' && '累积布局偏移'}
                              {metric === 'TTFB' && '首字节时间'}
                              {metric === 'TBT' && '总阻塞时间'}
                              {metric === 'SI' && '速度指数'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={status === 'good' ? 'default' : status === 'needs-improvement' ? 'secondary' : 'destructive'}>
                            {formatMetricValue(metric, value)}
                          </Badge>
                          <Badge variant="outline">{status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                  
                  {Object.entries(customMetrics).length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">自定义测量</h4>
                      {Object.entries(customMetrics).map(([name, value]) => (
                        <div key={name} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium">{name}</span>
                          <Badge variant="default">{value.toFixed(2)}ms</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>资源加载监控</CardTitle>
              <CardDescription>监控所有网络资源的加载时间和大小</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resources.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>暂无资源加载数据</p>
                  <p className="text-sm mt-2">等待资源加载或刷新页面</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{resources.length}</div>
                      <div className="text-sm text-blue-800">总资源数</div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {resources.filter(r => r.cached).length}
                      </div>
                      <div className="text-sm text-green-800">缓存资源</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <div className="grid grid-cols-5 gap-4 text-sm font-medium">
                        <div>资源</div>
                        <div>类型</div>
                        <div>加载时间</div>
                        <div>大小</div>
                        <div>状态</div>
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {resources.slice(-10).reverse().map((resource, index) => (
                        <div key={index} className="grid grid-cols-5 gap-4 px-4 py-3 border-b hover:bg-gray-50">
                          <div className="text-sm truncate" title={resource.url}>
                            {resource.url.split('/').pop() || resource.url}
                          </div>
                          <div>
                            <Badge variant="outline" className="text-xs">
                              {resource.type}
                            </Badge>
                          </div>
                          <div className="text-sm">{resource.loadTime.toFixed(0)}ms</div>
                          <div className="text-sm">
                            {resource.size > 1024 ? `${(resource.size / 1024).toFixed(1)}KB` : `${resource.size}B`}
                          </div>
                          <div>
                            <Badge variant={resource.cached ? 'default' : 'secondary'} className="text-xs">
                              {resource.cached ? '缓存' : '网络'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>网络信息</CardTitle>
              <CardDescription>当前网络环境和连接信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {networkInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">网络类型</div>
                      <div className="font-medium">{networkInfo.effectiveType.toUpperCase()}</div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">下行速度</div>
                      <div className="font-medium">{networkInfo.downlink} Mbps</div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">往返时延</div>
                      <div className="font-medium">{networkInfo.rtt} ms</div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">省流模式</div>
                      <div className="font-medium">
                        <Badge variant={networkInfo.saveData ? 'destructive' : 'default'}>
                          {networkInfo.saveData ? '开启' : '关闭'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-3">网络质量评估</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>连接质量:</span>
                        <Badge 
                          variant={networkInfo.rtt < 100 ? 'default' : networkInfo.rtt < 300 ? 'secondary' : 'destructive'}
                        >
                          {networkInfo.rtt < 100 ? '优秀' : networkInfo.rtt < 300 ? '良好' : '较差'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>速度等级:</span>
                        <Badge 
                          variant={networkInfo.downlink > 2 ? 'default' : networkInfo.downlink > 0.5 ? 'secondary' : 'destructive'}
                        >
                          {networkInfo.downlink > 2 ? '高速' : networkInfo.downlink > 0.5 ? '中速' : '低速'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>网络信息不可用</p>
                  <p className="text-sm mt-2">您的浏览器不支持网络信息API</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>性能预算检查</CardTitle>
              <CardDescription>监控性能指标是否超出预设预算</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.keys(DEFAULT_PERFORMANCE_BUDGETS).length - budgetReport.violationCount}
                  </div>
                  <div className="text-sm text-green-800">达标指标</div>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {budgetReport.violationCount}
                  </div>
                  <div className="text-sm text-red-800">超标指标</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {Object.entries(DEFAULT_PERFORMANCE_BUDGETS).map(([metric, budget]) => {
                  const value = metrics[metric as keyof typeof metrics];
                  const violations = budgetReport.violations[metric] || [];
                  const isViolated = violations.length > 0;
                  
                  return (
                    <div key={metric} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{metric}</div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={isViolated ? 'destructive' : 'default'}>
                            预算: {formatMetricValue(metric, budget)}
                          </Badge>
                          {value !== undefined && (
                            <Badge variant="outline">
                              实际: {formatMetricValue(metric, value)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {value !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${isViolated ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ 
                              width: `${Math.min((value / budget) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}