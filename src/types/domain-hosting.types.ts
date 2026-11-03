/* Types for the Domain & Hosting Manager module. Mirrors the backend responses. */

export type TargetType = "domain" | "hosting";

export type RenewalStatus =
  | "active"
  | "expiring_soon"
  | "expired"
  | "renewed"
  | "cancelled";

export type PaidBy = "company" | "client";

export type HostingType = "shared" | "vps" | "cloud" | "dedicated" | "other";

export type BillingCycle = "monthly" | "yearly" | "biennial";

export type ContactMethod = "phone" | "whatsapp" | "email" | "other";

export type LogAction = "client_contacted" | "renewed" | "reminder_sent" | "note";

/** Passwords are never returned in clear text: `password` is a mask, `hasPassword` says whether one is stored. */
export interface DomainCredentials {
  loginUrl?: string;
  username?: string;
  hasPassword?: boolean;
  password?: string;
  twoFactorNote?: string;
}

export interface DomainRecord {
  _id: string;
  project: string;
  client?: string | null;
  clientName: string;
  domainName: string;
  registrar?: string;
  registrarUrl?: string;
  purchaseDate?: string | null;
  expiryDate: string;
  purchasePrice?: number;
  renewalPrice?: number;
  currency: string;
  paidBy: PaidBy;
  autoRenew: boolean;
  nameservers: string[];
  dnsNotes?: string;
  whoisPrivacy: boolean;
  /** Only present for admin roles. */
  credentials?: DomainCredentials;
  status: RenewalStatus;
  notes?: string;
  lastRenewedAt?: string | null;
  lastPaidAmount?: number;
  /** Whole calendar days until expiry. Negative = already expired. */
  daysLeft: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface HostingCredential {
  _id: string;
  label: string;
  loginUrl?: string;
  username?: string;
  hasPassword?: boolean;
  password?: string;
  port?: number | null;
  note?: string;
}

export interface LinkedDomain {
  _id: string;
  domainName: string;
  status: RenewalStatus;
  expiryDate: string;
}

export interface HostingRecord {
  _id: string;
  project: string;
  client?: string | null;
  clientName: string;
  linkedDomains: LinkedDomain[];
  hostingType: HostingType;
  provider?: string;
  planName?: string;
  serverLocation?: string;
  serverIp?: string;
  controlPanel?: string;
  controlPanelUrl?: string;
  purchaseDate?: string | null;
  expiryDate: string;
  billingCycle: BillingCycle;
  purchasePrice?: number;
  renewalPrice?: number;
  currency: string;
  paidBy: PaidBy;
  /** Only present for admin roles. */
  credentials?: HostingCredential[];
  status: RenewalStatus;
  notes?: string;
  lastRenewedAt?: string | null;
  lastPaidAmount?: number;
  daysLeft: number;
  createdAt?: string;
  updatedAt?: string;
}

export type TargetRecord = DomainRecord | HostingRecord;

export interface RenewalLogRecord {
  _id: string;
  targetType: TargetType;
  targetId: string;
  action: LogAction;
  contactMethod?: ContactMethod | null;
  oldExpiryDate?: string | null;
  newExpiryDate?: string | null;
  amountPaid?: number;
  note?: string;
  createdBy?: { fullName?: string; email?: string } | null;
  createdAt: string;
}

export interface DashboardSummary {
  expired: number;
  expiringWithin7Days: number;
  expiringWithin15Days: number;
  expiringWithin30Days: number;
  totalActive: number;
  /** Renewal cost of items expiring within 30 days, one total per currency. */
  upcomingRenewalCost: Record<string, number>;
}

export interface ReminderItem {
  _id: string;
  targetType: TargetType;
  targetId: string;
  subjectName: string;
  clientName: string;
  expiryDate: string;
  daysBefore: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationsResponse {
  items: ReminderItem[];
  unreadCount: number;
}

export interface ListMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface DomainHostingFilters {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: RenewalStatus | "";
  provider?: string;
  expiryFrom?: string;
  expiryTo?: string;
  sort?: string;
}

export interface ProjectOption {
  _id: string;
  name: string;
}

export interface RenewPayload {
  newExpiryDate: string;
  status?: "active" | "renewed";
  amountPaid?: number;
  contactMethod?: ContactMethod;
  note?: string;
}

export interface LogPayload {
  action: "client_contacted" | "reminder_sent" | "note";
  contactMethod?: ContactMethod;
  note?: string;
}
