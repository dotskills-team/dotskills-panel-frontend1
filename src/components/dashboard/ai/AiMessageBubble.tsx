import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiChatMessage } from "@/features/ai/stores/ai.store";
import { AiMarkdown } from "./AiMarkdown";

export function AiMessageBubble({ message }: { message: AiChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="bg-primary/10 text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
          <Bot className="size-4" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm whitespace-pre-wrap break-words"
            : "bg-muted text-foreground rounded-bl-sm",
          message.isError && "bg-destructive/10 text-destructive",
        )}
      >
        {isUser || message.isError ? message.content : <AiMarkdown text={message.content} />}
      </div>
    </div>
  );
}
