"use client";

import Script from "next/script";
import { useEffect } from "react";
import { GA_MEASUREMENT_ID, trackGA } from "@/lib/googleAnalytics";

/**
 * Loads Google Analytics 4 on every page and reports:
 *  - page_view:      automatic (GA4 "Enhanced measurement" also counts page changes inside the site)
 *  - generate_lead:  sent from lib/leads.ts when a form is submitted successfully
 *  - contact:        when someone taps a WhatsApp, phone or email link
 * Renders nothing until NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 */
export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) trackGA("contact", { method: "whatsapp" });
      else if (href.startsWith("tel:")) trackGA("contact", { method: "phone" });
      else if (href.startsWith("mailto:")) trackGA("contact", { method: "email" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
