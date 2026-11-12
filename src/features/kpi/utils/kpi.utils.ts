import type { KpiExtraItem } from "@/types/kpi.types";

/** Asia/Dhaka is UTC+6 all year, so a fixed offset is exact. */
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

/** Current month as YYYY-MM in Asia/Dhaka (the business calendar). */
export const getCurrentMonth = (now: Date = new Date()): string =>
  new Date(now.getTime() + DHAKA_OFFSET_MS).toISOString().slice(0, 7);

export const isMonthValue = (value: string): boolean => /^\d{4}-(0[1-9]|1[0-2])$/.test(value);

/** "2026-11" -> "November 2026". */
export const formatMonthLabel = (month: string): string => {
  if (!isMonthValue(month)) return month;
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthNumber - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

/** Moves a YYYY-MM value by a number of months (negative goes back). */
export const shiftMonth = (month: string, delta: number): string => {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1 + delta, 1));
  return date.toISOString().slice(0, 7);
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getMemberName = (user?: { firstName?: string; lastName?: string } | null): string =>
  user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "";

/** Percentage for display: whole numbers, "—" when there is no target. */
export const formatPercent = (value: number | null | undefined): string =>
  value === null || value === undefined ? "—" : `${Math.round(value)}%`;

/** Width of a progress bar: capped at 100 even when the target is exceeded. */
export const progressValue = (value: number | null | undefined): number =>
  value === null || value === undefined ? 0 : Math.max(0, Math.min(100, value));

const slugifyKey = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32) || "item";

/**
 * Builds the extra items sent to the server.
 * Existing items keep their key (reports refer to it); new items get a unique key from their name.
 */
export const buildExtraItems = (
  items: { key?: string; name: string; unit: KpiExtraItem["unit"]; target: number }[],
): KpiExtraItem[] => {
  const used = new Set(items.map((item) => item.key?.toLowerCase()).filter(Boolean) as string[]);

  return items.map((item) => {
    if (item.key) {
      return { key: item.key, name: item.name.trim(), unit: item.unit, target: item.target };
    }

    const base = slugifyKey(item.name);
    let key = base;
    let counter = 2;
    while (used.has(key)) {
      key = `${base}-${counter}`;
      counter += 1;
    }
    used.add(key);

    return { key, name: item.name.trim(), unit: item.unit, target: item.target };
  });
};

/** "BDT 1,250,000" - thousand separators. */
export const formatBdt = (value: number | null | undefined): string =>
  `BDT ${(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export const formatCount = (value: number | null | undefined): string =>
  (value ?? 0).toLocaleString("en-US");

export const KPI_STATUS_LABEL = {
  draft: "Draft",
  active: "Active",
  closed: "Closed",
} as const;

/** Difference between the team target and the sum of individual targets. */
export const compareTargets = (teamTarget: number, individualSum: number) => {
  const diff = individualSum - teamTarget;
  if (diff === 0) return { state: "match" as const, diff: 0 };
  return diff > 0 ? { state: "over" as const, diff } : { state: "under" as const, diff: Math.abs(diff) };
};

/** Percentage of target reached, or null when there is no target. */
export const toPercent = (achieved: number, target: number | null | undefined): number | null =>
  target && target > 0 ? (achieved / target) * 100 : null;

/**
 * Whether the viewer may review or return a report.
 * Admins can act on everyone's reports. The lead only on regular members' reports, never their own.
 * The server enforces the same rule; this only decides which buttons to show.
 */
export const canModerateReport = (
  viewer: { _id?: string; role?: string } | null | undefined,
  owner: { _id: string; role?: string },
): boolean => {
  if (!viewer) return false;
  if (isKpiAdmin(viewer.role)) return true;
  return (
    viewer.role === "MARKETING_SALES_LEAD" &&
    owner.role === "SALES_MARKETING" &&
    owner._id !== viewer._id
  );
};

/**
 * Whether the viewer may set, edit or activate the KPI of a person with this role.
 * Admins can manage everyone. The lead manages regular members and their own KPI, not other leads.
 * The server enforces the same rule; this only decides which controls to show.
 */
export const canManageMemberKpi = (
  viewer: { _id?: string; role?: string } | null | undefined,
  owner: { _id?: string; role?: string } | null | undefined,
): boolean => {
  if (!viewer || !owner) return false;
  if (isKpiAdmin(viewer.role)) return true;
  if (viewer.role !== "MARKETING_SALES_LEAD") return false;
  return owner.role === "SALES_MARKETING" || (Boolean(viewer._id) && owner._id === viewer._id);
};

/** Admin-level access to the KPI module: super admin, admin and manager. */
export const isKpiAdmin = (role?: string | null): boolean =>
  role === "SUPER_ADMIN" || role === "ADMIN" || role === "MANAGER";
