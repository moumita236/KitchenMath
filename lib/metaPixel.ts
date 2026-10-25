/**
 * Meta (Facebook/Instagram) Pixel helpers.
 * The Pixel only loads when NEXT_PUBLIC_META_PIXEL_ID is set (see .env.example),
 * so every call here is a safe no-op until then.
 */
export const META_PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID || "").replace(/\D/g, "");

type Fbq = (command: "track" | "trackCustom" | "init", event: string, params?: Record<string, unknown>) => void;

/** Sends a standard Meta event, e.g. trackMeta("Lead", { content_name: "enquiry" }). */
export function trackMeta(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !META_PIXEL_ID) return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") fbq("track", event, params);
}
