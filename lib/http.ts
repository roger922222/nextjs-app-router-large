// lib/http.ts
// 在服务器组件/Route Handler 中构造绝对 baseUrl，避免相对路径问题
import { headers } from "next/headers";

export async function getBaseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}
