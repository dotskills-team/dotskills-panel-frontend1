import { AccountType, ProviderName, AccountStatus } from "@/types/financial-account.types";

export const ACCOUNT_TYPE_OPTIONS = [
  { value: AccountType.CASH, label: "Cash" },
  { value: AccountType.BANK, label: "Bank" },
  { value: AccountType.MOBILE_BANKING, label: "Mobile Banking" },
  { value: AccountType.OTHER, label: "Other" },
];

export const PROVIDER_OPTIONS = [
  { value: ProviderName.BKASH, label: "bKash" },
  { value: ProviderName.NAGAD, label: "Nagad" },
  { value: ProviderName.ROCKET, label: "Rocket" },
  { value: ProviderName.OTHER, label: "Other" },
];

export const ACCOUNT_STATUS_OPTIONS = [
  { value: AccountStatus.ACTIVE, label: "Active" },
  { value: AccountStatus.INACTIVE, label: "Inactive" },
];

export const FINANCIAL_ACCOUNT_SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "accountName", label: "Name (A-Z)" },
  { value: "-openingBalance", label: "Balance (High-Low)" },
];