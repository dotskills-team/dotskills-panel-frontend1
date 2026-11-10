"use client";

import { useQuery } from "@tanstack/react-query";

import { clientApi } from "../api/client.api";
import { clientKeys } from "../api/client.keys";

/**
 * Users that can be picked in "credited to". Only enable it for roles that are
 * allowed to change the credit; other roles get a 403 from the server.
 */
export const useCreditCandidates = (enabled = true) =>
  useQuery({
    queryKey: clientKeys.creditCandidates(),
    queryFn: async () => {
      const res = await clientApi.getCreditCandidates();
      return res.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
