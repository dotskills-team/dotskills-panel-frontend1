import { getLeadFullName } from "./lead.utils";
import type { ILead } from "@/types/lead";

export const exportLeadsToCsv = (leads: ILead[]) => {
  if (leads.length === 0) return;

  const headers = [
    "Name",
    "Email",
    "Phone",
    "Company",
    "Status",
    "Priority",
    "Source",
    "Assigned To",
    "Created At",
  ];

  const rows = leads.map((lead) => [
    getLeadFullName(lead),
    lead.email ?? "",
    lead.phone,
    lead.company ?? "",
    lead.status,
    lead.priority,
    lead.source,
    lead.assignedTo ? getLeadFullName(lead.assignedTo) : "",
    lead.createdAt,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
