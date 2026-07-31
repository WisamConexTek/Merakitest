'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight, Search, Radio, ShieldAlert, FileText } from 'lucide-react'
import { Reveal } from './primitives'
import { LAYER_SOLID, LAYER_ON_LIGHT, type LayerCode } from './iso'
import { useReducedMotion } from './motion-fx'

/* ═══════════════════════════════════════════════════════════
   THE MANAGED SERVICE — /security

   The page for a visitor who has decided the MSSP proposition is
   interesting and now wants to know what actually happens: what we
   watch, what we do when something fires, and what we will not
   claim to do.

   That last section is deliberate. Every MSSP page on the internet
   lists capabilities; almost none state their limits, and a
   security buyer who has been sold to before reads the limits
   first. It is also simply the truthful thing to publish.
   ═══════════════════════════════════════════════════════════ */

const WATCHED: { layer: LayerCode; name: string; items: string[] }[] = [
  {
    layer: 'L4',
    name: 'Security Operations',
    items: [
      'External attack surface, continuously rediscovered',
      'New and changed internet-facing assets',
      'Alert triage across every platform below',
    ],
  },
  {
    layer: 'L3',
    name: 'Network & Edge',
    items: [
      'Volumetric and application-layer attack traffic',
      'WAF rule hits, tuned against your real traffic',
      'Zero Trust access grants and anomalies',
    ],
  },
  {
    layer: 'L2',
    name: 'Compute & Data Center',
    items: [
      'Endpoint and server protection events',
      'Backup job health and restore-point integrity',
      'Unexpected change on protected systems',
    ],
  },
  {
    layer: 'L1',
    name: 'Identity & Access',
    items: [
      'Sign-in anomalies and impossible travel',
      'Privileged account use outside normal patterns',
      'Account lifecycle drift — the leavers still enabled',
    ],
  },
]

const RESPONSE = [
  {
    Icon: Search,
    step: '01',
    title: 'Detect',
    body: 'Something crosses a threshold that was tuned to your environment during onboarding, not to a vendor default.',
  },
  {
    Icon: Radio,
    step: '02',
    title: 'Triage',
    body: 'An analyst establishes whether it is real, how far it reaches, and whether it matches a known pattern in your estate.',
  },
  {
    Icon: ShieldAlert,
    step: '03',
    title: 'Contain',
    body: 'Pre-authorised actions are taken immediately. Anything needing a business decision goes to your named contacts by the agreed route.',
  },
  {
    Icon: FileText,
    step: '04',
    title: 'Report',
    body: 'A written account of what happened, what was done, and what changes as a result — so the same thing is harder next time.',
  },
]

/* The limits. Published on purpose — see the note at the top of this file. */
const LIMITS = [
  'We monitor the layers we have visibility into. Where a system is outside the agreed scope, it is listed as out of scope rather than quietly assumed to be covered.',
  'We are not a substitute for your own incident decision-making. Actions with business consequence — taking a system offline, notifying customers — need your call, and the escalation path for that is set before go-live.',
  'Detection is not prevention. Monitoring reduces how long an intruder has, not whether one can get in. It works alongside the hardening and architecture work, not instead of it.',
]

/* ── The stack ──
   Four plates built the way every other object on the site is built: real
   thickness, one light source upper-left, and a soft shadow beneath.

   ── Each plate parks beside its own card ──
   Two earlier attempts got this wrong in the same way. The first made the
   offsets cumulative, so opening the top gap shoved every lower plate down
   at once. The second gave each plate its own range but compressed the
   travel to a fifth of the card spacing AND pinned the drawing sticky — so
   the plates drifted apart in a tidy little group that lined up with
   nothing.

   The distances are now the REAL ones: plate i settles at the vertical
   centre of card i, measured off the DOM, and the column is no longer
   sticky, so once a plate has arrived it stays level with its card for as
   long as both are on screen. Scroll back up and they gather again.

   They travel TOGETHER and drop off one at a time — a lift, not a
   staircase. One shared descent is added to every plate's starting point
   and clamped at its own card, so the group moves as a group and each
   plate simply stops when it arrives. Giving each plate its own stretch of
   scroll instead meant only one was ever moving, and the bottom plate shot
   to the floor while the other two sat still.

   Each plate is its own absolutely-positioned element rather than one
   drawing — spread over 700px they are no longer a single object, and
   positioning them in CSS beats doing viewBox arithmetic to fake it. */

const COS = Math.cos(Math.PI / 6)
const SIN = Math.sin(Math.PI / 6)
const HALF = 68
const THICK = 13
/* How far apart the plates sit before any of them has left */
const GATHERED = 17

function corner(x: number, z: number, y: number) {
  return `${((x - z) * COS).toFixed(1)} ${((x + z) * SIN - y).toFixed(1)}`
}

const PLATE = (() => {
  const a = HALF
  return {
    top: `M${corner(-a, -a, 0)}L${corner(a, -a, 0)}L${corner(a, a, 0)}L${corner(-a, a, 0)}Z`,
    left: `M${corner(-a, a, 0)}L${corner(a, a, 0)}L${corner(a, a, -THICK)}L${corner(-a, a, -THICK)}Z`,
    right: `M${corner(a, -a, 0)}L${corner(a, a, 0)}L${corner(a, a, -THICK)}L${corner(a, -a, -THICK)}Z`,
  }
})()

function Plate({
  layer,
  dimmed,
  lifted,
}: {
  layer: LayerCode
  dimmed: boolean
  lifted: boolean
}) {
  const base = LAYER_SOLID[layer]
  const ink = LAYER_ON_LIGHT[layer]

  return (
    <svg viewBox="-134 -86 300 184" className="w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`sh-${layer}`} x1="0.1" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`sd-${layer}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#1E1E9B" stopOpacity="0.30" />
          <stop offset="55%" stopColor="#1E1E9B" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#1E1E9B" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g
        style={{
          opacity: dimmed ? 0.55 : 1,
          transform: lifted ? 'translateY(-10px)' : 'none',
          transition:
            'opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <ellipse cx="0" cy="40" rx="86" ry="16" fill={`url(#sd-${layer})`} />
        <path d={PLATE.left} fill={base} opacity={0.72} />
        <path d={PLATE.right} fill={base} opacity={0.48} />
        <path d={PLATE.top} fill={base} />
        <path d={PLATE.top} fill={`url(#sh-${layer})`} />

        {/* The code sits out on a leader: printed on the face, only the
            topmost plate is ever readable once they gather. */}
        <path d="M118 0 H136" stroke={ink} strokeOpacity="0.5" strokeWidth="1.25" />
        <circle cx="118" cy="0" r="2.6" fill={ink} />
        <text x="144" y="4" className="font-mono-ui" fontSize="13" letterSpacing="0.16em" fill={ink}>
          {layer}
        </text>
      </g>
    </svg>
  )
}

function LayerStack({
  active,
  onPick,
  offsets,
  stageRef,
}: {
  active: LayerCode | null
  onPick: (l: LayerCode | null) => void
  offsets: MotionValue<number>[]
  stageRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div ref={stageRef} className="relative h-full min-h-[420px]">
      {WATCHED.map((row, i) => (
        <motion.div
          key={row.layer}
          style={{ y: offsets[i], zIndex: i }}
          className="absolute inset-x-0 top-0"
          onPointerEnter={() => onPick(row.layer)}
          onPointerLeave={() => onPick(null)}
        >
          {/* Inner wrapper carries the -50%, so the motion transform on the
              outer one stays a clean pixel offset the plate can be measured
              against. */}
          <div className="-translate-y-1/2 cursor-pointer">
            <Plate
              layer={row.layer}
              dimmed={active !== null && active !== row.layer}
              lifted={active === row.layer}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function SecurityPage() {
  /* Shared between the drawing and the cards, so pointing at either one
     highlights the other. The diagram stops being a picture beside a list
     and becomes the legend for it. */
  const [active, setActive] = useState<LayerCode | null>(null)
  const watched = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  /* ── Where each plate has to end up ──
     The centre of its own card, in pixels, measured off the DOM. Not a
     scaled-down approximation: the plate has to sit level with the text it
     labels, and the only number that guarantees that is the real one.

     Both columns are grid items starting at the same y, so a card's
     offsetTop inside its column is also the offset the plate needs inside
     its own. Below lg the two columns stack and there is nothing to line up
     with, so the targets collapse and the plates simply stay gathered. */
  const stageRef = useRef<HTMLDivElement>(null)
  const [slots, setSlots] = useState<number[]>([])

  useEffect(() => {
    const col = watched.current
    if (!col) return

    const measure = () => {
      if (window.innerWidth < 1024) {
        setSlots([])
        return
      }
      const cards = Array.from(col.children) as HTMLElement[]
      if (!cards.length) return

      /* offsetTop, DIFFERENCED against the column's own offsetTop.

         Two wrong turns got here. Plain `offsetTop` reports from the
         nearest positioned ancestor — the section, not the column — so the
         whole set landed low by the section's padding. Switching to
         getBoundingClientRect fixed the origin but introduced a worse
         problem: every card is wrapped in a Reveal that starts at
         translateY(40), and a rect reports where a thing is being DRAWN,
         not where it is laid out. Measuring mid-entrance baked that 40px
         into every slot.

         offsetTop is a layout value and ignores transforms entirely, so it
         reads the same whether the card has finished animating or not.
         Both the column and the cards resolve against the same positioned
         ancestor, so the difference is the card's true position inside the
         column — which is also the plate's slot, since the two columns are
         grid siblings that start at the same y. */
      setSlots(cards.map((c) => c.offsetTop - col.offsetTop + c.offsetHeight / 2))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(col)
    if (stageRef.current) ro.observe(stageRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const spread = slots.length === WATCHED.length
  /* Gathered means "stacked at the first card", not "stacked at the top of
     the column" — the first card is what is on screen when they are still
     together. */
  const home = spread ? slots[0] : 0
  const target = (i: number) => (spread ? slots[i] : GATHERED * i)
  const gathered = (i: number) => home + GATHERED * i

  const { scrollYProgress } = useScroll({
    target: watched,
    offset: ['start 72%', 'end 88%'],
  })

  /* ── They descend together, and each one gets off at its own floor ──
     One shared descent drives all four. Every plate adds the same distance
     to where it started, and clamps at its own card — so the group moves as
     a group, L3 stops first because its card is nearest, then L2, then L1
     carries on to the bottom.

     The previous version gave each plate its own scroll range instead,
     which meant only one ever moved at a time and L1 shot straight to the
     floor while the other two sat still. This is the lift, not the
     staircase.

     Order can never break: they all travel at the same rate from an already
     ordered start, and each stops at a slot further down than the one
     above, so a plate can only ever fall behind the one in front of it —
     never overtake it. L4 needs no special case, because its slot IS its
     starting point and the clamp holds it there. */
  const travel = spread ? Math.max(0, slots[3] - gathered(3)) : 0
  const drop = useTransform(scrollYProgress, [0.02, 0.94], [0, travel], { clamp: true })

  const anchor = useMotionValue(0)
  const yL3 = useTransform(drop, (d) => Math.min(gathered(1) + d, target(1)))
  const yL2 = useTransform(drop, (d) => Math.min(gathered(2) + d, target(2)))
  const yL1 = useTransform(drop, (d) => Math.min(gathered(3) + d, target(3)))

  /* Under a reduced-motion preference every plate is simply presented in
     its slot — nothing has to be scrolled for the diagram to make sense. */
  const restL3 = useMotionValue(0)
  const restL2 = useMotionValue(0)
  const restL1 = useMotionValue(0)
  useEffect(() => {
    anchor.set(home)
    restL3.set(spread ? slots[1] : GATHERED)
    restL2.set(spread ? slots[2] : GATHERED * 2)
    restL1.set(spread ? slots[3] : GATHERED * 3)
  }, [slots, spread, home, anchor, restL1, restL2, restL3])

  const offsets = reduced ? [anchor, restL3, restL2, restL1] : [anchor, yL3, yL2, yL1]

  return (
    <>
      {/* ── What we watch ── */}
      <section className="relative bg-paper py-24 sm:py-32">
        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
          <Reveal>
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">
              Coverage
            </span>
          </Reveal>
          <h2 className="font-display-xl mt-8 max-w-3xl text-[clamp(2rem,4.6vw,3.2rem)] text-graphite">
            What we are actually watching, layer by layer.
          </h2>

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
            {/* The drawing holds its place while the cards scroll past it —
                it is the key to them, so it should still be there when you
                reach the fourth one. */}
            <div className="h-full">
              <div className="mx-auto h-full w-full max-w-[330px]">
                <LayerStack
                  active={active}
                  onPick={setActive}
                  offsets={offsets}
                  stageRef={stageRef}
                />
              </div>
            </div>

            <div ref={watched} className="flex flex-col gap-4">
              {WATCHED.map((row, i) => {
                const tint = LAYER_SOLID[row.layer]
                const ink = LAYER_ON_LIGHT[row.layer]
                const lifted = active === row.layer

                return (
                  <Reveal key={row.layer} delay={i * 0.06}>
                    <div
                      onPointerEnter={() => setActive(row.layer)}
                      onPointerLeave={() => setActive(null)}
                      className="surface p-7 transition-[transform,box-shadow,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-8"
                      style={{
                        transform: lifted ? 'translateY(-4px)' : undefined,
                        boxShadow: lifted
                          ? '0 4px 8px rgba(10,12,31,.06), 0 24px 56px rgba(10,12,31,.09), 0 60px 120px rgba(30,30,155,.08)'
                          : undefined,
                        opacity: active && !lifted ? 0.55 : 1,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="font-mono-ui rounded-full px-3 py-1.5 text-[11px] tracking-[0.14em]"
                          style={{ backgroundColor: `${tint}1f`, color: ink }}
                        >
                          {row.layer}
                        </span>
                        <h3 className="font-display text-[1.2rem] leading-snug text-graphite sm:text-[1.4rem]">
                          {row.name}
                        </h3>
                      </div>

                      <ul className="mt-5 flex flex-col gap-3">
                        {row.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3.5 text-[15px] leading-relaxed text-graphite-2"
                          >
                            <span
                              className="mt-[7px] size-2 shrink-0 rounded-[3px]"
                              style={{ background: tint }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── What happens when something fires ── */}
      <section className="relative bg-paper-3 py-24 sm:py-32">
        

        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
          <Reveal>
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">Response</span>
          </Reveal>
          <h2 className="font-display-xl mt-8 max-w-3xl text-[clamp(2rem,4.6vw,3.2rem)] text-graphite">
            What happens when something fires.
          </h2>

          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESPONSE.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.06}>
                <li className="surface relative flex h-full flex-col p-7 sm:p-8">
                  
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet/12 text-violet">
                    <step.Icon className="size-4.5" />
                  </span>
                  <span className="font-mono-ui mt-6 text-[11px] tracking-[0.16em] text-graphite-3">
                    {step.step}
                  </span>
                  <h3 className="font-display mt-2 text-[1.2rem] text-graphite">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-graphite-2">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What we do not claim ── */}
      <section className="relative bg-paper-3 py-24 sm:py-32">
        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div>
              <Reveal>
                <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">Scope</span>
              </Reveal>
              <h2 className="font-display-xl mt-8 text-[clamp(1.9rem,4.4vw,3rem)] text-graphite">
                What this service does not do
              </h2>
              <Reveal delay={0.1}>
                <p className="mt-7 max-w-md text-[17px] leading-relaxed text-graphite-2">
                  Any provider can list capabilities. The limits are the more useful half of the
                  conversation, so they are on the page rather than in the contract only.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <Link
                  href="/contact"
                  className="group mt-9 inline-flex items-center gap-3 rounded-full border border-graphite/15 px-6 py-3.5 text-[15px] font-medium text-graphite transition-colors duration-500 hover:border-graphite/40"
                >
                  Discuss scope with an engineer
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>

            <ul className="flex flex-col">
              {LIMITS.map((limit, i) => (
                <Reveal key={limit} delay={i * 0.06}>
                  <li className="grid grid-cols-[auto_1fr] gap-6 border-t border-graphite/10 py-8 sm:gap-9">
                    <span className="font-mono-ui pt-1.5 text-[13px] tracking-[0.14em] text-violet">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="max-w-xl text-[15px] leading-relaxed text-graphite-2 sm:text-base">
                      {limit}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
