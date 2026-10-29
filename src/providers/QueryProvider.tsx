"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/query-client";

export default function QueryProvider({
  children,
}: PropsWithChildren) {
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}

      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}