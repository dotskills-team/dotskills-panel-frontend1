import api from "@/lib/axios";
import type { ILoan, ITransaction, LoanSummary } from "@/types/financial-account.types";

interface ListResponse<T> {
  success?: boolean;
  message?: string;
  data: T[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}

interface OneResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

const toQuery = (query: Record<string, unknown> = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
};

export interface DepositPayload {
  accountId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface CreateLoanPayload {
  lenderName: string;
  lenderPhone?: string;
  amount: number;
  accountId: string;
  receivedDate: string;
  dueDate?: string | null;
  note?: string;
}

export interface RepayLoanPayload {
  accountId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface TransferPayload {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  transferDate: string;
  note?: string;
}

export interface UpdateLoanPayload {
  lenderName?: string;
  lenderPhone?: string;
  amount?: number;
  accountId?: string;
  receivedDate?: string;
  dueDate?: string | null;
  note?: string;
}

export const depositMoney = async (payload: DepositPayload) =>
  (await api.post("/transactions/deposit", payload)).data;

export const getTransactions = async (query: Record<string, unknown> = {}) =>
  (await api.get<ListResponse<ITransaction>>(`/transactions${toQuery(query)}`)).data;

export const createLoan = async (payload: CreateLoanPayload) =>
  (await api.post("/loans", payload)).data;

export const repayLoan = async (id: string, payload: RepayLoanPayload) =>
  (await api.post(`/loans/${id}/repay`, payload)).data;

export const getLoans = async (query: Record<string, unknown> = {}) =>
  (await api.get<ListResponse<ILoan>>(`/loans${toQuery(query)}`)).data;

export const getLoanSummary = async () =>
  (await api.get<OneResponse<LoanSummary>>("/loans/summary")).data;

export const createTransfer = async (payload: TransferPayload) =>
  (await api.post("/fund-transfers", payload)).data;

export const updateLoan = async (id: string, payload: UpdateLoanPayload) =>
  (await api.patch(`/loans/${id}`, payload)).data;

export const deleteLoan = async (id: string) =>
  (await api.delete(`/loans/${id}`)).data;