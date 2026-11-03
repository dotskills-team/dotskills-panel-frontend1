import { z } from "zod";

/*
 * Form schemas. Numeric inputs are kept as strings in the forms and converted to
 * numbers when the request is built (see utils/domain-hosting.payload.ts), so the
 * resolver types stay simple.
 */

const DOMAIN_NAME_PATTERN =
  /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const optionalHttpUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || /^https?:\/\/.+/i.test(value), "Enter a URL starting with http:// or https://");

const optionalAmount = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0),
    "Enter a valid amount (0 or more)",
  );

const requiredProject = z.string().min(1, "Select a project");

const expiryDate = z.string().min(1, "Expiry date is required");

/* -------------------------------------------------------------------------- */
/* Domain                                                                     */
/* -------------------------------------------------------------------------- */

export const domainFormSchema = z.object({
  // Basic info
  project: requiredProject,
  domainName: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Domain name is required")
    .refine((value) => DOMAIN_NAME_PATTERN.test(value), "Enter a valid domain, e.g. example.com"),
  registrar: z.string().trim().max(150),
  registrarUrl: optionalHttpUrl,
  status: z.enum(["active", "expiring_soon", "expired", "renewed", "cancelled"]),

  // Purchase & pricing
  purchaseDate: z.string(),
  expiryDate,
  purchasePrice: optionalAmount,
  renewalPrice: optionalAmount,
  currency: z.string().trim().min(3, "Currency is required").max(5),
  paidBy: z.enum(["company", "client"]),
  autoRenew: z.boolean(),

  // DNS
  nameservers: z.string().max(1000),
  dnsNotes: z.string().max(2000),
  whoisPrivacy: z.boolean(),

  // Credentials
  loginUrl: z.string().trim().max(500),
  username: z.string().trim().max(200),
  password: z.string().max(500),
  clearPassword: z.boolean(),
  twoFactorNote: z.string().trim().max(500),

  // Notes
  notes: z.string().max(2000),
});

export type DomainFormValues = z.infer<typeof domainFormSchema>;

/* -------------------------------------------------------------------------- */
/* Hosting                                                                    */
/* -------------------------------------------------------------------------- */

const portField = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 65535),
    "Port must be between 1 and 65535",
  );

export const hostingCredentialRowSchema = z.object({
  _id: z.string().optional(),
  label: z.string().trim().min(1, "Credential label is required").max(100),
  loginUrl: z.string().trim().max(500),
  username: z.string().trim().max(200),
  password: z.string().max(500),
  clearPassword: z.boolean(),
  hasPassword: z.boolean(),
  port: portField,
  note: z.string().trim().max(500),
});

export const hostingFormSchema = z.object({
  // Basic info
  project: requiredProject,
  linkedDomains: z.array(z.string()),
  hostingType: z.enum(["shared", "vps", "cloud", "dedicated", "other"]),
  provider: z.string().trim().max(150),
  planName: z.string().trim().max(150),
  serverLocation: z.string().trim().max(150),
  serverIp: z.string().trim().max(100),
  status: z.enum(["active", "expiring_soon", "expired", "renewed", "cancelled"]),

  // Control panel
  controlPanel: z.string().trim().max(100),
  controlPanelUrl: optionalHttpUrl,

  // Purchase & pricing
  purchaseDate: z.string(),
  expiryDate,
  billingCycle: z.enum(["monthly", "yearly", "biennial"]),
  purchasePrice: optionalAmount,
  renewalPrice: optionalAmount,
  currency: z.string().trim().min(3, "Currency is required").max(5),
  paidBy: z.enum(["company", "client"]),

  // Credentials (multiple rows)
  credentials: z.array(hostingCredentialRowSchema),

  // Notes
  notes: z.string().max(2000),
});

export type HostingFormValues = z.infer<typeof hostingFormSchema>;
export type HostingCredentialRow = z.infer<typeof hostingCredentialRowSchema>;

/* -------------------------------------------------------------------------- */
/* Renew and contact log                                                      */
/* -------------------------------------------------------------------------- */

export const renewFormSchema = z.object({
  newExpiryDate: z.string().min(1, "New expiry date is required"),
  status: z.enum(["active", "renewed"]),
  amountPaid: optionalAmount,
  contactMethod: z.string(),
  note: z.string().max(1000),
});

export type RenewFormValues = z.infer<typeof renewFormSchema>;

export const logFormSchema = z.object({
  action: z.enum(["client_contacted", "reminder_sent", "note"]),
  contactMethod: z.string(),
  note: z.string().trim().max(1000),
});

export type LogFormValues = z.infer<typeof logFormSchema>;
