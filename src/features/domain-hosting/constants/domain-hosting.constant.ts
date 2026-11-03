import type {
  BillingCycle,
  ContactMethod,
  HostingType,
  LogAction,
  PaidBy,
  RenewalStatus,
  TargetType,
} from "@/types/domain-hosting.types";

/* -------------------------------------------------------------------------- */
/* Status                                                                     */
/* -------------------------------------------------------------------------- */

export const STATUS_OPTIONS: { value: RenewalStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "expiring_soon", label: "Expiring soon" },
  { value: "expired", label: "Expired" },
  { value: "renewed", label: "Renewed" },
  { value: "cancelled", label: "Cancelled" },
];

export const STATUS_LABEL: Record<RenewalStatus, string> = {
  active: "Active",
  expiring_soon: "Expiring soon",
  expired: "Expired",
  renewed: "Renewed",
  cancelled: "Cancelled",
};

// Full class names so Tailwind can detect them
export const STATUS_BADGE_CLASS: Record<RenewalStatus, string> = {
  active: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  expiring_soon: "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  expired: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-300",
  renewed: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  cancelled: "border-slate-400/50 bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

/* -------------------------------------------------------------------------- */
/* Expiry tone: red expired, orange <= 7 days, yellow <= 30 days, green ok     */
/* -------------------------------------------------------------------------- */

export type ExpiryTone = "expired" | "critical" | "warning" | "ok";

export const getExpiryTone = (daysLeft: number): ExpiryTone => {
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 7) return "critical";
  if (daysLeft <= 30) return "warning";
  return "ok";
};

export const EXPIRY_TONE_CLASS: Record<ExpiryTone, string> = {
  expired: "border-red-500/50 bg-red-500/15 text-red-700 dark:text-red-300",
  critical: "border-orange-500/50 bg-orange-500/15 text-orange-700 dark:text-orange-300",
  warning: "border-yellow-500/50 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  ok: "border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
};

/** "Expired 3 days ago", "Expires today", "12 days left". */
export const formatDaysLeft = (daysLeft: number): string => {
  if (daysLeft < 0) {
    const ago = Math.abs(daysLeft);
    return `Expired ${ago} ${ago === 1 ? "day" : "days"} ago`;
  }
  if (daysLeft === 0) return "Expires today";
  return `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`;
};

/* -------------------------------------------------------------------------- */
/* Form option lists                                                          */
/* -------------------------------------------------------------------------- */

export const PAID_BY_OPTIONS: { value: PaidBy; label: string }[] = [
  { value: "company", label: "Company" },
  { value: "client", label: "Client" },
];

export const HOSTING_TYPE_OPTIONS: { value: HostingType; label: string }[] = [
  { value: "shared", label: "Shared" },
  { value: "vps", label: "VPS" },
  { value: "cloud", label: "Cloud" },
  { value: "dedicated", label: "Dedicated" },
  { value: "other", label: "Other" },
];

export const BILLING_CYCLE_OPTIONS: { value: BillingCycle; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "biennial", label: "Biennial (2 years)" },
];

export const CONTACT_METHOD_OPTIONS: { value: ContactMethod; label: string }[] = [
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "other", label: "Other" },
];

export const LOG_ACTION_LABEL: Record<LogAction, string> = {
  client_contacted: "Client contacted",
  renewed: "Renewed",
  reminder_sent: "Reminder sent",
  note: "Note",
};

export const LOG_ACTION_OPTIONS: { value: Exclude<LogAction, "renewed">; label: string }[] = [
  { value: "client_contacted", label: "Client contacted" },
  { value: "reminder_sent", label: "Reminder sent" },
  { value: "note", label: "Note" },
];

export const CURRENCY_OPTIONS = ["BDT", "USD", "EUR", "GBP", "INR"] as const;

export const DEFAULT_CURRENCY = "BDT";

/** Roles that may create, edit, renew and delete. Everyone else is read-only. */
export const WRITE_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER", "DEVELOPER"];

/** Roles that may see credential fields and reveal passwords. */
export const CREDENTIAL_ROLES = ["SUPER_ADMIN", "ADMIN"];

export const TARGET_LABEL: Record<TargetType, string> = {
  domain: "Domain",
  hosting: "Hosting",
};

/** Backend route segment for each target type. */
export const TARGET_PATH: Record<TargetType, string> = {
  domain: "domains",
  hosting: "hosting",
};
