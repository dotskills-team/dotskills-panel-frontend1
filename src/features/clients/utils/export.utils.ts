/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IClient } from "@/types/clients";
import {
  formatCurrency,
  getClientFullName,
} from "./client.utils";

interface ExportClientsOptions {
  filename?: string;
}

const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const formatDate = (
  value?: string | Date | null,
): string => {
  if (!value) return "";

  return new Date(value).toLocaleDateString();
};

export const exportClients = (
  clients: IClient[],
  options?: ExportClientsOptions,
) => {
  if (!clients.length) return;

  const headers = [
    "Client Code",
    "Client Name",
    "Company",
    "Email",
    "Phone",
    "Status",
    "Client Type",
    "Assigned Manager",
    "Projects",
    "Completed Projects",
    "Revenue",
    "Paid",
    "Due",
    "Joined Date",
    "Created At",
  ];

  const rows = clients.map((client: any) => [
    client.clientCode,

    getClientFullName(client),

    client.companyName ?? "",

    client.leadId?.email ?? "",

    client.leadId?.phone ?? "",

    client.status,

    client.clientType,

    client.accountManager
      ? getClientFullName(client?.accountManager)
      : "",

    client.totalProjects ?? 0,

    client.completedProjects ?? 0,

    formatCurrency(client.totalRevenue),

    formatCurrency(client.totalPaid),

    formatCurrency(client.totalDue),

    formatDate(client.joinedAt),

    formatDate(client.createdAt),
  ]);

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download =
    options?.filename ??
    `clients-${new Date().toISOString().slice(0, 10)}.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};