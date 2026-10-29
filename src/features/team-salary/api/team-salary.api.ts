import api, { apiClient } from "@/lib/axios";

import type {
  CancelTeamSalaryInput,
  CreateSalaryPaymentInput,
  CreateTeamSalaryInput,
  GenerateMonthlySalaryInput,
  TeamSalaryQueryInput,
} from "../schemas/team-salary.schema";
import type { UpdateTeamSalaryInput } from "../schemas/team-salary.schema";

import type {
  IMySalariesResponse,
  ITeamSalary,
  MySalaryFilters,
  TeamSalarySummary,
} from "@/types/team-salary.types";

interface TeamSalaryListResponse {
  success?: boolean;
  message?: string;
  data: ITeamSalary[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

interface TeamSalaryResponse {
  success?: boolean;
  message?: string;
  data: ITeamSalary;
}

interface TeamSalarySummaryResponse {
  success?: boolean;
  message?: string;
  data: TeamSalarySummary;
}

interface GenerateSalaryResponse {
  success?: boolean;
  message?: string;
  data: ITeamSalary[];
}

const BASE_URL = "/team-salaries";

function buildQueryString(
  query: TeamSalaryQueryInput = {},
) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();

  return queryString
    ? `?${queryString}`
    : "";
}

async function request<T>(
  url: string,
  options?: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: string;
  },
): Promise<T> {
  const response = await api.request<T>({
    url,
    method: options?.method ?? "GET",
    data: options?.body ? JSON.parse(options.body) : undefined,
  });

  return response.data;
}

export async function getTeamSalaries(
  query: TeamSalaryQueryInput = {},
): Promise<TeamSalaryListResponse> {
  return request<TeamSalaryListResponse>(
    `${BASE_URL}${buildQueryString(query)}`,
  );
}

export async function deleteTeamSalary(id: string): Promise<{
  success?: boolean;
  message?: string;
  data: null;
}> {
  return request(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}

export async function getSalarySummary(
  query: Pick<
    TeamSalaryQueryInput,
    "month" | "year" | "status"
  > = {},
): Promise<TeamSalarySummaryResponse> {
  return request<TeamSalarySummaryResponse>(
    `${BASE_URL}/summary${buildQueryString(query)}`,
  );
}

export async function getTeamSalaryById(
  id: string,
): Promise<TeamSalaryResponse> {
  return request<TeamSalaryResponse>(
    `${BASE_URL}/${id}`,
  );
}

export async function getUserSalaryHistory(
  userId: string,
  query: Pick<
    TeamSalaryQueryInput,
    "page" | "limit" | "year" | "status" | "sort"
  > = {},
): Promise<TeamSalaryListResponse> {
  return request<TeamSalaryListResponse>(
    `${BASE_URL}/user/${userId}${buildQueryString(query)}`,
  );
}

export async function createTeamSalary(
  payload: CreateTeamSalaryInput,
): Promise<TeamSalaryResponse> {
  return request<TeamSalaryResponse>(
    BASE_URL,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function generateMonthlySalary(
  payload: GenerateMonthlySalaryInput,
): Promise<GenerateSalaryResponse> {
  return request<GenerateSalaryResponse>(
    `${BASE_URL}/generate`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function createSalaryPayment(
  id: string,
  payload: CreateSalaryPaymentInput,
): Promise<TeamSalaryResponse> {
  return request<TeamSalaryResponse>(
    `${BASE_URL}/${id}/payment`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function cancelTeamSalary(
  id: string,
  payload: CancelTeamSalaryInput,
): Promise<TeamSalaryResponse> {
  return request<TeamSalaryResponse>(
    `${BASE_URL}/${id}/cancel`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function updateTeamSalary(
  id: string,
  payload: UpdateTeamSalaryInput,
): Promise<TeamSalaryResponse> {
  return request<TeamSalaryResponse>(`${BASE_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export const salaryApi = {
    /**
     * Salary records of the logged-in employee
     */
    getMySalaries: (params?: MySalaryFilters) =>
        apiClient.get<IMySalariesResponse>(
            `${BASE_URL}/my-salaries${buildQueryString(params as Record<string, unknown>)}`,
        ),
};
