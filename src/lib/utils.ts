import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
}

export function removeEmptyFields<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) =>
        value !== "" &&
        value !== undefined &&
        value !== null,
    ),
  ) as Partial<T>;
}

export function deepClone<T>(value: T): T {
  return structuredClone(value);
}

export function capitalize(text: string): string {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function titleCase(text: string): string {
  return text
    .trim()
    .split(/\s+/)
    .map(capitalize)
    .join(" ");
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function truncate(
  value: string,
  length = 80,
): string {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length)}...`;
}

export function randomInt(
  min: number,
  max: number,
): number {
  return Math.floor(
    Math.random() * (max - min + 1),
  ) + min;
}

export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(Math.max(value, min), max);
}

export function uniqueArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function chunkArray<T>(
  array: T[],
  size: number,
): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, ms),
  );
}

export function buildQueryString(
  params: Record<string, unknown>,
): string {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      search.append(key, String(value));
    }
  });

  return search.toString();
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}