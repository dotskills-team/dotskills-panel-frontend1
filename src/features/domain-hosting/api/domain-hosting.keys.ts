import type { DomainHostingFilters, TargetType } from "@/types/domain-hosting.types";

/**
 * TanStack Query keys for the Domain & Hosting module.
 * Everything lives under `all`, so one invalidation refreshes the whole module.
 */
export const domainHostingKeys = {
  all: ["domain-hosting"] as const,

  summary: () => [...domainHostingKeys.all, "summary"] as const,

  lists: () => [...domainHostingKeys.all, "list"] as const,
  list: (type: TargetType, filters: DomainHostingFilters) =>
    [...domainHostingKeys.lists(), type, filters] as const,

  details: () => [...domainHostingKeys.all, "detail"] as const,
  detail: (type: TargetType, id: string) => [...domainHostingKeys.details(), type, id] as const,

  logs: (type: TargetType, id: string) => [...domainHostingKeys.all, "logs", type, id] as const,

  notifications: () => [...domainHostingKeys.all, "notifications"] as const,

  projectOptions: () => [...domainHostingKeys.all, "project-options"] as const,
};
