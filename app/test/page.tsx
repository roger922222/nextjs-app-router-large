export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">性能优化系统测试</h1>
      <p className="text-gray-600 mb-8">
        Next.js 性能优化系统已成功部署！请访问以下页面测试各项优化功能：
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a href="/image-optimization" className="p-4 border rounded-lg hover:bg-gray-50">
          <h3 className="font-semibold">图片优化</h3>
          <p className="text-sm text-gray-600">WebP格式、懒加载、响应式图片</p>
        </a>
        
        <a href="/data-compression" className="p-4 border rounded-lg hover:bg-gray-50">
          <h3 className="font-semibold">数据压缩</h3>
          <p className="text-sm text-gray-600">压缩算法、批量请求、分页优化</p>
        </a>
        
        <a href="/loading-experience" className="p-4 border rounded-lg hover:bg-gray-50">
          <h3 className="font-semibold">加载体验</h3>
          <p className="text-sm text-gray-600">骨架屏、渐进式加载、智能状态</p>
        </a>
        
        <a href="/performance-monitor" className="p-4 border rounded-lg hover:bg-gray-50">
          <h3 className="font-semibold">性能监控</h3>
          <p className="text-sm text-gray-600">Web指标、资源监控、网络信息</p>
        </a>
        
        <a href="/performance-test" className="p-4 border rounded-lg hover:bg-gray-50">
          <h3 className="font-semibold">性能测试</h3>
          <p className="text-sm text-gray-600">自动化测试、效果验证、优化建议</p>
        </a>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">系统状态</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ 图片优化系统 - 已部署</li>
          <li>✅ 数据压缩系统 - 已部署</li>
          <li>✅ 加载体验优化 - 已部署</li>
          <li>✅ 性能监控系统 - 已部署</li>
          <li>✅ 自动化测试系统 - 已部署</li>
        </ul>
      </div>
    </div>
  );
}