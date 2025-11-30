import { NextResponse } from "next/server";

let count = 0; // 模块级变量：用于观察请求是否被去重（memoized）

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reset = searchParams.get("reset");
  if (reset) count = 0;
  count += 1;
  return NextResponse.json({ count, ts: Date.now() });
}
