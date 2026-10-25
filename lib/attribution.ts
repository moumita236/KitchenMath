/**
 * Remembers where a visitor came from (UTM tags on the ad link, a Meta click id, or the
 * referring website), so each form submission can be saved with its source in the Google Sheet.
 * Kept in this browser's local storage for 30 days. Nothing is sent anywhere until a form is submitted.
 */
export interface Attribution {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  /** First page the visitor landed on from that source, e.g. "/contact". */
  landingPage: string;
}

const KEY = "km:attribution";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const EMPTY: Attribution = { utmSource: "", utmMedium: "", utmCampaign: "", utmContent: "", utmTerm: "", landingPage: "" };

const clean = (v: string | null, max = 100) => (v ?? "").trim().slice(0, max);

function read(): (Attribution & { at: number }) | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Attribution & { at: number };
    if (!v || typeof v.at !== "number" || Date.now() - v.at > MAX_AGE_MS) return null;
    return v;
  } catch {
    return null;
  }
}

function write(v: Attribution) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...v, at: Date.now() }));
  } catch {
    /* storage blocked (private mode): the lead is still saved, just without a source */
  }
}

/** Call on every page load. A new ad click always replaces the saved source; a plain referral only fills an empty one. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const q = new URLSearchParams(window.location.search);
  const landingPage = clean(window.location.pathname, 200);

  const utm: Attribution = {
    utmSource: clean(q.get("utm_source")),
    utmMedium: clean(q.get("utm_medium")),
    utmCampaign: clean(q.get("utm_campaign")),
    utmContent: clean(q.get("utm_content")),
    utmTerm: clean(q.get("utm_term")),
    landingPage,
  };

  if (utm.utmSource || utm.utmCampaign) return write(utm);

  // Meta adds ?fbclid=… to ad and post links even without UTM tags.
  if (q.get("fbclid")) return write({ ...EMPTY, utmSource: "meta", utmMedium: "click (no UTM tags)", landingPage });

  if (read()) return;

  // Another website (Google, Instagram app browser, WhatsApp web…) sent them here.
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.hostname && ref.hostname !== window.location.hostname) {
      write({ ...EMPTY, utmSource: clean(ref.hostname.replace(/^www\./, "")), utmMedium: "referral", landingPage });
    }
  } catch {
    /* unreadable referrer: ignore */
  }
}

/** The saved source for this visitor, or empty strings if none (direct visit). */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;
  const v = read();
  if (!v) return EMPTY;
  const { utmSource, utmMedium, utmCampaign, utmContent, utmTerm, landingPage } = v;
  return { utmSource, utmMedium, utmCampaign, utmContent, utmTerm, landingPage };
}
