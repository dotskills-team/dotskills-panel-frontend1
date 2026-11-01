import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero."),
  categoryId: z.string().min(1, "Category is required."),
  financialAccountId: z.string().min(1, "Financial account is required."),
  expenseDate: z.string().min(1, "Expense date is required."),
  description: z.string().trim().max(500).optional(),
  reference: z.string().trim().max(100).optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const expenseQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  searchTerm: z.string().optional(),
  categoryId: z.string().optional(),
  financialAccountId: z.string().optional(),
  sort: z.string().optional(),
  /** "true" = only the caller's own expenses (used by the My Expenses page). */
  mine: z.string().optional(),
  /** Date filter, YYYY-MM-DD. */
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseQueryInput = z.infer<typeof expenseQuerySchema>;