// ─────────────────────────────────────────────────────────────
// Error reporting — feeds captured errors into analytics and console.
// Wire a real service (Sentry, etc.) inside reportToService().
// ─────────────────────────────────────────────────────────────

import { track } from "./analytics";

export interface ErrorContext {
  componentStack?: string;
  [key: string]: unknown;
}

/** Forward an error to your error-tracking service. Replace as needed. */
function reportToService(error: unknown, ctx: ErrorContext = {}) {
  // Example (uncomment + add SDK):
  // Sentry.captureException(error, { extra: ctx });
  void error;
  void ctx;
}

export function captureError(error: unknown, ctx: ErrorContext = {}) {
  // Always log in development
  if (!import.meta.env?.PROD) {
    // eslint-disable-next-line no-console
    console.error("[reporting]", error, ctx);
  }
  // Lightweight in-app record (respects DoNotTrack inside track())
  track({
    name: "error",
    props: {
      message: error instanceof Error ? error.message : String(error),
    },
  });
  reportToService(error, ctx);
}

/** Install global listeners for uncaught errors / unhandled rejections. */
export function installGlobalErrorHandlers() {
  if (typeof window === "undefined") return;
  window.addEventListener("error", (e) => {
    captureError(e.error ?? e.message, { type: "window.error" });
  });
  window.addEventListener("unhandledrejection", (e) => {
    captureError(e.reason, { type: "unhandledrejection" });
  });
}
