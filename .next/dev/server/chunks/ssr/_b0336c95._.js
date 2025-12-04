module.exports = [
"[project]/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/app/mutations/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"408c5e2c3c8b9af58c38ae6746d08336c8a3139e76":"createPost","40a59b44e35cec663d8ee861f8cf3fdb9eb817451e":"deletePost","40c74393e8a61feda8b285963aea15e0953ade26d1":"updatePost"},"",""] */ __turbopack_context__.s([
    "createPost",
    ()=>createPost,
    "deletePost",
    ()=>deletePost,
    "updatePost",
    ()=>updatePost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function createPost(formData) {
    const title = String(formData.get("title") || `SA 新增 ${Date.now()}`);
    const body = String(formData.get("body") || "");
    const post = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["create"])({
        title,
        body
    });
    // 变更后，按需重验证
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])("posts", "page");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/client-swr", "page");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/client-react-query", "page");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/server", "page");
}
async function updatePost(formData) {
    const id = Number(formData.get("id"));
    const title = formData.get("title");
    const body = formData.get("body");
    const post = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["update"])(id, {
        title: typeof title === "string" ? title : undefined,
        body: typeof body === "string" ? body : undefined
    });
    if (!post) return;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])("posts", "page");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/client-swr", "page");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/client-react-query", "page");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/server", "page");
}
async function deletePost(formData) {
    const id = Number(formData.get("id"));
    const ok = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["remove"])(id);
    if (!ok) return;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])("posts", "page");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/client-swr", "page");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/client-react-query", "page");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/server", "page");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createPost,
    updatePost,
    deletePost
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createPost, "408c5e2c3c8b9af58c38ae6746d08336c8a3139e76", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updatePost, "40c74393e8a61feda8b285963aea15e0953ade26d1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deletePost, "40a59b44e35cec663d8ee861f8cf3fdb9eb817451e", null);
}),
"[project]/.next-internal/server/app/mutations/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/mutations/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$mutations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/mutations/actions.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/.next-internal/server/app/mutations/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/mutations/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "408c5e2c3c8b9af58c38ae6746d08336c8a3139e76",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$mutations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPost"],
    "40a59b44e35cec663d8ee861f8cf3fdb9eb817451e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$mutations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deletePost"],
    "40c74393e8a61feda8b285963aea15e0953ade26d1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$mutations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updatePost"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$mutations$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$mutations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/mutations/page/actions.js { ACTIONS_MODULE0 => "[project]/app/mutations/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$mutations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/mutations/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_b0336c95._.js.map