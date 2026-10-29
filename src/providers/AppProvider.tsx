"use client";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/query-client";

import { AuthInitializer } from "@/providers";

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({
  children,
}: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>{children}</AuthInitializer>
    </QueryClientProvider>
  );
}