"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addTargetLog,
  createDomain,
  createHosting,
  deleteTarget,
  getDashboardSummary,
  getNotifications,
  getProjectOptions,
  getTargetLogs,
  getTargets,
  getTarget,
  markNotificationRead,
  renewTarget,
  revealCredential,
  updateDomain,
  updateHosting,
} from "../api/domain-hosting.api";
import { domainHostingKeys } from "../api/domain-hosting.keys";
import type {
  DomainHostingFilters,
  LogPayload,
  RenewPayload,
  TargetType,
} from "@/types/domain-hosting.types";

/* ---------------------------------- Queries -------------------------------- */

export function useDomainHostingSummary() {
  return useQuery({
    queryKey: domainHostingKeys.summary(),
    queryFn: getDashboardSummary,
    placeholderData: (previousData) => previousData,
  });
}

export function useDomainHostingList(type: TargetType, filters: DomainHostingFilters) {
  return useQuery({
    queryKey: domainHostingKeys.list(type, filters),
    queryFn: () => getTargets(type, filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useDomainHostingDetail(type: TargetType, id?: string | null) {
  return useQuery({
    queryKey: domainHostingKeys.detail(type, id ?? ""),
    queryFn: () => getTarget(type, id as string),
    enabled: Boolean(id),
  });
}

export function useRenewalLogs(type: TargetType, id?: string | null) {
  return useQuery({
    queryKey: domainHostingKeys.logs(type, id ?? ""),
    queryFn: () => getTargetLogs(type, id as string),
    enabled: Boolean(id),
  });
}

export function useProjectOptions(enabled = true, role?: string) {
  return useQuery({
    queryKey: domainHostingKeys.projectOptions(),
    queryFn: () => getProjectOptions(role),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useReminderNotifications(enabled = true) {
  return useQuery({
    queryKey: domainHostingKeys.notifications(),
    queryFn: getNotifications,
    enabled,
    refetchInterval: 1000 * 60 * 5,
  });
}

/* -------------------------------- Mutations -------------------------------- */

/** Every write refreshes the whole module (summary, lists, detail, logs, reminders). */
function useInvalidateDomainHosting() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: domainHostingKeys.all });
}

export function useCreateDomain() {
  const invalidate = useInvalidateDomainHosting();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => createDomain(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateDomain() {
  const invalidate = useInvalidateDomainHosting();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      updateDomain(id, payload),
    onSuccess: invalidate,
  });
}

export function useCreateHosting() {
  const invalidate = useInvalidateDomainHosting();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => createHosting(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateHosting() {
  const invalidate = useInvalidateDomainHosting();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      updateHosting(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteTarget() {
  const invalidate = useInvalidateDomainHosting();
  return useMutation({
    mutationFn: ({ type, id }: { type: TargetType; id: string }) => deleteTarget(type, id),
    onSuccess: invalidate,
  });
}

export function useRenewTarget() {
  const invalidate = useInvalidateDomainHosting();
  return useMutation({
    mutationFn: ({ type, id, payload }: { type: TargetType; id: string; payload: RenewPayload }) =>
      renewTarget(type, id, payload),
    onSuccess: invalidate,
  });
}

export function useAddTargetLog() {
  const invalidate = useInvalidateDomainHosting();
  return useMutation({
    mutationFn: ({ type, id, payload }: { type: TargetType; id: string; payload: LogPayload }) =>
      addTargetLog(type, id, payload),
    onSuccess: invalidate,
  });
}

/** Not cached on purpose: each reveal is a fresh, audited server call. */
export function useRevealCredential() {
  return useMutation({
    mutationFn: ({ type, id, credentialId }: { type: TargetType; id: string; credentialId?: string }) =>
      revealCredential(type, id, credentialId),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: domainHostingKeys.notifications() });
    },
  });
}
