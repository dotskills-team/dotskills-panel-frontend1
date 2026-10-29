
// import { z } from "zod";

// import {
//   SalaryPaymentStatus,
// } from "@/types/team-salary.types";

// export const createTeamSalarySchema = z.object({
//   user: z
//     .string()
//     .min(1, "Employee is required."),

//   month: z
//     .number()
//     .int()
//     .min(1)
//     .max(12),

//   year: z
//     .number()
//     .int()
//     .min(2000)
//     .max(3000),

//   note: z
//     .string()
//     .trim()
//     .max(500, "Note cannot exceed 500 characters.")
//     .optional(),
// });

// export const generateMonthlySalarySchema = z.object({
//   month: z
//     .number()
//     .int()
//     .min(1)
//     .max(12),

//   year: z
//     .number()
//     .int()
//     .min(2000)
//     .max(3000),

//   note: z
//     .string()
//     .trim()
//     .max(500, "Note cannot exceed 500 characters.")
//     .optional(),
// });

// export const createSalaryPaymentSchema = z.object({
//   amount: z
//     .number()
//     .positive("Payment amount must be greater than zero."),
//   financialAccountId: z
//     .string()
//     .min(1, "Please select an account."),
//   paymentMethod: z
//     .string()
//     .min(1, "Payment method is required."),

//   paymentDate: z
//     .string()
//     .min(1, "Payment date is required."),

//   paymentReference: z
//     .string()
//     .trim()
//     .max(100, "Reference cannot exceed 100 characters.")
//     .optional(),

//   note: z
//     .string()
//     .trim()
//     .max(500, "Note cannot exceed 500 characters.")
//     .optional(),
// });

// export const cancelTeamSalarySchema = z.object({
//   reason: z
//     .string()
//     .trim()
//     .min(3, "Cancellation reason is required.")
//     .max(500, "Reason cannot exceed 500 characters."),
// });

// export const teamSalaryQuerySchema = z.object({
//   page: z.coerce
//     .number()
//     .int()
//     .positive()
//     .optional(),

//   limit: z.coerce
//     .number()
//     .int()
//     .positive()
//     .optional(),

//   searchTerm: z
//     .string()
//     .optional(),

//   month: z.coerce
//     .number()
//     .int()
//     .min(1)
//     .max(12)
//     .optional(),

//   year: z.coerce
//     .number()
//     .int()
//     .min(2000)
//     .max(3000)
//     .optional(),

//   status: z
//     .enum([
//       SalaryPaymentStatus.PENDING,
//       SalaryPaymentStatus.PARTIAL,
//       SalaryPaymentStatus.PAID,
//       SalaryPaymentStatus.CANCELLED,
//     ])
//     .optional(),

//   paymentMethod: z
//     .string()
//     .optional(),

//   user: z
//     .string()
//     .optional(),

//   sort: z
//     .string()
//     .optional(),
// });

// export type CreateTeamSalaryInput = z.infer<
//   typeof createTeamSalarySchema
// >;

// export type GenerateMonthlySalaryInput = z.infer<
//   typeof generateMonthlySalarySchema
// >;

// export type CreateSalaryPaymentInput = z.infer<
//   typeof createSalaryPaymentSchema
// >;

// export type CancelTeamSalaryInput = z.infer<
//   typeof cancelTeamSalarySchema
// >;

// export type TeamSalaryQueryInput = z.infer<
//   typeof teamSalaryQuerySchema
// >;


import { z } from "zod";

import { SalaryPaymentStatus } from "@/types/team-salary.types";

const extraNameSchema = z
  .string()
  .trim()
  .max(100, "Extra name cannot exceed 100 characters.")
  .optional();

const extraAmountSchema = z
  .number()
  .finite()
  .min(0, "Extra amount cannot be negative.")
  .optional();

const requireExtraName = (
  data: { extraName?: string; extraAmount?: number },
  ctx: z.RefinementCtx,
) => {
  if ((data.extraAmount ?? 0) > 0 && !data.extraName) {
    ctx.addIssue({
      code: "custom",
      path: ["extraName"],
      message: "Extra name is required when extra amount is provided.",
    });
  }
};

export const createTeamSalarySchema = z
  .object({
    user: z.string().min(1, "Employee is required."),

    month: z.number().int().min(1).max(12),

    year: z.number().int().min(2000).max(3000),

    extraName: extraNameSchema,
    extraAmount: extraAmountSchema,

    note: z
      .string()
      .trim()
      .max(500, "Note cannot exceed 500 characters.")
      .optional(),
  })
  .superRefine(requireExtraName);

export const updateTeamSalarySchema = z
  .object({
    extraName: extraNameSchema,
    extraAmount: extraAmountSchema,

    note: z
      .string()
      .trim()
      .max(500, "Note cannot exceed 500 characters.")
      .optional(),
  })
  .superRefine(requireExtraName);

export const generateMonthlySalarySchema = z.object({
  month: z.number().int().min(1).max(12),

  year: z.number().int().min(2000).max(3000),

  note: z
    .string()
    .trim()
    .max(500, "Note cannot exceed 500 characters.")
    .optional(),
});

export const createSalaryPaymentSchema = z.object({
  amount: z.number().positive("Payment amount must be greater than zero."),
  paymentFor: z.enum(["SALARY", "EXTRA"]),
  financialAccountId: z.string().min(1, "Please select an account."),
  paymentMethod: z.string().min(1, "Payment method is required."),

  paymentDate: z.string().min(1, "Payment date is required."),

  paymentReference: z
    .string()
    .trim()
    .max(100, "Reference cannot exceed 100 characters.")
    .optional(),

  note: z
    .string()
    .trim()
    .max(500, "Note cannot exceed 500 characters.")
    .optional(),
});

export const cancelTeamSalarySchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Cancellation reason is required.")
    .max(500, "Reason cannot exceed 500 characters."),
});

export const teamSalaryQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),

  limit: z.coerce.number().int().positive().optional(),

  searchTerm: z.string().optional(),

  month: z.coerce.number().int().min(1).max(12).optional(),

  year: z.coerce.number().int().min(2000).max(3000).optional(),

  status: z
    .enum([
      SalaryPaymentStatus.PENDING,
      SalaryPaymentStatus.PARTIAL,
      SalaryPaymentStatus.PAID,
      SalaryPaymentStatus.CANCELLED,
    ])
    .optional(),

  paymentMethod: z.string().optional(),

  user: z.string().optional(),

  sort: z.string().optional(),
});

export type CreateTeamSalaryInput = z.infer<typeof createTeamSalarySchema>;

export type UpdateTeamSalaryInput = z.infer<typeof updateTeamSalarySchema>;

export type GenerateMonthlySalaryInput = z.infer<
  typeof generateMonthlySalarySchema
>;

export type CreateSalaryPaymentInput = z.infer<
  typeof createSalaryPaymentSchema
>;

export type CancelTeamSalaryInput = z.infer<typeof cancelTeamSalarySchema>;

export type TeamSalaryQueryInput = z.infer<typeof teamSalaryQuerySchema>;