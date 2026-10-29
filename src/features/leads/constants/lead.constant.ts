import {
  AttachmentType,
  LeadContactStatus,
  LeadPriority,
  LeadSource,
  LeadStatus,
  LeadType,
  PreferredContactMethod,
} from "@/types/lead";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "destructive"
  | "success"
  | "warning"
  | "info";

export interface Option<T = string> {
  label: string;
  value: T;
}

export interface StatusConfig {
  label: string;
  value: LeadStatus;
  variant: BadgeVariant;
  className: string;
}

export interface PriorityConfig {
  label: string;
  value: LeadPriority;
  variant: BadgeVariant;
  className: string;
}

export interface TypeConfig {
  label: string;
  value: LeadPriority;
  variant: BadgeVariant;
  className: string;
}



export interface SourceConfig {
  label: string;
  value: LeadSource;
}

export interface LeadTypeConfig {
  label: string;
  value: LeadType;
}

export interface ContactMethodConfig {
  label: string;
  value: PreferredContactMethod;
}

export interface AttachmentConfig {
  label: string;
  value: AttachmentType;
}

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  StatusConfig
> = {
  NEW: {
    label: "New",
    value: LeadStatus.NEW,
    variant: "secondary",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  },

  CONTACTED: {
    label: "Contacted",
    value: LeadStatus.CONTACTED,
    variant: "info",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },

  QUALIFIED: {
    label: "Qualified",
    value: LeadStatus.QUALIFIED,
    variant: "success",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },

  PROPOSAL_SENT: {
    label: "Proposal Sent",
    value: LeadStatus.PROPOSAL_SENT,
    variant: "warning",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },

  NEGOTIATION: {
    label: "Negotiation",
    value: LeadStatus.NEGOTIATION,
    variant: "warning",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },

  ON_HOLD: {
    label: "On Hold",
    value: LeadStatus.ON_HOLD,
    variant: "outline",
    className:
      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  },
  CONFIRMED_MEETING: {
  label: "Confirmed Meeting",
  value: LeadStatus.CONFIRMED_MEETING,
  variant: "success",
  className:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
},

  WON: {
    label: "Won",
    value: LeadStatus.WON,
    variant: "success",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },

  LOST: {
    label: "Lost",
    value: LeadStatus.LOST,
    variant: "destructive",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
};

export const NOTE_ACTIVITY_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "3d", label: "Last 3 Days" },
  { value: "7d", label: "Last 7 Days" },
] as const;

export const LEAD_CONTACT_STATUS_OPTIONS = [
  {
    value: LeadContactStatus.NO_RESPONSE,
    label: "No Response",
  },
  {
    value: LeadContactStatus.BUSY,
    label: "Busy",
  },
  {
    value: LeadContactStatus.NEXT_CONTACT,
    label: "Next Contact",
  },
  {
    value: LeadContactStatus.PHONE_OFF,
    label: "Phone Off",
  },
] as const;

export const LEAD_TYPE_OPTIONS = [
  {
    value: LeadType.WEBSITE,
    label: "Website",
  },
  {
    value: LeadType.SOFTWARE,
    label: "Software",
  },
] as const;

export const LEAD_PRIORITY_CONFIG: Record<
  LeadPriority,
  PriorityConfig
> = {
  LOW: {
    label: "Low",
    value: LeadPriority.LOW,
    variant: "secondary",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  },

  MEDIUM: {
    label: "Medium",
    value: LeadPriority.MEDIUM,
    variant: "default",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },

  HIGH: {
    label: "High",
    value: LeadPriority.HIGH,
    variant: "warning",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },

  URGENT: {
    label: "Urgent",
    value: LeadPriority.URGENT,
    variant: "destructive",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
};

export const LEAD_TYPE_CONFIG: Record<
  LeadType,
  LeadTypeConfig
> = {
  WEBSITE: {
    label: "Website",
    value: LeadType.WEBSITE,
  },
  SOFTWARE: {
    label: "Software",
    value: LeadType.SOFTWARE,
  },
};


export const LEAD_SOURCE_CONFIG: Record<
  LeadSource,
  SourceConfig
  > = {
    FACEBOOK: { label: "Facebook", value: LeadSource.FACEBOOK },
  WEBSITE: { label: "Website", value: LeadSource.WEBSITE },
  GOOGLE: { label: "Google", value: LeadSource.GOOGLE },
  LINKEDIN: { label: "LinkedIn", value: LeadSource.LINKEDIN },
  WHATSAPP: { label: "WhatsApp", value: LeadSource.WHATSAPP },
  EMAIL: { label: "Email", value: LeadSource.EMAIL },
  PHONE_CALL: { label: "Phone Call", value: LeadSource.PHONE_CALL },
  REFERRAL: { label: "Referral", value: LeadSource.REFERRAL },
  MANUAL: { label: "Manual", value: LeadSource.MANUAL },
  OTHER: { label: "Other", value: LeadSource.OTHER },
};

export const CONTACT_METHOD_CONFIG: Record<
  PreferredContactMethod,
  ContactMethodConfig
> = {
  PHONE: {
    label: "Phone",
    value: PreferredContactMethod.PHONE,
  },

  EMAIL: {
    label: "Email",
    value: PreferredContactMethod.EMAIL,
  },

  WHATSAPP: {
    label: "WhatsApp",
    value: PreferredContactMethod.WHATSAPP,
  },

  SMS: {
    label: "SMS",
    value: PreferredContactMethod.SMS,
  },
};

export const ATTACHMENT_TYPE_CONFIG: Record<
  AttachmentType,
  AttachmentConfig
> = {
  IMAGE: {
    label: "Image",
    value: AttachmentType.IMAGE,
  },

  DOCUMENT: {
    label: "Document",
    value: AttachmentType.DOCUMENT,
  },

  PDF: {
    label: "PDF",
    value: AttachmentType.PDF,
  },

  SPREADSHEET: {
    label: "Spreadsheet",
    value: AttachmentType.SPREADSHEET,
  },

  OTHER: {
    label: "Other",
    value: AttachmentType.OTHER,
  },
};

export const LEAD_STATUS_OPTIONS: Option<LeadStatus>[] =
  Object.values(LEAD_STATUS_CONFIG);

export const LEAD_PRIORITY_OPTIONS: Option<LeadPriority>[] =
  Object.values(LEAD_PRIORITY_CONFIG);

export const LEAD_SOURCE_OPTIONS: Option<LeadSource>[] =
  Object.values(LEAD_SOURCE_CONFIG);

export const CONTACT_METHOD_OPTIONS: Option<PreferredContactMethod>[] =
  Object.values(CONTACT_METHOD_CONFIG);

export const ATTACHMENT_TYPE_OPTIONS: Option<AttachmentType>[] =
  Object.values(ATTACHMENT_TYPE_CONFIG);


export const DEFAULT_LEAD_FILTERS = {
  page: 1,
  limit: 10,
  searchTerm: "",

  status: undefined,
  priority: undefined,
  source: undefined,
  assignedTo: undefined,

  sort: "-createdAt",
};

export const LEAD_PAGE_SIZES = [
  10,
  20,
  30,
  50,
  100,
] as const;

export const DEFAULT_PAGE_SIZE = 10;

export const MAX_NOTE_LENGTH = 2000;

export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;