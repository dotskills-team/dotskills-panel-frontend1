import { z } from "zod";

import {
  ClientDocumentType,
  ClientStatus,
  ClientType,
} from "@/types/clients";

export const createClientSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name is required."),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name is required."),

  email: z
    .string()
    .trim()
    .email("Invalid email.")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .min(5, "Phone number is required."),

  alternatePhone: z.string().optional(),

  companyName: z.string().optional(),

  companyWebsite: z
    .string()
    .url("Please enter a valid website.")
    .optional()
    .or(z.literal("")),

  industry: z.string().optional(),

  companySize: z.string().optional(),

  taxId: z.string().optional(),

  clientType: z.nativeEnum(ClientType),

  assignedManager: z.string().optional(),

  accountManager: z.string().optional(),

  country: z.string().optional(),

  state: z.string().optional(),

  city: z.string().optional(),

  zipCode: z.string().optional(),

  address: z.string().optional(),

  preferredContactMethod: z.string().optional(),

  estimatedValue: z.coerce
    .number()
    .min(0)
    .optional(),

  budget: z.coerce
    .number()
    .min(0)
    .optional(),

  timeline: z.string().optional(),

  requirementTitle: z.string().optional(),

  requirementDescription: z.string().optional(),

  joinedAt: z.string().optional(),

  lastContactAt: z.string().optional(),

  nextFollowUp: z.string().optional(),

  tags: z.array(z.string()).default([]),

  labels: z.array(z.string()).default([]),

  technologies: z.array(z.string()).default([]),

  services: z.array(z.string()).default([]),

  customFields: z.record(z.string(), z.any()).optional(),
});

export const updateClientSchema =
  createClientSchema.partial();

export const assignClientManagerSchema =
  z.object({
    accountManager: z
      .string()
      .min(1, "Manager is required."),
  });

export const updateClientStatusSchema =
  z.object({
    status: z.nativeEnum(ClientStatus),
  });

export const addClientNoteSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, "Please write a note.")
    .max(5000),
});

export const addClientDocumentSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(2, "Title is required."),

    url: z
      .string()
      .url("Please provide a valid URL."),

    type: z
      .nativeEnum(ClientDocumentType)
      .optional(),
  });

export const clientFilterSchema =
  z.object({
    searchTerm: z.string().optional(),

    status: z
      .nativeEnum(ClientStatus)
      .optional(),

    clientType: z
      .nativeEnum(ClientType)
      .optional(),

    assignedManager: z.string().optional(),

    accountManager: z.string().optional(),

    industry: z.string().optional(),

    page: z.coerce.number().optional(),

    limit: z.coerce.number().optional(),

    sort: z.string().optional(),

    fields: z.string().optional(),

    "createdAt[gte]": z.string().optional(),

    "createdAt[lte]": z.string().optional(),
  });

export type CreateClientValues =
  z.infer<typeof createClientSchema>;

export type UpdateClientValues =
  z.infer<typeof updateClientSchema>;

export type AssignClientManagerValues =
  z.infer<typeof assignClientManagerSchema>;

export type UpdateClientStatusValues =
  z.infer<typeof updateClientStatusSchema>;

export type AddClientNoteValues =
  z.infer<typeof addClientNoteSchema>;

export type AddClientDocumentValues =
  z.infer<typeof addClientDocumentSchema>;

export type ClientFilterValues =
  z.infer<typeof clientFilterSchema>;