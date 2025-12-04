module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/db.ts
// 简单的内存数据层。注意：在生产环境中应替换为真实数据库。
__turbopack_context__.s([
    "create",
    ()=>create,
    "get",
    ()=>get,
    "list",
    ()=>list,
    "remove",
    ()=>remove,
    "update",
    ()=>update
]);
let _id = 3;
const posts = [
    {
        id: 1,
        title: "Hello Next.js",
        body: "欢迎使用 App Router！",
        createdAt: Date.now() - 1000 * 60 * 60
    },
    {
        id: 2,
        title: "Server Components",
        body: "默认在服务端获取数据，支持流式渲染。",
        createdAt: Date.now() - 1000 * 60 * 30
    },
    {
        id: 3,
        title: "SWR & React Query",
        body: "在客户端进行数据获取与变更。",
        createdAt: Date.now() - 1000 * 60 * 10
    }
];
function list() {
    return posts.slice().sort((a, b)=>b.createdAt - a.createdAt);
}
function get(id) {
    return posts.find((p)=>p.id === id);
}
function create(input) {
    const post = {
        id: ++_id,
        title: input.title ?? "Untitled",
        body: input.body ?? "",
        createdAt: Date.now()
    };
    posts.push(post);
    return post;
}
function update(id, patch) {
    const p = posts.find((x)=>x.id === id);
    if (!p) return undefined;
    if (typeof patch.title === "string") p.title = patch.title;
    if (typeof patch.body === "string") p.body = patch.body;
    return p;
}
function remove(id) {
    const idx = posts.findIndex((x)=>x.id === id);
    if (idx >= 0) {
        posts.splice(idx, 1);
        return true;
    }
    return false;
}
}),
"[project]/app/api/posts/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const delay = parseInt(searchParams.get("delay") || "0", 10) || 0;
    if (delay > 0) {
        await new Promise((r)=>setTimeout(r, delay));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        posts: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["list"])(),
        ts: Date.now()
    });
}
async function POST(request) {
    const payload = await request.json().catch(()=>({}));
    const post = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["create"])({
        title: payload.title || "新帖子",
        body: payload.body || ""
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        post,
        ts: Date.now()
    }, {
        status: 201
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d2e7998b._.js.map