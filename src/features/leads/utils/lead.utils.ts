import { AttachmentType, ILead, LeadContactStatus, LeadPriority, LeadSource, LeadStatus } from "@/types/lead";

export const getLeadStatusColor = (status: LeadStatus) => {
  switch (status) {
    case LeadStatus.NEW:
      return "secondary";
    case LeadStatus.CONTACTED:
      return "default";
    case LeadStatus.QUALIFIED:
      return "info";
    case LeadStatus.PROPOSAL_SENT:
      return "warning";
    case LeadStatus.CONFIRMED_MEETING:
      return "success";
    case LeadStatus.NEGOTIATION:
      return "warning";
    case LeadStatus.ON_HOLD:
      return "secondary";
    case LeadStatus.WON:
      return "success";
    case LeadStatus.LOST:
      return "destructive";
    default:
      return "secondary";
  }
};

export const hasNextContact = (lead: ILead) => {
  return (
    lead.contactStatus === LeadContactStatus.NEXT_CONTACT &&
    Boolean(lead.nextContactAt)
  );
};

export const getLeadContactStatusLabel = (
  status?: LeadContactStatus | null,
) => {
  switch (status) {
    case LeadContactStatus.NO_RESPONSE:
      return "No Response";

    case LeadContactStatus.BUSY:
      return "Busy";

    case LeadContactStatus.NEXT_CONTACT:
      return "Next Contact";

    default:
      return "Not Contacted";
  }
};

export const formatNextContact = (
  nextContactAt?: string | null,
) => {
  if (!nextContactAt) return null;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(nextContactAt));
};

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const diffSec = Math.round((Date.now() - date.getTime()) / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function inferAttachmentType(file: File): AttachmentType {
  if (file.type.startsWith("image/")) return AttachmentType.IMAGE;
  if (file.type === "application/pdf") return AttachmentType.PDF;
  if (
    file.type.includes("spreadsheet") ||
    file.type === "text/csv" ||
    /\.(xlsx|xls|csv)$/i.test(file.name)
  )
    return AttachmentType.SPREADSHEET;
  if (
    file.type.includes("word") ||
    file.type === "application/msword" ||
    /\.(docx?|rtf)$/i.test(file.name)
  )
    return AttachmentType.DOCUMENT;
  return AttachmentType.OTHER;
}

export const getPriorityColor = (priority: LeadPriority) => {
  switch (priority) {
    case LeadPriority.LOW:
      return "secondary";
    case LeadPriority.MEDIUM:
      return "default";
    case LeadPriority.HIGH:
      return "warning";
    case LeadPriority.URGENT:
      return "destructive";
    default:
      return "secondary";
  }
};

export const formatLeadSource = (source: LeadSource) => {
  return source.replaceAll("_", " ");
};

export const getLeadFullName = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => `${firstName} ${lastName}`;

export const formatCurrency = (value?: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

export const buildLeadQuery = (filters: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
};

export const getInitials = (firstName?: string, lastName?: string) =>
  `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();

export const formatDate = (date?: string | Date | null, locale = "en-US") => {
  if (!date) return "-";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(date));
};

export const formatDateTime = (
  date?: string | Date | null,
  locale = "en-US",
) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

export const canConvertLead = (lead: {
  isConverted: boolean;
  status: LeadStatus;
}) =>
  !lead.isConverted &&
  lead.status !== LeadStatus.LOST &&
  lead.status !== LeadStatus.ON_HOLD;

export const getAttachmentExtension = (url: string) =>
  url.split(".").pop()?.toLowerCase() ?? "";

export const isImageUrl = (url: string) =>
  ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
    getAttachmentExtension(url),
  );
