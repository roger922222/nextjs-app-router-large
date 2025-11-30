"use client";
import React, { useState } from "react";
import { SWRConfig } from "swr";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 将 SWR 与 React Query 的 Provider 统一放置
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SWRConfig>
  );
}
