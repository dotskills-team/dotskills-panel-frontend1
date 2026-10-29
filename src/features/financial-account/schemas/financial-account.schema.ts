import { z } from "zod";
import { AccountType, ProviderName, AccountStatus } from "@/types/financial-account.types";

export const createFinancialAccountSchema = z.object({
  accountName: z.string().min(2, "Account name is required.").max(100),
  accountType: z.enum([
    AccountType.CASH,
    AccountType.BANK,
    AccountType.MOBILE_BANKING,
    AccountType.OTHER,
  ]),
  // providerName: z
  //   .enum([
  //     ProviderName.BKASH,
  //     ProviderName.NAGAD,
  //     ProviderName.ROCKET,
  //     ProviderName.OTHER,
  //   ])
  //   .optional(),
  providerName: z
  .enum([
    ProviderName.BKASH,
    ProviderName.NAGAD,
    ProviderName.ROCKET,
    ProviderName.OTHER,
  ])
  .nullable()
  .optional(),
  accountNumber: z.string().optional(),
  accountHolderName: z.string().optional(),
  bankName: z.string().optional(),
  branchName: z.string().optional(),
  ownerId: z.string().nullable().optional(),
  openingBalance: z.coerce.number().min(0).default(0),
  currency: z.string().default("BDT"),
  description: z.string().trim().max(500).optional(),
  status: z
    .enum([AccountStatus.ACTIVE, AccountStatus.INACTIVE])
    .optional(),
});

export const updateFinancialAccountSchema = createFinancialAccountSchema.partial();

export const financialAccountQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  searchTerm: z.string().optional(),
  accountType: z
    .enum([
      AccountType.CASH,
      AccountType.BANK,
      AccountType.MOBILE_BANKING,
      AccountType.OTHER,
    ])
    .optional(),
  status: z.enum([AccountStatus.ACTIVE, AccountStatus.INACTIVE]).optional(),
  sort: z.string().optional(),
});

export type CreateFinancialAccountInput = z.infer<typeof createFinancialAccountSchema>;
export type UpdateFinancialAccountInput = z.infer<typeof updateFinancialAccountSchema>;
export type FinancialAccountQueryInput = z.infer<typeof financialAccountQuerySchema>;