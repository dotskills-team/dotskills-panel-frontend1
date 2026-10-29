// "use client";

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import {
//   createFinancialAccount,
//   deleteFinancialAccount,
//   getFinancialAccountById,
//   getFinancialAccounts,
//   getFinancialAccountSummary,
//   updateFinancialAccount,
// } from "../api/financial-account.api";

// import type {
//   CreateFinancialAccountInput,
//   FinancialAccountQueryInput,
//   UpdateFinancialAccountInput,
// } from "../schemas/financial-account.schema";

// export const financialAccountKeys = {
//   all: ["financial-accounts"] as const,
//   lists: () => [...financialAccountKeys.all, "list"] as const,
//   list: (query: FinancialAccountQueryInput) =>
//     [...financialAccountKeys.lists(), query] as const,
//   details: () => [...financialAccountKeys.all, "detail"] as const,
//   detail: (id: string) => [...financialAccountKeys.details(), id] as const,
// };

// export function useFinancialAccounts(
//   query: FinancialAccountQueryInput = {},
//   options?: { enabled?: boolean },
// ) {
//   return useQuery({
//     queryKey: financialAccountKeys.list(query),
//     queryFn: () => getFinancialAccounts(query),
//     enabled: options?.enabled ?? true,
//     placeholderData: (previousData) => previousData,
//   });
// }

// export function useFinancialAccount(id?: string, options?: { enabled?: boolean }) {
//   return useQuery({
//     queryKey: financialAccountKeys.detail(id ?? ""),
//     queryFn: () => getFinancialAccountById(id as string),
//     enabled: Boolean(id) && (options?.enabled ?? true),
//   });
// }

// export function useCreateFinancialAccount() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: CreateFinancialAccountInput) =>
//       createFinancialAccount(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
//     },
//   });
// }

// export function useUpdateFinancialAccount() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: UpdateFinancialAccountInput;
//     }) => updateFinancialAccount(id, payload),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: financialAccountKeys.lists() });
//       queryClient.invalidateQueries({
//         queryKey: financialAccountKeys.detail(variables.id),
//       });
//     },
//   });
// }

// export function useDeleteFinancialAccount() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id }: { id: string }) => deleteFinancialAccount(id),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
//       queryClient.invalidateQueries({
//         queryKey: financialAccountKeys.detail(variables.id),
//       });
//     },
//   });
// }


// export function useFinancialAccountSummary(options?: { enabled?: boolean }) {
//   return useQuery({
//     queryKey: [...financialAccountKeys.all, "summary"],
//     queryFn: () => getFinancialAccountSummary(),
//     enabled: options?.enabled ?? true,
//   });
// }


"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createFinancialAccount,
  deleteFinancialAccount,
  getFinancialAccountById,
  getFinancialAccounts,
  getFinancialAccountSummary,
  getFinancialPayments,
  updateFinancialAccount,
} from "../api/financial-account.api";
import type { FinancialPaymentQuery } from "../api/financial-account.api";

import type {
  CreateFinancialAccountInput,
  FinancialAccountQueryInput,
  UpdateFinancialAccountInput,
} from "../schemas/financial-account.schema";

export const financialAccountKeys = {
  all: ["financial-accounts"] as const,
  lists: () => [...financialAccountKeys.all, "list"] as const,
  list: (query: FinancialAccountQueryInput) =>
    [...financialAccountKeys.lists(), query] as const,
  details: () => [...financialAccountKeys.all, "detail"] as const,
  detail: (id: string) => [...financialAccountKeys.details(), id] as const,
  summary: () => [...financialAccountKeys.all, "summary"] as const,
  payments: () => [...financialAccountKeys.all, "payments"] as const,
  paymentList: (query: FinancialPaymentQuery) =>
    [...financialAccountKeys.payments(), query] as const,
};

export function useFinancialAccounts(
  query: FinancialAccountQueryInput = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: financialAccountKeys.list(query),
    queryFn: () => getFinancialAccounts(query),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
  });
}

export function useFinancialAccount(id?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: financialAccountKeys.detail(id ?? ""),
    queryFn: () => getFinancialAccountById(id as string),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}

export function useCreateFinancialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFinancialAccountInput) =>
      createFinancialAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
    },
  });
}

export function useUpdateFinancialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFinancialAccountInput;
    }) => updateFinancialAccount(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: financialAccountKeys.detail(variables.id),
      });
      // account name/type বদলালে payments list এও দেখাবে
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.payments() });
    },
  });
}

export function useDeleteFinancialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteFinancialAccount(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
      queryClient.invalidateQueries({
        queryKey: financialAccountKeys.detail(variables.id),
      });
    },
  });
}

export function useFinancialAccountSummary(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: financialAccountKeys.summary(),
    queryFn: () => getFinancialAccountSummary(),
    enabled: options?.enabled ?? true,
  });
}

export function useFinancialPayments(
  query: FinancialPaymentQuery = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: financialAccountKeys.paymentList(query),
    queryFn: () => getFinancialPayments(query),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
  });
}