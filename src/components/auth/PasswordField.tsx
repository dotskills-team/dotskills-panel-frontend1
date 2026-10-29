"use client";

import { useId, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useController } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  /** Optional element rendered inline with the label, e.g. a "Forgot password?" link. */
  labelSlot?: React.ReactNode;
}

export function PasswordField<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Password",
  placeholder = "Enter your password",
  autoComplete = "current-password",
  disabled,
  labelSlot,
}: PasswordFieldProps<TFieldValues>) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();
  const errorId = useId();

  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {labelSlot}
      </div>

      <div className="relative">
        <Lock
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <Input
          ref={field?.ref}
          name={field?.name}
          value={field?.value ?? ""}
          onChange={field?.onChange}
          onBlur={field?.onBlur}
          id={inputId}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-11 rounded-xl border-border/80 bg-background/60 pl-9 pr-10",
            "transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40",
            error && "border-destructive focus-visible:ring-destructive/40",
          )}
        />

        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2",
            "flex h-7 w-7 items-center justify-center rounded-lg",
            "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {error?.message && (
        <p id={errorId} className="text-sm font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}
