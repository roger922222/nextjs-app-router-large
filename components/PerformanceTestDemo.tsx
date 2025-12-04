'use client';

import { useState, useEffect } from 'react';
import {
  runAllPerformanceTests,
  generateTestSummary,
  TestReport,
  TestResult
} from '@/lib/performance-tests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PerformanceTestDemo() {
  const [testReports, setTestReports] = useState<TestReport[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [testSummary, setTestSummary] = useState<ReturnType<typeof generateTestSummary> | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setTestReports([]);
    
    try {
      const reports = await runAllPerformanceTests();
      setTestReports(reports);
      setTestSummary(generateTestSummary(reports));
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-500';
      case 'fail': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pass': return 'default';
      case 'fail': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">性能优化测试验证</h1>
        <p className="text-gray-600">运行自动化测试验证各项性能优化的效果</p>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          size="lg"
        >
          {isRunning ? '测试中...' : '开始性能测试'}
        </Button>
      </div>

      {testSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{testSummary.totalTests}</div>
              <div className="text-sm text-gray-600 mt-1">总测试数</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{testSummary.totalPassed}</div>
              <div className="text-sm text-gray-600 mt-1">通过测试</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600">{testSummary.totalFailed}</div>
              <div className="text-sm text-gray-600 mt-1">失败测试</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600">{testSummary.totalWarnings}</div>
              <div className="text-sm text-gray-600 mt-1">警告测试</div>
            </CardContent>
          </Card>
        </div>
      )}

      {testReports.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">测试摘要</TabsTrigger>
            <TabsTrigger value="details">详细结果</TabsTrigger>
            <TabsTrigger value="recommendations">优化建议</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>测试摘要</CardTitle>
                <CardDescription>各测试套件的整体表现</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {testReports.map((report, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{report.suiteName}</h4>
                      <Badge variant={report.failed === 0 ? 'default' : 'destructive'}>
                        {report.passed}/{report.totalTests} 通过
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">总测试</div>
                        <div className="font-medium">{report.totalTests}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">通过</div>
                        <div className="font-medium text-green-600">{report.passed}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">失败</div>
                        <div className="font-medium text-red-600">{report.failed}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">总耗时</div>
                        <div className="font-medium">{report.totalDuration.toFixed(0)}ms</div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>测试进度</span>
                        <span>{Math.round((report.passed / report.totalTests) * 100)}%</span>
                      </div>
                      <Progress value={(report.passed / report.totalTests) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>详细测试结果</CardTitle>
                <CardDescription>每个测试用例的详细结果</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {testReports.map((report, reportIndex) => (
                  <div key={reportIndex} className="space-y-3">
                    <h4 className="font-medium text-lg">{report.suiteName}</h4>
                    
                    {report.results.map((result, resultIndex) => (
                      <div key={resultIndex} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(result.status)}`}></div>
                            <span className="font-medium">{result.name}</span>
                          </div>
                          <Badge variant={getStatusBadgeVariant(result.status)}>
                            {result.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">执行时间</div>
                            <div className="font-medium">{result.duration.toFixed(2)}ms</div>
                          </div>
                          <div>
                            <div className="text-gray-600">内存使用</div>
                            <div className="font-medium">{(result.memoryUsed / 1024 / 1024).toFixed(2)}MB</div>
                          </div>
                          <div>
                            <div className="text-gray-600">状态</div>
                            <div className="font-medium">
                              {result.status === 'pass' ? '✅ 通过' : 
                               result.status === 'fail' ? '❌ 失败' : '⚠️ 警告'}
                            </div>
                          </div>
                        </div>
                        
                        {result.message && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="text-sm text-yellow-800">
                              <strong>备注:</strong> {result.message}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>优化建议</CardTitle>
                <CardDescription>基于测试结果的性能优化建议</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {testSummary && testSummary.recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {testSummary.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-blue-600 mt-0.5">💡</div>
                        <div>
                          <div className="font-medium text-blue-900">建议 {index + 1}</div>
                          <div className="text-blue-800 text-sm mt-1">{recommendation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-green-600 text-4xl mb-4">🎉</div>
                    <h4 className="font-medium text-green-800 mb-2">优秀！</h4>
                    <p className="text-green-700">所有性能测试均已通过，暂不需要额外的优化建议。</p>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">通用优化建议</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>定期运行性能测试以监控应用性能变化</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>使用真实用户监控(RUM)收集实际用户体验数据</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>建立性能预算并在CI/CD流程中强制执行</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>针对不同网络环境优化资源加载策略</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}