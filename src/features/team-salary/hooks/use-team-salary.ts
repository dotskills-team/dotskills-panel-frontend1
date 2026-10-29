// "use client";

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import {
//   cancelTeamSalary,
//   createSalaryPayment,
//   createTeamSalary,
//   generateMonthlySalary,
//   getSalarySummary,
//   getTeamSalaryById,
//   getTeamSalaries,
//   getUserSalaryHistory,
//   deleteTeamSalary,
// } from "../api/team-salary.api";

// import type {
//   CancelTeamSalaryInput,
//   CreateSalaryPaymentInput,
//   CreateTeamSalaryInput,
//   GenerateMonthlySalaryInput,
//   TeamSalaryQueryInput,
// } from "../schemas/team-salary.schema";

// export const teamSalaryKeys = {
//   all: ["team-salaries"] as const,

//   lists: () => [...teamSalaryKeys.all, "list"] as const,

//   list: (query: TeamSalaryQueryInput) =>
//     [...teamSalaryKeys.lists(), query] as const,

//   details: () => [...teamSalaryKeys.all, "detail"] as const,

//   detail: (id: string) => [...teamSalaryKeys.details(), id] as const,

//   summary: (query: Pick<TeamSalaryQueryInput, "month" | "year" | "status">) =>
//     [...teamSalaryKeys.all, "summary", query] as const,

//   userHistory: (userId: string, query: object) =>
//     [...teamSalaryKeys.all, "user-history", userId, query] as const,
// };

// export function useTeamSalaries(
//   query: TeamSalaryQueryInput = {},
//   options?: {
//     enabled?: boolean;
//   },
// ) {
//   return useQuery({
//     queryKey: teamSalaryKeys.list(query),
//     queryFn: () => getTeamSalaries(query),
//     enabled: options?.enabled ?? true,
//     placeholderData: (previousData) => previousData,
//   });
// }

// export function useSalarySummary(
//   query: Pick<TeamSalaryQueryInput, "month" | "year" | "status"> = {},
//   options?: {
//     enabled?: boolean;
//   },
// ) {
//   return useQuery({
//     queryKey: teamSalaryKeys.summary(query),
//     queryFn: () => getSalarySummary(query),
//     enabled: options?.enabled ?? true,
//   });
// }

// export function useTeamSalary(
//   id?: string,
//   options?: {
//     enabled?: boolean;
//   },
// ) {
//   return useQuery({
//     queryKey: teamSalaryKeys.detail(id ?? ""),
//     queryFn: () => getTeamSalaryById(id as string),
//     enabled: Boolean(id) && (options?.enabled ?? true),
//   });
// }

// export function useUserSalaryHistory(
//   userId?: string,
//   query: Pick<
//     TeamSalaryQueryInput,
//     "page" | "limit" | "year" | "status" | "sort"
//   > = {},
// ) {
//   return useQuery({
//     queryKey: teamSalaryKeys.userHistory(userId ?? "", query),
//     queryFn: () => getUserSalaryHistory(userId as string, query),
//     enabled: Boolean(userId),
//   });
// }

// export function useCreateTeamSalary() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: CreateTeamSalaryInput) => createTeamSalary(payload),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: teamSalaryKeys.lists(),
//       });

//       queryClient.invalidateQueries({
//         queryKey: teamSalaryKeys.all,
//       });
//     },
//   });
// }

// export function useGenerateMonthlySalary() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: GenerateMonthlySalaryInput) =>
//       generateMonthlySalary(payload),

//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: teamSalaryKeys.all,
//       });
//     },
//   });
// }

// export function useCreateSalaryPayment() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: CreateSalaryPaymentInput;
//     }) => createSalaryPayment(id, payload),

//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: teamSalaryKeys.lists(),
//       });

//       queryClient.invalidateQueries({
//         queryKey: teamSalaryKeys.detail(variables.id),
//       });

//       queryClient.invalidateQueries({
//         queryKey: teamSalaryKeys.all,
//       });
//       queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
// queryClient.invalidateQueries({ queryKey: ["transactions"] });
//     },
//   });
// }

// export function useMoveTeamSalaryToTrash() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id }: { id: string }) => deleteTeamSalary(id),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: teamSalaryKeys.all });
//       queryClient.invalidateQueries({
//         queryKey: teamSalaryKeys.detail(variables.id),
//       });
//       queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
// queryClient.invalidateQueries({ queryKey: ["transactions"] });
//     },
//   });
// }

// export function useCancelTeamSalary() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: CancelTeamSalaryInput;
//     }) => cancelTeamSalary(id, payload),

//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: teamSalaryKeys.lists(),
//       });

//       queryClient.invalidateQueries({
//         queryKey: teamSalaryKeys.detail(variables.id),
//       });

//       queryClient.invalidateQueries({
//         queryKey: teamSalaryKeys.all,
//       });
//     },
//   });
// }




"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cancelTeamSalary,
  createSalaryPayment,
  createTeamSalary,
  generateMonthlySalary,
  getSalarySummary,
  getTeamSalaryById,
  getTeamSalaries,
  getUserSalaryHistory,
  deleteTeamSalary,
  updateTeamSalary,
} from "../api/team-salary.api";

import type {
  CancelTeamSalaryInput,
  CreateSalaryPaymentInput,
  CreateTeamSalaryInput,
  GenerateMonthlySalaryInput,
  TeamSalaryQueryInput,
  UpdateTeamSalaryInput,
} from "../schemas/team-salary.schema";

export const teamSalaryKeys = {
  all: ["team-salaries"] as const,

  lists: () => [...teamSalaryKeys.all, "list"] as const,

  list: (query: TeamSalaryQueryInput) =>
    [...teamSalaryKeys.lists(), query] as const,

  details: () => [...teamSalaryKeys.all, "detail"] as const,

  detail: (id: string) => [...teamSalaryKeys.details(), id] as const,

  summary: (query: Pick<TeamSalaryQueryInput, "month" | "year" | "status">) =>
    [...teamSalaryKeys.all, "summary", query] as const,

  userHistory: (userId: string, query: object) =>
    [...teamSalaryKeys.all, "user-history", userId, query] as const,
};

export function useTeamSalaries(
  query: TeamSalaryQueryInput = {},
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: teamSalaryKeys.list(query),
    queryFn: () => getTeamSalaries(query),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
  });
}

export function useSalarySummary(
  query: Pick<TeamSalaryQueryInput, "month" | "year" | "status"> = {},
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: teamSalaryKeys.summary(query),
    queryFn: () => getSalarySummary(query),
    enabled: options?.enabled ?? true,
  });
}

export function useTeamSalary(
  id?: string,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: teamSalaryKeys.detail(id ?? ""),
    queryFn: () => getTeamSalaryById(id as string),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}

export function useUserSalaryHistory(
  userId?: string,
  query: Pick<
    TeamSalaryQueryInput,
    "page" | "limit" | "year" | "status" | "sort"
  > = {},
) {
  return useQuery({
    queryKey: teamSalaryKeys.userHistory(userId ?? "", query),
    queryFn: () => getUserSalaryHistory(userId as string, query),
    enabled: Boolean(userId),
  });
}

export function useCreateTeamSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTeamSalaryInput) => createTeamSalary(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamSalaryKeys.all });
    },
  });
}

export function useUpdateTeamSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTeamSalaryInput;
    }) => updateTeamSalary(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamSalaryKeys.all });
      queryClient.invalidateQueries({
        queryKey: teamSalaryKeys.detail(variables.id),
      });
    },
  });
}

export function useGenerateMonthlySalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateMonthlySalaryInput) =>
      generateMonthlySalary(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamSalaryKeys.all,
      });
    },
  });
}

export function useCreateSalaryPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateSalaryPaymentInput;
    }) => createSalaryPayment(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamSalaryKeys.all });
      queryClient.invalidateQueries({
        queryKey: teamSalaryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useMoveTeamSalaryToTrash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteTeamSalary(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamSalaryKeys.all });
      queryClient.invalidateQueries({
        queryKey: teamSalaryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useCancelTeamSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CancelTeamSalaryInput;
    }) => cancelTeamSalary(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamSalaryKeys.all });
      queryClient.invalidateQueries({
        queryKey: teamSalaryKeys.detail(variables.id),
      });
    },
  });
}