import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

import { API, HTTP_STATUS } from "./constants";
import type { ApiErrorResponse, ApiResponse } from "@/types";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;

let failedQueue: {
  resolve: () => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

const api: AxiosInstance = axios.create({
  baseURL: API.BASE_URL,

  timeout: API.TIMEOUT,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },

  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(normalizeAxiosError(error));
    }

    const status = error.response?.status;

    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";

    const isAuthPage =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password" ||
      pathname === "/reset-password";

    const isRefreshRequest = originalRequest.url?.includes(
      API.TOKEN_REFRESH_ENDPOINT,
    );

    // Don't try to refresh while already on auth pages
    if (isAuthPage) {
      return Promise.reject(normalizeAxiosError(error));
    }

    if (
      status !== HTTP_STATUS.UNAUTHORIZED ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(normalizeAxiosError(error));
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post<ApiResponse<null>>(API.TOKEN_REFRESH_ENDPOINT, {});

      processQueue();

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.replace("/login");
      }

      return Promise.reject(
        refreshError instanceof AxiosError
          ? normalizeAxiosError(refreshError)
          : refreshError,
      );
    } finally {
      isRefreshing = false;
    }
  },
);

export class ApiError extends Error {
  status?: number;

  errorSources?: {
    path: string;
    message: string;
  }[];

  constructor(
    message: string,
    status?: number,
    errorSources?: {
      path: string;
      message: string;
    }[],
  ) {
    super(message);

    this.name = "ApiError";

    this.status = status;

    this.errorSources = errorSources;
  }
}

export const normalizeAxiosError = (
  error: AxiosError<ApiErrorResponse>,
): ApiError => {
  return new ApiError(
    error.response?.data?.message ?? error.message ?? "Something went wrong.",

    error.response?.status,

    error.response?.data?.errorSources,
  );
};

export const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.get<T>(url, config);

    return response.data;
  },

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await api.post<T>(url, data, config);

    return response.data;
  },

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await api.put<T>(url, data, config);

    return response.data;
  },

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await api.patch<T>(url, data, config);

    return response.data;
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.delete<T>(url, config);

    return response.data;
  },
};

export default api;
