import { env } from "./env";

declare global {
  interface Window {
    gtag?: (
      command: string,
      target: string,
      params?: Record<string, unknown>,
    ) => void;

    dataLayer?: unknown[];
  }
}

const enabled =
  typeof window !== "undefined" &&
  env.IS_PROD &&
  !!env.GOOGLE_ANALYTICS_ID;

export const analytics = {
  pageView(path: string) {
    if (!enabled || !window.gtag) return;

    window.gtag("config", env.GOOGLE_ANALYTICS_ID, {
      page_path: path,
    });
  },

  event(
    name: string,
    params?: Record<string, unknown>,
  ) {
    if (!enabled || !window.gtag) return;

    window.gtag("event", name, params);
  },

  login(method = "credentials") {
    this.event("login", { method });
  },

  logout() {
    this.event("logout");
  },

  search(searchTerm: string) {
    this.event("search", {
      search_term: searchTerm,
    });
  },

  generateLead(source?: string) {
    this.event("generate_lead", {
      source,
    });
  },

  purchase(
    transactionId: string,
    value: number,
    currency = "BDT",
  ) {
    this.event("purchase", {
      transaction_id: transactionId,
      value,
      currency,
    });
  },

  exception(
    description: string,
    fatal = false,
  ) {
    this.event("exception", {
      description,
      fatal,
    });
  },
};

export default analytics;