"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fundTransferApi } from "../api/fund-transfer.api";
import type {
  CreateFundTransferInput,
  FundTransferQueryInput,
} from "../schemas/fund-transfer.schema";

export const fundTransferKeys = {
  all: ["fund-transfers"] as const,
  list: (query: FundTransferQueryInput) => [...fundTransferKeys.all, "list", query] as const,
};

export function useFundTransfers(query: FundTransferQueryInput = {}) {
  return useQuery({
    queryKey: fundTransferKeys.list(query),
    queryFn: () => fundTransferApi.getAll(query),
    placeholderData: (previousData) => previousData,
  });
}

// Transfer balance বদলায়, তাই financial-accounts আর expenses cache-ও refresh করতে হবে
function useInvalidateAfterTransfer() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: fundTransferKeys.all });
    queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
  };
}

export function useCreateFundTransfer() {
  const invalidate = useInvalidateAfterTransfer();
  return useMutation({
    mutationFn: (payload: CreateFundTransferInput) => fundTransferApi.create(payload),
    onSuccess: invalidate,
  });
}

export function useDeleteFundTransfer() {
  const invalidate = useInvalidateAfterTransfer();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => fundTransferApi.remove(id),
    onSuccess: invalidate,
  });
}