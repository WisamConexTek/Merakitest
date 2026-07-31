'use client'

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  cubicBezier,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  animate,
  type MotionValue,
} from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from './motion-fx'

/* ═══════════════════ SCROLL PROGRESS BAR ═══════════════════ */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.3 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-cyan"
    />
  )
}

/* ═══════════════════ REVEAL ON SCROLL ═══════════════════ */

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}

/* Slow and long-eased on purpose. The pacing of the reveal is one of the
   few things that reliably separates a page that feels expensive from one
   that feels like a template: a full second on a heavily decelerating
   curve reads as composed, while the 0.4s springy default everyone reaches
   for reads as eager. The trigger also fires a little later (-14%) so the
   movement happens where the eye already is. */
export function Reveal({ children, className, delay = 0, y = 40, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-14% 0px -6% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════ WORD-BY-WORD HEADLINE ═══════════════════ */

export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.055,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const words = text.split(' ')

  /* The reveal mask clips to the line box, which sits tighter than the glyphs
     themselves, so ascenders and descenders get sliced flat. Padding widens the
     clip region; the matching negative margin keeps layout untouched, and the
     travel distance grows to stay fully hidden.

     The bottom padding used to be 0.1em, which was enough when the display face
     was an all-caps grotesque with essentially no descenders. This site sets
     headlines in sentence case, so every p, g and y in a heading was being cut
     off flat — hence 0.22em on both sides, and 140% of travel so a word is
     still completely out of the mask at the start. */
  return (
    <span ref={ref} className={cn('inline', className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="-mb-[0.22em] -mt-[0.22em] inline-block overflow-hidden align-bottom pb-[0.22em] pt-[0.22em]"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '140%' }}
            animate={inView ? { y: '0%' } : { y: '140%' }}
            transition={{
              duration: 0.85,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 && ' '}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ═══════════════════ SCROLL-CONVERGING HEADLINE ═══════════════════

   The words start pushed out toward the edges of the screen and close back
   into their real position as the heading scrolls up into reading place.

   Every word keeps its normal layout slot; only `transform: translateX` moves,
   so nothing below the heading shifts while you scroll and the browser never
   re-flows the line. The travel distance is measured, not guessed: each word
   is offset from its own line's centre, and the outermost word is sent as far
   as the viewport edge allows, so the effect scales itself from phone to
   ultra-wide without a single breakpoint.                                  */

type WordPlan = { dx: number; lag: number }

/* Slow to leave, decisive through the middle, soft on the landing — the
   closing beat lands exactly as the heading settles. */
const CONVERGE = cubicBezier(0.5, 0, 0.2, 1)

function SpreadWord({
  word,
  plan,
  factor,
  innerRef,
}: {
  word: string
  plan: WordPlan | undefined
  factor: MotionValue<number>
  innerRef: (el: HTMLSpanElement | null) => void
}) {
  const dx = plan?.dx ?? 0
  const lag = plan?.lag ?? 0

  /* Outer words are sprung a little softer, so the line closes like a zip
     from the middle out instead of snapping shut as one rigid block. */
  const x = useSpring(
    useTransform(factor, (f) => f * dx),
    { stiffness: 128 - lag * 46, damping: 30, mass: 0.42 },
  )

  return (
    <motion.span
      ref={innerRef}
      className="inline-block whitespace-nowrap will-change-transform"
      style={{ x }}
    >
      {word}
    </motion.span>
  )
}

export function ScrollSpreadWords({
  text,
  className,
  /* Share of the free space beside each line that the end words cross. */
  reach = 1,
  /* Breathing room kept between the furthest word and the screen edge. */
  edgeGutter = 24,
  /* Ceiling on the spread, so ultra-wide screens stay composed. */
  maxTravel = 380,
}: {
  text: string
  className?: string
  reach?: number
  edgeGutter?: number
  maxTravel?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [plans, setPlans] = useState<WordPlan[]>([])
  const reduced = useReducedMotion()
  const words = text.split(' ')

  /* 1 while the heading is still low on the screen, 0 once it has arrived. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 88%', 'start 30%'],
  })
  const factor = useTransform(scrollYProgress, [0, 1], [1, 0], { ease: CONVERGE })
  /* Scattered type also reads dimmer, so the line resolves in weight as well
     as in position — the same timeline, one instruction to the eye. */
  const opacity = useTransform(factor, [1, 0], [0.55, 1])

  const measure = useCallback(() => {
    const host = ref.current
    if (!host) return

    const els = wordRefs.current.slice(0, words.length)
    if (els.some((el) => !el)) return

    /* Group by baseline row — a wrapped heading is several independent lines,
       and each one gets its own centre and its own room to expand into.

       Everything here reads `offsetTop`/`offsetLeft` rather than client rects:
       those are layout positions, unaffected by the transforms this component
       is itself applying, so re-measuring mid-scroll can't feed on its own
       output. The host is `relative`, which makes it the offsetParent and puts
       every reading in one coordinate space. */
    const rows = new Map<number, number[]>()
    els.forEach((el, i) => {
      const top = Math.round(el!.offsetTop)
      const row = rows.get(top)
      if (row) row.push(i)
      else rows.set(top, [i])
    })

    const hostLeft = host.getBoundingClientRect().left
    const viewport = document.documentElement.clientWidth
    const next: WordPlan[] = words.map(() => ({ dx: 0, lag: 0 }))

    rows.forEach((idx) => {
      let left = Infinity
      let right = -Infinity
      idx.forEach((i) => {
        const el = els[i]!
        left = Math.min(left, el.offsetLeft)
        right = Math.max(right, el.offsetLeft + el.offsetWidth)
      })

      const centre = (left + right) / 2
      const half = (right - left) / 2
      if (half <= 0) return

      /* Each word gets a signed weight from -1 (line's left end) to +1 (right
         end), taken from its centre, so a word sitting mid-line barely drifts
         while the ends do the travelling. */
      const weights = idx.map((i) => {
        const el = els[i]!
        return (el.offsetLeft + el.offsetWidth / 2 - centre) / half
      })

      /* One travel distance for the whole line — the largest that still keeps
         every word's outer edge inside the gutter. Solved per word rather than
         from the line box, so the end words land right on the margin instead of
         stopping short of it. Symmetric, so the line stays optically centred
         at every point of the close. */
      let travel = Infinity
      idx.forEach((i, n) => {
        const el = els[i]!
        const w = weights[n]
        if (w < -0.001) {
          travel = Math.min(travel, (hostLeft + el.offsetLeft - edgeGutter) / -w)
        } else if (w > 0.001) {
          const rightEdge = hostLeft + el.offsetLeft + el.offsetWidth
          travel = Math.min(travel, (viewport - edgeGutter - rightEdge) / w)
        }
      })

      /* Past a point more distance stops reading as "spread" and starts
         reading as "broken", so wide screens are capped rather than letting
         the line fly apart — and a phone, where a heading already fills the
         width and the honest answer is zero, still gets a small opening beat
         instead of nothing at all. */
      const ceiling = Math.max(maxTravel, viewport * 0.2)
      const floor = Math.min(viewport * 0.05, ceiling)
      travel = Math.min(Math.max(Math.max(travel === Infinity ? 0 : travel, 0) * reach, floor), ceiling)

      idx.forEach((i, n) => {
        next[i] = { dx: weights[n] * travel, lag: Math.abs(weights[n]) }
      })
    })

    setPlans(next)
  }, [words.length, reach, edgeGutter, maxTravel])

  useLayoutEffect(() => {
    /* No measuring under a reduced-motion preference — and nothing to undo
       either, since the render below simply stops handing the plans out. */
    if (reduced) return

    let frame = 0
    /* The font promise below outlives this effect. Without the flag, a run
       that has already been torn down — by unmount, or by the motion
       preference arriving and clearing the plans — still lands one late
       measurement and puts the words back on the move. */
    let live = true
    const schedule = () => {
      if (!live) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    schedule()
    /* The display face is web-loaded: widths measured before it swaps in are
       the fallback's, and every word would land off by a few pixels. */
    document.fonts?.ready.then(schedule).catch(() => {})

    const ro = new ResizeObserver(schedule)
    if (ref.current) ro.observe(ref.current)
    window.addEventListener('resize', schedule)

    return () => {
      live = false
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', schedule)
    }
  }, [measure, reduced])

  return (
    <motion.span
      ref={ref}
      className={cn('relative block', className)}
      style={reduced ? undefined : { opacity }}
    >
      {words.map((word, i) => (
        /* The gap between words is a real text node, a sibling of the word
           rather than a passenger inside it: a space trapped at the end of an
           inline-block is trimmed away, and the whole heading sets solid. As a
           sibling it also stays a legal wrap point. */
        <Fragment key={`${word}-${i}`}>
          <SpreadWord
            word={word}
            plan={reduced ? undefined : plans[i]}
            factor={factor}
            innerRef={(el) => {
              wordRefs.current[i] = el
            }}
          />
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </motion.span>
  )
}

/* ═══════════════════ MARQUEE ═══════════════════ */

export function Marquee({
  children,
  duration = 32,
  reverse = false,
  className,
  pauseOnHover = false,
}: {
  children: React.ReactNode
  duration?: number
  reverse?: boolean
  className?: string
  pauseOnHover?: boolean
}) {
  return (
    <div
      className={cn('overflow-hidden', pauseOnHover && 'marquee-pause', className)}
      dir="ltr"
    >
      <div
        className="marquee-track"
        data-reverse={reverse}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════ ANIMATED COUNTER ═══════════════════ */

export function Counter({
  to,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 1.8,
  className,
}: {
  to: number
  suffix?: string
  prefix?: string
  decimals?: number
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    const mv = { value: 0 }
    const controls = animate(mv.value, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) =>
        setDisplay(
          v.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }),
        ),
    })
    return () => controls.stop()
  }, [inView, to, duration, decimals])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/* ═══════════════════ ARROW PILL BUTTON ═══════════════════ */

type PillProps = {
  children: React.ReactNode
  href?: string
  variant?: 'dark' | 'light' | 'sun' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  external?: boolean
  onClick?: () => void
}

/* Square-shouldered and chamfered, not pill-shaped. The corner cut runs on
   the same isometric diagonal as everything else on the page, which is what
   stops a button from being the one rounded object in a drawing. */
const pillVariants = {
  dark: 'bg-ink text-mist hover:bg-ink-2',
  light: 'bg-white text-ink hover:bg-mist-2',
  sun: 'bg-violet text-white hover:bg-peri',
  outline: 'bg-transparent text-ink border border-ink/30 hover:border-violet hover:text-violet',
} as const

const pillSizes = {
  sm: 'h-10 px-4 text-[13px]',
  md: 'h-12 px-5 text-sm',
  lg: 'h-13 sm:h-14 px-6 sm:px-7 text-base',
} as const

const arrowSizes = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-4.5',
} as const

export function ArrowPill({
  children,
  href,
  variant = 'dark',
  size = 'md',
  className,
  external = false,
  onClick,
}: PillProps) {
  const inner = (
    <>
      <span className="font-semibold tracking-tight whitespace-nowrap">{children}</span>
      <svg
        viewBox="0 0 24 24"
        className={cn(
          'transition-transform duration-300 group-hover:translate-x-1',
          arrowSizes[size],
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </>
  )

  const classes = cn(
    'chamfer chamfer-sm group inline-flex items-center gap-2.5 transition-colors duration-300',
    pillVariants[variant],
    pillSizes[size],
    className,
  )

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {inner}
    </button>
  )
}

/* ═══════════════════ CIRCUIT TRACE ═══════════════════
   The connector between things on this site: a right-angled run with a 45°
   corner, drawn the way a rack diagram or a PCB trace is drawn. It replaces
   the sister brand's hand-drawn arrow — same job, opposite voice.

   The path draws itself when it scrolls into view, so a connection reads as
   being made rather than as having always been there. */

export function CircuitTrace({
  className,
  d = 'M2 2 H58 L82 26 V104',
  viewBox = '0 0 120 110',
  stroke = 'currentColor',
  width = 1.5,
  delay = 0,
}: {
  className?: string
  d?: string
  viewBox?: string
  stroke?: string
  width?: number
  delay?: number
}) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion()

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      fill="none"
      className={cn('pointer-events-none', className)}
      aria-hidden
    >
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="square"
        initial={reduced ? false : { pathLength: 0 }}
        animate={inView || reduced ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

/* ═══════════════════ METRIC READOUT ═══════════════════
   A figure and its label in the machine voice. Used everywhere a number
   appears, so that a stat never gets styled ad hoc per section. */

export function Readout({
  value,
  label,
  tone = 'dark',
  className,
}: {
  value: string
  label: string
  /* `dark` = sitting on the dark ground */
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <div className={cn('border-t pt-5', tone === 'dark' ? 'border-white/15' : 'border-graphite/12', className)}>
      <p
        className={cn(
          'font-display text-[1.6rem] sm:text-[1.9rem]',
          tone === 'dark' ? 'text-white' : 'text-graphite',
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          'font-mono-ui mt-2 text-[11px] uppercase leading-relaxed tracking-[0.14em]',
          tone === 'dark' ? 'text-white/45' : 'text-graphite-3',
        )}
      >
        {label}
      </p>
    </div>
  )
}

/* ═══════════════════ PARALLAX HELPER ═══════════════════ */

export function useParallax(distance = 80): {
  ref: React.RefObject<HTMLDivElement | null>
  y: MotionValue<number>
} {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 })
  return { ref, y }
}

/* ═══════════════════ SECTION LABEL ═══════════════════ */

export function Kicker({
  children,
  className,
  tone = 'ink',
}: {
  children: React.ReactNode
  className?: string
  tone?: 'ink' | 'cream'
}) {
  /* A square dot, not a round one, and set in the machine voice — this is a
     label on a drawing rather than a badge on a marketing page. */
  return (
    <span
      className={cn(
        'font-mono-ui inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] sm:text-[11px]',
        tone === 'ink' ? 'text-ink/55' : 'text-mist/55',
        className,
      )}
    >
      <span className="size-1.5 shrink-0 bg-cyan" />
      {children}
    </span>
  )
}

/* ═══════════════════ TILT CARD ═══════════════════ */

export function TiltCard({
  children,
  className,
  strength = 10,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 200,
    damping: 22,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), {
    stiffness: 200,
    damping: 22,
  })

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn('will-change-transform', className)}
    >
      {children}
    </motion.div>
  )
}
