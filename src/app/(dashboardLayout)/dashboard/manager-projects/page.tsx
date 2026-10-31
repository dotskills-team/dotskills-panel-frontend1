import type { Metadata } from "next";

import { LeadsPageClient } from "@/components/dashboard/lead/leads-page-client";
import { ProjectsPageClient } from "@/components/dashboard/project/ProjectClientPage";
import { ManagerProjectsPageClient } from "../../../../components/dashboard/project/ManagerProjectsClientPage";

export const metadata: Metadata = {
  title: "Projects | Acme CRM",
  description: "Manage your projects efficiently.",
};

export default function ProjectsPage() {
  return (
    <div className="p-4">
      <ManagerProjectsPageClient />
    </div>
  );
}
