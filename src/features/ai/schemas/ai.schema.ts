import { z } from "zod";
import { AI_MAX_MESSAGE_LENGTH, AI_WORKSPACES } from "../constants/ai.constants";

export const aiChatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(AI_MAX_MESSAGE_LENGTH, `Message must be at most ${AI_MAX_MESSAGE_LENGTH} characters`),
  workspace: z.enum(AI_WORKSPACES),
  conversationId: z.string().optional(),
});

export type AiChatPayload = z.infer<typeof aiChatSchema>;

export interface AiChatResult {
  conversationId: string;
  workspace: (typeof AI_WORKSPACES)[number];
  reply: string;
  toolsUsed: string[];
}
