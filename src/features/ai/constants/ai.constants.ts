import { Role } from "@/types/user.types";

export const AI_WORKSPACES = ["business", "personal"] as const;
export type AiWorkspace = (typeof AI_WORKSPACES)[number];

export const AI_WORKSPACE_LABELS: Record<AiWorkspace, string> = {
  business: "Business",
  personal: "Personal",
};

/** Only these roles see the Personal workspace (the backend enforces the same rule). */
export const AI_PERSONAL_ROLES: string[] = [Role.SUPER_ADMIN, Role.ADMIN];

export const canUsePersonalWorkspace = (role?: string | null): boolean =>
  !!role && AI_PERSONAL_ROLES.includes(role);

export const AI_MAX_MESSAGE_LENGTH = 4000;

export const AI_SPEECH_LANGS = [
  { code: "en-US", label: "EN" },
  { code: "bn-BD", label: "বাং" },
] as const;
export type AiSpeechLang = (typeof AI_SPEECH_LANGS)[number]["code"];
export const AI_SPEECH_LANG_KEY = "ai-speech-lang";

/**
 * The shared apiClient times out after 30s, but an answer can need several model + data steps.
 * Slightly above the backend's worst case (80s budget + one 35s fallback chain).
 */
export const AI_CHAT_TIMEOUT_MS = 130_000;

export const AI_SUGGESTIONS: Record<AiWorkspace, string[]> = {
  business: [
    "Which projects still have an outstanding balance?",
    "Which project deadlines are due in the next 30 days?",
    "Give me a summary of my dashboard",
  ],
  personal: ["Help me draft an email", "Make a plan for my workday"],
};
