"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2, Mail, SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { cn } from "@/lib/utils";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/schema/auth.schema";

export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const { mutate: sendResetLink, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    sendResetLink(values, {
      onSuccess: () => setSubmittedEmail(values.email),
    });
  }

  if (submittedEmail) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border/70 bg-muted/40 px-5 py-6 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <p className="text-sm text-foreground">
            If an account exists for{" "}
            <span className="font-medium">{submittedEmail}</span>, a reset
            link is on its way.
          </p>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t get it? Check spam, or try again in a few minutes.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setSubmittedEmail(null)}
          className="h-10 w-full rounded-xl font-medium"
        >
          Use a different email
        </Button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 rounded text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email address
        </label>

        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            disabled={isPending}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(
              "h-11 rounded-xl border-border/80 bg-background/60 pl-9 transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40",
              errors.email && "border-destructive focus-visible:ring-destructive/40",
            )}
            {...register("email")}
          />
        </div>

        {errors.email?.message && (
          <p id="email-error" className="text-sm font-medium text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="group h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-[0_1px_2px_rgba(79,70,229,0.1),0_8px_20px_-8px_rgba(79,70,229,0.5)] transition-all hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Sending link&hellip;
          </>
        ) : (
          <>
            Send reset link
            <SendHorizontal
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </>
        )}
      </Button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 rounded text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to sign in
      </Link>
    </form>
  );
}
