import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types";
import type {
  CreateKpiPayload,
  IKpi,
  IKpiReport,
  KpiListQuery,
  KpiMyProgress,
  KpiMyReport,
  KpiProgress,
  KpiReportListQuery,
  KpiReportRecord,
  KpiReportContentPayload,
  KpiProjectBreakdown,
  KpiReportSummary,
  KpiStatus,
  KpiTeamContext,
  KpiUserRef,
  UpdateKpiPayload,
} from "@/types/kpi.types";

const BASE_URL = "/kpis";

const buildQuery = (params: object = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, String(v));
  });
  const q = sp.toString();
  return q ? `?${q}` : "";
};

export const kpiApi = {
  list: (query?: KpiListQuery) =>
    apiClient.get<ApiResponse<IKpi[]>>(`${BASE_URL}${buildQuery(query)}`),

  /** Every team member's KPI against achievement, plus the team KPI. Totals only. */
  progress: (month: string) =>
    apiClient.get<ApiResponse<KpiProgress>>(`${BASE_URL}/progress${buildQuery({ month })}`),

  /** Admin only: the team KPI and the sum of individual targets. */
  teamContext: (month: string) =>
    apiClient.get<ApiResponse<KpiTeamContext>>(`${BASE_URL}/team/context${buildQuery({ month })}`),

  teamMembers: () => apiClient.get<ApiResponse<KpiUserRef[]>>(`${BASE_URL}/team-members`),

  create: (payload: CreateKpiPayload) => apiClient.post<ApiResponse<IKpi>>(BASE_URL, payload),


  update: (id: string, payload: UpdateKpiPayload) =>
    apiClient.patch<ApiResponse<IKpi>>(`${BASE_URL}/${id}`, payload),

  /** Admin only. Also removes the KPI's monthly report. */
  remove: (id: string) => apiClient.delete<ApiResponse<null>>(`${BASE_URL}/${id}`),

  updateStatus: (id: string, status: Exclude<KpiStatus, "draft">) =>
    apiClient.patch<ApiResponse<IKpi>>(`${BASE_URL}/${id}/status`, { status }),

  /** Admin only: per-project breakdown including each project's value. */
  projectBreakdown: (month: string, userId?: string) =>
    apiClient.get<ApiResponse<KpiProjectBreakdown>>(
      `${BASE_URL}/progress/projects${buildQuery({ month, userId })}`,
    ),

  /** The caller's own KPI, achievement, team totals and credited projects (no values). */
  myProgress: (month: string) =>
    apiClient.get<ApiResponse<KpiMyProgress>>(`${BASE_URL}/me/progress${buildQuery({ month })}`),

  /** The caller's monthly report. Responds 404 when there is no active KPI for the month. */
  myReport: (month: string) =>
    apiClient.get<ApiResponse<KpiMyReport>>(`/kpi-reports/me${buildQuery({ month })}`),

  saveReportDraft: (month: string, payload: KpiReportContentPayload) =>
    apiClient.put<ApiResponse<IKpiReport>>(`/kpi-reports/me/${month}`, payload),

  submitReport: (month: string, payload: KpiReportContentPayload) =>
    apiClient.post<ApiResponse<IKpiReport>>(`/kpi-reports/me/${month}/submit`, payload),

  /** Reports for review. The lead only gets regular members' reports; admins get everyone's. */
  reports: (query?: KpiReportListQuery) =>
    apiClient.get<ApiResponse<KpiReportRecord[]>>(`/kpi-reports${buildQuery(query)}`),

  reviewReport: (id: string, comment?: string) =>
    apiClient.post<ApiResponse<KpiReportRecord>>(`/kpi-reports/${id}/review`, { comment }),

  returnReport: (id: string, comment: string) =>
    apiClient.post<ApiResponse<KpiReportRecord>>(`/kpi-reports/${id}/return`, { comment }),

  /** Whether each person's monthly report is submitted (admin and lead). */
  reportSummary: (month: string) =>
    apiClient.get<ApiResponse<KpiReportSummary>>(`/kpi-reports/summary${buildQuery({ month })}`),
};
