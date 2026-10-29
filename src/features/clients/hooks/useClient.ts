"use client";

import { useQuery } from "@tanstack/react-query";

import { clientApi } from "../api/client.api";
import { clientKeys } from "../api/client.keys";

export function useClient(id?: string) {
  return useQuery({
    queryKey: clientKeys.detail(id ?? ""),

    enabled: !!id,

    queryFn: async () => {
      const { data } =
        await clientApi.getClient(id!);

      return data;
    },
  });
}