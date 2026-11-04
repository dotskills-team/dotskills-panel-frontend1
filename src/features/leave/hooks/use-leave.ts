"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leaveApi, type ApprovePayload } from "../api/leave.api";
import type { LeaveListQuery, LeaveRequestFormValues } from "../schemas/leave.schema";

export const leaveKeys = {
  all: ["leave"] as const,
  requests: () => [...leaveKeys.all, "requests"] as const,
  list: (q: LeaveListQuery) => [...leaveKeys.requests(), "list", q] as const,
  detail: (id: string) => [...leaveKeys.requests(), "detail", id] as const,
  balance: (year?: number) => [...leaveKeys.all, "balance", year ?? "current"] as const,
  policy: () => [...leaveKeys.all, "policy"] as const,
};

export function useLeaveRequests(query: LeaveListQuery = {}, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: leaveKeys.list(query),
    queryFn: () => leaveApi.list(query),
    enabled: options?.enabled ?? true,
    placeholderData: (prev) => prev,
  });
}

export function useLeaveRequest(id?: string) {
  return useQuery({
    queryKey: leaveKeys.detail(id ?? ""),
    queryFn: () => leaveApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useMyLeaveBalance(year?: number) {
  return useQuery({ queryKey: leaveKeys.balance(year), queryFn: () => leaveApi.myBalance(year) });
}

export function useLeavePolicy() {
  return useQuery({
    queryKey: leaveKeys.policy(),
    queryFn: () => leaveApi.policy(),
    staleTime: 5 * 60 * 1000,
  });
}

/** Server-side dry run (day count + over-balance warning). Debounce `values` in the caller. */
export function useLeavePreview(values: LeaveRequestFormValues | null, enabled: boolean) {
  return useQuery({
    queryKey: [...leaveKeys.all, "preview", values],
    queryFn: () => leaveApi.preview(values as LeaveRequestFormValues),
    enabled: enabled && values !== null,
    retry: false,
  });
}

// Any change to a request moves balances and the approval lists, so refresh everything leave-related.
function useInvalidateLeave() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: leaveKeys.all });
}

export function useCreateLeaveRequest() {
  const invalidate = useInvalidateLeave();
  return useMutation({
    mutationFn: (payload: LeaveRequestFormValues) => leaveApi.create(payload),
    onSuccess: invalidate,
  });
}

export function useCancelLeaveRequest() {
  const invalidate = useInvalidateLeave();
  return useMutation({ mutationFn: (id: string) => leaveApi.cancel(id), onSuccess: invalidate });
}

export function useApproveLeaveRequest() {
  const invalidate = useInvalidateLeave();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApprovePayload }) =>
      leaveApi.approve(id, payload),
    onSuccess: invalidate,
  });
}

export function useRejectLeaveRequest() {
  const invalidate = useInvalidateLeave();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => leaveApi.reject(id, { reason }),
    onSuccess: invalidate,
  });
}

export function useRecommendLeaveRequest() {
  const invalidate = useInvalidateLeave();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => leaveApi.recommend(id, { note }),
    onSuccess: invalidate,
  });
}

export function useLeaveCalendar(from: string, to: string) {
  return useQuery({
    queryKey: [...leaveKeys.all, "calendar", from, to],
    queryFn: () => leaveApi.calendar(from, to),
    placeholderData: (prev) => prev,
  });
}

/** Approver warning: colleagues already on approved leave in the range. */
export function useLeaveConflicts(
  q: { from: string; to: string; department?: string; excludeRequestId?: string },
  enabled = true,
) {
  return useQuery({
    queryKey: [...leaveKeys.all, "conflicts", q],
    queryFn: () => leaveApi.conflicts(q),
    enabled,
    staleTime: 60_000,
  });
}

export function useLeaveDashboardSummary() {
  return useQuery({
    queryKey: [...leaveKeys.all, "dashboard-summary"],
    queryFn: () => leaveApi.dashboardSummary(),
  });
}

/* ------------------------- Phase 3: admin, reports ------------------------- */

export function useLeaveReport(year: number, month?: number, staff?: string) {
  return useQuery({
    queryKey: [...leaveKeys.all, "report", year, month ?? "year", staff ?? "all"],
    queryFn: () => leaveApi.report(year, month, staff),
    placeholderData: (prev) => prev,
  });
}

export function useLeaveAuditLogs(q: { page?: number; limit?: number; action?: string }) {
  return useQuery({
    queryKey: [...leaveKeys.all, "audit", q],
    queryFn: () => leaveApi.auditLogs(q),
    placeholderData: (prev) => prev,
  });
}

export function useStaffLeaveBalance(staffId?: string, year?: number) {
  return useQuery({
    queryKey: [...leaveKeys.all, "staff-balance", staffId, year ?? "current"],
    queryFn: () => leaveApi.staffBalance(staffId as string, year),
    enabled: Boolean(staffId),
  });
}

export function useUpdateLeavePolicy() {
  const invalidate = useInvalidateLeave();
  return useMutation({
    mutationFn: (payload: Parameters<typeof leaveApi.updatePolicy>[0]) => leaveApi.updatePolicy(payload),
    onSuccess: invalidate,
  });
}

export function useAdjustLeaveBalance() {
  const invalidate = useInvalidateLeave();
  return useMutation({
    mutationFn: ({ staffId, ...payload }: { staffId: string } & Parameters<typeof leaveApi.adjustBalance>[1]) =>
      leaveApi.adjustBalance(staffId, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateLeaveRequest() {
  const invalidate = useInvalidateLeave();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      leaveApi.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useCreateLeaveForStaff() {
  const invalidate = useInvalidateLeave();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => leaveApi.createForStaff(payload),
    onSuccess: invalidate,
  });
}
