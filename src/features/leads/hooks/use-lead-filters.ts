"use client";

import { useCallback, useMemo, useState } from "react";

import { DEFAULT_PAGE_SIZE } from "../constants/lead.constant";
import { buildLeadQuery } from "../utils/lead.utils";
import type { LeadFilters } from "@/types/lead";

const INITIAL_FILTERS: LeadFilters = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  sort: "-createdAt",
  searchTerm: "",
};

export const useLeadFilters = () => {
  const [filters, setFilters] = useState<LeadFilters>(INITIAL_FILTERS);

  const updateFilters = useCallback((patch: Partial<LeadFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...patch,
      // Any filter change other than pagination resets to page 1
      page: patch.page ?? 1,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const setSearchTerm = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm, page: 1 }));
  }, []);

  const setSort = useCallback((sort: string) => {
    setFilters((prev) => ({ ...prev, sort }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const queryFilters = useMemo(
    () => buildLeadQuery(filters as Record<string, unknown>) as LeadFilters,
    [filters],
  );

  const activeFilterCount = useMemo(() => {
    const { page, limit, sort, searchTerm, ...rest } = filters;
    void page;
    void limit;
    void sort;
    void searchTerm;
    return Object.values(rest).filter(
      (value) => value !== undefined && value !== "",
    ).length;
  }, [filters]);

  return {
    filters,
    queryFilters,
    updateFilters,
    setPage,
    setLimit,
    setSearchTerm,
    setSort,
    resetFilters,
    activeFilterCount,
  };
};
