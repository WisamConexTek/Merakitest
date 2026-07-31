'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowUpRight,
  Layers,
  Server,
  Network,
  ShieldCheck,
  Radar,
  HardDrive,
  Workflow,
  LifeBuoy,
} from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { SERVICES_DATA, type ServiceDetail } from '@/lib/services-data'
import { Reveal } from './primitives'
import { LAYER_SOLID, LAYER_NAME } from './iso'
import { ServiceObject } from './iso-objects'
import { useReducedMotion } from './motion-fx'

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

   ── The panel drift ──
   The dark SERVICES panel travels against the scroll across the
   whole section. It is the only parallax on the site, which is what
   keeps it reading as deliberate rather than as a tic.
   ═══════════════════════════════════════════════════════════ */

const ICON_MAP: Record<string, typeof Layers> = {
  Layers,
  Server,
  Network,
  ShieldCheck,
  Radar,
  HardDrive,
  Workflow,
  LifeBuoy,
}

/* THE card. Every service card on the site is this component — homepage,
   /services and the "elsewhere on the stack" row all render it, so the
   behaviour can never drift between pages.

   Proportions are taken from the reference rather than invented: the image
   well is very nearly SQUARE and takes about two thirds of the card's
   height. The first pass had a wide, short well with a small emblem
   floating in it, which is most of why the cards read as thin — a frame
   that size wants a real object filling it, not a badge. */
export function ServiceTile({ service, index = 0 }: { service: ServiceDetail; index?: number }) {
  return (
    <Reveal delay={Math.min(index, 7) * 0.05} className="group relative">
      {/* Gives the cell exactly the card's height, so the row gap the grid
          asks for is the row gap you get. */}
      <div className="tile-sizer" aria-hidden />
      <Link
        href={`/services/${service.slug}`}
        className="surface absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 flex-col p-5 transition-shadow duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:z-20 group-hover:shadow-[0_4px_8px_rgba(10,12,31,.06),0_24px_56px_rgba(10,12,31,.09),0_60px_120px_rgba(30,30,155,.08)]"
      >
        {/* Square well, filled by the object */}
        <div className="relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-paper-3/80">
          <ServiceObject slug={service.slug} layer={service.layer} className="w-[94%]" />
          <span className="font-mono-ui absolute left-4 top-4 text-[10px] tracking-[0.16em] text-graphite-3">
            {service.layer}
          </span>
        </div>

        {/* Truly fixed height, not a min-height. The cell's height is derived
            from the column width plus a constant (see .tile-sizer), and that
            constant is only constant if this block never grows. A min-height
            let it: the longest titles wrap to three lines at the narrowest
            four-column layout and pushed the card 11px past its cell, which
            is exactly the uneven spacing this was meant to prevent.

            So it is sized for the worst case — three-line title, four-line
            summary — and the shorter cards simply carry the slack at the
            bottom. That slack is what the hover footer opens into, so it
            reads as breathing room rather than as a gap. */}
        <div className="h-[200px] px-1 pt-7">
          <h3 className="font-display line-clamp-3 flex min-h-[2.5em] items-start text-[1.05rem] uppercase leading-tight tracking-[-0.01em] text-graphite sm:text-[1.15rem]">
            {service.title}
          </h3>
          <p className="mt-3 line-clamp-4 text-[14px] leading-relaxed text-graphite-2">
            {service.summary}
          </p>
        </div>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="flex items-center justify-end gap-3 px-1 pt-5">
              <span className="text-[15px] font-medium text-graphite">Learn more</span>
              <span className="flex size-11 items-center justify-center rounded-xl bg-graphite text-white transition-colors duration-500 group-hover:bg-violet">
                <ArrowUpRight className="size-5" />
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
  const ref = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  /* How far the panel may fall: the height of the card block minus its own
     height, so its foot lands exactly on the last row and never breaks out
     of the section. Measured rather than guessed — the card block's height
     depends on the column width, which depends on the viewport. */
  const [travel, setTravel] = useState(0)

  useEffect(() => {
    const stage = stageRef.current
    const panel = panelRef.current
    if (!stage || !panel) return

    /* Only below lg is the panel in normal flow, stacked above the cards;
       moving it there would drag a hole through the layout. */
    const wide = window.matchMedia('(min-width: 1024px)')
    const measure = () =>
      setTravel(wide.matches ? Math.max(0, stage.offsetHeight - panel.offsetHeight) : 0)

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    ro.observe(panel)
    wide.addEventListener('change', measure)
    return () => {
      ro.disconnect()
      wide.removeEventListener('change', measure)
    }
  }, [])

  /* Bound to the card block rather than to the whole section, so the fall
     is measured against the thing the panel is falling past. */
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] })
  /* Held still for the first and last eighth of the passage. Mapping the
     full 0→1 means the panel is already moving while the section is still
     off-screen and is still moving after it has left — the travel you
     actually see ends up being the middle sliver of it. Clamping to
     0.12–0.88 spends the whole fall in the part of the scroll where the
     section is on screen, and gives it somewhere to settle at each end.

     This is a mapping, not an animation, so scrolling back up rewinds it
     exactly — no extra code for the return trip. */
  const panelY = useTransform(scrollYProgress, [0.12, 0.88], [0, travel], { clamp: true })


  return (
    <section ref={ref} className="relative overflow-hidden bg-paper py-24 sm:py-32">
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
              <h2 className="font-display-xl mt-7 text-[clamp(1.9rem,4.4vw,3.1rem)] text-graphite">
                {t('servicesTitle')}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-graphite-2">
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

        {/* ── Stage ──
            The dark panel sits UNDER the cards and shows only where they do
            not reach: a band above the first row and a strip down the left.
            That overlap is what gives the block depth — the panel reads as a
            plane behind the cards rather than a tile beside them. */}
        <div ref={stageRef} className="relative mt-14 sm:mt-16">
          <motion.div
            ref={panelRef}
            style={reduced ? undefined : { y: panelY }}
            aria-hidden
            className="relative z-0 mb-8 lg:absolute lg:left-0 lg:top-0 lg:mb-0 lg:w-[430px]"
          >
            <div className="relative h-[300px] overflow-hidden rounded-[26px] bg-graphite p-8 sm:p-10 lg:h-[560px]">
              {/* Faint machine texture — real config lines, not lorem */}
              <pre className="font-mono-ui pointer-events-none absolute inset-x-8 bottom-8 top-36 overflow-hidden text-[10px] leading-[2] text-white/[0.08] sm:inset-x-10 lg:top-44">{`layer L1  identity
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

              {/* Stays lit for the whole fall. The first row of cards does
                  pass in front of it on its way down — the panel is a plane
                  BEHIND the cards, and reading it in fragments is the depth
                  cue. Fading it out instead just left a blank slab. */}
              <h3 className="font-display-xl relative text-[clamp(2.4rem,5.4vw,3.5rem)] uppercase tracking-[-0.02em] text-white">
                Services
              </h3>
              <p className="font-mono-ui relative mt-4 text-[11px] uppercase tracking-[0.2em] text-white/40">
                Eight disciplines · four layers
              </p>
            </div>
          </motion.div>

          {/* Indented on lg so the panel's left edge stays visible beside the
              first card; the cards themselves ride over the rest of it. */}
          <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:ps-[150px] lg:pt-[190px]">
            {SERVICES_DATA.map((service, i) => (
              <ServiceTile key={service.slug} service={service} index={i} />
            ))}
          </div>
        </div>

        {/* Legend — the four layers the cards are colour-coded by */}
        <Reveal>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
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
