import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | DotSkills Panel",
    default: "Sign in",
  },
};

interface AuthGroupLayoutProps {
  children: React.ReactNode;
}

export default function AuthGroupLayout({ children }: AuthGroupLayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
