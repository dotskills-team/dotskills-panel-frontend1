import { create } from "zustand";
import type { AiWorkspace } from "../constants/ai.constants";

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  toolsUsed?: string[];
}

interface WorkspaceChat {
  messages: AiChatMessage[];
  conversationId?: string;
}

interface AiState {
  isOpen: boolean;
  workspace: AiWorkspace;
  chats: Record<AiWorkspace, WorkspaceChat>;
  setOpen: (open: boolean) => void;
  setWorkspace: (workspace: AiWorkspace) => void;
  addMessage: (workspace: AiWorkspace, message: Omit<AiChatMessage, "id">) => void;
  setConversationId: (workspace: AiWorkspace, id: string) => void;
  clearChat: (workspace: AiWorkspace) => void;
}

let counter = 0;
const nextId = () => `ai-${Date.now()}-${counter++}`;

const emptyChats = (): Record<AiWorkspace, WorkspaceChat> => ({
  business: { messages: [] },
  personal: { messages: [] },
});

export const useAiStore = create<AiState>((set) => ({
  isOpen: false,
  workspace: "business",
  chats: emptyChats(),
  setOpen: (isOpen) => set({ isOpen }),
  setWorkspace: (workspace) => set({ workspace }),
  addMessage: (workspace, message) =>
    set((state) => ({
      chats: {
        ...state.chats,
        [workspace]: {
          ...state.chats[workspace],
          messages: [...state.chats[workspace].messages, { ...message, id: nextId() }],
        },
      },
    })),
  setConversationId: (workspace, id) =>
    set((state) => ({
      chats: { ...state.chats, [workspace]: { ...state.chats[workspace], conversationId: id } },
    })),
  clearChat: (workspace) =>
    set((state) => ({ chats: { ...state.chats, [workspace]: { messages: [] } } })),
}));
