import type { Metadata } from "next";

import { ManagerProjectsPageClient } from "../../../../components/dashboard/project/ManagerProjectsClientPage";

export const metadata: Metadata = {
  title: "Projects | Acme CRM",
  description: "Manage your projects efficiently.",
};

export default function ProjectsPage() {
  return (
    <div className="min-w-0">
      <ManagerProjectsPageClient />
    </div>
);
}
