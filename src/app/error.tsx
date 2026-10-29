"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-4 text-muted-foreground">
          An unexpected error occurred while loading the
          application.
        </p>

        <Button
          className="mt-8"
          onClick={reset}
        >
          Try Again
        </Button>
      </div>
    </main>
  );
}