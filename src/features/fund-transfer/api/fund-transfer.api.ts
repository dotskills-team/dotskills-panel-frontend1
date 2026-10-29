import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types";
import type { IFundTransfer } from "@/types/fund-transfer.types";
import type {
  CreateFundTransferInput,
  FundTransferQueryInput,
} from "../schemas/fund-transfer.schema";

const BASE_URL = "/fund-transfers";

const buildQuery = (params: FundTransferQueryInput = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const fundTransferApi = {
  getAll: (params?: FundTransferQueryInput) =>
    apiClient.get<ApiResponse<IFundTransfer[]>>(`${BASE_URL}${buildQuery(params)}`),

  create: (payload: CreateFundTransferInput) =>
    apiClient.post<ApiResponse<IFundTransfer>>(BASE_URL, payload),

  remove: (id: string) => apiClient.delete<ApiResponse<null>>(`${BASE_URL}/${id}`),
};

export default fundTransferApi;