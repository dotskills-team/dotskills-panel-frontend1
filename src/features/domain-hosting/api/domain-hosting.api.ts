import api from "@/lib/axios";
import type {
  DashboardSummary,
  DomainRecord,
  DomainHostingFilters,
  HostingRecord,
  ListMeta,
  LogPayload,
  NotificationsResponse,
  ProjectOption,
  RenewalLogRecord,
  RenewPayload,
  TargetRecord,
  TargetType,
} from "@/types/domain-hosting.types";
import { TARGET_PATH } from "../constants/domain-hosting.constant";

const BASE_URL = "/domain-hosting";

/** Standard response envelope used by the backend. */
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ListMeta;
}

const cleanParams = (params: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

/* ------------------------------- Overview ---------------------------------- */

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await api.get<ApiEnvelope<DashboardSummary>>(`${BASE_URL}/dashboard-summary`);
  return data.data;
}

/* ----------------------------- Lists and detail ---------------------------- */

export async function getTargets(
  type: TargetType,
  filters: DomainHostingFilters,
): Promise<{ data: TargetRecord[]; meta: ListMeta }> {
  const { data } = await api.get<ApiEnvelope<TargetRecord[]>>(
    `${BASE_URL}/${TARGET_PATH[type]}`,
    { params: cleanParams(filters as Record<string, unknown>) },
  );
  return { data: data.data, meta: data.meta as ListMeta };
}

export async function getTarget(type: TargetType, id: string): Promise<TargetRecord> {
  const { data } = await api.get<ApiEnvelope<TargetRecord>>(`${BASE_URL}/${TARGET_PATH[type]}/${id}`);
  return data.data;
}

/* ---------------------------- Create / update / delete --------------------- */

export async function createDomain(payload: Record<string, unknown>): Promise<DomainRecord> {
  const { data } = await api.post<ApiEnvelope<DomainRecord>>(`${BASE_URL}/domains`, payload);
  return data.data;
}

export async function updateDomain(id: string, payload: Record<string, unknown>): Promise<DomainRecord> {
  const { data } = await api.patch<ApiEnvelope<DomainRecord>>(`${BASE_URL}/domains/${id}`, payload);
  return data.data;
}

export async function createHosting(payload: Record<string, unknown>): Promise<HostingRecord> {
  const { data } = await api.post<ApiEnvelope<HostingRecord>>(`${BASE_URL}/hosting`, payload);
  return data.data;
}

export async function updateHosting(id: string, payload: Record<string, unknown>): Promise<HostingRecord> {
  const { data } = await api.patch<ApiEnvelope<HostingRecord>>(`${BASE_URL}/hosting/${id}`, payload);
  return data.data;
}

export async function deleteTarget(type: TargetType, id: string): Promise<void> {
  await api.delete(`${BASE_URL}/${TARGET_PATH[type]}/${id}`);
}

/* ------------------------------ Renewal and logs --------------------------- */

export async function renewTarget(
  type: TargetType,
  id: string,
  payload: RenewPayload,
): Promise<TargetRecord> {
  const { data } = await api.post<ApiEnvelope<TargetRecord>>(
    `${BASE_URL}/${TARGET_PATH[type]}/${id}/renew`,
    payload,
  );
  return data.data;
}

export async function getTargetLogs(type: TargetType, id: string): Promise<RenewalLogRecord[]> {
  const { data } = await api.get<ApiEnvelope<RenewalLogRecord[]>>(
    `${BASE_URL}/${TARGET_PATH[type]}/${id}/logs`,
  );
  return data.data;
}

export async function addTargetLog(
  type: TargetType,
  id: string,
  payload: LogPayload,
): Promise<RenewalLogRecord> {
  const { data } = await api.post<ApiEnvelope<RenewalLogRecord>>(
    `${BASE_URL}/${TARGET_PATH[type]}/${id}/logs`,
    payload,
  );
  return data.data;
}

/* -------------------------------- Credentials ------------------------------ */

/** Asks the server to decrypt one password. The result is never cached. */
export async function revealCredential(
  type: TargetType,
  id: string,
  credentialId?: string,
): Promise<{ password: string }> {
  const { data } = await api.post<ApiEnvelope<{ password: string }>>(
    `${BASE_URL}/${TARGET_PATH[type]}/${id}/reveal-credential`,
    credentialId ? { credentialId } : {},
  );
  return data.data;
}

/* ------------------------------ Notifications ------------------------------ */

export async function getNotifications(): Promise<NotificationsResponse> {
  const { data } = await api.get<ApiEnvelope<NotificationsResponse>>(`${BASE_URL}/notifications`);
  return data.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`${BASE_URL}/notifications/${id}/read`);
}

/* -------------------------------- Projects --------------------------------- */

/**
 * Project list for the form dropdown.
 * Developers only get their own assigned projects (the all-projects endpoint is
 * forbidden for them), so they read /projects/my-projects instead.
 */
export async function getProjectOptions(role?: string): Promise<ProjectOption[]> {
  if (role === "DEVELOPER") {
    const { data } = await api.get<ApiEnvelope<ProjectOption[]>>("/projects/my-projects", {
      params: { limit: 500 },
    });
    return data.data;
  }

  const { data } = await api.get<ApiEnvelope<ProjectOption[]>>("/projects", {
    params: { fields: "name", limit: 500, sort: "name" },
  });
  return data.data;
}
