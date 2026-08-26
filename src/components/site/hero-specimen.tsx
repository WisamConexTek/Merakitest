'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Phone } from 'lucide-react'
import { COMPANY } from '@/lib/i18n'
import { LAYER_SOLID, type LayerCode } from './iso'
import { useReducedMotion } from './motion-fx'

/* ═══════════════════════════════════════════════════════════
   THE HERO — SPECIMEN

   Three printed samples put down on a surface, and the slider
   deals a new one every five seconds. Whichever layer is being
   talked about comes to the front and lies flat; the other two
   stay at the angle they were dropped.

   ── Why a slider at all ──
   The estate is four layers and the pitch is different for each.
   One static headline has to pick a layer and lose the rest, or
   generalise until it says nothing. Three slides buy three
   arguments — at the cost that most visitors only ever see the
   first, so SLIDE ONE HAS TO WORK ALONE. It does: it is the
   estate itself, which is what a first-time reader came for.

   ── Why the fan geometry is in CSS, not here ──
   The cards need one layout below xl (a single card, crossfading)
   and another above it (three in a row at their dropped angles).
   Measuring the viewport in an effect to decide would mount the
   wrong one for a frame and swap visibly on first paint, so the
   two layouts are a media query in globals.css and this component
   only ever says which card is live.

   ── Why three siblings rather than two columns ──
   On a phone the picture has to come between the lede and the
   actions, or it lands a screen below the fold and the direction
   loses the only thing that makes it itself. One DOM order, two
   placements: normal flow on small screens, explicit grid cells
   from xl.

   ── Timing ──
   Five seconds a slide. A click jumps and RESTARTS the clock
   rather than merely advancing, so a reader who wants to hold one
   slide can — which matters when two people share a screen.
   ═══════════════════════════════════════════════════════════ */

const HOLD = 5000

type Slide = {
  kick: string
  head: [string, string]
  lede: string
  card: { code: string; title: string; line: string; layer: LayerCode }
  img: { src: string; alt: string }
}

/* Card codes span layers where the engagement does — the estate card is
   L1–L2 because identity and compute are one piece of work, not two. */
const SLIDES: Slide[] = [
  {
    kick: 'Estate & data centre',
    head: ['The room, and', 'everything in it.'],
    lede:
      'Consolidation, hardware refresh and data center transformation services in Greensboro, NC — planned from a survey of what you actually have, not from a catalogue of what we would like to sell.',
    card: {
      code: 'L1–L2',
      title: 'Estate & data centre',
      line: 'Consolidation, refresh and transformation — designed from a survey.',
      layer: 'L1',
    },
    img: { src: '/hero/estate.jpg', alt: 'Illustration of a data hall aisle lined with cabinets' },
  },
  {
    kick: 'Network & edge',
    head: ['The way in.', 'The way through.'],
    lede:
      'Segmentation, WAF, DDoS absorption and identity-aware access, so a request is judged on who is asking rather than on where the packet says it came from.',
    card: {
      code: 'L3',
      title: 'Network & edge',
      line: 'Segmentation, WAF and identity-aware access at every door.',
      layer: 'L3',
    },
    img: { src: '/hero/network.jpg', alt: 'Illustration of fibre patch leads seated in an optical panel' },
  },
  {
    kick: 'Security operations',
    head: ['The people who stay up.', 'Your 24/7 MSSP.'],
    lede:
      'Managed cybersecurity detection, triage and response across all four layers, run by the engineers who designed the environment — which is why they can tell odd from wrong.',
    card: {
      code: 'L4',
      title: 'Security operations',
      line: 'Detection, triage and response, by the team that built it.',
      layer: 'L4',
    },
    img: { src: '/hero/operations.jpg', alt: 'Illustration of an operations wall of monitoring screens' },
  },
]

/* How each card was dropped: the vertical stagger and the angle. Small and
   uneven on purpose — a regular rhythm reads as a grid, not as a hand. */
const DROP = [
  { y: '0px', rot: '-3deg' },
  { y: '-46px', rot: '2deg' },
  { y: '18px', rot: '-1.4deg' },
]

/* Cyan is unreadable as label text on white, so L4 gets a darkened cousin.
   The spine above it stays the true brand colour. */
const CODE_INK: Record<LayerCode, string> = {
  L1: LAYER_SOLID.L1,
  L2: LAYER_SOLID.L2,
  L3: LAYER_SOLID.L3,
  L4: '#22a8c2',
}

export function HeroSpecimen() {
  const [live, setLive] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const reduced = useReducedMotion()

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    if (reduced) return
    timer.current = setInterval(() => setLive((i) => (i + 1) % SLIDES.length), HOLD)
  }, [reduced])

  useEffect(() => {
    start()
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [start])

  const go = useCallback(
    (i: number) => {
      setLive(i)
      start()
    },
    [start],
  )

  const slide = SLIDES[live]

  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-24 sm:pb-20 lg:pb-24 lg:pt-32">
      {/* One wash of brand light, kept well under the level where it would
          start reading as a shape of its own */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] -top-[28%] size-[900px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(91,67,249,0.13) 0%, rgba(72,231,255,0.07) 42%, rgba(244,245,250,0) 70%)',
        }}
      />

      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-10 px-5 sm:px-8 xl:grid xl:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] xl:gap-x-16 xl:gap-y-10">
        {/* ── The argument ── */}
        <div className="xl:col-start-1 xl:row-start-1 xl:self-end">
          <div className="flex items-center gap-4">
            <span aria-hidden className="block h-px w-8 bg-graphite/25" />
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-graphite-3">
              {String(live + 1).padStart(2, '0')}
              <span className="mx-2 opacity-40">·</span>
              {slide.kick}
            </span>
          </div>

          {/* aria-live tells a screen reader the copy changed underneath it,
              which an autoplaying slider otherwise hides completely */}
          <div aria-live="polite" aria-atomic="true">
            <h1 className="font-display-xl mt-6 text-[clamp(2.2rem,4.4vw,3.5rem)] text-graphite">
              <span className="block">{slide.head[0]}</span>
              <span className="block">{slide.head[1]}</span>
            </h1>
            {/* ── Why this box has a fixed height ──
                The three ledes are not the same length — slide one runs to
                four lines, the other two wrap at three — and this paragraph
                is the only thing on the page whose own height used to
                decide the page's height. Every five seconds the section
                would grow or shrink by that one line and shove the entire
                rest of the site down and back up with it, which is what
                read as the page "breathing." Reserving the WORST CASE (measured:
                111px at sm+, 98px below it — both rounded up here) fixes
                the section's height regardless of which slide is live; the
                shorter two just leave a little air at the bottom, same
                trade the service cards make. */}
            <div className="mt-6 h-[100px] max-w-[30rem] sm:h-[114px]">
              <p className="text-[15px] leading-relaxed text-graphite-2 sm:text-[17px]">
                {slide.lede}
              </p>
            </div>
          </div>
        </div>

        {/* ── The samples ── */}
        <div className="spec-stage xl:col-start-2 xl:row-start-1 xl:row-span-2 xl:self-center">
          {SLIDES.map((s, i) => (
            <button
              key={s.card.title}
              type="button"
              onClick={() => go(i)}
              data-on={i === live}
              aria-label={`Show ${s.kick}`}
              aria-current={i === live}
              style={{ '--drop': DROP[i].y, '--rot': DROP[i].rot } as React.CSSProperties}
              className="spec-card group cursor-pointer overflow-hidden rounded-[18px] bg-paper-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              <span className="relative block aspect-[760/486] w-full overflow-hidden bg-paper-3">
                <Image
                  src={s.img.src}
                  alt={s.img.alt}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1280px) 280px, 92vw"
                  className="object-cover saturate-[0.75] transition-[filter] duration-700 group-data-[on=true]:saturate-100"
                />
              </span>
              <span
                aria-hidden
                className="block h-1.5 w-full"
                style={{ background: LAYER_SOLID[s.card.layer] }}
              />
              <span className="block px-5 pb-6 pt-5">
                <span
                  className="font-mono-ui block text-[11px] tracking-[0.2em]"
                  style={{ color: CODE_INK[s.card.layer] }}
                >
                  {s.card.code}
                </span>
                <span className="font-display mt-3 block text-[clamp(1.1rem,1.4vw,1.35rem)] text-graphite">
                  {s.card.title}
                </span>
                <span className="mt-3 block text-[13.5px] leading-relaxed text-graphite-3">
                  {s.card.line}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* ── Actions, proof, and the clock ── */}
        <div className="xl:col-start-1 xl:row-start-2 xl:self-start">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-graphite py-3 pe-3 ps-7 text-[15px] font-medium text-white transition-colors duration-500 hover:bg-violet"
            >
              Talk to an engineer
              <span className="flex size-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
            <a
              href={COMPANY.phoneHref}
              className="inline-flex items-center gap-2.5 rounded-full border border-graphite/15 px-6 py-3.5 text-[15px] font-medium text-graphite transition-colors duration-500 hover:border-graphite/40"
            >
              <Phone className="size-4 text-violet" />
              {COMPANY.phoneDisplay}
            </a>
          </div>

          <div className="mt-10 flex items-stretch gap-6 border-t border-graphite/10 pt-6 sm:gap-10">
            {[
              { n: String(COMPANY.founded), l: 'Founded' },
              { n: COMPANY.expertiseYears, l: 'Years combined' },
              { n: '24/7', l: 'Monitored' },
            ].map((s, i) => (
              <div key={s.l} className="flex items-stretch gap-6 sm:gap-10">
                {i > 0 && <span aria-hidden className="w-px bg-graphite/10" />}
                <div>
                  <span className="font-num block text-[clamp(1.4rem,2.2vw,1.9rem)] leading-none text-graphite">
                    {s.n}
                  </span>
                  <span className="font-mono-ui mt-2 block whitespace-nowrap text-[10px] uppercase tracking-[0.16em] text-graphite-3">
                    {s.l}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── The clock, made visible ──
              Three rules, the live one filling across its five seconds. The
              fill element is keyed on the live index so React remounts it on
              every change and the animation restarts — including when a click
              resets the clock rather than merely advancing it. */}
          <div className="mt-9 flex items-center gap-5">
            {SLIDES.map((s, i) => (
              <button
                key={s.kick}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${s.kick}`}
                aria-current={i === live}
                className="group flex cursor-pointer items-center gap-3 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              >
                <span
                  className={`font-mono-ui text-[11px] tracking-[0.16em] transition-colors duration-500 ${
                    i === live ? 'text-graphite' : 'text-graphite-3/60 group-hover:text-graphite-3'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative block h-0.5 w-16 overflow-hidden bg-graphite/15 sm:w-20">
                  <span
                    key={`${i}-${live}`}
                    className={`spec-fill absolute inset-0 origin-left bg-graphite ${
                      i === live ? 'is-live' : ''
                    }`}
                    style={{ animationDuration: `${HOLD}ms` }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
