"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2, Minus, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  AI_MAX_MESSAGE_LENGTH,
  AI_SPEECH_LANG_KEY,
  AI_SPEECH_LANGS,
  AI_SUGGESTIONS,
  canUsePersonalWorkspace,
  type AiSpeechLang,
  type AiWorkspace,
} from "@/features/ai/constants/ai.constants";
import { useSendMessage } from "@/features/ai/hooks/use-ai";
import { useSpeechInput } from "@/features/ai/hooks/use-speech-input";
import { AiMicButton, AiSpeechLangSwitch } from "./AiMicButton";
import { useAiStore } from "@/features/ai/stores/ai.store";
import { useCurrentUser } from "@/stores/auth.selectors";
import { AiMessageBubble } from "./AiMessageBubble";
import { WorkspaceSwitch } from "./WorkspaceSwitch";

const readSpeechLang = (): AiSpeechLang => {
  try {
    const saved = localStorage.getItem(AI_SPEECH_LANG_KEY);
    return AI_SPEECH_LANGS.find((l) => l.code === saved)?.code ?? "en-US";
  } catch {
    return "en-US";
  }
};

/**
 * Chatbot-style popup that opens right above the floating button (bottom-right),
 * with no backdrop, so the page behind stays usable.
 */
export function AiChatPanel() {
  const user = useCurrentUser();
  const isOpen = useAiStore((s) => s.isOpen);
  const setOpen = useAiStore((s) => s.setOpen);
  const storedWorkspace = useAiStore((s) => s.workspace);
  const setWorkspace = useAiStore((s) => s.setWorkspace);
  const chats = useAiStore((s) => s.chats);
  const clearChat = useAiStore((s) => s.clearChat);

  const showPersonal = canUsePersonalWorkspace(user?.role);
  // A non-admin can never be in personal mode, even if the store was changed.
  const workspace: AiWorkspace = showPersonal ? storedWorkspace : "business";
  const chat = chats[workspace];

  const { mutate, isPending } = useSendMessage();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat.messages.length, isPending, isOpen]);

  // Focus the input when the popup opens, close on Escape
  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setOpen]);

  const [speechLang, setSpeechLang] = useState<AiSpeechLang>(readSpeechLang);
  const {
    supported: speechSupported,
    listening,
    start: startListening,
    stop: stopListening,
  } = useSpeechInput({
    lang: speechLang,
    onChange: setInput,
    onError: (message) => toast.error(message),
  });

  // Stop listening when the popup closes
  useEffect(() => {
    if (!isOpen) stopListening();
  }, [isOpen, stopListening]);

  if (!isOpen) return null;

  const changeSpeechLang = (lang: AiSpeechLang) => {
    setSpeechLang(lang);
    try {
      localStorage.setItem(AI_SPEECH_LANG_KEY, lang);
    } catch {
      // storage unavailable (private mode): keep the choice for this session only
    }
  };

  const toggleMic = () => {
    if (listening) stopListening();
    else startListening(input);
  };

  const send = (text: string) => {
    const message = text.trim();
    if (!message || isPending) return;
    stopListening();
    setInput("");
    mutate({ message, workspace, conversationId: chat.conversationId });
  };

  const isEmpty = chat.messages.length === 0;

  return (
    <div
      role="dialog"
      aria-label="Dotskills Assistant"
      className="bg-popover text-popover-foreground animate-in fade-in-0 slide-in-from-bottom-4 zoom-in-95 fixed right-4 bottom-20 z-40 flex h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border shadow-2xl duration-200 sm:w-[400px]"
    >
      {/* Header */}
      <div className="flex flex-col gap-2.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-4 pt-3 pb-3 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Sparkles className="size-4.5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Dotskills Assistant</p>
              <p className="truncate text-[11px] text-white/80">
                {workspace === "business" ? "Projects, clients, leads & finance" : "General assistant"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Clear chat"
              title="Clear chat"
              disabled={isPending || isEmpty}
              onClick={() => clearChat(workspace)}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <RotateCcw />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Minimize"
              title="Minimize"
              onClick={() => setOpen(false)}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Minus />
            </Button>
          </div>
        </div>
        <WorkspaceSwitch value={workspace} onChange={setWorkspace} showPersonal={showPersonal} />
      </div>

      {/* Messages */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 px-4 py-4">
          {isEmpty && (
            <div className="flex flex-col gap-3 pt-1">
              <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2.5 text-sm">
                Hi{user?.firstName ? ` ${user.firstName}` : ""}! 👋 How can I help you today?
              </div>
              <div className="flex flex-col gap-2">
                {AI_SUGGESTIONS[workspace].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="hover:border-primary/40 hover:bg-muted/60 rounded-xl border px-3 py-2 text-left text-sm transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chat.messages.map((m) => (
            <AiMessageBubble key={m.id} message={m} />
          ))}

          {isPending && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      {/* Composer */}
      <form
        className="border-t p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <div className="focus-within:ring-ring/40 bg-background rounded-2xl border transition-shadow focus-within:ring-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder={listening ? "Listening…" : "Type your question…"}
            readOnly={listening}
            maxLength={AI_MAX_MESSAGE_LENGTH}
            rows={1}
            className="max-h-28 min-h-11 resize-none border-0 bg-transparent px-3.5 py-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center justify-between gap-2 px-1.5 pb-1.5">
            {speechSupported ? (
              <AiSpeechLangSwitch value={speechLang} disabled={listening} onChange={changeSpeechLang} />
            ) : (
              <span />
            )}
            <div className="flex items-center gap-1">
              <AiMicButton
                supported={speechSupported}
                listening={listening}
                disabled={isPending}
                onToggle={toggleMic}
              />
              <Button
                type="submit"
                size="icon-sm"
                aria-label="Send"
                disabled={isPending || !input.trim()}
                className="rounded-xl"
              >
                <ArrowUp />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
