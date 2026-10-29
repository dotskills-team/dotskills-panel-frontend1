export const projectKeys = {
  all: ["projects"] as const,

  lists: () => [...projectKeys.all, "list"] as const,

  list: (filters?: Record<string, unknown>) =>
    [...projectKeys.lists(), filters] as const,

  details: () => [...projectKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...projectKeys.details(), id] as const,

  deleted: () => [...projectKeys.all, "deleted"] as const,

  deletedList: (filters?: Record<string, unknown>) =>
    [...projectKeys.deleted(), filters] as const,
};