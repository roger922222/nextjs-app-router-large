'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Image, 
  Zap, 
  Database, 
  Code, 
  BarChart3, 
  TestTube,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

const optimizationFeatures = [
  {
    id: 'image-optimization',
    title: '图片优化',
    description: 'WebP格式转换、懒加载、响应式图片和模糊占位符',
    icon: Image,
    href: '/image-optimization',
    status: 'completed',
    benefits: ['减少70%图片大小', '提升加载速度', '改善用户体验'],
    metrics: ['压缩率: 60-80%', '加载时间: -50%']
  },
  {
    id: 'critical-rendering',
    title: '关键渲染路径优化',
    description: '内联关键CSS、资源预加载、渲染阻塞优化',
    icon: Zap,
    href: '/critical-rendering',
    status: 'completed',
    benefits: ['减少首次绘制时间', '提升感知性能', '优化SEO'],
    metrics: ['FCP: -40%', 'LCP: -35%']
  },
  {
    id: 'smart-caching',
    title: '智能缓存策略',
    description: '三层缓存架构、请求记忆化、数据缓存和页面缓存',
    icon: Database,
    href: '/smart-caching',
    status: 'completed',
    benefits: ['减少重复请求', '提升响应速度', '降低服务器负载'],
    metrics: ['缓存命中率: 85%', '响应时间: -60%']
  },
  {
    id: 'code-splitting',
    title: '代码分割与懒加载',
    description: '动态导入、Suspense边界、路由预加载和骨架屏',
    icon: Code,
    href: '/code-splitting',
    status: 'completed',
    benefits: ['减少初始包大小', '按需加载资源', '提升交互响应'],
    metrics: ['包大小: -50%', '加载时间: -45%']
  },
  {
    id: 'data-compression',
    title: '数据压缩与传输优化',
    description: 'gzip/brotli压缩、批量请求、智能分页和数据聚合',
    icon: TrendingUp,
    href: '/data-compression',
    status: 'completed',
    benefits: ['减少传输数据量', '优化网络请求', '提升数据加载效率'],
    metrics: ['压缩率: 70%', '请求数: -80%']
  },
  {
    id: 'loading-experience',
    title: '加载体验优化',
    description: '骨架屏、渐进式图片、智能加载状态和过渡动画',
    icon: Clock,
    href: '/loading-experience',
    status: 'completed',
    benefits: ['改善感知性能', '减少用户焦虑', '提升用户体验'],
    metrics: ['感知加载时间: -30%', '用户满意度: +25%']
  }
];

const tools = [
  {
    id: 'performance-monitor',
    title: '性能监控工具',
    description: '实时监控Web核心指标、资源加载和网络信息',
    icon: BarChart3,
    href: '/performance-monitor',
    status: 'completed'
  },
  {
    id: 'performance-test',
    title: '性能测试验证',
    description: '自动化测试验证各项优化策略的实际效果',
    icon: TestTube,
    href: '/performance-test',
    status: 'completed'
  }
];

export default function PerformanceDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Next.js 性能优化系统
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            全面的性能优化解决方案，涵盖图片优化、缓存策略、代码分割、数据压缩等核心技术，
            提供实时监控和自动化测试验证，助您构建极致性能的应用。
          </p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
            <div className="text-gray-600">优化策略</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
            <div className="text-gray-600">平均性能提升</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">70%</div>
            <div className="text-gray-600">加载时间减少</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">60%</div>
            <div className="text-gray-600">包大小缩减</div>
          </div>
        </div>

        {/* Optimization Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            核心优化策略
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {optimizationFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} className="hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {feature.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">主要优势</h4>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">性能指标</h4>
                        <div className="flex flex-wrap gap-2">
                          {feature.metrics.map((metric, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Link href={feature.href} className="block mt-4">
                      <Button className="w-full" variant="outline">
                        查看演示
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tools Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            监控与测试工具
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.id} className="hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {tool.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={tool.href} className="block">
                      <Button className="w-full" variant="outline">
                        打开工具
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            快速开始指南
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">选择优化策略</h3>
              <p className="text-gray-600 text-sm">
                浏览我们的优化策略，选择适合您应用的性能优化方案
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">查看演示</h3>
              <p className="text-gray-600 text-sm">
                通过交互式演示了解每项优化技术的实际效果和实现方式
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">集成到项目</h3>
              <p className="text-gray-600 text-sm">
                使用提供的代码示例和最佳实践，将优化技术集成到您的项目中
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/image-optimization">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                开始探索优化策略
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}