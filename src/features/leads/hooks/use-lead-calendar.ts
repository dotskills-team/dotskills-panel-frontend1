"use client";
"use client";

import { useQuery } from "@tanstack/react-query";
import { leadApi } from "../api/lead.api";

export function useFollowUpCalendar() {
  return useQuery({
    queryKey: ["leads", "calendar"],
    queryFn: () => leadApi.getFollowUpCalendar(),
    refetchInterval: 5 * 60 * 1000,
  });
}