# Next.js App Router 大型示例工程

本工程演示基于 Next.js App Router 的全套能力：服务器组件的数据获取与三层缓存、并行/串行、Suspense 与流式渲染；客户端 SWR / React Query；Server Actions；Route Handlers 自定义 API 与 CRUD；按需重验证。

## 安装与启动

- Node.js ≥ 18（建议 20）
- 安装依赖：

```bash
npm i
```

- 开发启动：

```bash
npm run dev
```

访问 http://localhost:3000

## 目录结构（关键）

- app/
  - page.tsx：首页说明与导航
  - layout.tsx：导航栏与 Providers
  - globals.css：全局样式
  - loading.tsx：根级加载占位
  - server/：服务器组件演示页面
    - page.tsx：Data Cache 与 no-store 演示
    - parallel/page.tsx：并行获取（Promise.all）
    - serial/page.tsx：串行获取（依次 await）
    - dedup/page.tsx：请求去重（Request Memoization）
    - full-route-cache/page.tsx：整页缓存（Full Route Cache）
  - streaming/page.tsx：Suspense 与分块流式渲染
  - client-swr/page.tsx：客户端组件，SWR 列表与新增 + mutate
  - client-react-query/page.tsx：客户端组件，React Query 列表与新增/更新/删除 + invalidateQueries
  - mutations/
    - actions.ts：Server Actions（create/update/delete），变更后 revalidateTag('posts') 与 revalidatePath('/client-swr', '/client-react-query', '/server')
    - page.tsx：表单页面，支持提交状态显示
  - on-demand-revalidate/page.tsx：页面内的 Server Action 手动触发 revalidateTag('posts')
- app/api/
  - posts/route.ts：GET 列表、POST 创建，支持 ?delay=ms 模拟延迟
  - posts/[id]/route.ts：GET 单条、PATCH 更新、DELETE 删除
  - metrics/route.ts：GET 返回调用次数（模块级变量计数），用于请求去重演示
- lib/
  - db.ts：内存数据层，提供 list/get/create/update/remove 并初始化种子数据
  - http.ts：在服务器环境中利用 next/headers 构造 baseUrl（协议 + Host），避免相对路径问题

## 页面导航与验证方法

- 首页：/
- 服务器组件缓存演示：/server
  - Data Cache：页面内对 /api/posts 执行带 tags 与 revalidate 的 fetch。可在 Server Actions 页面变更后，点击“按需重验证”，观察数据时间戳更新。
  - no-store：页面内对 /api/posts?delay=500 执行 cache: 'no-store' 的 fetch，每次渲染都会更新。
- 并行获取：/server/parallel
  - 两个不同延迟的接口通过 Promise.all 并行获取，观察时间戳差异。
- 串行获取：/server/serial
  - 依次 await 两个接口，观察总耗时更长。
- 请求去重：/server/dedup
  - 同一渲染上下文中对 /api/metrics 执行两次完全相同的 fetch，预期后端计数仅 +1（两个返回结果的 count 相同）。
- 整页缓存：/server/full-route-cache
  - export const revalidate = 60；整页缓存 60 秒。若需要立即刷新整页，可在 Server Actions 中调用 revalidatePath('/server/full-route-cache')（示例里未调用，便于观察缓存效果）。
- Suspense 与流式渲染：/streaming
  - 两个慢速服务器子组件（2s/4s），页面会分块逐步输出（流式渲染）。
- 客户端 SWR：/client-swr
  - useSWR('/api/posts') 展示列表，点击“新增”后会 POST /api/posts，并通过 mutate() 进行本地更新与重新验证。
- 客户端 React Query：/client-react-query
  - useQuery 获取列表，useMutation 进行新增/更新/删除，并通过 queryClient.invalidateQueries({ queryKey: ['posts'] }) 进行重新验证。
- Server Actions 与按需重验证：/mutations
  - 表单分别演示 create/update/delete。每次变更后，Server Actions 会调用 revalidateTag('posts') 和 revalidatePath('/client-swr', '/client-react-query', '/server')，使相关页面数据刷新。
- 手动触发重验证：/on-demand-revalidate
  - 页面内定义一个 Server Action，点击按钮后调用 revalidateTag('posts')。

## 三层缓存机制与原理说明（RSC 背景）

- 请求去重（Request Memoization）
  - 同一请求上下文中，对相同 URL + 完全一致的 fetch options 的调用会被去重，只执行一次。适用于 cache: 'no-store' 的场景，主要目的是避免重复 I/O。
- 数据缓存（Data Cache）
  - 在服务器组件中通过 fetch 的 next: { tags, revalidate } 控制数据缓存；在变更后使用 revalidateTag('posts') 使数据过期并在下一次请求时重新获取。不会缓存整页，仅缓存数据层。
- 整页缓存（Full Route Cache）
  - 通过在页面文件中导出 revalidate = 60（或 'force-cache'）实现整页层面的缓存。该缓存可通过 revalidatePath('/xxx') 进行按需失效。注意：页面内部使用 cache: 'no-store' 的 fetch 会使整页缓存失效（示例页避免使用）。

### 按需重验证

- revalidateTag('posts')：针对数据缓存的标签失效。配合 fetch(next: { tags: ['posts'] }) 使用。
- revalidatePath('/server')：针对整页缓存进行路径级别的失效，使下次请求重新渲染整个页面。

## 运行环境与其他说明

- 若需要自定义端口或跨域访问，请在启动参数或代理层进行配置。
- 本示例使用内存数据层（lib/db.ts），服务重启后数据会重置。
- 无需额外环境变量；如在生产中使用真实数据库，请自行扩展 lib/db.ts 与相关 Route Handlers。
