// import { CreateExpenseCategoryInput, ExpenseCategoryQueryInput, UpdateExpenseCategoryInput } from "@/features/financial-account/hooks/use-financial-account";
import api from "@/lib/axios";
import type { IExpenseCategory } from "@/types/expense-category.types";
import { CreateExpenseCategoryInput, ExpenseCategoryQueryInput, UpdateExpenseCategoryInput } from "../schemas/expense-category.schema";


interface ExpenseCategoryListResponse {
  success?: boolean;
  message?: string;
  data: IExpenseCategory[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}

interface ExpenseCategoryResponse {
  success?: boolean;
  message?: string;
  data: IExpenseCategory;
}

const BASE_URL = "/expense-categories";

function buildQueryString(query: ExpenseCategoryQueryInput = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

async function request<T>(
  url: string,
  options?: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: string },
): Promise<T> {
  const response = await api.request<T>({
    url,
    method: options?.method ?? "GET",
    data: options?.body ? JSON.parse(options.body) : undefined,
  });

  return response.data;
}

export async function getExpenseCategories(
  query: ExpenseCategoryQueryInput = {},
): Promise<ExpenseCategoryListResponse> {
  return request<ExpenseCategoryListResponse>(`${BASE_URL}${buildQueryString(query)}`);
}

export async function getExpenseCategoryById(
  id: string,
): Promise<ExpenseCategoryResponse> {
  return request<ExpenseCategoryResponse>(`${BASE_URL}/${id}`);
}

export async function createExpenseCategory(
  payload: CreateExpenseCategoryInput,
): Promise<ExpenseCategoryResponse> {
  return request<ExpenseCategoryResponse>(BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateExpenseCategory(
  id: string,
  payload: UpdateExpenseCategoryInput,
): Promise<ExpenseCategoryResponse> {
  return request<ExpenseCategoryResponse>(`${BASE_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteExpenseCategory(id: string): Promise<{
  success?: boolean;
  message?: string;
  data: null;
}> {
  return request(`${BASE_URL}/${id}`, { method: "DELETE" });
}