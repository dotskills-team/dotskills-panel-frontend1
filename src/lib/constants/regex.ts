export const REGEX = {
  EMAIL:
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  PHONE:
    /^(?:\+880|0)[1-9]\d{7,9}$/,

  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,

  OBJECT_ID:
    /^[a-f\d]{24}$/i,
} as const;