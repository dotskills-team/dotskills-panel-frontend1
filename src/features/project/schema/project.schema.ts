
// import { z } from "zod";
// import { PaymentStatus, ProjectStatus, ProjectType } from "@/types/project.types";

// const csvToArray = (val: string) =>
//   val
//     .split(",")
//     .map((item) => item.trim())
//     .filter(Boolean);

// const documentSchema = z.object({
//   requirement: z.string().min(1, "Requirement is required"),
//   link: z.string().min(1, "Link is required").url("Invalid link URL"),
// });

// const paymentSchema = z.object({
//   amount: z.coerce.number({ error: "Amount is required" }).min(0, "Amount cannot be negative"),
//   date: z.string().min(1, "Payment date is required"),
//   status: z.nativeEnum(PaymentStatus),
//   note: z.string().optional(),
// });

// export const createProjectFormSchema = z.object({
//   name: z.string().min(1, "Project name is required"),
//   description: z.string().optional(),
//   type: z.nativeEnum(ProjectType),
//   client: z.string().min(1, "Client is required"),
//   projectManager: z.string().min(1, "Project leader is required"),
//   developers: z.array(z.string()).optional().default([]),
//   budget: z.coerce.number().optional(),
//   startDate: z.string().min(1, "Start date is required"),
//   endDate: z.string().optional(),
//   technologies: z
//     .string()
//     .min(1, "Add at least one technology")
//     .transform(csvToArray),
//   documents: z.array(documentSchema).optional().default([]),
//   status: z.nativeEnum(ProjectStatus).optional(),
//   paymentStatus: z.nativeEnum(PaymentStatus).optional(),
//   payments: z.array(paymentSchema).optional().default([]),
//   nextPaymentDate: z.string().optional(),
//   priority: z.coerce.number().int().min(1, "Priority must be at least 1").optional(),
//   liveUrl: z.string().optional(),
//   developmentLiveUrl: z.string().optional(),
//   repositoryUrl: z.string().optional(),
// });

// // What the form fields hold (technologies is still a comma string here)
// export type CreateProjectFormValues = z.input<typeof createProjectFormSchema>;

// // What handleSubmit gives you after validation (technologies is string[])
// export type CreateProjectFormOutput = z.output<typeof createProjectFormSchema>;


import { z } from "zod";
import { PaymentStatus, ProjectStatus, ProjectType } from "@/types/project.types";

const csvToArray = (val: string) =>
  val
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const documentSchema = z.object({
  requirement: z.string().min(1, "Requirement is required"),
  link: z.string().min(1, "Link is required").url("Invalid link URL"),
});

const paymentSchema = z.object({
  amount: z.coerce.number({ error: "Amount is required" }).min(0, "Amount cannot be negative"),
  date: z.string().min(1, "Payment date is required"),
  status: z.nativeEnum(PaymentStatus),
  note: z.string().optional(),
  financialAccountId: z.string().optional(),
});

const paymentInstallmentSchema = z.object({
  installmentNo: z.string().min(1, "Installment name is required"),
  projectionDate: z.string().min(1, "Projection date is required"),
  paymentPercentage: z.coerce
    .number({ error: "Percentage is required" })
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100"),
  amount: z.coerce.number({ error: "Amount is required" }).min(0, "Amount cannot be negative"),
   isCompleted: z.boolean().optional().default(false),
  
});

export const createProjectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  type: z.nativeEnum(ProjectType),
  client: z.string().min(1, "Client is required"),
  projectManager: z.string().min(1, "Project leader is required"),
  developers: z.array(z.string()).optional().default([]),
  budget: z.coerce.number().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  technologies: z
    .string()
    .min(1, "Add at least one technology")
    .transform(csvToArray),
  documents: z.array(documentSchema).optional().default([]),
  status: z.nativeEnum(ProjectStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  payments: z.array(paymentSchema).optional().default([]),
  paymentSchedule: z.array(paymentInstallmentSchema).optional().default([]),
  nextPaymentDate: z.string().optional(),
  priority: z.coerce.number().int().min(1, "Priority must be at least 1").optional(),
  liveUrl: z.string().optional(),
  developmentLiveUrl: z.string().optional(),
  repositoryUrl: z.string().optional(),
});

// What the form fields hold (technologies is still a comma string here)
export type CreateProjectFormValues = z.input<typeof createProjectFormSchema>;

// What handleSubmit gives you after validation (technologies is string[])
export type CreateProjectFormOutput = z.output<typeof createProjectFormSchema>;