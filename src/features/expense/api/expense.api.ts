import api from "@/lib/axios";
import type { IExpense } from "@/types/expense.types";
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseQueryInput,
} from "../schemas/expense.schema";

interface ExpenseListResponse {
  success?: boolean;
  message?: string;
  data: IExpense[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}

interface ExpenseResponse {
  success?: boolean;
  message?: string;
  data: IExpense;
}

const BASE_URL = "/expenses";

function buildQueryString(query: ExpenseQueryInput = {}) {
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

// JSON create (no attachment)
export async function getExpenses(
  query: ExpenseQueryInput = {},
): Promise<ExpenseListResponse> {
  return request<ExpenseListResponse>(`${BASE_URL}${buildQueryString(query)}`);
}

export async function getExpenseById(id: string): Promise<ExpenseResponse> {
  return request<ExpenseResponse>(`${BASE_URL}/${id}`);
}

export async function createExpense(
  payload: CreateExpenseInput,
): Promise<ExpenseResponse> {
  return request<ExpenseResponse>(BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateExpense(
  id: string,
  payload: UpdateExpenseInput,
): Promise<ExpenseResponse> {
  return request<ExpenseResponse>(`${BASE_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteExpense(id: string): Promise<{
  success?: boolean;
  message?: string;
  data: null;
}> {
  return request(`${BASE_URL}/${id}`, { method: "DELETE" });
}

// Multipart create/update (with attachment) — bypasses the JSON `request` helper
export async function createExpenseWithAttachment(
  formData: FormData,
): Promise<ExpenseResponse> {
  const response = await api.post<ExpenseResponse>(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateExpenseWithAttachment(
  id: string,
  formData: FormData,
): Promise<ExpenseResponse> {
  const response = await api.patch<ExpenseResponse>(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}