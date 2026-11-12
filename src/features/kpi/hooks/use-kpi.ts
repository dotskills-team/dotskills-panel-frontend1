"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { kpiApi } from "../api/kpi.api";
import type {
  CreateKpiPayload,
  KpiListQuery,
  KpiReportListQuery,
  KpiReportContentPayload,
  KpiStatus,
  UpdateKpiPayload,
} from "@/types/kpi.types";

export const kpiKeys = {
  all: ["kpi"] as const,
  list: (q: KpiListQuery) => [...kpiKeys.all, "list", q] as const,
  progress: (month: string) => [...kpiKeys.all, "progress", month] as const,
  teamContext: (month: string) => [...kpiKeys.all, "team-context", month] as const,
  teamMembers: () => [...kpiKeys.all, "team-members"] as const,
  reportSummary: (month: string) => [...kpiKeys.all, "report-summary", month] as const,
  reports: (q: KpiReportListQuery) => [...kpiKeys.all, "reports", q] as const,
  mine: (month: string) => [...kpiKeys.all, "mine", month] as const,
  myReport: (month: string) => [...kpiKeys.all, "my-report", month] as const,
  breakdown: (month: string, userId?: string) =>
    [...kpiKeys.all, "breakdown", month, userId ?? "all"] as const,
};

interface QueryOptions {
  enabled?: boolean;
}

export function useKpiProgress(month: string, options?: QueryOptions) {
  return useQuery({
    queryKey: kpiKeys.progress(month),
    queryFn: () => kpiApi.progress(month),
    enabled: options?.enabled ?? true,
    placeholderData: (prev) => prev,
  });
}

export function useKpiList(query: KpiListQuery, options?: QueryOptions) {
  return useQuery({
    queryKey: kpiKeys.list(query),
    queryFn: () => kpiApi.list(query),
    enabled: options?.enabled ?? true,
    placeholderData: (prev) => prev,
  });
}

export function useKpiTeamContext(month: string, options?: QueryOptions) {
  return useQuery({
    queryKey: kpiKeys.teamContext(month),
    queryFn: () => kpiApi.teamContext(month),
    enabled: options?.enabled ?? true,
    placeholderData: (prev) => prev,
  });
}

export function useKpiTeamMembers(options?: QueryOptions) {
  return useQuery({
    queryKey: kpiKeys.teamMembers(),
    queryFn: () => kpiApi.teamMembers(),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useKpiReportSummary(month: string, options?: QueryOptions) {
  return useQuery({
    queryKey: kpiKeys.reportSummary(month),
    queryFn: () => kpiApi.reportSummary(month),
    enabled: options?.enabled ?? true,
    placeholderData: (prev) => prev,
  });
}

/** Reports waiting for (or past) review. Scoping to the caller's role is done by the server. */
export function useKpiReports(query: KpiReportListQuery, options?: QueryOptions) {
  return useQuery({
    queryKey: kpiKeys.reports(query),
    queryFn: () => kpiApi.reports(query),
    enabled: options?.enabled ?? true,
    placeholderData: (prev) => prev,
  });
}

/** The caller's own KPI, achievement, team totals and credited projects. */
export function useMyKpiProgress(month: string, options?: QueryOptions) {
  return useQuery({
    queryKey: kpiKeys.mine(month),
    queryFn: () => kpiApi.myProgress(month),
    enabled: options?.enabled ?? true,
  });
}

/** The caller's monthly report. Enable it only when an active or closed KPI exists. */
export function useMyKpiReport(month: string, options?: QueryOptions) {
  return useQuery({
    queryKey: kpiKeys.myReport(month),
    queryFn: () => kpiApi.myReport(month),
    enabled: options?.enabled ?? true,
    retry: false,
  });
}

/** Admin only. Values are fetched only while the breakdown dialog is open. */
export function useKpiProjectBreakdown(month: string, userId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: kpiKeys.breakdown(month, userId),
    queryFn: () => kpiApi.projectBreakdown(month, userId),
    enabled,
  });
}

// Any KPI change moves the table, the team card, the sums and the report summary, so refresh all of it.
function useInvalidateKpi() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: kpiKeys.all });
}

export function useCreateKpi() {
  const invalidate = useInvalidateKpi();
  return useMutation({
    mutationFn: (payload: CreateKpiPayload) => kpiApi.create(payload),
    onSuccess: invalidate,
  });
}


export function useUpdateKpi() {
  const invalidate = useInvalidateKpi();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateKpiPayload }) =>
      kpiApi.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteKpi() {
  const invalidate = useInvalidateKpi();
  return useMutation({
    mutationFn: (id: string) => kpiApi.remove(id),
    onSuccess: invalidate,
  });
}

export function useUpdateKpiStatus() {
  const invalidate = useInvalidateKpi();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Exclude<KpiStatus, "draft"> }) =>
      kpiApi.updateStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useSaveReportDraft() {
  const invalidate = useInvalidateKpi();
  return useMutation({
    mutationFn: ({ month, payload }: { month: string; payload: KpiReportContentPayload }) =>
      kpiApi.saveReportDraft(month, payload),
    onSuccess: invalidate,
  });
}

export function useSubmitKpiReport() {
  const invalidate = useInvalidateKpi();
  return useMutation({
    mutationFn: ({ month, payload }: { month: string; payload: KpiReportContentPayload }) =>
      kpiApi.submitReport(month, payload),
    onSuccess: invalidate,
  });
}

export function useReviewKpiReport() {
  const invalidate = useInvalidateKpi();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) => kpiApi.reviewReport(id, comment),
    onSuccess: invalidate,
  });
}

export function useReturnKpiReport() {
  const invalidate = useInvalidateKpi();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) => kpiApi.returnReport(id, comment),
    onSuccess: invalidate,
  });
}
