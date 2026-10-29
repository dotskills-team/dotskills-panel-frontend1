import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types";

import type {
  AddClientDocumentPayload,
  AddClientNotePayload,
  AssignClientManagerPayload,
  ClientFilters,
  ClientListResponse,
  CreateClientPayload,
  DeleteClientResponse,
  GetClientResponse,
  IClient,
  UpdateClientPayload,
  UpdateClientStatusPayload,
} from "@/types/clients";

const BASE_URL = "/clients";

const buildQuery = (params?: ClientFilters) => {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
};

export const clientApi = {
  getClients: (filters?: ClientFilters) =>
    apiClient.get<ClientListResponse>(`${BASE_URL}${buildQuery(filters)}`),

  getDeletedClients: (filters?: ClientFilters) =>
    apiClient.get<ClientListResponse>(
      `${BASE_URL}/deleted${buildQuery(filters)}`,
    ),

  getClient: (id: string) =>
    apiClient.get<GetClientResponse>(
      `${BASE_URL}/${id}`,
    ),

  createClient: (
    payload: CreateClientPayload,
  ) =>
    apiClient.post<ApiResponse<IClient>>(
      `${BASE_URL}/create`,
      payload,
    ),

  updateClient: (
    id: string,
    payload: UpdateClientPayload,
  ) =>
    apiClient.patch<ApiResponse<IClient>>(
      `${BASE_URL}/${id}`,
      payload,
    ),

  trashClient: (id: string) =>
    apiClient.patch<DeleteClientResponse>(
      `${BASE_URL}/${id}/soft-delete`,
    ),

  restoreClient: (id: string) =>
    apiClient.patch<ApiResponse<IClient>>(
      `${BASE_URL}/${id}/restore`,
    ),

  permanentlyDeleteClient: (id: string) =>
    apiClient.delete<DeleteClientResponse>(
      `${BASE_URL}/${id}/permanent`,
    ),

  updateStatus: (
    id: string,
    payload: UpdateClientStatusPayload,
  ) =>
    apiClient.patch<ApiResponse<IClient>>(
      `${BASE_URL}/${id}/status`,
      payload,
    ),

  assignManager: (
    id: string,
    payload: AssignClientManagerPayload,
  ) =>
    apiClient.patch<ApiResponse<IClient>>(
      `${BASE_URL}/${id}/assign`,
      payload,
    ),

  addNote: (
    id: string,
    payload: AddClientNotePayload,
  ) =>
    apiClient.post<ApiResponse<IClient>>(
      `${BASE_URL}/${id}/notes`,
      payload,
    ),

  addDocument: (
    id: string,
    payload: AddClientDocumentPayload,
  ) =>
    apiClient.post<ApiResponse<IClient>>(
      `${BASE_URL}/${id}/documents`,
      payload,
    ),
};

export default clientApi;