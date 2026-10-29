"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createExpenseCategory,
  deleteExpenseCategory,
  getExpenseCategories,
  getExpenseCategoryById,
  updateExpenseCategory,
} from "../api/expense-category.api";
import { CreateExpenseCategoryInput, ExpenseCategoryQueryInput, UpdateExpenseCategoryInput } from "../schemas/expense-category.schema";
// import {  } from "@/features/financial-account/hooks/use-financial-account";



export const expenseCategoryKeys = {
  all: ["expense-categories"] as const,
  lists: () => [...expenseCategoryKeys.all, "list"] as const,
  list: (query: ExpenseCategoryQueryInput) =>
    [...expenseCategoryKeys.lists(), query] as const,
  details: () => [...expenseCategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseCategoryKeys.details(), id] as const,
};

export function useExpenseCategories(
  query: ExpenseCategoryQueryInput = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: expenseCategoryKeys.list(query),
    queryFn: () => getExpenseCategories(query),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
  });
}

export function useExpenseCategory(id?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: expenseCategoryKeys.detail(id ?? ""),
    queryFn: () => getExpenseCategoryById(id as string),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}

export function useCreateExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpenseCategoryInput) => createExpenseCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseCategoryKeys.all });
    },
  });
}

export function useUpdateExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateExpenseCategoryInput;
    }) => updateExpenseCategory(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseCategoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: expenseCategoryKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteExpenseCategory(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseCategoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: expenseCategoryKeys.detail(variables.id),
      });
    },
  });
}