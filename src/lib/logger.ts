import { env } from "./env";

type LogData = unknown;

const print = (
  method: "log" | "info" | "warn" | "error",
  message: string,
  data?: LogData,
) => {
  if (!env.IS_DEV) return;

  const time = new Date().toISOString();

  console[method](
    `[${time}] ${message}`,
    data ?? "",
  );
};

export const logger = {
  log(message: string, data?: LogData) {
    print("log", message, data);
  },

  info(message: string, data?: LogData) {
    print("info", message, data);
  },

  warn(message: string, data?: LogData) {
    print("warn", message, data);
  },

  error(message: string, data?: LogData) {
    print("error", message, data);
  },

  api(
    method: string,
    url: string,
    status?: number,
  ) {
    if (!env.IS_DEV) return;

    console.info(
      `[API] ${method.toUpperCase()} ${url}${
        status ? ` (${status})` : ""
      }`,
    );
  },

  table(data: unknown[]) {
    if (!env.IS_DEV) return;

    console.table(data);
  },

  group(title: string, callback: () => void) {
    if (!env.IS_DEV) return;

    console.group(title);

    callback();

    console.groupEnd();
  },
};

export default logger;