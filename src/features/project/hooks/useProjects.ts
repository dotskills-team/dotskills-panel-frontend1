"use client";

import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { projectApi } from "../api/project.api";
import { projectKeys } from "../api/project.keys";

import type {
  ProjectFilters,
} from "@/types/project.types";

interface UseProjectQueryOptions {
  enabled?: boolean;
}

export const useProjects = (
  filters?: ProjectFilters,
  options?: UseProjectQueryOptions,
) => {
  return useQuery({
    queryKey: projectKeys.list(
      filters as Record<string, unknown>,
    ),

    queryFn: () =>
      projectApi.getProjects(filters),

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 5,

    enabled: options?.enabled,
  });
};

export const useDeletedProjects = (
  filters?: ProjectFilters,
  options?: UseProjectQueryOptions,
) => {
  return useQuery({
    queryKey: projectKeys.deletedList(
      filters as Record<string, unknown>,
    ),

    queryFn: () =>
      projectApi.getDeletedProjects(filters),

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 5,

    enabled: options?.enabled,
  });
};

export const useProject = (
  id?: string,
  options?: UseProjectQueryOptions,
) => {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ""),

    queryFn: () =>
      projectApi.getProject(id!),

    enabled:
      Boolean(id) &&
      options?.enabled !== false,

    staleTime: 1000 * 60 * 5,
  });
};