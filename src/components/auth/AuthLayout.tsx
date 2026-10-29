"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthIllustration } from "@/components/auth/AuthIllustration";
import { useAuthStore } from "@/stores";

const DEFAULT_AUTHENTICATED_PATH = "/dashboard";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace(DEFAULT_AUTHENTICATED_PATH);
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2
          className="h-5 w-5 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-[45%] max-w-140 lg:block xl:w-[42%]">
        <AuthIllustration />
      </aside>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center px-6 pt-6 sm:px-10 sm:pt-8 lg:hidden">
          <AuthHeader />
        </div>

        <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-105 space-y-8">
            <div className="hidden lg:block">
              <AuthHeader />
            </div>

            {children}
          </div>
        </main>

        <div className="px-6 pb-8 sm:px-10">
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}
