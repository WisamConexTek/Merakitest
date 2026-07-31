'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LangProvider, useLang, type TKey } from '@/lib/i18n'
import { ScrollProgress, Reveal } from './primitives'
import { cn } from '@/lib/utils'
import { Header } from './header'
import { Footer } from './footer'

/* Scroll reset on route navigation */
function ScrollReset() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    })
  }, [pathname])

  return null
}

/* ── Footer reveal ──
   The footer is pinned to the bottom of the viewport underneath the page, and
   the content scrolls over it like a sheet sliding away — so the footer rises
   into view instead of arriving with the scroll. A spacer the height of the
   footer keeps the document tall enough to expose all of it.

   The effect only turns on when the footer actually fits on screen (otherwise
   its top would be cut off) and when the visitor hasn't asked for reduced
   motion; in either case it falls back to a normal footer that scrolls. */
function RevealFooter() {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const h = el.offsetHeight
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setHeight(h)
      setEnabled(!reduced && h <= window.innerHeight)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <>
      {/* Reserves the scroll distance the reveal needs */}
      <div aria-hidden style={{ height: enabled ? height : 0 }} />
      <div ref={ref} className={enabled ? 'fixed inset-x-0 bottom-0 z-0' : 'relative'}>
        <Footer />
      </div>
    </>
  )
}

/* ── Hero pin ──
   The mirror image of the footer reveal. The hero holds its place at the top
   of the viewport while the section beneath climbs up and covers it, so the
   page turns like a card instead of sliding away.

   `sticky` (not `fixed`) is what makes it release cleanly: the browser clamps
   a sticky element to its parent's box, so once the page has scrolled past the
   content the hero is pushed up on its own — no manual unpinning. Same guards
   as the footer: only when the hero fits on screen and motion is welcome. */
function PinnedHero({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      /* One pixel of slack: the hero is sized in svh, which can round against
         window.innerHeight and would otherwise fail the fit test outright. */
      setPinned(!reduced && el.offsetHeight <= window.innerHeight + 1)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div ref={ref} className={pinned ? 'sticky top-0 z-0' : 'relative z-10'}>
      {children}
    </div>
  )
}

/* Shared chrome for every page: language provider, progress bar, nav, footer.
   Pass `hero` to have it pinned while the rest of the page scrolls over it. */
export function SiteShell({
  children,
  hero,
}: {
  children: React.ReactNode
  hero?: React.ReactNode
}) {
  return (
    <LangProvider>
      <ScrollReset />
      <div dir="ltr" className="min-h-screen">
        <ScrollProgress />
        <Header />
        <main className="relative z-10">
          {hero && <PinnedHero>{hero}</PinnedHero>}
          {/* Opaque and above both the hero and the footer, so it covers the
              hero on the way down and the footer until it scrolls past */}
          <div className="relative z-10 bg-paper">{children}</div>
        </main>
        <RevealFooter />
      </div>
    </LangProvider>
  )
}

/* Masthead for inner pages — clears the fixed header and names the page.

   Same anatomy as the homepage's opening block, deliberately: a number, a
   rule, a label, then the title. Every page therefore starts the same way,
   and the number tells a visitor where they are in the site rather than
   just decorating the corner. */
export function PageHeader({
  titleKey,
  ledeKey,
  /* Optional stack-layer code, e.g. "L3" — ties a page back to the hero model */
  layer,
  eyebrow,
  index = '01',
}: {
  titleKey: TKey
  ledeKey?: TKey
  layer?: string
  eyebrow?: string
  index?: string
}) {
  const { t } = useLang()

  return (
    <section className="relative overflow-hidden bg-paper pb-14 pt-32 sm:pb-20 sm:pt-40">
      {/* The same single wash the hero uses, so a landing and an inner page
          feel lit from the same place */}
      <div
        className="pointer-events-none absolute -right-[12%] -top-[30%] size-[760px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(91,67,249,0.09) 0%, rgba(72,231,255,0.045) 45%, rgba(244,245,250,0) 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono-ui text-[13px] text-graphite-3">{index}</span>
            <span className="h-px w-8 bg-graphite/20" />
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">
              {eyebrow ?? t('brandSub')}
            </span>
            {layer && (
              <span className="rounded-full bg-violet/10 px-3 py-1">
                <span className="font-mono-ui text-[10px] tracking-[0.16em] text-violet">
                  {layer}
                </span>
              </span>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="font-display-xl mt-8 max-w-4xl text-[clamp(2.4rem,6.4vw,4.8rem)] text-graphite">
            {t(titleKey)}
          </h1>
        </Reveal>

        {ledeKey && (
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-graphite-2 sm:text-lg">
              {t(ledeKey)}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}

/* Shared section wrapper — keeps vertical rhythm identical everywhere and
   carries the ground colour, so a page is a list of sections rather than a
   list of paddings that drifted apart. */
export function Section({
  children,
  tone = 'light',
  className,
  id,
}: {
  children: React.ReactNode
  tone?: 'light' | 'dark' | 'alt'
  className?: string
  id?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden py-20 sm:py-28',
        tone === 'dark' && 'on-ink bg-graphite text-white',
        tone === 'light' && 'bg-paper text-graphite',
        tone === 'alt' && 'bg-paper-3 text-graphite',
        className,
      )}
    >
      {children}
    </section>
  )
}
