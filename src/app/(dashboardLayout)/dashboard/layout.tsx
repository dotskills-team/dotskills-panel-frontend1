import type { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | DotSkills Panel",
  },
  description:
    "Enterprise dashboard for managing your business operations through DotSkills Panel.",
  robots: {
    index: false,
    follow: false,
  },
};

interface DashboardRootLayoutProps {
  children: React.ReactNode;
}

export default function DashboardRootLayout({
  children,
}: DashboardRootLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}