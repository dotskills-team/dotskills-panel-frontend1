import type { IFinancialAccount } from "./financial-account.types";
import type { IExpenseCategory } from "./expense-category.types";

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

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: string;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}