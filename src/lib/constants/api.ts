export const API = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:5000/api/v1",

  TIMEOUT: 30000,

  TOKEN_REFRESH_ENDPOINT: "/auth/refresh-token",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,

  INTERNAL_SERVER_ERROR: 500,
} as const;