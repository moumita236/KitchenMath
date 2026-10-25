import { ContactDetails, ContactNextSteps } from "@/components/company/ContactDetails";
import { Check, ClipboardCheck, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/company/ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SERVICES } from "@/lib/content/company";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: `Contact ${SITE.name}: Book a Free Restaurant Growth Audit`,
  description: `Send your restaurant details for a free growth audit, email ${SITE.company.email}, or visit our Mumbai office. We reply within one business day.`,
  path: "/contact",
});

/**
 * Contact page = the landing page for ads.
 * Order on phones: short headline → enquiry form → what the audit covers → next steps → other ways to reach us.
 * On laptops & desktops the form sits on the right of the first screen, the headline and audit list on the left.
 */
export default function ContactPage() {
  return (
    <>
      {/* 1 · FORM FIRST (deep band) */}
      <section className="relative isolate overflow-hidden bg-inverse" aria-labelledby="contact-title">
        <div className="grid-lines grid-lines-inverse grid-fade absolute inset-0 -z-10 opacity-70" aria-hidden />
        <div className="absolute inset-0 -z-10 [background:radial-gradient(55%_60%_at_100%_0%,rgb(var(--accent)/0.16),transparent_70%),radial-gradient(45%_55%_at_0%_100%,rgb(var(--star)/0.10),transparent_70%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-[linear-gradient(90deg,transparent,rgb(var(--star))_30%,rgb(var(--star))_70%,transparent)] opacity-55" aria-hidden />

        <div className="container grid gap-6 pb-12 pt-6 sm:gap-8 sm:pb-16 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-8 lg:pb-20 lg:pt-12 xl:gap-x-16">
          {/* Headline: top on phones, top-left on desktop */}
          <div className="text-on-inverse lg:col-start-1 lg:row-start-1">
            <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} onDark />
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-on-inverse/20 bg-on-inverse/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-bright backdrop-blur sm:mt-6 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-star" aria-hidden /> Free growth audit
            </p>
            <h1 id="contact-title" className="mt-3 text-[1.85rem] font-semibold leading-[1.08] text-on-inverse sm:mt-5 sm:text-5xl lg:text-[3.1rem]">
              <span className="text-accent-bright">Find where your restaurant</span>{" "}
              <span className="font-serif font-normal italic">is losing profit.</span>
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-on-inverse/80 sm:mt-5 sm:text-lg">
              Share a few details. A growth consultant will call you within one business day.
            </p>
          </div>

          {/* Enquiry form: right after the headline on phones, right column on desktop */}
          <div
            id="enquiry"
            className="contact-card scroll-mt-24 overflow-hidden rounded-[24px] p-5 sm:rounded-[28px] sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="contact-icon grid h-11 w-11 shrink-0 place-items-center rounded-2xl sm:h-12 sm:w-12"><ClipboardCheck className="h-5 w-5" aria-hidden /></span>
              <div>
                <h2 className="text-lg font-extrabold text-white sm:text-2xl">Book your free growth audit</h2>
                <p className="mt-1 text-sm text-white/65 sm:text-[15px]">Takes under a minute. We reply by phone, WhatsApp or email.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Free", "No obligation", "1 business day reply"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-star px-3 py-1 text-xs font-bold text-[#0F0A06]"><Check className="h-3.5 w-3.5" aria-hidden />{t}</span>
              ))}
            </div>
            <hr className="mt-5 h-px border-0 bg-white/[0.12]" aria-hidden />
            <div className="mt-5"><ContactForm tone="panel" /></div>
          </div>

          {/* What the audit covers: below the form on phones, under the headline on desktop */}
          <div className="text-on-inverse lg:col-start-1 lg:row-start-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-star-text">What we look at in your audit</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <li key={s.id} className="flex gap-3 rounded-2xl border border-on-inverse/10 bg-on-inverse/[0.04] p-4">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-star text-star-ink"><Check className="h-3.5 w-3.5" aria-hidden /></span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-on-inverse">{s.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-on-inverse/65">{s.summary}</span>
                  </span>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-on-inverse/75">
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-star-text" aria-hidden /> Reply within one business day</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-star-text" aria-hidden /> Your details are only used to reply</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2 · WHAT HAPPENS NEXT + MAP */}
      <section className="pb-4 pt-2 sm:pt-6" aria-label="What happens next">
        <div className="container">
          <ContactNextSteps />
        </div>
      </section>

      {/* 3 · OTHER WAYS TO REACH US */}
      <section className="py-14 sm:py-20" aria-labelledby="other-ways">
        <div className="container grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
          <div>
            <p className="eyebrow text-star-dark">Prefer to talk first?</p>
            <h2 id="other-ways" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Other ways to reach us</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Email the team, pick a topic to start your enquiry, or visit our office in {SITE.company.location || "Mumbai"}.
            </p>
            <a href="#enquiry" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 font-semibold brand-gradient text-accent-ink shadow-glow [text-shadow:0_1px_2px_rgb(0_0_0/0.28)] transition hover:brightness-110">
              <ClipboardCheck className="h-4 w-4" aria-hidden /> Back to the form
            </a>
          </div>
          <ContactDetails />
        </div>
      </section>
    </>
  );
}
