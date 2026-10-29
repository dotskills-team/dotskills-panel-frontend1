"use client";

import { useCallback, useMemo, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "../constants/project.constants";
import { ProjectFilters } from "@/types/project.types";
import { buildProjectQuery } from "../utils/project.utils";

const INITIAL_FILTERS: ProjectFilters = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  sort: "-startDate",
  searchTerm: "",
};

export const useProjectFilters = () => {
  const [filters, setFilters] =
    useState<ProjectFilters>(INITIAL_FILTERS);

  const updateFilters = useCallback(
    (patch: Partial<ProjectFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...patch,
        // Any filter change other than pagination resets to page 1
        page: patch.page ?? 1,
      }));
    },
    [],
  );

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setFilters((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  }, []);

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      setFilters((prev) => ({
        ...prev,
        searchTerm,
        page: 1,
      }));
    },
    [],
  );

  const setSort = useCallback((sort: string) => {
    setFilters((prev) => ({
      ...prev,
      sort,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const queryFilters = useMemo(
    () =>
      buildProjectQuery(
        filters as Record<string, unknown>,
      ) as ProjectFilters,
    [filters],
  );

  const activeFilterCount = useMemo(() => {
    const {
      page,
      limit,
      sort,
      searchTerm,
      ...rest
    } = filters;

    void page;
    void limit;
    void sort;
    void searchTerm;

    return Object.values(rest).filter(
      (value) =>
        value !== undefined &&
        value !== "",
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