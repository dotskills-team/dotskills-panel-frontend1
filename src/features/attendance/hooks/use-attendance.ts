"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  attendanceApi,
  type AttendanceCreatePayload,
  type AttendanceWritePayload,
} from "../api/attendance.api";
import type { AttendanceListQuery } from "../schemas/attendance.schema";

export const attendanceKeys = {
  all: ["attendance"] as const,
  today: () => [...attendanceKeys.all, "today"] as const,
  month: (month: string) => [...attendanceKeys.all, "month", month] as const,
  list: (q: AttendanceListQuery) => [...attendanceKeys.all, "list", q] as const,
  summary: (month: string) => [...attendanceKeys.all, "summary", month] as const,
};

/**
 * Today's record. `clockOffsetMs` is (server clock - browser clock) at response time,
 * so the live timer follows the server's time, not the device's.
 */
export function useAttendanceToday() {
  return useQuery({
    queryKey: attendanceKeys.today(),
    queryFn: async () => {
      const res = await attendanceApi.today();
      return { ...res, clockOffsetMs: Date.parse(res.data.serverTime) - Date.now() };
    },
  });
}

export function useMyAttendanceMonth(month: string) {
  return useQuery({
    queryKey: attendanceKeys.month(month),
    queryFn: () => attendanceApi.myMonth(month),
    placeholderData: (prev) => prev,
  });
}

export function useAttendanceList(query: AttendanceListQuery, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: attendanceKeys.list(query),
    queryFn: () => attendanceApi.list(query),
    enabled: options?.enabled ?? true,
    placeholderData: (prev) => prev,
  });
}

export function useAttendanceSummary(month: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: attendanceKeys.summary(month),
    queryFn: () => attendanceApi.summary(month),
    enabled: options?.enabled ?? true,
    placeholderData: (prev) => prev,
  });
}

// Every action changes today's card, the monthly table and the admin views, so refresh all of them.
function useInvalidateAttendance() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: attendanceKeys.all });
}

export function useCheckIn() {
  const invalidate = useInvalidateAttendance();
  return useMutation({ mutationFn: () => attendanceApi.checkIn(), onSuccess: invalidate });
}

export function useCheckOut() {
  const invalidate = useInvalidateAttendance();
  return useMutation({ mutationFn: () => attendanceApi.checkOut(), onSuccess: invalidate });
}

export function useStartBreak() {
  const invalidate = useInvalidateAttendance();
  return useMutation({ mutationFn: () => attendanceApi.startBreak(), onSuccess: invalidate });
}

export function useEndBreak() {
  const invalidate = useInvalidateAttendance();
  return useMutation({ mutationFn: () => attendanceApi.endBreak(), onSuccess: invalidate });
}

export function useUpdateAttendance() {
  const invalidate = useInvalidateAttendance();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AttendanceWritePayload }) =>
      attendanceApi.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useCreateAttendance() {
  const invalidate = useInvalidateAttendance();
  return useMutation({
    mutationFn: (payload: AttendanceCreatePayload) => attendanceApi.create(payload),
    onSuccess: invalidate,
  });
}
