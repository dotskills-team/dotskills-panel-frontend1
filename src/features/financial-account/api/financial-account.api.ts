// import api from "@/lib/axios";
// import type { FinancialAccountSummary, IFinancialAccount } from "@/types/financial-account.types";
// import type {
//   CreateFinancialAccountInput,
//   UpdateFinancialAccountInput,
//   FinancialAccountQueryInput,
// } from "../schemas/financial-account.schema";

// interface FinancialAccountListResponse {
//   success?: boolean;
//   message?: string;
//   data: IFinancialAccount[];
//   meta: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPage: number;
//   };
// }

// interface FinancialAccountResponse {
//   success?: boolean;
//   message?: string;
//   data: IFinancialAccount;
// }

// const BASE_URL = "/financial-accounts";

// function buildQueryString(query: FinancialAccountQueryInput = {}) {
//   const params = new URLSearchParams();

//   Object.entries(query).forEach(([key, value]) => {
//     if (value !== undefined && value !== null && value !== "") {
//       params.set(key, String(value));
//     }
//   });

//   const queryString = params.toString();
//   return queryString ? `?${queryString}` : "";
// }

// async function request<T>(
//   url: string,
//   options?: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: string },
// ): Promise<T> {
//   const response = await api.request<T>({
//     url,
//     method: options?.method ?? "GET",
//     data: options?.body ? JSON.parse(options.body) : undefined,
//   });

//   return response.data;
// }

// export async function getFinancialAccounts(
//   query: FinancialAccountQueryInput = {},
// ): Promise<FinancialAccountListResponse> {
//   return request<FinancialAccountListResponse>(`${BASE_URL}${buildQueryString(query)}`);
// }

// export async function getFinancialAccountById(
//   id: string,
// ): Promise<FinancialAccountResponse> {
//   return request<FinancialAccountResponse>(`${BASE_URL}/${id}`);
// }

// export async function createFinancialAccount(
//   payload: CreateFinancialAccountInput,
// ): Promise<FinancialAccountResponse> {
//   return request<FinancialAccountResponse>(BASE_URL, {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// }

// interface FinancialAccountSummaryResponse {
//   success?: boolean;
//   message?: string;
//   data: FinancialAccountSummary;
// }

// export async function getFinancialAccountSummary(): Promise<FinancialAccountSummaryResponse> {
//   return request<FinancialAccountSummaryResponse>(`${BASE_URL}/summary`);
// }





// export async function updateFinancialAccount(
//   id: string,
//   payload: UpdateFinancialAccountInput,
// ): Promise<FinancialAccountResponse> {
//   return request<FinancialAccountResponse>(`${BASE_URL}/${id}`, {
//     method: "PATCH",
//     body: JSON.stringify(payload),
//   });
// }

// export async function deleteFinancialAccount(id: string): Promise<{
//   success?: boolean;
//   message?: string;
//   data: null;
// }> {
//   return request(`${BASE_URL}/${id}`, { method: "DELETE" });
// }



import api from "@/lib/axios";
import type { FinancialAccountSummary, IFinancialAccount } from "@/types/financial-account.types";
import type {
  CreateFinancialAccountInput,
  UpdateFinancialAccountInput,
  FinancialAccountQueryInput,
} from "../schemas/financial-account.schema";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface FinancialAccountListResponse {
  success?: boolean;
  message?: string;
  data: IFinancialAccount[];
  meta: PaginationMeta;
}

interface FinancialAccountResponse {
  success?: boolean;
  message?: string;
  data: IFinancialAccount;
}

interface FinancialAccountSummaryResponse {
  success?: boolean;
  message?: string;
  data: FinancialAccountSummary;
}

// ---------- Payments ----------

export type FinancialPaymentStatus =
  | "DUE"
  | "PARTIAL"
  | "ADVANCED"
  | "COMPLETE"
  | "ALL";

export interface FinancialPaymentQuery {
  financialAccountId?: string;
  projectId?: string;
  status?: FinancialPaymentStatus;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  excludeDeletedProjects?: boolean;
  page?: number;
  limit?: number;
}

export interface IFinancialPayment {
  paymentId: string;
  amount: number;
  date: string;
  status: Exclude<FinancialPaymentStatus, "ALL">;
  note?: string;
  project: {
    _id: string;
    name: string;
    isDeleted?: boolean;
  };
  client: {
    _id?: string;
    name?: string;
  };
  account: {
    _id: string;
    accountName: string;
    accountType: string;
    currentBalance: number;
  };
}

export interface IPaymentByAccount {
  _id: string;
  accountName: string;
  accountType: string;
  currentBalance: number;
  totalReceived: number;
  paymentCount: number;
}

export interface FinancialPaymentsData {
  payments: IFinancialPayment[];
  summary: {
    totalAmount: number;
    totalPayments: number;
  };
  byAccount: IPaymentByAccount[];
}

export interface FinancialPaymentsResponse {
  success?: boolean;
  message?: string;
  data: FinancialPaymentsData;
  meta: PaginationMeta;
}

// ---------- Helpers ----------

const BASE_URL = "/financial-accounts";

function buildQueryString(
  query: FinancialAccountQueryInput | FinancialPaymentQuery = {},
) {
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

// ---------- Accounts ----------

export async function getFinancialAccounts(
  query: FinancialAccountQueryInput = {},
): Promise<FinancialAccountListResponse> {
  return request<FinancialAccountListResponse>(`${BASE_URL}${buildQueryString(query)}`);
}

export async function getFinancialAccountById(
  id: string,
): Promise<FinancialAccountResponse> {
  return request<FinancialAccountResponse>(`${BASE_URL}/${id}`);
}

export async function createFinancialAccount(
  payload: CreateFinancialAccountInput,
): Promise<FinancialAccountResponse> {
  return request<FinancialAccountResponse>(BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getFinancialAccountSummary(): Promise<FinancialAccountSummaryResponse> {
  return request<FinancialAccountSummaryResponse>(`${BASE_URL}/summary`);
}

export async function updateFinancialAccount(
  id: string,
  payload: UpdateFinancialAccountInput,
): Promise<FinancialAccountResponse> {
  return request<FinancialAccountResponse>(`${BASE_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteFinancialAccount(id: string): Promise<{
  success?: boolean;
  message?: string;
  data: null;
}> {
  return request(`${BASE_URL}/${id}`, { method: "DELETE" });
}

// ---------- Payments ----------

export async function getFinancialPayments(
  query: FinancialPaymentQuery = {},
): Promise<FinancialPaymentsResponse> {
  return request<FinancialPaymentsResponse>(
    `${BASE_URL}/payments${buildQueryString(query)}`,
  );
}