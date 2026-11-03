import type { Metadata } from "next";

import { DomainHostingPageClient } from "@/components/dashboard/domain-hosting/domain-hosting-page-client";

export const metadata: Metadata = {
  title: "Domain & Hosting | DotSkills Panel",
  description: "Track client domains and hosting renewals.",
};

export default function DomainHostingPage() {
  return <DomainHostingPageClient />;
}
