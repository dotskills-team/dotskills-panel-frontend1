export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",

  USER: "user",

  THEME: "theme",

  SIDEBAR_STATE: "sidebar_state",

  LANGUAGE: "language",
} as const;

const isBrowser = typeof window !== "undefined";

function getStorage(storage: Storage | undefined) {
  if (!isBrowser || !storage) return null;

  return storage;
}

function setItem<T>(
  storage: Storage | undefined,
  key: string,
  value: T,
): void {
  const target = getStorage(storage);

  if (!target) return;

  target.setItem(key, JSON.stringify(value));
}

function getItem<T>(
  storage: Storage | undefined,
  key: string,
): T | null {
  const target = getStorage(storage);

  if (!target) return null;

  const value = target.getItem(key);

  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function removeItem(
  storage: Storage | undefined,
  key: string,
): void {
  const target = getStorage(storage);

  target?.removeItem(key);
}

function clear(storage: Storage | undefined): void {
  const target = getStorage(storage);

  target?.clear();
}

export const local = {
  set: <T>(key: string, value: T) =>
    setItem(localStorage, key, value),

  get: <T>(key: string) =>
    getItem<T>(localStorage, key),

  remove: (key: string) =>
    removeItem(localStorage, key),

  clear: () => clear(localStorage),
};

export const session = {
  set: <T>(key: string, value: T) =>
    setItem(sessionStorage, key, value),

  get: <T>(key: string) =>
    getItem<T>(sessionStorage, key),

  remove: (key: string) =>
    removeItem(sessionStorage, key),

  clear: () => clear(sessionStorage),
};