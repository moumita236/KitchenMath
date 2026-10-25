/**
 * Google Analytics 4 helpers.
 * GA only loads when NEXT_PUBLIC_GA_MEASUREMENT_ID is set (see .env.example),
 * so every call here is a safe no-op until then.
 */
export const GA_MEASUREMENT_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");

type Gtag = (command: "event" | "config" | "js", target: string | Date, params?: Record<string, unknown>) => void;

/** Sends a GA4 event, e.g. trackGA("generate_lead", { form_name: "Free growth audit" }). */
export function trackGA(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") gtag("event", event, params);
}
