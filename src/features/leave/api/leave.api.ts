import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types";
import type {
  ILeaveBalance,
  ILeaveCalendar,
  ILeaveConflicts,
  ILeaveAuditLog,
  ILeaveDashboardSummary,
  ILeaveReport,
  ILeavePolicy,
  ILeavePreview,
  ILeaveRequest,
} from "@/types/leave.types";
import type { LeaveListQuery, LeaveRequestFormValues } from "../schemas/leave.schema";

const BASE_URL = "/leave";

const buildQuery = (params: object = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, String(v));
  });
  const q = sp.toString();
  return q ? `?${q}` : "";
};

export interface ApprovePayload {
  note?: string;
  extraLeaveType?: "unpaid" | "advance" | "waived";
  extraApprovalNote?: string;
}

export const leaveApi = {
  list: (q?: LeaveListQuery) =>
    apiClient.get<ApiResponse<ILeaveRequest[]>>(`${BASE_URL}/requests${buildQuery(q)}`),
  getById: (id: string) => apiClient.get<ApiResponse<ILeaveRequest>>(`${BASE_URL}/requests/${id}`),
  preview: (payload: LeaveRequestFormValues) =>
    apiClient.post<ApiResponse<ILeavePreview>>(`${BASE_URL}/requests/preview`, payload),
  create: (payload: LeaveRequestFormValues) =>
    apiClient.post<ApiResponse<ILeaveRequest>>(`${BASE_URL}/requests`, payload),
  cancel: (id: string) =>
    apiClient.patch<ApiResponse<ILeaveRequest>>(`${BASE_URL}/requests/${id}/cancel`),
  approve: (id: string, payload: ApprovePayload) =>
    apiClient.patch<ApiResponse<ILeaveRequest>>(`${BASE_URL}/requests/${id}/approve`, payload),
  reject: (id: string, payload: { reason: string }) =>
    apiClient.patch<ApiResponse<ILeaveRequest>>(`${BASE_URL}/requests/${id}/reject`, payload),
  recommend: (id: string, payload: { note: string }) =>
    apiClient.post<ApiResponse<ILeaveRequest>>(`${BASE_URL}/requests/${id}/recommend`, payload),
  myBalance: (year?: number) =>
    apiClient.get<ApiResponse<ILeaveBalance>>(`${BASE_URL}/balance/me${buildQuery({ year })}`),
  policy: () => apiClient.get<ApiResponse<ILeavePolicy>>(`${BASE_URL}/policy`),
  calendar: (from: string, to: string) =>
    apiClient.get<ApiResponse<ILeaveCalendar>>(`${BASE_URL}/calendar${buildQuery({ from, to })}`),
  conflicts: (q: { from: string; to: string; department?: string; excludeRequestId?: string }) =>
    apiClient.get<ApiResponse<ILeaveConflicts>>(`${BASE_URL}/conflicts${buildQuery(q)}`),
  dashboardSummary: () =>
    apiClient.get<ApiResponse<ILeaveDashboardSummary>>(`${BASE_URL}/dashboard-summary`),
  staffBalance: (staffId: string, year?: number) =>
    apiClient.get<ApiResponse<ILeaveBalance>>(`${BASE_URL}/balance/${staffId}${buildQuery({ year })}`),
  adjustBalance: (
    staffId: string,
    payload: { year?: number; field: "totalQuota" | "carriedForward"; amount: number; reason: string },
  ) => apiClient.post<ApiResponse<ILeaveBalance>>(`${BASE_URL}/balance/${staffId}/adjust`, payload),
  updatePolicy: (payload: Partial<ILeavePolicy>) =>
    apiClient.put<ApiResponse<ILeavePolicy>>(`${BASE_URL}/policy`, payload),
  update: (id: string, payload: Record<string, unknown>) =>
    apiClient.patch<ApiResponse<ILeaveRequest>>(`${BASE_URL}/requests/${id}`, payload),
  createForStaff: (payload: Record<string, unknown>) =>
    apiClient.post<ApiResponse<ILeaveRequest>>(`${BASE_URL}/admin/create-for-staff`, payload),
  report: (year: number, month?: number, staff?: string) =>
    apiClient.get<ApiResponse<ILeaveReport>>(`${BASE_URL}/reports${buildQuery({ year, month, staff })}`),
  /** Downloads the report as a file; returns the Blob for the caller to save. */
  exportReport: (year: number, month: number | undefined, format: "xlsx" | "pdf", staff?: string) =>
    apiClient.get<Blob>(`${BASE_URL}/reports/export${buildQuery({ year, month, format, staff })}`, {
      responseType: "blob",
    }),
  auditLogs: (q: { page?: number; limit?: number; action?: string; staff?: string }) =>
    apiClient.get<ApiResponse<ILeaveAuditLog[]>>(`${BASE_URL}/audit-logs${buildQuery(q)}`),
  uploadAttachment: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<ApiResponse<{ url: string; name: string }>>(`${BASE_URL}/attachments`, form);
  },
};

export default leaveApi;
