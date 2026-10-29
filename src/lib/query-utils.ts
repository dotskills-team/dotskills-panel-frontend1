import { QueryKey } from "@tanstack/react-query";

import { queryClient } from "./query-client";

export const invalidateQuery = (
  queryKey: QueryKey,
) => queryClient.invalidateQueries({ queryKey });

export const refetchQuery = (
  queryKey: QueryKey,
) =>
  queryClient.refetchQueries({
    queryKey,
  });

export const removeQuery = (
  queryKey: QueryKey,
) =>
  queryClient.removeQueries({
    queryKey,
  });

export const resetQuery = (
  queryKey: QueryKey,
) =>
  queryClient.resetQueries({
    queryKey,
  });

export const clearCache = () =>
  queryClient.clear();