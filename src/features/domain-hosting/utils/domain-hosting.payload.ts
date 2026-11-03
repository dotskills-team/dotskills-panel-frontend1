import { format } from "date-fns";

import type {
  DomainFormValues,
  HostingCredentialRow,
  HostingFormValues,
} from "../schemas/domain-hosting.schema";
import type { DomainRecord, HostingRecord } from "@/types/domain-hosting.types";

/* -------------------------------------------------------------------------- */
/* Form value <-> API value conversion                                        */
/* -------------------------------------------------------------------------- */

/** "2026-11-03" (local date) -> ISO string at local midnight. Empty -> null. */
export const toIsoDate = (value: string): string | null => {
  if (!value) return null;
  return new Date(`${value}T00:00:00`).toISOString();
};

/** ISO date from the API -> "yyyy-MM-dd" for <input type="date">. */
export const toDateInput = (iso?: string | null): string => {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return format(parsed, "yyyy-MM-dd");
};

/** Empty string -> undefined (field left out of the request), otherwise a number. */
export const toAmount = (value: string): number | undefined => {
  if (value.trim() === "") return undefined;
  return Number(value);
};

/**
 * Password rules for the request:
 * - clearPassword checked → "" (backend clears the stored password)
 * - empty input          → undefined (backend keeps the stored password)
 * - typed value          → sent as typed (backend encrypts it)
 */
const toPasswordField = (password: string, clearPassword: boolean): string | undefined => {
  if (clearPassword) return "";
  if (password === "") return undefined;
  return password;
};

const splitNameservers = (value: string): string[] =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

/* -------------------------------------------------------------------------- */
/* Request builders                                                           */
/* -------------------------------------------------------------------------- */

export const buildDomainPayload = (values: DomainFormValues) => ({
  project: values.project,
  domainName: values.domainName.trim().toLowerCase(),
  registrar: values.registrar.trim(),
  registrarUrl: values.registrarUrl.trim(),
  purchaseDate: toIsoDate(values.purchaseDate),
  expiryDate: toIsoDate(values.expiryDate),
  purchasePrice: toAmount(values.purchasePrice) ?? 0,
  renewalPrice: toAmount(values.renewalPrice) ?? 0,
  currency: values.currency.trim().toUpperCase(),
  paidBy: values.paidBy,
  autoRenew: values.autoRenew,
  nameservers: splitNameservers(values.nameservers),
  dnsNotes: values.dnsNotes.trim(),
  whoisPrivacy: values.whoisPrivacy,
  status: values.status,
  notes: values.notes.trim(),
  credentials: {
    loginUrl: values.loginUrl.trim(),
    username: values.username.trim(),
    twoFactorNote: values.twoFactorNote.trim(),
    password: toPasswordField(values.password, values.clearPassword),
  },
});

const buildCredentialRow = (row: HostingCredentialRow) => ({
  // Existing rows keep their id so the backend can keep their stored password
  ...(row._id ? { _id: row._id } : {}),
  label: row.label.trim(),
  loginUrl: row.loginUrl.trim(),
  username: row.username.trim(),
  port: row.port.trim() === "" ? null : Number(row.port),
  note: row.note.trim(),
  password: toPasswordField(row.password, row.clearPassword),
});

export const buildHostingPayload = (values: HostingFormValues) => ({
  project: values.project,
  linkedDomains: values.linkedDomains,
  hostingType: values.hostingType,
  provider: values.provider.trim(),
  planName: values.planName.trim(),
  serverLocation: values.serverLocation.trim(),
  serverIp: values.serverIp.trim(),
  status: values.status,
  controlPanel: values.controlPanel.trim(),
  controlPanelUrl: values.controlPanelUrl.trim(),
  purchaseDate: toIsoDate(values.purchaseDate),
  expiryDate: toIsoDate(values.expiryDate),
  billingCycle: values.billingCycle,
  purchasePrice: toAmount(values.purchasePrice) ?? 0,
  renewalPrice: toAmount(values.renewalPrice) ?? 0,
  currency: values.currency.trim().toUpperCase(),
  paidBy: values.paidBy,
  notes: values.notes.trim(),
  credentials: values.credentials.map(buildCredentialRow),
});

/* -------------------------------------------------------------------------- */
/* Record -> form default values                                              */
/* -------------------------------------------------------------------------- */

export const domainToFormValues = (record?: DomainRecord | null): DomainFormValues => ({
  project: record?.project ?? "",
  domainName: record?.domainName ?? "",
  registrar: record?.registrar ?? "",
  registrarUrl: record?.registrarUrl ?? "",
  status: record?.status ?? "active",
  purchaseDate: toDateInput(record?.purchaseDate),
  expiryDate: toDateInput(record?.expiryDate),
  purchasePrice: record?.purchasePrice !== undefined ? String(record.purchasePrice) : "",
  renewalPrice: record?.renewalPrice !== undefined ? String(record.renewalPrice) : "",
  currency: record?.currency ?? "BDT",
  paidBy: record?.paidBy ?? "company",
  autoRenew: record?.autoRenew ?? false,
  nameservers: (record?.nameservers ?? []).join("\n"),
  dnsNotes: record?.dnsNotes ?? "",
  whoisPrivacy: record?.whoisPrivacy ?? false,
  loginUrl: record?.credentials?.loginUrl ?? "",
  username: record?.credentials?.username ?? "",
  // Stored passwords are never sent back, so the field always starts empty
  password: "",
  clearPassword: false,
  twoFactorNote: record?.credentials?.twoFactorNote ?? "",
  notes: record?.notes ?? "",
});

export const hostingToFormValues = (record?: HostingRecord | null): HostingFormValues => ({
  project: record?.project ?? "",
  linkedDomains: (record?.linkedDomains ?? []).map((domain) => domain._id),
  hostingType: record?.hostingType ?? "shared",
  provider: record?.provider ?? "",
  planName: record?.planName ?? "",
  serverLocation: record?.serverLocation ?? "",
  serverIp: record?.serverIp ?? "",
  status: record?.status ?? "active",
  controlPanel: record?.controlPanel ?? "",
  controlPanelUrl: record?.controlPanelUrl ?? "",
  purchaseDate: toDateInput(record?.purchaseDate),
  expiryDate: toDateInput(record?.expiryDate),
  billingCycle: record?.billingCycle ?? "yearly",
  purchasePrice: record?.purchasePrice !== undefined ? String(record.purchasePrice) : "",
  renewalPrice: record?.renewalPrice !== undefined ? String(record.renewalPrice) : "",
  currency: record?.currency ?? "BDT",
  paidBy: record?.paidBy ?? "company",
  notes: record?.notes ?? "",
  credentials: (record?.credentials ?? []).map((row) => ({
    _id: row._id,
    label: row.label,
    loginUrl: row.loginUrl ?? "",
    username: row.username ?? "",
    password: "",
    clearPassword: false,
    hasPassword: Boolean(row.hasPassword),
    port: row.port !== undefined && row.port !== null ? String(row.port) : "",
    note: row.note ?? "",
  })),
});
