import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to access your DotSkills workspace."
    >
      <LoginForm />
    </AuthCard>
  );
}
