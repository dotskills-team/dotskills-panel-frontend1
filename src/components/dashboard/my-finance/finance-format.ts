import type { IExpense } from "@/types/expense.types";

export const formatMoney = (value?: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(value ?? 0);

/** Name of the user who recorded an expense (the API populates `createdBy`). */
export const creatorName = (expense: IExpense) => {
  const creator = expense.createdBy;
  if (!creator) return "—";
  if (typeof creator === "string") return "Unknown user";
  const name = `${creator.firstName ?? ""} ${creator.lastName ?? ""}`.trim();
  return name || creator.email || "Unknown user";
};

/** Account name from an expense, which the API populates as an object. */
export const accountNameOf = (expense: IExpense) => {
  const account = expense.financialAccountId;
  if (!account) return "—";
  if (typeof account === "string") return "—";
  return account.accountName ?? "—";
};

export const categoryNameOf = (expense: IExpense) => {
  const category = expense.categoryId;
  if (!category) return "—";
  if (typeof category === "string") return "—";
  return category.name ?? "—";
};
