'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { SERVICES_DATA, type ServiceDetail } from '@/lib/services-data'
import { Reveal } from './primitives'
import { LAYER_SOLID, LAYER_NAME } from './iso'
import { ServiceObject } from './iso-objects'

/* ═══════════════════════════════════════════════════════════
   SERVICES — four to a row

   ── The card opens, and the grid does not move ──
   Hovering a card expands a footer carrying the call to action. In
   a plain grid that would grow the whole row track and shove every
   neighbour down, so instead each cell is a fixed-height box and
   the card inside is absolutely centred in it. Growth then happens
   in BOTH directions out of a stationary cell — the card pushes out
   of the row, and nothing around it shifts by a pixel.

   Every collapsed card is the same height (the copy block carries a
   min-height), so centring them in equal cells lines their tops up
   as if they were in normal flow.

   Height animates with a 0fr → 1fr grid row rather than a max-height
   guess: `max-height` has to be set larger than the content will
   ever be, so the transition spends most of its duration animating
   empty space and the easing never lands where you asked. `1fr`
   resolves to the real measured height.

   ── Why the SERVICES banner no longer drifts ──
   It used to be a tall panel sitting BEHIND the cards, parallax-
   scrolling down the page — a nice trick at the section's original
   height, but it meant the panel was almost entirely hidden behind
   the grid at every scroll position except a brief window, which
   read as a bug once the cards themselves got more compact rather
   than as depth. It is a plain, fully visible, non-overlapping
   banner pinned above the grid now — no motion, no measuring
   effect, nothing that can be covered by something else.
   ═══════════════════════════════════════════════════════════ */

/* THE card. Every service card on the site is this component — homepage,
   /services and the "elsewhere on the stack" row all render it, so the
   behaviour can never drift between pages.

   ── Why the well is a fixed height, not aspect-square ──
   The first version tied the well's height to the column width (an
   aspect-square), which is exactly why eight cards needed two screens of
   scrolling: at four columns the well alone was ~300px tall. A FIXED well
   height decouples card height from column width entirely, which is also
   what let `.tile-sizer` stop being a percentage-of-width trick and become
   one plain measured pixel value — see globals.css. */
export function ServiceTile({ service, index = 0 }: { service: ServiceDetail; index?: number }) {
  return (
    <Reveal delay={Math.min(index, 7) * 0.05} className="group relative">
      {/* Gives the cell exactly the card's height, so the row gap the grid
          asks for is the row gap you get. */}
      <div className="tile-sizer" aria-hidden />
      <Link
        href={`/services/${service.slug}`}
        className="surface absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 flex-col p-[18px] transition-shadow duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:z-20 group-hover:shadow-[0_4px_8px_rgba(10,12,31,.06),0_24px_56px_rgba(10,12,31,.09),0_60px_120px_rgba(30,30,155,.08)]"
      >
        {/* Fixed-height well, filled by the object */}
        {/* ── Why the object is sized by HEIGHT, not width ──
            Every ServiceObject shares one viewBox (188×180, see
            iso-objects.tsx) regardless of which boxes it actually draws, so
            scaling it by a PERCENTAGE OF WIDTH made its rendered height a
            function of the column width — at four columns that height ran
            past this fixed-height well and the taller arrangements (the
            stacked ones especially) clipped against the top and bottom of
            their own frame. A fixed pixel HEIGHT with the width left to
            follow the viewBox's own ratio is the only sizing that can never
            exceed the well, at any column width. */}
        <div className="relative flex h-[140px] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-paper-3/80">
          <ServiceObject slug={service.slug} layer={service.layer} className="h-[104px] w-auto" />
          <span className="font-mono-ui absolute left-3 top-3 text-[10px] tracking-[0.16em] text-graphite-3">
            {service.layer}
          </span>
        </div>

        {/* Truly fixed height, not a min-height. The cell's height is a
            plain pixel value now (see .tile-sizer) rather than derived from
            the column width, and that value is only constant if this block
            never grows. A min-height let it: the longest titles wrap to a
            third line at the narrowest four-column layout and pushed the
            card past its cell, which is exactly the uneven spacing this was
            meant to prevent.

            Two lines of title, two of summary — the worst case — and
            shorter cards carry the slack at the bottom. That slack is what
            the hover footer opens into, so it reads as breathing room
            rather than as a gap. */}
        <div className="h-[120px] px-0.5 pt-4">
          <h3 className="font-display line-clamp-2 text-[1.02rem] uppercase leading-tight tracking-[-0.01em] text-graphite">
            {service.title}
          </h3>
          <p className="mt-2.5 line-clamp-2 text-[13.5px] leading-relaxed text-graphite-2">
            {service.summary}
          </p>
        </div>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="flex items-center justify-end gap-2.5 px-0.5 pt-3">
              <span className="text-[13.5px] font-medium text-graphite">Learn more</span>
              <span className="flex size-9 items-center justify-center rounded-lg bg-graphite text-white transition-colors duration-500 group-hover:bg-violet">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

export function ServicesSection() {
  const { t } = useLang()

  return (
    <section className="relative overflow-hidden bg-paper py-10 sm:py-12">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        {/* ── Section head ── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono-ui text-[13px] text-graphite-3">02</span>
                <span className="h-px w-8 bg-graphite/20" />
                <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">
                  {t('servicesKicker')}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display-xl mt-4 text-[clamp(1.7rem,3.6vw,2.5rem)] text-graphite">
                {t('servicesTitle')}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-graphite-2">
                {t('servicesLede')}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.18}>
            <Link
              href="/services"
              className="group inline-flex shrink-0 items-center gap-3 text-[15px] font-medium text-graphite-2 transition-colors duration-500 hover:text-graphite"
            >
              Learn more
              <span className="flex size-8 items-center justify-center rounded-full bg-graphite/8 transition-colors duration-500 group-hover:bg-violet group-hover:text-white">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </Reveal>
        </div>

        {/* ── The SERVICES banner ──
            This used to be a tall panel sitting BEHIND the cards, drifting
            down the page on scroll — which meant it read as almost entirely
            hidden: only a strip down the left edge was ever on show, and
            that strip moved. A banner that is pinned in normal flow, full
            width, and never covered by anything is the fix for both
            complaints at once — it is always fully visible, and it never
            needs to be found underneath something else. */}
        <Reveal delay={0.1}>
          <div className="relative mt-6 overflow-hidden rounded-[22px] bg-graphite px-6 py-6 sm:mt-8 sm:px-8 sm:py-7">
            {/* Faint machine texture — real config lines, not lorem — spans
                the whole banner as ambient background rather than content
                that has to fit inside it. */}
            <pre className="font-mono-ui pointer-events-none absolute inset-y-0 right-8 hidden w-[420px] overflow-hidden text-[10px] leading-[1.9] text-white/[0.07] md:block">{`layer L1  identity
  mfa            enforced
  standing_admin denied
layer L2  compute
  backup         immutable
  restore_test   quarterly
layer L3  edge
  waf            tuned
  zero_trust     per-identity
layer L4  soc
  monitoring     24/7/365
  escalation     agreed`}</pre>

            <div className="relative flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h3 className="font-display-xl text-[clamp(1.6rem,3.2vw,2.2rem)] uppercase tracking-[-0.02em] text-white">
                Managed IT & Cloud Services
              </h3>
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-white/40">
                Eight disciplines · four layers
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── The grid ── */}
        <div className="relative z-10 mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES_DATA.map((service, i) => (
            <ServiceTile key={service.slug} service={service} index={i} />
          ))}
        </div>

        {/* Legend — the four layers the cards are colour-coded by */}
        <Reveal>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
            {(['L4', 'L3', 'L2', 'L1'] as const).map((l) => (
              <span key={l} className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-[3px]" style={{ background: LAYER_SOLID[l] }} />
                <span className="font-mono-ui text-[11px] tracking-[0.1em] text-graphite-3">
                  {l}
                </span>
                <span className="text-[13px] text-graphite-2">{LAYER_NAME[l]}</span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
