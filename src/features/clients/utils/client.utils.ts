import type { IClient } from "@/types/clients";

export const getClientFullName = (
  client?: Partial<IClient> | null,
): string => {
  if (!client) return "Unknown Client";

  return [client?.firstName || client.leadId?.firstName, client?.lastName || client.leadId?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
};

export const getClientDisplayName = (
  client?: Partial<IClient> | null,
): string => {
  if (!client) return "Unknown Client";

  return (
    client.companyName ||
    getClientFullName(client) ||
    client.leadId?.email ||
    client.leadId?.phone ||
    "Unknown Client"
  );
};

export const getClientInitials = (
  client?: Partial<IClient> | null,
): string => {
  if (!client) return "CL";

  const initials = [client.firstName, client.lastName]
    .filter(Boolean)
    .map((name) => name!.charAt(0).toUpperCase())
    .join("");

  return initials || "CL";
};

export const formatCurrency = (
  value?: number | null,
  currency = "BDT",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

export const formatNumber = (
  value?: number | null,
): string => {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
};

export const calculateCollectionPercentage = (
  paid?: number,
  total?: number,
): number => {
  if (!total || total <= 0) return 0;

  return Math.round(((paid ?? 0) / total) * 100);
};

export const calculateDueAmount = (
  total?: number,
  paid?: number,
): number => {
  return Math.max((total ?? 0) - (paid ?? 0), 0);
};

export const isActiveClient = (
  client?: Partial<IClient> | null,
): boolean => {
  return client?.status === "ACTIVE";
};

export const getClientStatusColor = (
  status?: string,
): string => {
  switch (status) {
    case "ACTIVE":
      return "success";

    case "INACTIVE":
      return "secondary";

    case "ON_HOLD":
      return "warning";

    case "BLACKLISTED":
      return "destructive";

    default:
      return "outline";
  }
};

export const hasOutstandingDue = (
  client?: Partial<IClient> | null,
): boolean => {
  return (client?.totalDue ?? 0) > 0;
};

export const getProjectCompletionPercentage = (
  client?: Partial<IClient> | null,
): number => {
  const total = client?.totalProjects ?? 0;
  const completed = client?.completedProjects ?? 0;

  if (!total) return 0;

  return Math.round((completed / total) * 100);
};