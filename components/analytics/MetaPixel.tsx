"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { META_PIXEL_ID, trackMeta } from "@/lib/metaPixel";

/**
 * Loads the Meta Pixel on every page and reports:
 *  - PageView: on first load and on every page change
 *  - Contact:  when someone taps a WhatsApp, phone or email link
 *  - Lead:     sent from lib/leads.ts when a form is submitted successfully
 * Renders nothing until NEXT_PUBLIC_META_PIXEL_ID is set.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  // PageView on client-side page changes (the first one is sent by the base code below).
  useEffect(() => {
    if (!META_PIXEL_ID) return;
    if (lastPath.current === null) { lastPath.current = pathname; return; }
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackMeta("PageView");
  }, [pathname]);

  // Contact: any click on a WhatsApp, phone or email link, anywhere on the site.
  useEffect(() => {
    if (!META_PIXEL_ID) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) trackMeta("Contact", { content_name: "whatsapp" });
      else if (href.startsWith("tel:")) trackMeta("Contact", { content_name: "phone" });
      else if (href.startsWith("mailto:")) trackMeta("Contact", { content_name: "email" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}
