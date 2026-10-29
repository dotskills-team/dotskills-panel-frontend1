export const leadKeys = {
  all: ["leads"] as const,

  lists: () => [...leadKeys.all, "list"] as const,

  list: (filters?: Record<string, unknown>) =>
    [...leadKeys.lists(), filters] as const,

  details: () => [...leadKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...leadKeys.details(), id] as const,

  deleted: () => [...leadKeys.all, "deleted"] as const,

  deletedList: (filters?: Record<string, unknown>) =>
    [...leadKeys.deleted(), filters] as const,
};