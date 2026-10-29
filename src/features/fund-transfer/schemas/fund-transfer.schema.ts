import { z } from "zod";

export const createFundTransferSchema = z
  .object({
    fromAccountId: z.string().min(1, "From account is required."),
    toAccountId: z.string().min(1, "To account is required."),
    amount: z.coerce.number().positive("Amount must be greater than zero."),
    transferDate: z.string().min(1, "Transfer date is required."),
    reference: z.string().trim().max(100).optional(),
    note: z.string().trim().max(500).optional(),
  })
  .refine((v) => v.fromAccountId !== v.toAccountId, {
    message: "From and To account cannot be the same.",
    path: ["toAccountId"],
  });

export const fundTransferQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  searchTerm: z.string().optional(),
  fromAccountId: z.string().optional(),
  toAccountId: z.string().optional(),
  sort: z.string().optional(),
});

export type CreateFundTransferInput = z.infer<typeof createFundTransferSchema>;
export type FundTransferQueryInput = z.infer<typeof fundTransferQuerySchema>;