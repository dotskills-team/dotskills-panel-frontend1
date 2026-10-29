import { z } from "zod";
import { CategoryStatus } from "@/types/expense-category.types";

export const createExpenseCategorySchema = z.object({
  name: z.string().min(2, "Category name is required.").max(100),
  description: z.string().trim().max(500).optional(),
  status: z.enum([CategoryStatus.ACTIVE, CategoryStatus.INACTIVE]).optional(),
});

export const updateExpenseCategorySchema = createExpenseCategorySchema.partial();

export const expenseCategoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  searchTerm: z.string().optional(),
  status: z.enum([CategoryStatus.ACTIVE, CategoryStatus.INACTIVE]).optional(),
  sort: z.string().optional(),
});

export type CreateExpenseCategoryInput = z.infer<typeof createExpenseCategorySchema>;
export type UpdateExpenseCategoryInput = z.infer<typeof updateExpenseCategorySchema>;
export type ExpenseCategoryQueryInput = z.infer<typeof expenseCategoryQuerySchema>;