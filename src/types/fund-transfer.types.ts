import type { IFinancialAccount } from "./financial-account.types";

type AccountRef = Pick<IFinancialAccount, "_id" | "accountName" | "accountType" | "currentBalance">;

export interface IFundTransfer {
    _id: string;
    fromAccountId: AccountRef | string;
    toAccountId: AccountRef | string;
    amount: number;
    transferDate: string;
    reference?: string;
    note?: string;
    createdBy?: { _id: string; firstName?: string; lastName?: string } | string; // ⬅️ যোগ করুন

    createdAt: string;
}