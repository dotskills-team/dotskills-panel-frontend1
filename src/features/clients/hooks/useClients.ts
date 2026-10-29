"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { clientApi } from "../api/client.api";
import { clientKeys } from "../api/client.keys";

import type { ClientFilters, IClientStats } from "@/types/clients";

interface UseClientQueryOptions {
  enabled?: boolean;
}

const EMPTY_STATS: IClientStats = {
  total: 0,
  Active: 0,
  Inactive: 0,
  Suspended: 0,
  Blacklisted: 0,
  totalProjects: 0,
  completedProjects: 0,
  activeProjects: 0,
  totalRevenue: 0,
  totalInvoices: 0,
  totalPaid: 0,
  totalDue: 0,
};

export const useClients = (
  filters?: ClientFilters,
  options?: UseClientQueryOptions,
) => {
  return useQuery({
    queryKey: clientKeys.list(filters as Record<string, unknown>),
    queryFn: () => clientApi.getClients(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled,
  });
};

export const useDeletedClients = (
  filters?: ClientFilters,
  options?: UseClientQueryOptions,
) => {
  return useQuery({
    queryKey: clientKeys.deletedList(filters as Record<string, unknown>),
    queryFn: () => clientApi.getDeletedClients(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled,
  });
};

// Reads `stats` from the same getClients response (same query key as
// useClients, so no extra request). Pass the same filters as useClients.
export const useClientStats = (
  filters?: ClientFilters,
  options?: UseClientQueryOptions,
) => {
  const query = useClients(filters, options);

  return {
    stats: query.data?.stats ?? EMPTY_STATS,
    isLoading: query.isLoading,
  };
};