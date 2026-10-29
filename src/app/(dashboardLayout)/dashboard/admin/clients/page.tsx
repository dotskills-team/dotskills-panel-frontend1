import { ClientsPageClient } from "@/components/dashboard/client/clients-page-client";

export const metadata = {
  title: "Clients | DotSkills Panel",
  description: "Manage your clients and client information",
};

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <ClientsPageClient />
    </div>
  );
}
