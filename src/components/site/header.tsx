'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react'
import { useLang, COMPANY, type TKey } from '@/lib/i18n'
import { MerakiLogo } from './logo'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════
   THE HEADER

   Three states, and the moves between them are most of the
   impression this component makes:

     AT REST         full bar, transparent, sitting on the paper
     SCROLLING DOWN  folds away to the right and leaves a single
                     button behind
     SCROLLING UP    the full bar returns, condensed onto a white
                     pill — WITH its links, every time

   The bar does not simply vanish on the way down. It collapses
   rightward into one button, so navigation is never actually gone
   — it is parked. An earlier version slid the whole thing off the
   top, which meant a visitor mid-page had no way to move without
   scrolling back up first.

   Coming back it always returns complete. The links used to
   dissolve in the condensed state, on the theory that a condensed
   bar is for getting back to the top rather than for browsing —
   which was a guess about intent, and the wrong one. Scrolling up
   IS the gesture for "show me the navigation", so it shows all of
   it.

   ── Why a threshold, not a raw delta ──
   Reacting to every scroll event makes the bar flicker on trackpad
   jitter and on the rubber-banding at the top and bottom of a page.
   Direction only flips after ACCUMULATED movement passes a
   threshold, so small wobbles never register.
   ═══════════════════════════════════════════════════════════ */

const NAV_LINKS: { href: string; key: TKey }[] = [
  { href: '/', key: 'navHome' },
  { href: '/services', key: 'navServices' },
  { href: '/security', key: 'navSecurity' },
  { href: '/about', key: 'navAbout' },
  { href: '/contact', key: 'navContact' },
]

/* How far you have to travel in one direction before the bar agrees */
const FLIP = 46
/* Below this the bar is always shown in its resting state */
const TOP_ZONE = 90

const GLIDE = [0.16, 1, 0.3, 1] as const

/* '/' would prefix-match every route, so it is the one link that has to
   compare exactly. */
function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function Header() {
  const { t } = useLang()
  const pathname = usePathname()
  const { scrollY } = useScroll()

  /* `collapsed` folds the bar down to the parked button; `condensed` is the
     white pill styling it wears once the page has moved at all. */
  const [collapsed, setCollapsed] = useState(false)
  const [condensed, setCondensed] = useState(false)
  const [open, setOpen] = useState(false)

  const lastY = useRef(0)
  const travel = useRef(0)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - lastY.current
    lastY.current = y

    if (y < TOP_ZONE) {
      setCondensed(false)
      setCollapsed(false)
      travel.current = 0
      return
    }
    setCondensed(true)

    /* Reset the counter whenever the direction changes, so travel always
       measures distance moved THIS way rather than net displacement. */
    if ((delta > 0 && travel.current < 0) || (delta < 0 && travel.current > 0)) {
      travel.current = 0
    }
    travel.current += delta

    if (travel.current > FLIP) setCollapsed(true)
    else if (travel.current < -FLIP) setCollapsed(false)
  })

  /* A dropdown does not lock the page. The first version opened a
     full-screen sheet with the nav set at 3.4rem — an enormous response to
     tapping one button, and it froze the scroll behind it. This is a small
     panel hung off the button instead, so it dismisses the way a menu
     should: Escape, a click outside, a scroll, or a route change.

     Escape and popstate are both external-system subscriptions, which is
     exactly what an effect is for; neither writes state synchronously. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const close = () => setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('popstate', close)
    /* Passive: this only ever reads that a scroll happened. */
    window.addEventListener('scroll', close, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('popstate', close)
      window.removeEventListener('scroll', close)
    }
  }, [open])

  /* The bar and the parked button both stay put while the panel is up —
     the panel belongs to whichever one opened it, so hiding its own
     trigger would make it look unmoored. */
  const showBar = !collapsed
  const showButton = collapsed

  return (
    <>
      {/* ── The bar ── */}
      <AnimatePresence initial={false}>
        {showBar && (
          <motion.header
            key="bar"
            /* Leaves to the RIGHT rather than upward: it is folding into the
               button parked in that corner, not walking off the top. */
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.97 }}
            transition={{ duration: 0.55, ease: GLIDE }}
            className="fixed inset-x-0 top-0 z-60 px-4 pt-4 sm:px-6 sm:pt-5"
          >
            <div
              className={cn(
                'mx-auto flex items-center justify-between gap-4 transition-[background-color,box-shadow,padding,max-width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                condensed
                  ? 'max-w-[1340px] rounded-full bg-white/85 px-3 py-2.5 shadow-[0_2px_4px_rgba(10,12,31,.05),0_12px_28px_rgba(10,12,31,.07)] backdrop-blur-xl sm:px-4'
                  : 'max-w-[1500px] rounded-full bg-transparent px-1 py-1.5',
              )}
            >
              {/* ── Why both flanks are flex-1 ──
                  The bar is brand | links | actions. With the flanks sized to
                  their content, `justify-between` centres the links in the
                  LEFTOVER space, not in the bar — and the flanks are nowhere
                  near equal (145px of logo against 385px of phone + button),
                  so the links sat 120px left of the bar's midline.

                  Giving both flanks an equal share puts the links on the
                  bar's true centre, and because the share is elastic rather
                  than fixed it degrades by drifting instead of colliding when
                  the bar gets tight. */}
              <Link
                href="/"
                aria-label="Meraki-IT home"
                className="flex-1 transition-opacity duration-500 hover:opacity-65"
              >
                <MerakiLogo className="h-8 sm:h-9" tone="light" />
              </Link>

              {/* Always present. Scrolling up is the ask for navigation, so
                  it arrives complete rather than as a stub. */}
              <nav className="hidden shrink-0 items-center gap-0.5 whitespace-nowrap lg:flex">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-500',
                      isActive(pathname, link.href)
                        ? 'text-violet'
                        : 'text-graphite-2 hover:text-graphite',
                    )}
                  >
                    {t(link.key)}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-1 items-center justify-end gap-2">
                {/* ── Why nowrap, and why 2xl ──
                    A flex item's default floor is its MIN-CONTENT width — the
                    longest single word, not the whole line. So an elastic
                    flank was free to squeeze this box until "(888) 499-9880"
                    broke across two lines. `whitespace-nowrap` raises that
                    floor to the full string, which makes wrapping impossible
                    however tight the bar gets.

                    The breakpoint is the other half. Between 1280 and 1536 the
                    bar has to hold the logo, five links, a phone number and a
                    button, and the phone is the one item that is repeated in
                    the hero, the footer and the contact page. It waits for the
                    width that can carry it rather than being crushed in. */}
                <a
                  href={COMPANY.phoneHref}
                  className="hidden items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[15px] font-medium text-graphite-2 transition-colors duration-500 hover:text-graphite 2xl:flex"
                >
                  <Phone className="size-4" />
                  {COMPANY.phoneDisplay}
                </a>

                <Link
                  href="/contact"
                  className="group hidden items-center gap-2 whitespace-nowrap rounded-full bg-graphite py-2.5 pe-3 ps-5 text-[15px] font-medium text-white transition-colors duration-500 hover:bg-violet sm:flex"
                >
                  {t('navCta')}
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>

                <button
                  onClick={() => setOpen((v) => !v)}
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  aria-expanded={open}
                  className="relative z-70 flex size-11 items-center justify-center rounded-full bg-graphite text-white transition-colors duration-500 hover:bg-violet lg:hidden"
                >
                  {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ── Parked ──
          What the bar folds into on the way down. Deliberately the only
          thing left on screen: one target, in the corner the bar left
          towards, that reopens the whole menu. */}
      <AnimatePresence initial={false}>
        {showButton && (
          <motion.button
            key="parked"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            initial={{ opacity: 0, scale: 0.7, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.7, x: 24 }}
            transition={{ duration: 0.45, ease: GLIDE }}
            className="fixed end-4 top-4 z-70 flex size-14 items-center justify-center rounded-[18px] bg-white text-graphite shadow-[0_2px_4px_rgba(10,12,31,.06),0_12px_28px_rgba(10,12,31,.10)] transition-colors duration-500 hover:text-violet sm:end-6 sm:top-5 sm:size-16 sm:rounded-[20px]"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── The panel ──
          Hung off the top-right corner, the size of an actual menu. The
          links sit at reading size; the trigger stays visible behind it. */}
      <AnimatePresence>
        {open && (
          <>
            {/* Barely-there scrim. Enough to say "this is modal" and to
                give the click-outside somewhere to land, not enough to
                black out the page behind a five-item menu. */}
            <motion.button
              key="scrim"
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: GLIDE }}
              className="fixed inset-0 z-65 cursor-default bg-graphite/15 backdrop-blur-[2px]"
            />

            <motion.nav
              key="panel"
              aria-label="Site menu"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.42, ease: GLIDE }}
              style={{ transformOrigin: 'top right' }}
              className="fixed end-4 top-[86px] z-70 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-[22px] bg-white p-2.5 shadow-[0_4px_8px_rgba(10,12,31,.06),0_24px_56px_rgba(10,12,31,.12),0_60px_120px_rgba(30,30,155,.10)] sm:end-6 sm:top-[104px]"
            >
              {NAV_LINKS.map((link) => {
                const on = isActive(pathname, link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'group flex items-center justify-between rounded-2xl px-4 py-3 text-[17px] font-medium transition-colors duration-300',
                      on ? 'bg-violet/8 text-violet' : 'text-graphite hover:bg-paper',
                    )}
                  >
                    {t(link.key)}
                    <ArrowUpRight
                      className={cn(
                        'size-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
                        on ? 'text-violet' : 'text-graphite-3 group-hover:text-violet',
                      )}
                    />
                  </Link>
                )
              })}

              <div className="mx-4 my-2 h-px bg-graphite/8" />

              <a
                href={COMPANY.phoneHref}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-graphite-2 transition-colors duration-300 hover:bg-paper hover:text-graphite"
              >
                <Phone className="size-4 text-violet" />
                <span className="font-mono-ui text-[14px]">{COMPANY.phoneDisplay}</span>
              </a>

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="group mt-1 flex items-center justify-between gap-3 rounded-2xl bg-graphite px-5 py-3.5 text-[15px] font-medium text-white transition-colors duration-500 hover:bg-violet"
              >
                {t('navCta')}
                <span className="flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

    </>
  )
}
