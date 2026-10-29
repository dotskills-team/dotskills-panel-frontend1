"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { leadApi } from "../api/lead.api";
import { leadKeys } from "../api/lead.keys";
import type { LeadFilters } from "@/types/lead";

interface UseLeadQueryOptions {
  enabled?: boolean;
}

export const useLeads = (
  filters?: LeadFilters,
  options?: UseLeadQueryOptions,
) => {
  return useQuery({
    queryKey: leadKeys.list(filters as Record<string, unknown>),
    queryFn: () => leadApi.getLeads(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled,
  });
};

export const useDeletedLeads = (
  filters?: LeadFilters,
  options?: UseLeadQueryOptions,
) => {
  return useQuery({
    queryKey: leadKeys.deletedList(filters as Record<string, unknown>),
    queryFn: () => leadApi.getDeletedLeads(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled,
  });
};

export const useLead = (id?: string, options?: UseLeadQueryOptions) => {
  return useQuery({
    queryKey: leadKeys.detail(id ?? ""),
    queryFn: () => leadApi.getLead(id!),
    enabled: Boolean(id) && options?.enabled !== false,
    staleTime: 1000 * 60 * 5,
  });
};
