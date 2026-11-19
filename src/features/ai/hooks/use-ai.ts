"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { aiApi } from "../api/ai.api";
import type { AiChatPayload } from "../schemas/ai.schema";
import { useAiStore } from "../stores/ai.store";

/**
 * Sends one chat message. The user bubble is added immediately, the reply (or an error
 * bubble) is added when the request finishes.
 */
export const useSendMessage = () => {
  const addMessage = useAiStore((s) => s.addMessage);
  const setConversationId = useAiStore((s) => s.setConversationId);

  return useMutation({
    mutationFn: (payload: AiChatPayload) => aiApi.chat(payload),
    onMutate: (payload) => {
      addMessage(payload.workspace, { role: "user", content: payload.message });
    },
    onSuccess: (res, payload) => {
      const result = res.data;
      setConversationId(payload.workspace, result.conversationId);
      addMessage(payload.workspace, {
        role: "assistant",
        content: result.reply,
        toolsUsed: result.toolsUsed,
      });
    },
    onError: (error, payload) => {
      const message = error instanceof Error ? error.message : "Something went wrong";
      addMessage(payload.workspace, { role: "assistant", content: message, isError: true });
      toast.error(message);
    },
  });
};
