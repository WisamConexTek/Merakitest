'use client'

import Link from 'next/link'
import { ArrowUpRight, Phone, Mail } from 'lucide-react'
import { useLang, COMPANY } from '@/lib/i18n'
import { Reveal } from './primitives'

/* ═══════════════════════════════════════════════════════════
   WHY MERAKI-IT

   A numbered ledger, not a bento of cards. Four reasons is a
   list; rendering a list as four boxes with four icons adds
   decoration and subtracts scannability. The rule between rows
   does the work the borders would have done.

   The four claims come from meraki-it.com's own differentiators;
   the two figures are the company's stated founding year and
   combined-experience number.
   ═══════════════════════════════════════════════════════════ */

const REASONS = [
  {
    title: 'Support that answers, at the hour it matters',
    body: 'Monitoring runs continuously and escalation paths are agreed before onboarding finishes — so a three-in-the-morning event meets a playbook rather than a voicemail greeting.',
  },
  {
    title: 'Solutions built for your estate, not from a catalogue',
    body: 'Every engagement starts with discovery of what you actually have. Recommendations that arrive before that work has been done are a product pitch wearing a proposal cover.',
  },
  {
    title: 'Current technology, chosen for a reason',
    body: 'We run modern platforms because they solve the problem better, and we will tell you plainly when the boring option is the right one. New is not an argument on its own.',
  },
  {
    title: 'Engineers who own the outcome',
    body: 'The team that designed your environment is the team monitoring it. That context is the difference between a fast containment and a long conference call about whose fault it is.',
  },
]

export function Differentiators() {
  const { t } = useLang()

  return (
    <section className="relative bg-paper-3 py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono-ui text-[13px] text-graphite-3">05</span>
                <span className="h-px w-8 bg-graphite/20" />
                <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">
                  {t('whyKicker')}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="font-display-xl mt-8 text-[clamp(2rem,4.4vw,3.2rem)] text-graphite">
                {t('whyTitle')}
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-12 flex flex-wrap gap-12">
                <div>
                  {/* Printed, not counted: a thousands-grouping counter turns a
                      year into "1,997" on its way up, and counting to a date
                      implies it is a quantity rather than a point in time. */}
                  <p className="font-display-xl text-[3.2rem] text-violet sm:text-[4rem]">
                    {COMPANY.founded}
                  </p>
                  <p className="font-mono-ui mt-2 text-[11px] uppercase tracking-[0.16em] text-graphite-3">
                    Founded
                  </p>
                </div>
                <div>
                  <p className="font-display-xl text-[3.2rem] text-violet sm:text-[4rem]">
                    {COMPANY.expertiseYears}
                  </p>
                  <p className="font-mono-ui mt-2 text-[11px] uppercase leading-relaxed tracking-[0.16em] text-graphite-3">
                    Years combined
                    <br />
                    expertise
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <Link
                href="/about"
                className="group mt-12 inline-flex items-center gap-3 rounded-full border border-graphite/15 px-6 py-3.5 text-[15px] font-medium text-graphite transition-colors duration-500 hover:border-graphite/40"
              >
                About the company
                <ArrowUpRight className="size-4 text-violet transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>

          <ul className="flex flex-col">
            {REASONS.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 0.06}>
                <li className="grid grid-cols-[auto_1fr] gap-6 border-t border-graphite/10 py-8 sm:gap-9">
                  <span className="font-mono-ui pt-1.5 text-[13px] text-violet">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.25rem] leading-snug text-graphite sm:text-[1.4rem]">
                      {reason.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-graphite-2 sm:text-base">
                      {reason.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════ CLOSING CTA ═══════════════════
   The one strong block of colour on the site, and the last thing before
   the footer. It is violet rather than ink because the page committed to
   a light ground end to end: on paper, a saturated brand panel is the
   loudest available move and it stays in the family, where a near-black
   slab would just read as a leftover from a different design. */

export function ContactCta() {
  const { t } = useLang()

  const routes = [
    { Icon: Phone, label: COMPANY.phoneDisplay, href: COMPANY.phoneHref, note: 'Call' },
    { Icon: Mail, label: COMPANY.email, href: COMPANY.emailHref, note: 'Email' },
  ]

  return (
    <section className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-violet px-7 py-14 sm:px-14 sm:py-20">
          {/* A second light source inside the panel, so the flat fill has
              somewhere to fall off to */}
          <div
            className="pointer-events-none absolute -right-[10%] -top-[40%] size-[720px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(140,242,255,0.30) 0%, rgba(91,67,249,0) 65%)',
            }}
          />

          <div className="relative grid gap-14 lg:grid-cols-2 lg:items-end">
            <div>
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="font-mono-ui text-[13px] text-white/50">06</span>
                  <span className="h-px w-8 bg-white/30" />
                  <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-white/60">
                    {t('contactKicker')}
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <h2 className="font-display-xl mt-8 text-[clamp(2.2rem,5vw,3.8rem)] text-white">
                  {t('contactTitle')}
                </h2>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-white/75">
                  {t('contactLede')}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.16}>
              <div className="flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="group flex items-center justify-between gap-6 rounded-[22px] bg-white px-7 py-7 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
                >
                  <span>
                    <span className="font-display block text-[1.35rem] text-graphite sm:text-[1.5rem]">
                      Start a conversation
                    </span>
                    <span className="mt-1.5 block text-[15px] text-graphite-2">
                      Tell us what is on fire, or what soon will be
                    </span>
                  </span>
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-violet text-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                    <ArrowUpRight className="size-5" />
                  </span>
                </Link>

                {routes.map((r) => (
                  <a
                    key={r.note}
                    href={r.href}
                    className="group flex items-center justify-between gap-6 rounded-[22px] border border-white/25 px-7 py-6 transition-colors duration-500 hover:border-white/60"
                  >
                    <span className="flex items-center gap-4">
                      <r.Icon className="size-4 shrink-0 text-white/70" />
                      <span className="font-mono-ui text-[15px] text-white">{r.label}</span>
                    </span>
                    <span className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-white/50">
                      {r.note}
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
