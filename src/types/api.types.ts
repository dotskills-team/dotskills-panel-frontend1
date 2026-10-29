export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ApiResponse<T, S = Record<string, any>> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
  stats?: S;
}

export interface ApiErrorSource {
  path: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorSources?: ApiErrorSource[];
}