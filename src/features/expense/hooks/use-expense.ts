"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createExpense,
  createExpenseWithAttachment,
  deleteExpense,
  getExpenseById,
  getExpenses,
  updateExpense,
  updateExpenseWithAttachment,
} from "../api/expense.api";

import type {
  CreateExpenseInput,
  ExpenseQueryInput,
  UpdateExpenseInput,
} from "../schemas/expense.schema";

export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (query: ExpenseQueryInput) => [...expenseKeys.lists(), query] as const,
  details: () => [...expenseKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};

export function useExpenses(
  query: ExpenseQueryInput = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: expenseKeys.list(query),
    queryFn: () => getExpenses(query),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
  });
}

export function useExpense(id?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: expenseKeys.detail(id ?? ""),
    queryFn: () => getExpenseById(id as string),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpenseInput) => createExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
}

export function useCreateExpenseWithAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createExpenseWithAttachment(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpenseInput }) =>
      updateExpense(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
    },
  });
}

export function useUpdateExpenseWithAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateExpenseWithAttachment(id, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteExpense(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
    },
  });
}