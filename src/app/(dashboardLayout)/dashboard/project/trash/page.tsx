import type { Metadata } from "next";

import { ProjectsTrashPageClient } from "@/components/dashboard/project/ProjectTrashPageClient";

export const metadata: Metadata = {
  title: "Projects Trash | DotSkills Panel",
  description: "Restore or permanently delete soft-deleted projects.",
};

export default function LeadsTrashPage() {
  return (
    <div className="p-4 sm:p-6">
      <ProjectsTrashPageClient />
    </div>
  );
}
