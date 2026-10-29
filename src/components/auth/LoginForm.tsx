/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn, Mail } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/auth/useLogin";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginFormValues } from "@/lib/schema/auth.schema";

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(values: LoginFormValues) {
    login(values);
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

      <PasswordField
        control={control}
        name="password"
        disabled={isPending}
        labelSlot={
          <Link
            href="/forgot-password"
            tabIndex={isPending ? -1 : 0}
            className="rounded text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Forgot password?
          </Link>
        }
      />

      <div className="flex flex-row items-center">
        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <Checkbox
              id="rememberMe"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isPending}
              className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
            />
          )}
        />
        <label
          htmlFor="rememberMe"
          className="cursor-pointer pl-2.5 text-sm font-normal text-muted-foreground"
        >
          Remember me for 30 days
        </label>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="group h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-[0_1px_2px_rgba(79,70,229,0.1),0_8px_20px_-8px_rgba(79,70,229,0.5)] transition-all hover:bg-primary/90 hover:shadow-[0_1px_2px_rgba(79,70,229,0.15),0_10px_24px_-8px_rgba(79,70,229,0.6)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Signing in&hellip;
          </>
        ) : (
          <>
            Sign in
            <LogIn
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </>
        )}
      </Button>
    </form>
  );
}
