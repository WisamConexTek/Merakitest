'use client'

import { Eye, Compass, MapPin } from 'lucide-react'
import { useLang, COMPANY } from '@/lib/i18n'
import { Reveal } from './primitives'
import { MerakiMark } from './logo'

/* ═══════════════════════════════════════════════════════════
   ABOUT — /about

   Two claims the company can actually stand behind: founded 2008,
   fifty-plus years of combined expertise. Both come from
   meraki-it.com. Nothing else numeric appears on this page,
   because an about page padded with invented metrics is the
   fastest way to lose a technical reader.
   ═══════════════════════════════════════════════════════════ */

export function About() {
  const { t } = useLang()

  return (
    <section className="relative bg-paper py-24 sm:py-32">
      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          {/* No headline here: /about states it in its PageHeader, and the
              same sentence twice on one screen reads as an oversight. */}
          <div>
            <Reveal>
              <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">{t('aboutKicker')}</span>
            </Reveal>
            <h2 className="font-display-xl mt-8 text-[clamp(2rem,4.6vw,3.2rem)] text-graphite">
              Built by people who have run this before.
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-graphite-2">
                Meraki-IT was founded in 2008 and has spent every year since designing,
                consolidating and defending infrastructure for businesses that need it to simply
                work. The team has done this in enough environments to know which shortcuts cost
                money later.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-12 flex flex-wrap gap-10">
                <div>
                  {/* Printed, not counted. `Counter` groups thousands, so a year
                      animates through "1,997" and lands on "2,008" — and even
                      correctly formatted, counting up to a date implies it is a
                      quantity rather than a point in time. */}
                  <p className="font-display-xl text-[3.2rem] text-violet sm:text-[4rem]">{COMPANY.founded}</p>
                  <p className="font-mono-ui mt-2 text-[11px] uppercase tracking-[0.16em] text-graphite-3">
                    Founded
                  </p>
                </div>
                
                <div>
                  <p className="font-display-xl text-[3.2rem] text-violet sm:text-[4rem]">
                    {COMPANY.expertiseYears}
                  </p>
                  <p className="font-mono-ui mt-2 text-[11px] uppercase leading-relaxed tracking-[0.16em] text-graphite-3">
                    Years combined expertise
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <a
                href={COMPANY.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="surface surface-lift mt-14 inline-flex items-start gap-4 p-6"
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-violet" />
                <span>
                  <span className="font-mono-ui block text-[11px] uppercase tracking-[0.16em] text-graphite-3">
                    Where we are
                  </span>
                  <span className="mt-2 block text-[15px] leading-relaxed text-graphite-2">
                    {COMPANY.address}
                  </span>
                </span>
              </a>
            </Reveal>
          </div>

          {/* The mark, at the size it was designed to be looked at */}
          <Reveal delay={0.12}>
            <div className="flex h-full flex-col justify-center">
              <MerakiMark className="w-full max-w-[300px] self-center" title="Meraki-IT" />
              <p className="font-mono-ui mt-10 text-center text-[11px] uppercase leading-relaxed tracking-[0.18em] text-graphite-3">
                {t('brandSub')}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function VisionMission() {
  const { t } = useLang()

  const blocks = [
    { Icon: Eye, heading: t('visionHeading'), body: t('visionBody'), accent: '#48E7FF', ink: '#0B8FA6' },
    { Icon: Compass, heading: t('missionHeading'), body: t('missionBody'), accent: '#5B43F9', ink: '#5B43F9' },
  ]

  return (
    <section className="relative bg-paper-3 py-24 sm:py-32">
            <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {blocks.map((block, i) => (
            <Reveal key={block.heading} delay={i * 0.08}>
              <div className="surface flex h-full flex-col p-8 sm:p-10">
                <span
                  className="flex size-14 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${block.accent}18`, color: block.ink }}
                >
                  <block.Icon className="size-5" />
                </span>
                <h3 className="font-display mt-8 text-[1.6rem] text-graphite sm:text-[1.9rem]">
                  {block.heading}
                </h3>
                <p className="mt-5 text-[16px] leading-relaxed text-graphite-2">{block.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
