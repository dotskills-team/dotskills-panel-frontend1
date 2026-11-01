import type { Metadata } from "next";

import { ProjectsPageClient } from "@/components/dashboard/project/ProjectClientPage";

export const metadata: Metadata = {
  title: "Projects | Acme CRM",
  description: "Manage your projects efficiently.",
};

export default function ProjectsPage() {
  return (
    <div className="min-w-0">
      <ProjectsPageClient />
    </div>
  );
}
