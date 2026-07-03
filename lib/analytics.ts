// ─────────────────────────────────────────────────────────────
// Lightweight, privacy-friendly analytics.
// - Respects Do Not Track / Global Privacy Control.
// - In dev: logs to console.
// - In prod: beacons events to a configurable endpoint (no-op by default until
//   you wire Plausible/GA/PostHog — see index.html for the recommended script).
// ─────────────────────────────────────────────────────────────

export interface AnalyticsEvent {
  name: string;
  props?: Record<string, string | number | boolean | undefined>;
}

const ENDPOINT = "/api/track"; // configure to your backend / proxy

function allowed(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    doNotTrack?: string;
    msDoNotTrack?: string;
    globalPrivacyControl?: boolean;
  };
  const dnt = nav.doNotTrack || (window as any).doNotTrack || nav.msDoNotTrack;
  if (dnt === "1" || dnt === "yes") return false;
  if (nav.globalPrivacyControl === true) return false;
  return true;
}

const isProd = import.meta.env?.PROD ?? false;

export function track(event: AnalyticsEvent | string): void {
  const e: AnalyticsEvent =
    typeof event === "string" ? { name: event } : event;

  if (!allowed()) return;

  if (!isProd) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", e.name, e.props ?? {});
    return;
  }

  try {
    const payload = JSON.stringify({
      name: e.name,
      props: e.props ?? {},
      ts: Date.now(),
      path: location.pathname,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, payload);
    } else {
      fetch(ENDPOINT, {
        method: "POST",
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* never let analytics break the app */
  }
}

export function pageview(path?: string): void {
  track({ name: "pageview", props: { path: path ?? location.pathname } });
}
