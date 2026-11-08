import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types";
import type {
  IAttendance,
  IAttendanceMonth,
  IAttendanceSummary,
  IAttendanceToday,
} from "@/types/attendance.types";
import type { AttendanceListQuery } from "../schemas/attendance.schema";

const BASE_URL = "/attendance";

const buildQuery = (params: object = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, String(v));
  });
  const q = sp.toString();
  return q ? `?${q}` : "";
};

export interface AttendanceWritePayload {
  checkIn?: string;
  checkOut?: string | null;
  breaks?: { start: string; end: string | null }[];
  editReason: string;
}

export interface AttendanceCreatePayload extends AttendanceWritePayload {
  userId: string;
  date: string;
  checkIn: string;
}

export const attendanceApi = {
  checkIn: () => apiClient.post<ApiResponse<IAttendance>>(`${BASE_URL}/check-in`),
  checkOut: () => apiClient.post<ApiResponse<IAttendance>>(`${BASE_URL}/check-out`),
  startBreak: () => apiClient.post<ApiResponse<IAttendance>>(`${BASE_URL}/break/start`),
  endBreak: () => apiClient.post<ApiResponse<IAttendance>>(`${BASE_URL}/break/end`),

  today: () => apiClient.get<ApiResponse<IAttendanceToday>>(`${BASE_URL}/me/today`),
  myMonth: (month: string) =>
    apiClient.get<ApiResponse<IAttendanceMonth>>(`${BASE_URL}/me${buildQuery({ month })}`),

  list: (q?: AttendanceListQuery) =>
    apiClient.get<ApiResponse<IAttendance[]>>(`${BASE_URL}${buildQuery(q)}`),
  summary: (month: string) =>
    apiClient.get<ApiResponse<IAttendanceSummary>>(`${BASE_URL}/summary${buildQuery({ month })}`),
  update: (id: string, payload: AttendanceWritePayload) =>
    apiClient.patch<ApiResponse<IAttendance>>(`${BASE_URL}/${id}`, payload),
  create: (payload: AttendanceCreatePayload) =>
    apiClient.post<ApiResponse<IAttendance>>(BASE_URL, payload),
};
