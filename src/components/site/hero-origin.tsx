'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useScroll } from 'framer-motion'
import { ArrowUpRight, Phone } from 'lucide-react'
import { useLang, COMPANY } from '@/lib/i18n'
import { FACES } from './logo'
import { LAYER_SOLID, LAYER_NAME, type LayerCode } from './iso'
import { useReducedMotion } from './motion-fx'

/* ═══════════════════════════════════════════════════════════
   THE HERO — ORIGIN

   The page opens on the mark. Scroll, and the logo LIES DOWN:
   it tips out of the flat page onto the isometric axis every
   other object on this site is drawn on, its faces separating
   as they go, each one handing over to the layer it was already
   the colour of. The headline arrives inside the result — the
   upper plates pass in FRONT of the words, the lower ones
   behind. Scroll back up and it stands and folds shut.

   ── Why this works at all ──
   The mark is not decoration that happens to sit near a stack
   diagram. Its cyan top plane, its peri left half and its violet
   right half ARE L4, L3 and L2 — same three hexes, no coincidence.
   The logo can open into the architecture because it always was
   the architecture. A generic cube could not do this: it has no
   faces that mean anything, and the transition would be a
   dissolve between two unrelated pictures.

   ── The tilt ──
   A flat plane maps into the isometric ground plane by exactly
   the projection in iso.tsx: x → (x−z)·cos30, y → (x+z)·sin30.
   Interpolating from the identity matrix to that one is not a
   cross-fade — it is the same shape changing its attitude to the
   viewer, which is why the handover to the plates is invisible.

   ── One number ──
   Every moving part is a pure function of the scroll progress p.
   Nothing is a timed animation, nothing has state. That is why it
   rewinds perfectly on the way back up without a line of code
   written for the return trip.
   ═══════════════════════════════════════════════════════════ */

const LAYERS: { code: LayerCode; name: string }[] = [
  { code: 'L1', name: LAYER_NAME.L1 },
  { code: 'L2', name: LAYER_NAME.L2 },
  { code: 'L3', name: LAYER_NAME.L3 },
  { code: 'L4', name: LAYER_NAME.L4 },
]

/* Which layer each of the mark's five faces becomes. The two crossing
   triangles — the pieces that make the mark read as three-dimensional —
   fall together into L1, the layer the flat logo has no plane for. */
const FACE_LAYER: Record<string, number> = {
  top: 3,
  left: 2,
  right: 1,
  'cross-left': 0,
  'cross-right': 0,
}

/* Final screen offsets in viewBox units. Positive is down, so L1 sinks and
   L4 rises — index 0..3 is L1..L4. */
const SPREAD = [16, 5.5, -5.5, -16]

const COS = Math.cos(Math.PI / 6)
const SIN = Math.sin(Math.PI / 6)

function project(x: number, z: number, y: number): [number, number] {
  return [(x - z) * COS, (x + z) * SIN - y]
}

function poly(points: [number, number][]): string {
  return `M${points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L')}Z`
}

/* One plate at elevation zero. Everything that moves it is a transform on the
   wrapping group, so the geometry is built once and never recomputed. */
function platePaths(w = 80, h = 9) {
  const a = -w / 2
  const b = w / 2
  return {
    top: poly([project(a, a, h), project(b, a, h), project(b, b, h), project(a, b, h)]),
    left: poly([project(a, b, h), project(b, b, h), project(b, b, 0), project(a, b, 0)]),
    right: poly([project(b, a, h), project(b, b, h), project(b, b, 0), project(b, a, 0)]),
    /* Slots cut into the lit face — the detail that separates a plate from a
       coloured slab at the size this actually renders. */
    slots: Array.from({ length: 5 }, (_, i) => {
      const x = -30 + i * 14
      return poly([
        project(x, 40, 5.6),
        project(x + 9, 40, 5.6),
        project(x + 9, 40, 3),
        project(x, 40, 3),
      ])
    }),
  }
}

const PLATE = platePaths()

function Plate({ layer, id }: { layer: LayerCode; id: string }) {
  const col = LAYER_SOLID[layer]
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={PLATE.left} fill={col} opacity={0.72} />
      <path d={PLATE.right} fill={col} opacity={0.48} />
      <path d={PLATE.top} fill={col} />
      <path d={PLATE.top} fill={`url(#${id})`} />
      {PLATE.slots.map((d, i) => (
        <path key={i} d={d} fill="#0A0C1F" opacity={0.2} />
      ))}
    </>
  )
}

/* One half of the object: the mark faces that belong to these layers, then
   their plates. Both live in the SAME coordinate space — that is what lets a
   face hand over to its plate without a jump, because at the moment of the
   swap they are in the same plane, at the same size, in the same place.

   The two halves are rendered as separate SVGs so the headline can sit
   between them in the stacking order. */
function Half({ layers, kind }: { layers: number[]; kind: 'back' | 'front' }) {
  return (
    <svg viewBox="-96 -104 192 200" className="absolute inset-0 size-full overflow-visible" aria-hidden>
      {FACES.filter((f) => layers.includes(FACE_LAYER[f.id])).map((f) => (
        <g key={f.id} data-face={FACE_LAYER[f.id]}>
          <g data-tilt>
            <g transform="translate(-66,-58)">
              <path d={f.d} fill={f.fill} />
            </g>
          </g>
        </g>
      ))}
      {layers.map((i) => (
        <g key={i} data-plate={i} opacity={0}>
          <Plate layer={LAYERS[i].code} id={`hp-${kind}-${i}`} />
        </g>
      ))}
    </svg>
  )
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}
function seg(p: number, a: number, b: number) {
  return Math.max(0, Math.min(1, (p - a) / (b - a)))
}

/* The mark lying down. The scale term rides along because the mark measures
   132 wide and lands 107 wide once tilted, where a plate is 138: without it
   the logo would arrive at a different size from the stack it is becoming. */
function tiltMatrix(k: number) {
  const s = 1 - 0.355 * k
  const m = [(1 + (COS - 1) * k) * s, SIN * k * s, -COS * k * s, (1 + (SIN - 1) * k) * s, 0, 0]
  return `matrix(${m.map((n) => n.toFixed(4)).join(',')})`
}

export function HeroOrigin() {
  const { t } = useLang()
  const track = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })

  /* ── Why this is imperative ──
     Nearly every moving part here is an SVG transform, and CSS transforms on
     SVG elements depend on transform-box/transform-origin resolution that
     differs between engines. Writing the `transform` ATTRIBUTE is defined in
     user space in every browser, so the object cannot drift. Everything is
     driven from one function of p, which also keeps the whole choreography
     readable in one place instead of scattered across a dozen useTransforms. */
  useEffect(() => {
    const el = frame.current
    if (!el) return

    const faces = Array.from(el.querySelectorAll<SVGGElement>('[data-face]'))
    const plates = Array.from(el.querySelectorAll<SVGGElement>('[data-plate]'))
    const lines = Array.from(el.querySelectorAll<HTMLElement>('[data-line]'))
    const type = el.querySelector<HTMLElement>('[data-type]')
    const legend = el.querySelector<HTMLElement>('[data-legend]')
    const aside = el.querySelector<HTMLElement>('[data-aside]')

    const apply = (p: number) => {
      const open = easeOut(seg(p, 0.06, 0.72))
      const tilt = tiltMatrix(easeOut(seg(p, 0.04, 0.54)))
      /* The handover happens mid-tilt, while both are moving. Doing it at
         rest at either end makes the swap visible. */
      const faceOut = 1 - seg(p, 0.28, 0.43)
      const plateIn = seg(p, 0.3, 0.46)

      for (const g of faces) {
        const i = Number(g.dataset.face)
        g.setAttribute('transform', `translate(0,${(SPREAD[i] * open).toFixed(2)})`)
        g.setAttribute('opacity', faceOut.toFixed(3))
        g.firstElementChild?.setAttribute('transform', tilt)
      }
      for (const g of plates) {
        const i = Number(g.dataset.plate)
        g.setAttribute('transform', `translate(0,${(SPREAD[i] * open).toFixed(2)})`)
        g.setAttribute('opacity', plateIn.toFixed(3))
      }

      /* The page opens on the mark and nothing else — the headline arrives
         once the logo has begun to move, so the first thing seen is the logo
         whole rather than a logo already being cut in half by type. */
      if (type) type.style.opacity = seg(p, 0.1, 0.34).toFixed(3)

      /* The two lines part company at different moments, so the words look
         pushed apart by the object rather than timed alongside it. They have
         to open wider than the stack is tall, or the plates bury them instead
         of slicing through them. Offsets are in em so they track the type.

         1.75em is measured, not chosen: the top plate's apex sits ~190px above
         the object's centre at desktop size, and at 1.2em the first line was
         landing under exactly that — "EVERY LAYER" lost its middle and read as
         "EVER?  ?AYER". This clears the apex so only the tip crosses the type. */
      const t1 = easeOut(seg(p, 0.16, 0.66))
      const t2 = easeOut(seg(p, 0.22, 0.74))
      if (lines[0]) lines[0].style.transform = `translateY(calc(1.75em * ${(-t1).toFixed(3)}))`
      if (lines[1]) lines[1].style.transform = `translateY(calc(1.75em * ${t2.toFixed(3)}))`

      const late = seg(p, 0.55, 0.9)
      if (legend) {
        legend.style.opacity = late.toFixed(3)
        legend.style.transform = `translateX(${((1 - late) * 1.6).toFixed(2)}rem)`
      }
      if (aside) aside.style.opacity = seg(p, 0.62, 0.95).toFixed(3)
    }

    /* Reduced motion gets the settled state and no scrubbing at all: the
       stack open, the copy present, the mark already handed over. */
    apply(reduced ? 1 : scrollYProgress.get())
    if (reduced) return

    return scrollYProgress.on('change', apply)
  }, [reduced, scrollYProgress])

  return (
    /* The track is the scroll distance the transformation needs; the frame
       inside it is what the visitor actually sees. Sticky rather than fixed,
       so the browser releases the hero on its own once the track is spent —
       no manual unpinning, and it degrades to a normal section when the
       track collapses under reduced motion. */
    <section
      ref={track}
      className={reduced ? 'relative bg-paper' : 'relative h-[300vh] bg-paper lg:h-[360vh]'}
      aria-label="Meraki-IT"
    >
      <div
        ref={frame}
        /* Reduced motion drops the pinning and the scrubbing, not the layout.
           The kicker, object, copy and figures are all positioned against a
           viewport-height frame; collapsing that frame to a short block piled
           them on top of one another. So the frame keeps its height and simply
           stops being sticky, and the composition is the settled state. */
        className={
          reduced
            ? 'relative min-h-screen overflow-hidden py-24'
            : 'sticky top-0 h-screen overflow-hidden'
        }
      >
        {/* One wash of brand light. Kept faint — on paper, colour at this size
            is atmosphere, and the moment it reads as a shape it is decoration. */}
        <div
          className="pointer-events-none absolute -right-[12%] -top-[24%] size-[900px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(91,67,249,0.10) 0%, rgba(72,231,255,0.05) 45%, rgba(244,245,250,0) 70%)',
          }}
        />
        {/* The axis the object is built on, drawn faintly on the ground and
            masked away at the edges so it never becomes a pattern. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'repeating-linear-gradient(30deg, rgba(10,12,31,.05) 0 1px, transparent 1px 5vw), repeating-linear-gradient(-30deg, rgba(10,12,31,.05) 0 1px, transparent 1px 5vw)',
            maskImage: 'radial-gradient(70% 62% at 50% 48%, #000 4%, transparent 76%)',
            WebkitMaskImage: 'radial-gradient(70% 62% at 50% 48%, #000 4%, transparent 76%)',
          }}
        />

        {/* ── The measure ──
            Every other section on the site sits in a 1500px column. The hero's
            pieces were positioned against the raw viewport instead, so on a
            wide screen the copy hugged the left edge while the figures ran out
            of content long before the right one — the whole composition read
            as leaning. This puts the hero on the same measure as everything
            below it, and the balance comes back on its own. */}
        <div className="relative mx-auto h-full w-full max-w-[1500px]">
        {/* Clears the fixed header, which stays exactly as it is — this hero
            brings no chrome of its own. */}
        <div className="absolute inset-x-0 top-[13vh] flex items-center justify-center gap-4 px-5">
          <span className="font-mono-ui text-[13px] text-graphite-3">01</span>
          <span className="h-px w-8 bg-graphite/20" />
          <span className="font-mono-ui text-center text-[11px] uppercase tracking-[0.2em] text-graphite-3">
            {t('heroBadge')}
          </span>
        </div>

        {/* ── The object and the type, interleaved ──
            Three siblings, deliberately: back half, headline, front half. A
            wrapper around the halves would carry a transform, a transform
            starts a stacking context, and the z-indices would then be scoped
            inside it — putting the whole object on one side of the words. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[43%] z-0 aspect-[192/200] w-[58vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 lg:top-1/2 lg:w-[39vw]"
        >
          <Half layers={[0, 1]} kind="back" />
        </div>

        <h1
          data-type
          className="font-display-xl absolute inset-x-0 top-[43%] z-10 -translate-y-1/2 px-5 text-center text-[clamp(2.4rem,6.2vw,5.4rem)] uppercase leading-[0.95] tracking-[-0.04em] text-graphite sm:px-8 lg:top-1/2"
          style={{ opacity: 0 }}
        >
          <span data-line className="block will-change-transform">
            Every layer
          </span>
          <span data-line className="block will-change-transform">
            under watch
          </span>
        </h1>

        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[43%] z-20 aspect-[192/200] w-[58vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 lg:top-1/2 lg:w-[39vw]"
        >
          <Half layers={[2, 3]} kind="front" />
        </div>

        {/* ── Copy and call to action ──
            Left of the object rather than under it: once the stack opens it
            owns the whole middle band, and anything centred below it is
            buried. Below the fold on small screens, where there is no room
            beside the object at all. */}
        <div
          data-aside
          className="absolute inset-x-5 bottom-[6vh] z-30 sm:inset-x-8 lg:inset-x-auto lg:bottom-auto lg:left-8 lg:top-1/2 lg:w-[24%] lg:max-w-[340px] lg:-translate-y-1/2"
          style={{ opacity: 0 }}
        >
          <p className="max-w-lg text-[15px] leading-relaxed text-graphite-2 sm:text-[17px]">
            {t('heroLede')}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 rounded-full bg-graphite py-3 pe-3 ps-7 text-[15px] font-medium text-white transition-colors duration-500 hover:bg-violet"
            >
              Explore the stack
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
        </div>

        {/* The legend names what the plates became, and only arrives once they
            have finished arriving. Desktop only — beside the object there is
            nowhere for it to go on a phone. */}
        <div
          data-legend
          aria-hidden
          className="absolute right-8 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-start gap-5 lg:flex"
          style={{ opacity: 0 }}
        >
          {[...LAYERS].reverse().map((l) => (
            <span key={l.code} className="flex items-center gap-3 whitespace-nowrap">
              <span
                className="size-2.5 rounded-[3px]"
                style={{ background: LAYER_SOLID[l.code] }}
              />
              <span className="font-mono-ui text-[11px] tracking-[0.12em] text-graphite-3">
                {l.code}
              </span>
              <span className="text-[13px] text-graphite-2">{l.name}</span>
            </span>
          ))}
        </div>

        {/* The figures sit still through the whole transformation — something
            has to hold the frame while everything else moves.

            ── Why this is justified rather than columned ──
            Four equal columns with left-aligned text always leave the last
            one part empty, and at this measure that was 260px of dead space:
            the row terminated at 1405 while the legend above it and the
            copy below it both reached 1668, so the whole block read as
            leaning. Spreading the four groups instead puts the first on the
            left gutter and the last on the right one, and each rule travels
            with the figure it belongs to rather than sitting at the head of
            a column the figure does not fill. */}
        <div className="absolute inset-x-5 bottom-[5vh] z-30 hidden items-stretch justify-between sm:inset-x-8 lg:flex">
          {[
            { n: COMPANY.founded, l: 'Founded' },
            { n: COMPANY.expertiseYears, l: 'Years combined' },
            { n: '03', l: 'Security platforms' },
            { n: '24/7', l: 'Monitored' },
          ].map((s, i) => (
            <div key={s.l} className="flex items-stretch gap-5">
              {i > 0 && <span aria-hidden className="w-px bg-graphite/15" />}
              <div>
                <span className="font-display-xl block text-[clamp(1.4rem,2.2vw,2rem)] leading-none text-graphite">
                  {s.n}
                </span>
                <span className="font-mono-ui mt-2 block whitespace-nowrap text-[10px] uppercase tracking-[0.16em] text-graphite-3">
                  {s.l}
                </span>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
