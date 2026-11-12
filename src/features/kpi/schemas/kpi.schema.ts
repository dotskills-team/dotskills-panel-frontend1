import { z } from "zod";

const money = (label: string) =>
  z.coerce
    .number({ error: `${label} must be a number.` })
    .min(0, `${label} cannot be negative.`);

const count = (label: string) =>
  z.coerce
    .number({ error: `${label} must be a number.` })
    .int(`${label} must be a whole number.`)
    .min(0, `${label} cannot be negative.`);

export const extraItemFormSchema = z.object({
  // Present for items that already exist; new items get a key when the form is submitted
  key: z.string().optional(),
  name: z.string().trim().min(1, "Name is required.").max(100),
  unit: z.enum(["amount", "count"]),
  target: money("Target"),
});

export const budgetItemFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  amount: money("Amount"),
});

const targetsShape = {
  targetSales: money("Target sales"),
  targetProjects: count("Target projects"),
  // The budget is the sum of these items; it is never typed in directly
  budgetItems: z.array(budgetItemFormSchema).max(30, "At most 30 budget items."),
  extraItems: z.array(extraItemFormSchema).max(20, "At most 20 extra items."),
  note: z.string().trim().max(2000).optional(),
};

/** Individual KPI: needs a user when it is created. */
export const individualKpiFormSchema = z.object({
  user: z.string().optional(),
  activateNow: z.boolean().optional(),
  ...targetsShape,
});

export const teamKpiFormSchema = z.object({
  activateNow: z.boolean().optional(),
  ...targetsShape,
});


export type ExtraItemFormValues = z.infer<typeof extraItemFormSchema>;
export type IndividualKpiFormValues = z.infer<typeof individualKpiFormSchema>;
export type TeamKpiFormValues = z.infer<typeof teamKpiFormSchema>;

/** Monthly report content. Achieved sales and projects are never sent: the server computes them. */
export const kpiReportFormSchema = z.object({
  actualBudgetSpent: money("Budget spent"),
  extraItemResults: z.array(
    z.object({
      key: z.string(),
      achieved: money("Achieved value"),
    }),
  ),
  summary: z.string().trim().max(5000, "Summary is too long."),
  challenges: z.string().trim().max(5000, "Challenges is too long."),
});

export type KpiReportFormInput = z.input<typeof kpiReportFormSchema>;
export type KpiReportFormValues = z.output<typeof kpiReportFormSchema>;

/** Reviewer comments. A comment is optional when marking reviewed and required when returning. */
export const reviewCommentSchema = z.object({
  comment: z.string().trim().max(1000, "Comment is too long."),
});

export const returnCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "A comment is required when returning a report.")
    .max(1000, "Comment is too long."),
});

export type ReviewCommentValues = z.infer<typeof reviewCommentSchema>;
