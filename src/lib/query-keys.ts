export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },

  dashboard: {
    overview: ["dashboard", "overview"] as const,
  },

  users: {
    all: ["users"] as const,

    list: (params?: unknown) =>
      ["users", "list", params] as const,

    details: (id: string) =>
      ["users", id] as const,

    deleted: ["users", "deleted"] as const,
  },

  leads: {
    all: ["leads"] as const,

    list: (params?: unknown) =>
      ["leads", "list", params] as const,

    details: (id: string) =>
      ["leads", id] as const,

    deleted: ["leads", "deleted"] as const,
  },

  clients: {
    all: ["clients"] as const,

    list: (params?: unknown) =>
      ["clients", "list", params] as const,

    details: (id: string) =>
      ["clients", id] as const,
  },

  projects: {
    all: ["projects"] as const,

    list: (params?: unknown) =>
      ["projects", "list", params] as const,

    details: (id: string) =>
      ["projects", id] as const,
  },




  financialAccounts: {
  all: ["financial-accounts"] as const,
  list: (params?: unknown) => ["financial-accounts", "list", params] as const,
  details: (id: string) => ["financial-accounts", id] as const,
},

expenseCategories: {
  all: ["expense-categories"] as const,
  list: (params?: unknown) => ["expense-categories", "list", params] as const,
  details: (id: string) => ["expense-categories", id] as const,
},

expenses: {
  all: ["expenses"] as const,
  list: (params?: unknown) => ["expenses", "list", params] as const,
  details: (id: string) => ["expenses", id] as const,
},
};