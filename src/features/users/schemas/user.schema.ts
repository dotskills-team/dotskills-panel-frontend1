import { z } from "zod";
import { Gender, PaymentMethod, Role, UserStatus } from "@/types/user.types";

const genderSchema = z.enum([
  Gender.MALE,
  Gender.FEMALE,
  Gender.OTHER,
  Gender.PREFER_NOT_TO_SAY,
]);

const roleSchema = z.enum([
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.MANAGER,
  Role.DEVELOPER,
  Role.DESIGNER,
  Role.MARKETER,
  Role.STAFF,
]);

const paymentMethodSchema = z.enum([
  PaymentMethod.CASH,
  PaymentMethod.BKASH,
  PaymentMethod.NAGAD,
  PaymentMethod.BANK,
]);

const paymentAccountSchema = z.object({
  accountHolderName: z
    .string()
    .trim()
    .max(100, "Account holder name cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),

  accountNumber: z
    .string()
    .trim()
    .max(50, "Account number cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
});

const bankAccountSchema = z.object({
  accountHolderName: z
    .string()
    .trim()
    .max(100, "Account holder name cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),

  accountNumber: z
    .string()
    .trim()
    .max(50, "Account number cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),

  bankName: z
    .string()
    .trim()
    .max(100, "Bank name cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),

  branchName: z
    .string()
    .trim()
    .max(100, "Branch name cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),

  routingNumber: z
    .string()
    .trim()
    .max(50, "Routing number cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
});

const personalCompensationFields = {
  gender: genderSchema.optional(),

  salary: z.coerce.number().min(0).optional(),
  dateOfBirth: z.string().optional(),

  paymentMethod: paymentMethodSchema.optional(),

  paymentAccount: paymentAccountSchema.partial().optional(),

  bankAccount: bankAccountSchema.partial().optional(),
};

function validatePaymentInformation<
  T extends {
    paymentMethod?: PaymentMethod;
    paymentAccount?: {
      accountHolderName?: string;
      accountNumber?: string;
    };
    bankAccount?: {
      accountHolderName?: string;
      accountNumber?: string;
      bankName?: string;
      branchName?: string;
      routingNumber?: string;
    };
  },
>(data: T, ctx: z.RefinementCtx) {
  const method = data.paymentMethod;

  if (!method || method === PaymentMethod.CASH) {
    return;
  }

  if (method === PaymentMethod.BKASH || method === PaymentMethod.NAGAD) {
    if (!data.paymentAccount?.accountHolderName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paymentAccount", "accountHolderName"],
        message: "Account holder name is required.",
      });
    }

    if (!data.paymentAccount?.accountNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paymentAccount", "accountNumber"],
        message: "Account number is required.",
      });
    }

    return;
  }

  if (method === PaymentMethod.BANK) {
    if (!data.bankAccount?.accountHolderName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bankAccount", "accountHolderName"],
        message: "Account holder name is required.",
      });
    }

    if (!data.bankAccount?.accountNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bankAccount", "accountNumber"],
        message: "Account number is required.",
      });
    }

    if (!data.bankAccount?.bankName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bankAccount", "bankName"],
        message: "Bank name is required.",
      });
    }
  }
}

export const createUserSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),

    email: z.string().trim().toLowerCase().email("Invalid email address"),

    phone: z.string().optional(),

    password: z.string().min(8, "Password must be at least 8 characters"),

    role: roleSchema,

    designation: z.string().trim().optional(),

    department: z.string().trim().optional(),

    address: z.string().trim().optional(),

    avatar: z.string().optional(),

    bio: z.string().optional(),

    ...personalCompensationFields,
  })
  .superRefine(validatePaymentInformation);

export const updateUserSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .optional(),

    phone: z.string().optional(),

    role: roleSchema.optional(),

    designation: z.string().trim().optional(),

    department: z.string().trim().optional(),

    address: z.string().trim().optional(),

    // avatar: z.string().optional(),
    avatar: z.string().nullish(),

    bio: z.string().optional(),

    ...personalCompensationFields,
  })
  .superRefine(validatePaymentInformation);

export const updateUserStatusSchema = z.object({
  status: z.enum([
    UserStatus.ACTIVE,
    UserStatus.INACTIVE,
    UserStatus.SUSPENDED,
  ]),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;