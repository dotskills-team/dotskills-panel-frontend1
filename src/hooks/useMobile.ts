"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Prevent SSR hydration mismatch
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Set initial value
   setTimeout(() => {
     setIsMobile(mediaQuery.matches);
   }, 100);

    // Listen for viewport changes
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    // Safari < 14 fallback
    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return isMobile;
}