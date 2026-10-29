
import type { User } from "./user.types";

export enum SalaryPaymentStatus {
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export interface ISalaryPayment {
  _id?: string;
  amount: number;
  paymentMethod: string;
  financialAccountId?: string;
  paymentDate: string;
  paymentReference?: string;
  note?: string;
  recordedBy?:
  | Pick<User, "firstName" | "lastName" | "email" | "designation">
  | string;
  createdAt?: string;
  paymentFor?: "SALARY" | "EXTRA";
}

export interface ITeamSalary {
  _id: string;

  user:
  | Pick<
    User,
    | "_id"
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "role"
    | "designation"
    | "department"
    | "salary"
    | "paymentMethod"
    | "avatar"
  >
  | string;

  month: number;
  year: number;

  salaryAmount: number;

  extraName?: string;
  extraAmount?: number;

  // salaryAmount + extraAmount (old records-e na-o thakte pare)
  totalAmount?: number;

  paidAmount: number;
  dueAmount: number;

  status: SalaryPaymentStatus;

  payments: ISalaryPayment[];

  note?: string;

  cancelledAt?: string;
  cancelledBy?:
  | Pick<User, "firstName" | "lastName" | "email" | "designation">
  | string;
  cancellationReason?: string;

  createdBy?: string | User;
  updatedBy?: string | User;

  createdAt: string;
  updatedAt: string;
}

export interface TeamSalarySummary {
  totalBaseSalary: number;
  totalExtra: number;
  totalSalary: number; // base + extra
  totalPaid: number;
  totalDue: number;
  totalRecords: number;
  pendingCount: number;
  partialCount: number;
  paidCount: number;
  cancelledCount: number;
}

export interface GenerateMonthlySalaryPayload {
  month: number;
  year: number;
  note?: string;
}

export interface CreateTeamSalaryPayload {
  user: string;
  month: number;
  year: number;
  extraName?: string;
  extraAmount?: number;
  note?: string;
}

export interface UpdateTeamSalaryPayload {
  extraName?: string;
  extraAmount?: number;
  note?: string;
}

export interface CreateSalaryPaymentPayload {
  amount: number;
  paymentFor?: "SALARY" | "EXTRA";
  financialAccountId: string;
  paymentMethod: string;
  paymentDate: string;
  paymentReference?: string;
  note?: string;
}

export interface CancelTeamSalaryPayload {
  reason: string;
}

/** Helper: old record-e totalAmount na thakle fallback */
export const getSalaryTotal = (
  salary: Pick<ITeamSalary, "salaryAmount" | "extraAmount" | "totalAmount">,
) => salary.totalAmount ?? salary.salaryAmount + (salary.extraAmount ?? 0);

/** Paid amount component-wise (old payment = SALARY) */
export const getPaidBreakdown = (salary: Pick<ITeamSalary, "payments">) => {
  let salaryPaid = 0;
  let extraPaid = 0;

  for (const payment of salary.payments ?? []) {
    if (payment.paymentFor === "EXTRA") extraPaid += Number(payment.amount);
    else salaryPaid += Number(payment.amount);
  }

  return { salaryPaid, extraPaid };
};


export interface IMySalaryPayment {
    _id: string;
    amount: number;
    paymentFor?: "SALARY" | "EXTRA";
    paymentMethod: string;
    paymentDate: string;
    paymentReference?: string;
    note?: string;
}

export interface IMySalary {
    _id: string;
    month: number;
    year: number;
    salaryAmount: number;
    extraName?: string;
    extraAmount: number;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    status: string;
    payments: IMySalaryPayment[];
    note?: string;
    cancelledAt?: string;
    cancellationReason?: string;
    createdAt?: string;
}

export interface IMySalaryStats {
    total: number;
    totalSalary: number;
    totalPaid: number;
    totalDue: number;
    Pending: number;
    Partial: number;
    Paid: number;
    Cancelled: number;
    years: number[];
    paymentMethods: string[];
}

export interface IMySalaryMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface MySalaryFilters {
    page?: number;
    limit?: number;
    sort?: string;
    searchTerm?: string;
    month?: string;
    year?: string;
    status?: string;
    paymentMethod?: string;
}

export interface IMySalariesResponse {
    success: boolean;
    message: string;
    data: IMySalary[];
    meta?: IMySalaryMeta;
    stats?: IMySalaryStats;
}