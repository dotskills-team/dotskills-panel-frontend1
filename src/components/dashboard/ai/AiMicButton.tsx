"use client";

import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AI_SPEECH_LANGS, type AiSpeechLang } from "@/features/ai/constants/ai.constants";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  supported: boolean;
  listening: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function AiMicButton({ supported, listening, disabled, onToggle }: MicButtonProps) {
  const label = !supported
    ? "Voice input isn't supported in this browser"
    : listening
      ? "Stop listening"
      : "Speak your message";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* span keeps the tooltip working while the button is disabled */}
        <span tabIndex={supported ? -1 : 0}>
          <Button
            type="button"
            variant={listening ? "destructive" : "ghost"}
            size="icon-sm"
            aria-label={label}
            aria-pressed={listening}
            disabled={!supported || disabled}
            onClick={onToggle}
            className={cn("rounded-xl", listening && "animate-pulse")}
          >
            {listening ? <Square /> : <Mic />}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

interface LangSwitchProps {
  value: AiSpeechLang;
  disabled?: boolean;
  onChange: (lang: AiSpeechLang) => void;
}

/** Small EN | বাং switch for the speech recognition language. */
export function AiSpeechLangSwitch({ value, disabled, onChange }: LangSwitchProps) {
  return (
    <div role="group" aria-label="Voice language" className="bg-muted flex rounded-lg p-0.5 text-[11px]">
      {AI_SPEECH_LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          disabled={disabled}
          aria-pressed={value === l.code}
          onClick={() => onChange(l.code)}
          className={cn(
            "rounded-md px-2 py-0.5 font-medium transition-colors disabled:opacity-50",
            value === l.code ? "bg-background shadow-sm" : "text-muted-foreground",
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
