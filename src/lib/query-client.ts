import {
  DefaultOptions,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

const shouldRetry = (
  failureCount: number,
  error: unknown,
): boolean => {
  if (failureCount >= 2) return false;

  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (
      status &&
      [400, 401, 403, 404, 409, 422].includes(status)
    ) {
      return false;
    }
  }

  return true;
};

const defaultOptions: DefaultOptions = {
  queries: {
    retry: shouldRetry,

    retryDelay: (attempt) =>
      Math.min(1000 * 2 ** attempt, 30000),

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 30,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    refetchOnMount: false,

    networkMode: "online",

    throwOnError: false,
  },

  mutations: {
    retry: false,

    networkMode: "online",

    throwOnError: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions,
});