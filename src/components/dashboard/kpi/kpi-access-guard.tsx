"use client";

import type { ReactNode } from "react";

import { isKpiAdmin } from "@/features/kpi/utils/kpi.utils";
import { isMarketingSalesLead } from "@/features/users/utils/user.utils";
import { useAuthStore } from "@/stores";

interface KpiAccessGuardProps {
  children: ReactNode;
}

/**
 * Client-side guard for the review pages: admins and the Marketing & Sales Lead only.
 * This only decides what is rendered. The backend enforces the same rules on every endpoint.
 */
export function KpiAccessGuard({ children }: KpiAccessGuardProps) {
  const user = useAuthStore((s) => s.user);

  // Auth is still being restored
  if (!user) return null;

  const allowed = isKpiAdmin(user.role) || isMarketingSalesLead(user.role);

  if (!allowed) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold">You do not have access to this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
