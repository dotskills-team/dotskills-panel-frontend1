import { REGEX } from "./constants";

export function isEmail(value: string): boolean {
  return REGEX.EMAIL.test(value.trim());
}

export function isPhone(value: string): boolean {
  return REGEX.PHONE.test(value.trim());
}

export function isStrongPassword(value: string): boolean {
  return REGEX.PASSWORD.test(value);
}

export function isObjectId(value: string): boolean {
  return REGEX.OBJECT_ID.test(value);
}

export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

export function minLength(value: string, length: number): boolean {
  return value.trim().length >= length;
}

export function maxLength(value: string, length: number): boolean {
  return value.trim().length <= length;
}

export function isPositiveNumber(value: number): boolean {
  return value > 0;
}

export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isAllowedFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function isAllowedFileSize(file: File, maxSizeInMB: number): boolean {
  const maxBytes = maxSizeInMB * 1024 * 1024;

  return file.size <= maxBytes;
}
