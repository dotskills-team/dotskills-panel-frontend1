"use client";

import { useState, useCallback } from "react";
import type { GetUsersParams } from "../api/user.api";

interface UserFiltersState {
  searchTerm: string;
  role?: string;
  status?: string;
  department?: string;
  designation?: string;
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
}

const DEFAULT_FILTERS: UserFiltersState = {
  searchTerm: "",
  page: 1,
  limit: 10,
};

export const useUserFilters = () => {
  const [filters, setFilters] = useState<UserFiltersState>(DEFAULT_FILTERS);

  const updateFilters = useCallback(
    (updates: Partial<UserFiltersState>) => {
      setFilters((prev) => ({
        ...prev,
        ...updates,
        page: updates.page ?? (updates.searchTerm || Object.keys(updates).length > 1 ? 1 : prev.page),
      }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const setSearch = useCallback((searchTerm: string) => {
    updateFilters({ searchTerm, page: 1 });
  }, [updateFilters]);

  const setRole = useCallback((role?: string) => {
    updateFilters({ role, page: 1 });
  }, [updateFilters]);

  const setStatus = useCallback((status?: string) => {
    updateFilters({ status, page: 1 });
  }, [updateFilters]);

  const setDepartment = useCallback((department?: string) => {
    updateFilters({ department, page: 1 });
  }, [updateFilters]);

  const setDesignation = useCallback((designation?: string) => {
    updateFilters({ designation, page: 1 });
  }, [updateFilters]);

  const setVerified = useCallback((isVerified?: boolean) => {
    updateFilters({ isVerified, page: 1 });
  }, [updateFilters]);

  const setSorting = useCallback(
    (sortBy?: string, sortOrder?: "asc" | "desc") => {
      updateFilters({ sortBy, sortOrder });
    },
    [updateFilters],
  );

  const setPage = useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  const setLimit = useCallback((limit: number) => {
    updateFilters({ limit, page: 1 });
  }, [updateFilters]);

  const getQueryParams = useCallback((): GetUsersParams => {
    const params: GetUsersParams = {
      page: filters.page,
      limit: filters.limit,
    };

    if (filters.searchTerm) params.searchTerm = filters.searchTerm;
    if (filters.role) params.role = filters.role;
    if (filters.status) params.status = filters.status;
    if (filters.department) params.department = filters.department;
    if (filters.designation) params.designation = filters.designation;
    if (filters.isVerified !== undefined) params.isVerified = filters.isVerified;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    return params;
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    setSearch,
    setRole,
    setStatus,
    setDepartment,
    setDesignation,
    setVerified,
    setSorting,
    setPage,
    setLimit,
    getQueryParams,
  };
};
