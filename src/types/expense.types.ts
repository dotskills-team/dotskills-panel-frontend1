import type { IFinancialAccount } from "./financial-account.types";
import type { IExpenseCategory } from "./expense-category.types";

export interface IExpenseSummary {
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
  largestAmount: number;
  latestExpenseDate: string | null;
  accountsUsed: number;
  thisMonthAmount: number;
  thisMonthCount: number;
  topCategories: Array<{ _id: string; name: string; amount: number; count: number }>;
}

export interface IExpense {
  _id: string;

  amount: number;
  categoryId: Pick<IExpenseCategory, "_id" | "name"> | string;
  financialAccountId:
    | Pick<IFinancialAccount, "_id" | "accountName" | "accountType">
    | string;
  expenseDate: string;

  description?: string;
  reference?: string;
  attachment?: string;

  /** Populated by the API as the creator's user document (or a bare id). */
  createdBy?:
    | string
    | { _id: string; firstName?: string; lastName?: string; email?: string; role?: string }
    | null;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: string;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}