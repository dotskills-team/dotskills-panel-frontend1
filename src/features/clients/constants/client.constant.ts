import {
  ClientDocumentType,
  ClientStatus,
  ClientType,
} from "@/types/clients";

export const CLIENT_STATUS_OPTIONS = [
  {
    label: "Active",
    value: ClientStatus.ACTIVE,
  },
  {
    label: "Inactive",
    value: ClientStatus.INACTIVE,
  },
  {
    label: "On Hold",
    value: ClientStatus.ON_HOLD,
  },
  {
    label: "Blacklisted",
    value: ClientStatus.BLACKLISTED,
  },
] as const;

export const CLIENT_TYPE_OPTIONS = [
  {
    label: "Individual",
    value: ClientType.INDIVIDUAL,
  },
  {
    label: "Company",
    value: ClientType.COMPANY,
  },
] as const;

export const CLIENT_DOCUMENT_TYPE_OPTIONS = [
  {
    label: "Image",
    value: ClientDocumentType.IMAGE,
  },
  {
    label: "PDF",
    value: ClientDocumentType.PDF,
  },
  {
    label: "Document",
    value: ClientDocumentType.DOCUMENT,
  },
  {
    label: "Spreadsheet",
    value: ClientDocumentType.SPREADSHEET,
  },
  {
    label: "Other",
    value: ClientDocumentType.OTHER,
  },
] as const;

export const CLIENT_STATUS_BADGES: Record<
  ClientStatus,
  {
    label: string;
    className: string;
  }
> = {
  [ClientStatus.ACTIVE]: {
    label: "Active",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },

  [ClientStatus.INACTIVE]: {
    label: "Inactive",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  },

  [ClientStatus.ON_HOLD]: {
    label: "On Hold",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },

  [ClientStatus.BLACKLISTED]: {
    label: "Blacklisted",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export const CLIENT_TYPE_BADGES: Record<
  ClientType,
  {
    label: string;
    className: string;
  }
> = {
  [ClientType.INDIVIDUAL]: {
    label: "Individual",
    className:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  },

  [ClientType.COMPANY]: {
    label: "Company",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
};

export const CLIENT_SEARCH_PLACEHOLDER =
  "Search by name, company, email, phone or client code...";

export const CLIENT_DEFAULT_PAGE_SIZE = 10;

export const CLIENT_PAGE_SIZE_OPTIONS = [
  10,
  20,
  50,
  100,
] as const;

export const CLIENT_EXPORT_FILE_NAME = "clients";

export const CLIENT_TABLE_COLUMNS = [
  "client",
  "company",
  "status",
  "manager",
  "projects",
  "revenue",
  "joinedAt",
  "actions",
] as const;

export const CLIENT_SORT_OPTIONS = [
  {
    label: "Newest",
    value: "-createdAt",
  },
  {
    label: "Oldest",
    value: "createdAt",
  },
  {
    label: "Name (A-Z)",
    value: "firstName",
  },
  {
    label: "Name (Z-A)",
    value: "-firstName",
  },
  {
    label: "Revenue (High-Low)",
    value: "-totalRevenue",
  },
  {
    label: "Revenue (Low-High)",
    value: "totalRevenue",
  },
] as const;

export const CLIENT_DEFAULT_FILTERS = {
  page: 1,
  limit: CLIENT_DEFAULT_PAGE_SIZE,
} as const;