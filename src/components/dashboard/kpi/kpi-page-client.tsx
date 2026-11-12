"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useKpiProgress,
  useKpiReportSummary,
  useKpiTeamContext,
} from "@/features/kpi/hooks/use-kpi";
import {
  canManageMemberKpi,
  formatMonthLabel,
  getCurrentMonth,
  getMemberName,
  isKpiAdmin,
} from "@/features/kpi/utils/kpi.utils";
import { isMarketingSalesLead } from "@/features/users/utils/user.utils";
import { useAuthStore } from "@/stores";
import type { KpiProgressMember } from "@/types/kpi.types";
import { KpiFormDialog } from "./kpi-form-dialog";
import { KpiMonthPicker } from "./kpi-month-picker";
import { KpiProjectBreakdownDialog } from "./kpi-project-breakdown-dialog";
import { KpiTable } from "./kpi-table";
import { KpiViewDialog } from "./kpi-view-dialog";
import { TeamKpiCard } from "./team-kpi-card";

type FormState =
  | { kind: "individual"; editing: null; presetUserId?: string }
  | { kind: "individual"; editing: { _id: string; userId: string }; presetUserId?: undefined }
  | { kind: "team"; editing: { _id: string } | null; presetUserId?: undefined };

export default function KpiPageClient() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const isAdmin = isKpiAdmin(role);
  const isLead = isMarketingSalesLead(role);
  const hasAccess = isAdmin || isLead;

  const [month, setMonth] = useState(getCurrentMonth);
  const [formState, setFormState] = useState<FormState | null>(null);
  const [viewing, setViewing] = useState<{ _id: string; userId: string } | null>(null);
  const [breakdownFor, setBreakdownFor] = useState<KpiProgressMember["user"] | null>(null);

  const progressQuery = useKpiProgress(month, { enabled: hasAccess });
  const contextQuery = useKpiTeamContext(month, { enabled: isAdmin });
  const reportsQuery = useKpiReportSummary(month, { enabled: hasAccess });

  const progress = progressQuery.data?.data;
  const members = useMemo(() => progress?.members ?? [], [progress]);
  const takenUserIds = useMemo(
    () => new Set(members.filter((m) => m.kpi).map((m) => m.user._id)),
    [members],
  );

  if (!user) return null;

  if (!hasAccess) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold">You do not have access to KPI management.</p>
      </div>
    );
  }

  const unsetCount = members.filter((m) => !m.kpi).length;

  return (
    <div className="space-y-6 pb-10">
      <DashboardPageHeader
        title="KPI Management"
        subTitle="Set monthly targets for the sales and marketing team and follow their progress."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <KpiMonthPicker value={month} onChange={setMonth} />
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setFormState({ kind: "individual", editing: null })}>
            <Plus className="mr-2 h-4 w-4" />
            Add KPI
          </Button>
        </div>
      </div>

      <TeamKpiCard
        month={month}
        isAdmin={isAdmin}
        progress={progress}
        progressLoading={progressQuery.isLoading}
        progressError={progressQuery.isError}
        context={contextQuery.data?.data}
        contextLoading={contextQuery.isLoading}
        contextError={contextQuery.isError}
        onCreate={() => setFormState({ kind: "team", editing: null })}
        onEdit={() => {
          const team = contextQuery.data?.data.team;
          if (team) setFormState({ kind: "team", editing: { _id: team._id } });
        }}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
            <div>
              <h2 className="text-base font-semibold">Team members</h2>
              <p className="text-xs text-muted-foreground">
                {formatMonthLabel(month)}
                {progress && unsetCount > 0 ? ` · ${unsetCount} without a KPI` : ""}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <KpiTable
              members={members}
              reports={reportsQuery.data?.data.people}
              reportsError={reportsQuery.isError}
              isLoading={progressQuery.isLoading}
              isError={progressQuery.isError}
              onRetry={() => progressQuery.refetch()}
              isAdmin={isAdmin}
              canManageRow={(m) => canManageMemberKpi(user, m.user)}
              onSetKpi={(userId) => setFormState({ kind: "individual", editing: null, presetUserId: userId })}
              onEdit={(m) =>
                m.kpi && setFormState({ kind: "individual", editing: { _id: m.kpi._id, userId: m.user._id } })
              }
              onView={(m) => m.kpi && setViewing({ _id: m.kpi._id, userId: m.user._id })}
              onViewProjects={(m) => setBreakdownFor(m.user)}
            />
          </div>
        </CardContent>
      </Card>

      {formState && (
        <KpiFormDialog
          open
          onOpenChange={(open) => !open && setFormState(null)}
          month={month}
          kind={formState.kind}
          editing={formState.editing}
          presetUserId={formState.presetUserId}
          takenUserIds={takenUserIds}
        />
      )}

      {viewing && (
        <KpiViewDialog
          open
          onOpenChange={(open) => !open && setViewing(null)}
          month={month}
          kpi={viewing}
        />
      )}

      {isAdmin && (
        <KpiProjectBreakdownDialog
          open={Boolean(breakdownFor)}
          onOpenChange={(open) => !open && setBreakdownFor(null)}
          month={month}
          userId={breakdownFor?._id}
          userName={breakdownFor ? getMemberName(breakdownFor) : undefined}
        />
      )}
    </div>
  );
}
