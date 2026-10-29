export enum AccountType {
  CASH = "CASH",
  BANK = "BANK",
  MOBILE_BANKING = "MOBILE_BANKING",
  OTHER = "OTHER",
}

export enum ProviderName {
  BKASH = "BKASH",
  NAGAD = "NAGAD",
  ROCKET = "ROCKET",
  OTHER = "OTHER",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IFinancialAccount {
  _id: string;

  accountName: string;
  accountType: AccountType;
  providerName?: ProviderName;
  accountNumber?: string;
  accountHolderName?: string;

  bankName?: string;
  branchName?: string;

  openingBalance: number;
  currentBalance: number;
  currency: string;

  description?: string;
  status: AccountStatus;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: string;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
  ownerId?: { _id: string; firstName?: string; lastName?: string; email?: string } | string | null;

}

// export interface FinancialAccountSummary {
//   totalAccounts: number;
//   totalOpeningBalance: number;
//   totalCurrentBalance: number;
//   totalSpent: number;

//   accounts: Array<
//     Pick<
//       IFinancialAccount,
//       | "_id"
//       | "accountName"
//       | "accountType"
//       | "openingBalance"
//       | "currentBalance"
//     >
//   >;
// }

export interface FinancialAccountSummary {
  totalAccounts: number;
  totalOpeningBalance: number;
  totalCurrentBalance: number;
  totalSpent: number;
    byOwner: Array<{
    ownerId: string | null;
    ownerName: string;
    accountCount: number;
    totalBalance: number;
  }>;

  accounts: Pick<
    IFinancialAccount,
    "_id" | "accountName" | "accountType" | "openingBalance" | "currentBalance"
  >[];
}

export type TransactionType =
  | "DEPOSIT"
  | "LOAN_RECEIVED"
  | "LOAN_REPAYMENT"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "SALARY"
  | "EXPENSE"
  | "PROJECT_PAYMENT";

export interface ITransaction {
  _id: string;
  accountId: { _id: string; accountName: string; accountType: string } | string;
  direction: "IN" | "OUT";
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  date: string;
  note?: string;
  isReversal: boolean;
  createdAt: string;
}

export interface ILoan {
  _id: string;
  lenderName: string;
  lenderPhone?: string;
  principalAmount: number;
  repaidAmount: number;
  dueAmount: number;
  receivedAccountId: { _id: string; accountName: string } | string;
  receivedDate: string;
  dueDate?: string | null;
  status: "ACTIVE" | "PAID";
  note?: string;
  createdAt: string;
}

export interface LoanSummary {
  totalBorrowed: number;
  totalRepaid: number;
  totalDue: number;
  activeCount: number;
}