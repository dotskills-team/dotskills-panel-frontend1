"use client";

import { useState } from "react";

import type { ClientFilters } from "@/types/clients";

export function useClientFilters() {
  const [filters, setFilters] =
    useState<ClientFilters>({
      page: 1,
      limit: 10,
    });

  return {
    filters,
    setFilters,
  };
}