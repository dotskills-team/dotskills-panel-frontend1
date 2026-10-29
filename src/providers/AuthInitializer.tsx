"use client";

import { useEffect } from "react";

import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const initialize = useAuthStore((state) => state.initialize);
  const reset = useAuthStore((state) => state.reset);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const user = await userService.me();

        if (!active) return;

        initialize(user);
      } catch {
        if (!active) return;

        reset();
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, [initialize, reset]);

  return <>{children}</>;
}
