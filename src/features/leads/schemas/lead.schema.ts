import { z } from "zod";

import {
  AttachmentType,
  LeadContactStatus,
  LeadPriority,
  LeadSource,
  LeadStatus,
  LeadType,
  PreferredContactMethod,
} from "@/types/lead";

const statusValues = Object.values(LeadStatus) as [LeadStatus, ...LeadStatus[]];
const priorityValues = Object.values(LeadPriority) as [
  LeadPriority,
  ...LeadPriority[],
];
const sourceValues = Object.values(LeadSource) as [LeadSource, ...LeadSource[]];
const contactMethodValues = Object.values(PreferredContactMethod) as [
  PreferredContactMethod,
  ...PreferredContactMethod[],
];
const attachmentTypeValues = Object.values(AttachmentType) as [
  AttachmentType,
  ...AttachmentType[],
];

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid selection." });

const phoneSchema = z
  .string({ message: "Phone number is required." })
  .regex(/^(?:\+880|0)[1-9]\d{7,9}$/, {
    message:
      "Phone number must be valid for Bangladesh. Format: +88XXXXXXXXX or 0XXXXXXXXX",
  });

const nameSchema = (fieldName: string) =>
  z
    .string({ message: `${fieldName} is required.` })
    .trim()
    .min(2, { message: `${fieldName} must be at least 2 characters long.` })
    .max(50, { message: `${fieldName} cannot exceed 50 characters.` });

export const createLeadFormSchema = z.object({
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address format." })
    .optional()
    .or(z.literal("")),
  phone: phoneSchema,
  alternatePhone: phoneSchema.optional().or(z.literal("")),

  company: z.string().trim().max(150).optional().or(z.literal("")),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  industry: z.string().trim().max(100).optional().or(z.literal("")),
  jobTitle: z.string().trim().max(100).optional().or(z.literal("")),
  employeeSize: z.string().trim().max(50).optional().or(z.literal("")),

  country: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  zipCode: z.string().trim().max(20).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  leadType: z.nativeEnum(LeadType).optional(),
  source: z.enum(sourceValues, {
    message: "Please choose a lead source.",
  }),
  priority: z.enum(priorityValues).optional(),
  pipelineStage: z.string().trim().max(100).optional().or(z.literal("")),
  estimatedValue: z.coerce
    .number()
    .min(0, { message: "Estimated value cannot be negative." })
    .optional(),
  expectedCloseDate: z.string().optional().or(z.literal("")),

  assignedTo: objectIdSchema.optional().or(z.literal("")),

  preferredContactMethod: z.enum(contactMethodValues).optional(),

  tags: z.array(z.string().trim()).optional(),
  labels: z.array(z.string().trim()).optional(),

  requirementTitle: z.string().trim().max(200).optional().or(z.literal("")),
  requirementDescription: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("")),
  budget: z.coerce.number().min(0).optional(),
  timeline: z.string().trim().max(100).optional().or(z.literal("")),
  technologies: z.array(z.string().trim()).optional(),
  attachments: z.array(z.string().trim()).optional(),
  services: z.array(z.string().trim()).optional(),
});

export const updateLeadContactStatusSchema = z
  .object({
    contactStatus: z.nativeEnum(LeadContactStatus),

    nextContactAt: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.contactStatus === LeadContactStatus.NEXT_CONTACT &&
      !data.nextContactAt
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nextContactAt"],
        message: "Next contact date and time is required.",
      });
    }

    if (
      data.contactStatus !== LeadContactStatus.NEXT_CONTACT &&
      data.nextContactAt
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nextContactAt"],
        message:
          "Next contact date is only allowed for Next Contact status.",
      });
    }
  });
  
export type UpdateLeadContactStatusValues = z.infer<
  typeof updateLeadContactStatusSchema
>;
export type CreateLeadFormValues = z.infer<typeof createLeadFormSchema>;

export const updateLeadFormSchema = createLeadFormSchema.partial();

export type UpdateLeadFormValues = z.infer<typeof updateLeadFormSchema>;

export const updateLeadStatusSchema = z.object({
  status: z.enum(statusValues, {
    message: "Please select a status.",
  }),
});

export type UpdateLeadStatusValues = z.infer<typeof updateLeadStatusSchema>;

export const assignLeadSchema = z.object({
  assignedTo: objectIdSchema,
});

export type AssignLeadValues = z.infer<typeof assignLeadSchema>;

export const convertLeadSchema = z.object({
  clientId: objectIdSchema.optional().or(z.literal("")),
});

export type ConvertLeadValues = z.infer<typeof convertLeadSchema>;

export const addNoteSchema = z.object({
  message: z
    .string({ message: "A note message is required." })
    .trim()
    .min(1, { message: "Note cannot be empty." })
    .max(2000, { message: "Note cannot exceed 2000 characters." }),
});

export type AddNoteValues = z.infer<typeof addNoteSchema>;

export const addAttachmentSchema = z.object({
  title: z
    .string({ message: "Title is required." })
    .trim()
    .min(1, { message: "Title is required." })
    .max(150, { message: "Title cannot exceed 150 characters." }),
  url: z
    .string({ message: "URL is required." })
    .trim()
    .url({ message: "Invalid attachment URL." }),
  type: z.enum(attachmentTypeValues).optional(),
});

export type AddAttachmentValues = z.infer<typeof addAttachmentSchema>;
