/**
 * Sends a form submission to /api/lead, which forwards it to your Google Sheet.
 * See google-apps-script/SETUP.md for the one-time sheet setup.
 */
import { trackMeta } from "@/lib/metaPixel";
import { getAttribution } from "@/lib/attribution";
import { trackGA } from "@/lib/googleAnalytics";

export type LeadFormType = "enquiry" | "scorecard";

export interface LeadPayload {
  formType: LeadFormType;
  name: string;
  restaurant: string;
  phone?: string;
  email?: string;
  city?: string;
  platforms?: string[];
  message?: string;
  /** Scorecard only: overall score and a score per area. */
  overallScore?: number | null;
  areaScores?: Record<string, number | null>;
  priorities?: string[];
  /** Honeypot: real visitors never fill this. */
  website?: string;
}

export async function submitLead(payload: LeadPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // getAttribution(): which ad / website brought this visitor (UTM tags), saved in the sheet's Source columns.
      body: JSON.stringify({ ...payload, ...getAttribution(), page: typeof window !== "undefined" ? window.location.pathname : "" }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (res.ok && data.ok) {
      // Tell Meta a real lead came in, so "Leads" ad campaigns can optimise for it.
      // Honeypot (bot) submissions are skipped.
      if (!payload.website) {
        const formName = payload.formType === "scorecard" ? "Growth scorecard" : "Free growth audit";
        trackMeta("Lead", { content_name: formName });
        // Google Analytics: mark "generate_lead" as a Key event in GA4 to count it as a conversion.
        trackGA("generate_lead", { form_name: formName });
      }
      return { ok: true };
    }
    return { ok: false, error: data.error || "We couldn't send your details. Please try again." };
  } catch {
    return { ok: false, error: "No internet connection. Please check it and try again." };
  }
}
