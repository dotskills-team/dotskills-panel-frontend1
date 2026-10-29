import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      description="Enter the email linked to your account and we'll send you a link to reset it."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
