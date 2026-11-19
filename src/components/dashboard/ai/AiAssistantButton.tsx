"use client";

import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAiStore } from "@/features/ai/stores/ai.store";
import { AiChatPanel } from "./AiChatPanel";

/** Floating bottom-right button. Toggles the chat popup that opens right above it. */
export function AiAssistantButton() {
  const isOpen = useAiStore((s) => s.isOpen);
  const setOpen = useAiStore((s) => s.setOpen);

  return (
    <>
      <AiChatPanel />
      <Button
        type="button"
        size="icon-lg"
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
        className="fixed right-4 bottom-4 z-40 size-12 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 text-white shadow-lg transition-transform hover:scale-105 hover:from-violet-600 hover:to-pink-600"
      >
        {isOpen ? <X className="size-5" /> : <Sparkles className="size-5" />}
      </Button>
    </>
  );
}
