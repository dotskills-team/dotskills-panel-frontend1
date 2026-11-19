import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types";
import { AI_CHAT_TIMEOUT_MS } from "../constants/ai.constants";
import type { AiChatPayload, AiChatResult } from "../schemas/ai.schema";

const BASE_URL = "/ai";

export const aiApi = {
  chat: (payload: AiChatPayload) =>
    apiClient.post<ApiResponse<AiChatResult>>(`${BASE_URL}/chat`, payload, {
      timeout: AI_CHAT_TIMEOUT_MS,
    }),
};
