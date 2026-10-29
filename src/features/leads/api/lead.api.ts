import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types";

import type {
  AddLeadAttachmentPayload,
  AddLeadNotePayload,
  AssignLeadPayload,
  ConvertLeadPayload,
  CreateLeadPayload,
  DeleteLeadResponse,
  FollowUpCalendarEntry,
  GetLeadResponse,
  ILead,
  LeadFilters,
  UpdateLeadContactStatusPayload,
  UpdateLeadPayload,
  UpdateLeadStatusPayload,
} from "@/types/lead";

const BASE_URL = "/leads";

const buildQuery = (params?: LeadFilters) => {
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

export interface ImportLeadsSummary {
  total: number;
  imported: number;
  duplicates: number;
  failed: number;
}

export const leadApi = {

  getLeads: (params?: LeadFilters) =>
    apiClient.get<ApiResponse<ILead[]>>(
      `${BASE_URL}${buildQuery(params)}`,
    ),

  getDeletedLeads: (params?: LeadFilters) =>
    apiClient.get<ApiResponse<ILead[]>>(
      `${BASE_URL}/trash${buildQuery(params)}`,
    ),

  getLead: (id: string) =>
    apiClient.get<GetLeadResponse>(
      `${BASE_URL}/${id}`,
    ),
 getFollowUpCalendar: () =>
    apiClient.get<ApiResponse<FollowUpCalendarEntry[]>>(`${BASE_URL}/calendar`), // ⬅️ যোগ করুন

  importLeads: (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    return apiClient.post<ApiResponse<ImportLeadsSummary>>(
      `${BASE_URL}/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  createLead: (payload: CreateLeadPayload) =>
    apiClient.post<ApiResponse<ILead>>(
      `${BASE_URL}/create`,
      payload,
    ),

  updateLead: (
    id: string,
    payload: UpdateLeadPayload,
  ) =>
    apiClient.patch<ApiResponse<ILead>>(
      `${BASE_URL}/${id}`,
      payload,
    ),

  trashLead: (id: string) =>
    apiClient.delete<DeleteLeadResponse>(
      `${BASE_URL}/${id}/trash`,
    ),

  restoreLead: (id: string) =>
    apiClient.patch<ApiResponse<ILead>>(
      `${BASE_URL}/${id}/restore`,
    ),

  permanentlyDeleteLead: (id: string) =>
    apiClient.delete<DeleteLeadResponse>(
      `${BASE_URL}/${id}/permanent`,
    ),

  updateStatus: (
    id: string,
    payload: UpdateLeadStatusPayload,
  ) =>
    apiClient.patch<ApiResponse<ILead>>(
      `${BASE_URL}/${id}/status`,
      payload,
    ),
    updateContactStatus: (
  id: string,
  payload: UpdateLeadContactStatusPayload,
) =>
  apiClient.patch<ApiResponse<ILead>>(
    `${BASE_URL}/${id}/contact-status`,
    payload,
  ),

  assignLead: (
    id: string,
    payload: AssignLeadPayload,
  ) =>
    apiClient.patch<ApiResponse<ILead>>(
      `${BASE_URL}/${id}/assign`,
      payload,
    ),

convertLead: (
  id: string,
  payload?: ConvertLeadPayload,
) =>
  apiClient.patch(
    `${BASE_URL}/${id}/convert`,
    payload ?? {},
  ),

  addNote: (
    id: string,
    payload: AddLeadNotePayload,
  ) =>
    apiClient.post<ApiResponse<ILead>>(
      `${BASE_URL}/${id}/notes`,
      payload,
    ),

  addAttachment: (
    id: string,
    payload: AddLeadAttachmentPayload,
  ) =>
    apiClient.post<ApiResponse<ILead>>(
      `${BASE_URL}/${id}/attachments`,
      payload,
    ),
};

export default leadApi;
