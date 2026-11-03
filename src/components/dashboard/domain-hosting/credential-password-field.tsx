"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRevealCredential } from "@/features/domain-hosting/hooks/use-domain-hosting";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { TargetType } from "@/types/domain-hosting.types";

/** The revealed password is hidden again after this many seconds. */
const AUTO_HIDE_SECONDS = 20;

interface CredentialPasswordFieldProps {
  type: TargetType;
  recordId: string;
  /** Hosting credential row id. Omit for domains. */
  credentialId?: string;
  hasPassword: boolean;
}

/**
 * Shows a masked password. "Reveal" asks the server (audited) for the value,
 * which then hides itself after a short delay. "Copy" copies the revealed value.
 */
export function CredentialPasswordField({
  type,
  recordId,
  credentialId,
  hasPassword,
}: CredentialPasswordFieldProps) {
  const [revealed, setRevealed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const revealMutation = useRevealCredential();

  // Auto-hide the revealed value
  useEffect(() => {
    if (revealed === null) return;
    const timer = window.setTimeout(() => setRevealed(null), AUTO_HIDE_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [revealed]);

  if (!hasPassword) {
    return <span className="text-sm text-muted-foreground">Not set</span>;
  }

  const handleReveal = async () => {
    try {
      const result = await revealMutation.mutateAsync({ type, id: recordId, credentialId });
      setRevealed(result.password);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to reveal the password."));
    }
  };

  const handleCopy = async () => {
    if (revealed === null) return;
    try {
      await navigator.clipboard.writeText(revealed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed. Select the text and copy it manually.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <code className="min-w-0 flex-1 truncate rounded-md border bg-muted/40 px-2 py-1 font-mono text-sm">
        {revealed ?? "••••••••"}
      </code>

      {revealed === null ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReveal}
          disabled={revealMutation.isPending}
        >
          {revealMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          Reveal
        </Button>
      ) : (
        <>
          <Button type="button" variant="outline" size="sm" onClick={() => setRevealed(null)}>
            <EyeOff className="h-4 w-4" />
            Hide
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleCopy} aria-label="Copy password">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </>
      )}
    </div>
  );
}
