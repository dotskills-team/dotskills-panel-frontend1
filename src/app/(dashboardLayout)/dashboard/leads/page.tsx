import type { Metadata } from "next";

import { LeadsPageClient } from "@/components/dashboard/lead/leads-page-client";

export const metadata: Metadata = {
  title: "Leads | Acme CRM",
  description: "Manage and convert your leads efficiently.",
};

export default function LeadsPage() {
  return (
    <div className="p-4">
      <LeadsPageClient />
    </div>
  );
}
