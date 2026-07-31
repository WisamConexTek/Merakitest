'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Info } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { Reveal, Readout } from './primitives'
import { LAYER_ON_LIGHT, LAYER_SOLID, type LayerCode } from './iso'
import { useReducedMotion } from './motion-fx'

/* ═══════════════════════════════════════════════════════════
   THE PERIMETER — homepage section two

   The MSSP argument, made as an instrument rather than as a
   paragraph: four defence rings with a sweep running over them,
   and a console beside it showing the kind of decision the team
   makes all night.

   ── An honesty note, and please keep it ──
   This is an ILLUSTRATION of how the service works. It is not a
   feed. Nothing here is connected to a real console, no real
   client is represented, and the addresses are drawn from the
   RFC 5737 documentation ranges (192.0.2.0/24, 198.51.100.0/24,
   203.0.113.0/24) precisely because those blocks are reserved for
   examples and can never belong to anyone.

   The label saying so is rendered on the panel, not tucked into a
   comment. A marketing page that mimics live telemetry without
   saying it is a mock-up is claiming a capability it has not
   demonstrated — and for a security firm, that is the worst
   possible thing to be caught doing.

   ── Determinism ──
   The event list is a fixed, hand-written array revealed one line
   at a time on a timer that starts in an effect. No Math.random,
   no Date.now, no clock formatting during render — every one of
   those produces different HTML on the server and the client, and
   React would tear the whole section down and rebuild it.
   ═══════════════════════════════════════════════════════════ */

type Verdict = 'blocked' | 'contained' | 'cleared' | 'watch'

const VERDICT_STYLE: Record<Verdict, { label: string; color: string; dot: string }> = {
  blocked: { label: 'BLOCKED', color: 'text-[#0B8FA6]', dot: 'bg-[#0B8FA6]' },
  contained: { label: 'CONTAINED', color: 'text-[#4F5CE0]', dot: 'bg-[#4F5CE0]' },
  cleared: { label: 'CLEARED', color: 'text-graphite-3', dot: 'bg-graphite-3' },
  watch: { label: 'WATCHING', color: 'text-violet', dot: 'bg-violet' },
}

/* Fixed sample. Addresses are RFC 5737 documentation ranges — see the note
   above; do not swap them for real-looking ones. */
const EVENTS: { time: string; verdict: Verdict; layer: string; text: string }[] = [
  { time: '02:14:06', verdict: 'blocked', layer: 'L3', text: 'Credential stuffing — 198.51.100.24' },
  { time: '02:31:44', verdict: 'watch', layer: 'L4', text: 'New external asset discovered' },
  { time: '03:02:19', verdict: 'contained', layer: 'L1', text: 'Impossible-travel sign-in, session revoked' },
  { time: '03:47:52', verdict: 'blocked', layer: 'L3', text: 'SQL injection attempt — 203.0.113.7' },
  { time: '04:12:35', verdict: 'cleared', layer: 'L2', text: 'Nightly backup verified, restore point sound' },
  { time: '05:08:03', verdict: 'blocked', layer: 'L3', text: 'Volumetric flood absorbed at edge' },
]

/* Four rings, outermost first — the same four layers the hero named, read from
   the outside in. Radii are in viewBox units. Colours come from the ON_DARK
   variant because a 1px ring and 8px type are exactly the case where L1's true
   indigo disappears into the ground; see the palette note in iso.tsx. */
const RINGS: { r: number; layer: LayerCode; name: string; color: string }[] = [
  { r: 96, layer: 'L4', name: 'Security Operations', color: LAYER_ON_LIGHT.L4 },
  { r: 74, layer: 'L3', name: 'Network & Edge', color: LAYER_ON_LIGHT.L3 },
  { r: 52, layer: 'L2', name: 'Compute & Data', color: LAYER_ON_LIGHT.L2 },
  { r: 30, layer: 'L1', name: 'Identity & Access', color: LAYER_ON_LIGHT.L1 },
]

const COMMITMENTS = [
  { value: '24/7/365', label: 'Monitoring coverage' },
  { value: '3', label: 'Platforms operated in-house' },
  { value: 'One', label: 'Escalation path, every layer' },
  { value: 'Playbook', label: 'Response agreed before onboarding' },
]

function Radar() {
  const reduced = useReducedMotion()

  return (
    <svg viewBox="-120 -120 240 240" className="size-full" aria-hidden>
      <defs>
        <linearGradient id="sweep-arm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5B43F9" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#5B43F9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Rings, outermost first */}
      {RINGS.map((ring) => (
        <g key={ring.layer}>
          <circle
            cx={0}
            cy={0}
            r={ring.r}
            fill="none"
            stroke={ring.color}
            strokeOpacity={0.3}
            strokeWidth={1}
          />
          {/* Tick at the top of each ring, labelled with its layer code */}
          <line
            x1={0}
            y1={-ring.r - 4}
            x2={0}
            y2={-ring.r + 4}
            stroke={ring.color}
            strokeOpacity={0.6}
            strokeWidth={1.25}
          />
          <text
            x={5}
            y={-ring.r + 3}
            className="font-mono-ui"
            fontSize={8}
            fill={ring.color}
            fillOpacity={0.8}
            letterSpacing="0.12em"
          >
            {ring.layer}
          </text>
        </g>
      ))}

      {/* Cross hairs */}
      <line x1={-104} y1={0} x2={104} y2={0} stroke="#1E1E9B" strokeOpacity={0.12} strokeWidth={1} />
      <line x1={0} y1={-104} x2={0} y2={104} stroke="#1E1E9B" strokeOpacity={0.12} strokeWidth={1} />

      {/* The sweep. A filled wedge rather than a line, so it reads as a beam
          covering ground rather than a hand ticking round a clock. */}
      {!reduced && (
        <g className="sweep" style={{ ['--sweep-duration' as string]: '7s' }}>
          <path d="M0 0 L96 0 A96 96 0 0 0 68 -68 Z" fill="url(#sweep-arm)" />
          <line x1={0} y1={0} x2={96} y2={0} stroke="#5B43F9" strokeOpacity={0.6} strokeWidth={1.25} />
        </g>
      )}

      <circle cx={0} cy={0} r={4} fill="#5B43F9" />
      <circle cx={0} cy={0} r={9} fill="none" stroke="#5B43F9" strokeOpacity={0.35} strokeWidth={1} />
    </svg>
  )
}

function Console() {
  const reduced = useReducedMotion()
  const [ticked, setTicked] = useState(0)

  /* Reduced motion gets the whole list at once — there is nothing to gain from
     making someone wait for content that is not going to move. Deriving it
     here rather than pushing it through setState keeps the effect below free
     of any synchronous state write. */
  const shown = reduced ? EVENTS.length : ticked

  useEffect(() => {
    if (reduced) return

    /* Reveals up to the full list and then stops. It does not loop: a feed
       that resets on a cycle advertises itself as a fake within ten seconds,
       and the point here is a sample of one night, not a perpetual-motion toy. */
    const id = setInterval(() => {
      setTicked((n) => {
        if (n >= EVENTS.length) {
          clearInterval(id)
          return n
        }
        return n + 1
      })
    }, 900)

    return () => clearInterval(id)
  }, [reduced])

  return (
    <div className="surface relative overflow-hidden">
      {/* Console chrome */}
      <div className="flex items-center justify-between border-b border-graphite/8 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="live-dot size-2 rounded-full bg-violet" />
          <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-violet">
            Sample shift · 02:00–06:00
          </span>
        </div>
        <span className="font-mono-ui text-[11px] tracking-[0.14em] text-graphite-3">SOC</span>
      </div>

      <ul className="flex min-h-[268px] flex-col gap-1 p-3">
        {EVENTS.slice(0, shown).map((event) => {
          const style = VERDICT_STYLE[event.verdict]
          return (
            <motion.li
              key={event.time}
              initial={reduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 odd:bg-paper/70"
            >
              <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${style.dot}`} />
              <span className="font-mono-ui shrink-0 text-[11px] text-graphite-3">{event.time}</span>
              <span className={`font-mono-ui w-[74px] shrink-0 text-[10px] tracking-[0.1em] ${style.color}`}>
                {style.label}
              </span>
              <span className="font-mono-ui hidden shrink-0 text-[10px] text-graphite-3 sm:block">
                {event.layer}
              </span>
              <span className="min-w-0 text-[13px] leading-relaxed text-graphite-2">{event.text}</span>
            </motion.li>
          )
        })}
      </ul>

      {/* The disclosure. On the panel, in the reading path — not in a
          footnote and not only in the source. */}
      <div className="flex items-start gap-3 border-t border-graphite/8 px-6 py-4">
        <Info className="mt-0.5 size-4 shrink-0 text-graphite-3" />
        <p className="text-[12px] leading-relaxed text-graphite-3">
          Illustration of the kind of decisions our analysts make overnight — not a live feed.
          Addresses shown are reserved documentation ranges and belong to no one.
        </p>
      </div>
    </div>
  )
}

export function Perimeter() {
  const { t } = useLang()

  return (
    <section className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div
        className="pointer-events-none absolute -left-[15%] top-1/4 size-[720px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(91,67,249,0.08) 0%, rgba(72,231,255,0.04) 45%, rgba(244,245,250,0) 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="font-mono-ui text-[13px] text-graphite-3">03</span>
              <span className="h-px w-8 bg-graphite/20" />
              <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">
                {t('perimeterKicker')}
              </span>
            </div>
          </Reveal>
          <h2 className="font-display-xl mt-8 text-[clamp(2.1rem,5vw,3.4rem)] text-graphite">
            {t('perimeterTitle')}
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-graphite-2">
              {t('perimeterLede')}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
          {/* Rings */}
          <Reveal>
            <div className="flex flex-col">
              <div className="mx-auto aspect-square w-full max-w-[380px]">
                <Radar />
              </div>
              <ul className="mt-6 flex flex-col gap-2">
                {RINGS.map((ring) => (
                  <li key={ring.layer} className="flex items-center gap-3">
                    <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: LAYER_SOLID[ring.layer] }} />
                    <span className="font-mono-ui w-6 shrink-0 text-[11px] tracking-[0.12em] text-graphite-3">
                      {ring.layer}
                    </span>
                    <span className="text-[14px] text-graphite-2">{ring.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Console + commitments */}
          <Reveal delay={0.12}>
            <Console />

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
              {COMMITMENTS.map((c) => (
                <Readout key={c.label} value={c.value} label={c.label} tone="light" />
              ))}
            </div>

            <Link
              href="/security"
              className="group mt-10 inline-flex items-center gap-3 rounded-full border border-graphite/15 px-6 py-3.5 text-[15px] font-medium text-graphite transition-colors duration-500 hover:border-graphite/40"
            >
              How the managed service works
              <ArrowRight className="size-4 text-violet transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
