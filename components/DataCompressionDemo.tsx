'use client';

import { useState, useEffect } from 'react';
import { compressData, decompressData, createBatchRequest, processBatchRequests, createPaginationResponse } from '@/lib/data-compression';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  algorithm: string;
  time: number;
}

interface BatchResult {
  totalRequests: number;
  batchSize: number;
  totalTime: number;
  individualTime: number;
  improvement: number;
}

interface PaginationResult {
  page: number;
  pageSize: number;
  totalItems: number;
  items: any[];
  loadTime: number;
}

export default function DataCompressionDemo() {
  const [compressionResults, setCompressionResults] = useState<CompressionResult[]>([]);
  const [batchResults, setBatchResults] = useState<BatchResult | null>(null);
  const [paginationResults, setPaginationResults] = useState<PaginationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('compression');

  // Generate sample data for testing
  const generateSampleData = (size: number) => {
    const data = [];
    for (let i = 0; i < size; i++) {
      data.push({
        id: i,
        name: `Item ${i}`,
        description: `This is a sample description for item ${i}. It contains some text to make it more realistic.`,
        timestamp: Date.now(),
        metadata: {
          category: ['electronics', 'clothing', 'books', 'home'][Math.floor(Math.random() * 4)],
          price: Math.random() * 1000,
          rating: Math.random() * 5
        }
      });
    }
    return data;
  };

  // Test compression algorithms
  const testCompression = async () => {
    setIsLoading(true);
    const results: CompressionResult[] = [];
    
    const sampleData = generateSampleData(1000);
    const jsonString = JSON.stringify(sampleData);
    
    const algorithms = ['gzip', 'deflate', 'brotli'] as const;
    
    for (const algorithm of algorithms) {
      const startTime = performance.now();
      
      try {
        const compressed = await compressData(jsonString, algorithm);
        const endTime = performance.now();
        
        results.push({
          originalSize: jsonString.length,
          compressedSize: compressed.length,
          compressionRatio: ((jsonString.length - compressed.length) / jsonString.length) * 100,
          algorithm,
          time: endTime - startTime
        });
      } catch (error) {
        console.error(`Compression failed for ${algorithm}:`, error);
      }
    }
    
    setCompressionResults(results);
    setIsLoading(false);
  };

  // Test batch request optimization
  const testBatchRequests = async () => {
    setIsLoading(true);
    
    // Simulate individual requests
    const individualStart = performance.now();
    const individualRequests = Array.from({ length: 50 }, (_, i) => 
      fetch(`/api/items/${i}`).catch(() => ({ ok: true, json: () => ({ id: i }) }))
    );
    await Promise.all(individualRequests);
    const individualTime = performance.now() - individualStart;
    
    // Simulate batch requests
    const batchStart = performance.now();
    const batchRequest = createBatchRequest(
      Array.from({ length: 50 }, (_, i) => ({
        url: `/api/items/${i}`,
        method: 'GET'
      }))
    );
    
    // Simulate batch processing
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    const batchTime = performance.now() - batchStart;
    
    setBatchResults({
      totalRequests: 50,
      batchSize: 10,
      totalTime: batchTime,
      individualTime: individualTime,
      improvement: ((individualTime - batchTime) / individualTime) * 100
    });
    
    setIsLoading(false);
  };

  // Test pagination optimization
  const testPagination = async () => {
    setIsLoading(true);
    const results: PaginationResult[] = [];
    const totalData = generateSampleData(10000);
    
    for (let page = 1; page <= 5; page++) {
      const startTime = performance.now();
      const paginatedData = createPaginationResponse(totalData, page, 20);
      const endTime = performance.now();
      
      results.push({
        page,
        pageSize: 20,
        totalItems: totalData.length,
        items: paginatedData.items,
        loadTime: endTime - startTime
      });
    }
    
    setPaginationResults(results);
    setIsLoading(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">数据压缩与传输优化演示</h1>
        <p className="text-gray-600">
          展示数据压缩算法、批量请求优化和分页加载的性能提升效果
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compression">数据压缩</TabsTrigger>
          <TabsTrigger value="batch">批量请求</TabsTrigger>
          <TabsTrigger value="pagination">分页加载</TabsTrigger>
        </TabsList>

        <TabsContent value="compression">
          <Card>
            <CardHeader>
              <CardTitle>数据压缩算法对比</CardTitle>
              <CardDescription>
                测试不同压缩算法对JSON数据的压缩效果和性能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testCompression} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? '测试中...' : '开始压缩测试'}
              </Button>
              
              {compressionResults.length > 0 && (
                <div className="space-y-4">
                  {compressionResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline">{result.algorithm.toUpperCase()}</Badge>
                        <span className="text-sm text-gray-500">
                          {result.time.toFixed(2)}ms
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>原始大小:</span>
                          <span>{(result.originalSize / 1024).toFixed(2)} KB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>压缩后大小:</span>
                          <span>{(result.compressedSize / 1024).toFixed(2)} KB</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>压缩率:</span>
                          <span className="text-green-600">{result.compressionRatio.toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <Progress 
                        value={result.compressionRatio} 
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle>批量请求优化</CardTitle>
              <CardDescription>
                对比单个请求与批量请求的性能差异
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testBatchRequests} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? '测试中...' : '开始批量测试'}
              </Button>
              
              {batchResults && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">单个请求</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>总时间:</span>
                          <span>{batchResults.individualTime.toFixed(2)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>请求数量:</span>
                          <span>{batchResults.totalRequests}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">批量请求</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>总时间:</span>
                          <span>{batchResults.totalTime.toFixed(2)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>批次大小:</span>
                          <span>{batchResults.batchSize}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-800">性能提升:</span>
                      <Badge variant="outline" className="border-green-200 text-green-800">
                        {batchResults.improvement.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagination">
          <Card>
            <CardHeader>
              <CardTitle>分页加载优化</CardTitle>
              <CardDescription>
                展示智能分页加载的性能表现
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testPagination} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? '加载中...' : '开始分页测试'}
              </Button>
              
              {paginationResults.length > 0 && (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    {paginationResults.map((result, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">第{result.page}页</Badge>
                          <span className="text-sm text-gray-600">
                            {result.items.length} 条记录
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">加载时间: </span>
                          <span className="font-medium">{result.loadTime.toFixed(2)}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-800">平均加载时间:</span>
                      <span className="text-blue-800 font-bold">
                        {(paginationResults.reduce((sum, r) => sum + r.loadTime, 0) / paginationResults.length).toFixed(2)}ms
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}