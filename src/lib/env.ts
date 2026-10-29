const required = (
  value: string | undefined,
  name: string,
): string => {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`,
    );
  }

  return value;
};

const optional = (
  value: string | undefined,
  fallback = "",
): string => {
  return value ?? fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV,

  IS_DEV: process.env.NODE_ENV === "development",

  IS_PROD: process.env.NODE_ENV === "production",

  IS_TEST: process.env.NODE_ENV === "test",

  APP_NAME: optional(
    process.env.NEXT_PUBLIC_APP_NAME,
    "Agency CRM",
  ),

  APP_URL: optional(
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
  ),

  API_URL: required(
    process.env.NEXT_PUBLIC_API_URL,
    "NEXT_PUBLIC_API_URL",
  ),

  APP_VERSION: optional(
    process.env.NEXT_PUBLIC_APP_VERSION,
    "1.0.0",
  ),

  GOOGLE_ANALYTICS_ID: optional(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  ),

  GTM_ID: optional(
    process.env.NEXT_PUBLIC_GTM_ID,
  ),
} as const;