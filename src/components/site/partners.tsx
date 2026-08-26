'use client'

import Link from 'next/link'
import { ArrowUpRight, Radar, Globe, HardDrive } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { Reveal } from './primitives'
import { LAYER_SOLID, LAYER_ON_LIGHT, type LayerCode } from './iso'

/* ═══════════════════════════════════════════════════════════
   THE PLATFORMS

   The one section a competitor cannot copy: Meraki-IT does not
   resell these three, it operates them as the MSSP. Each panel
   names the stack layer it defends, which closes the loop with
   the hero.

   ── On the vendor marks ──
   These are other companies' trademarks. Nothing here draws,
   approximates or recolours their logos: each panel sets the
   vendor's name in our own typeface and states the relationship
   in words. If Meraki-IT's partner programmes supply official
   brand assets AND permission to display them, they can be
   dropped in — until then, a typographic treatment is both the
   honest option and the safe one.
   ═══════════════════════════════════════════════════════════ */

type Platform = {
  name: string
  href: string
  Icon: typeof Radar
  layers: LayerCode[]
  category: string
  what: string
  weDo: string[]
}

const PLATFORMS: Platform[] = [
  {
    name: 'AttackMetricX',
    href: 'https://www.attackmetricx.com/',
    Icon: Radar,
    layers: ['L4'],
    category: 'Attack surface management',
    what: 'Continuously discovers what of yours is reachable from the internet — including the assets stood up for a project years ago and never taken down.',
    weDo: [
      'Onboard and scope the external estate',
      'Review discovery output, filter the noise',
      'Turn genuine exposures into remediation work',
    ],
  },
  {
    name: 'Cloudflare',
    href: 'https://www.cloudflare.com/',
    Icon: Globe,
    layers: ['L3'],
    category: 'Edge, WAF & Zero Trust',
    what: 'Sits in front of your public services absorbing volumetric attacks, filtering application-layer abuse, and granting remote access per identity rather than per tunnel.',
    weDo: [
      'Design and deploy the edge configuration',
      'Tune WAF rules against your real traffic',
      'Operate Zero Trust access policy as it changes',
    ],
  },
  {
    name: 'Acronis',
    href: 'https://www.acronis.com/en/',
    Icon: HardDrive,
    layers: ['L2', 'L1'],
    category: 'Backup, DR & cyber protection',
    what: 'Protects the data and the endpoints, with immutable retention that ransomware cannot rewrite — the control that decides how bad the worst day gets.',
    weDo: [
      'Design protection to agreed RPO and RTO',
      'Monitor backup health daily, catch silent failures',
      'Rehearse restores and report the real recovery time',
    ],
  },
]

function PlatformPanel({ platform, index }: { platform: Platform; index: number }) {
  const tint = LAYER_SOLID[platform.layers[0]]
  const ink = LAYER_ON_LIGHT[platform.layers[0]]

  return (
    <Reveal delay={index * 0.08}>
      <div className="surface surface-lift group flex h-full flex-col p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <span
            className="flex size-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${tint}18`, color: ink }}
          >
            <platform.Icon className="size-6" />
          </span>
          <div className="flex gap-1.5">
            {platform.layers.map((l) => (
              <span
                key={l}
                className="font-mono-ui rounded-full px-2.5 py-1 text-[10px] tracking-[0.12em]"
                style={{ backgroundColor: `${LAYER_SOLID[l]}18`, color: LAYER_ON_LIGHT[l] }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Vendor name in OUR typeface — never an imitation of their mark */}
        <h3 className="font-display mt-8 text-[1.7rem] text-graphite sm:text-[1.9rem]">
          {platform.name}
        </h3>
        <p className="font-mono-ui mt-2 text-[11px] uppercase tracking-[0.16em] text-graphite-3">
          {platform.category}
        </p>

        <p className="mt-6 text-[15px] leading-relaxed text-graphite-2">{platform.what}</p>

        <div className="mt-7 border-t border-graphite/8 pt-6">
          <span className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-violet">
            What Meraki-IT does
          </span>
          <ul className="mt-4 flex flex-col gap-3">
            {platform.weDo.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-graphite-2"
              >
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full"
                  style={{ background: ink }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={platform.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-1.5 self-start text-[13px] font-medium text-graphite-3 transition-colors duration-500 hover:text-violet"
        >
          {platform.name} platform
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </Reveal>
  )
}

export function Partners({ showHeading = true }: { showHeading?: boolean } = {}) {
  const { t } = useLang()

  return (
    <section className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="font-mono-ui text-[13px] text-graphite-3">04</span>
              <span className="h-px w-8 bg-graphite/20" />
              <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">
                {t('partnersKicker')}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            {showHeading ? (
              <h2 className="font-display-xl mt-8 text-[clamp(2.1rem,5vw,3.8rem)] text-graphite">
                {t('partnersTitle')}
              </h2>
            ) : (
              <h2 className="font-display-xl mt-8 text-[clamp(1.9rem,4.2vw,3rem)] text-graphite">
                Our elite technology partners, managed by us.
              </h2>
            )}
          </Reveal>

          {showHeading && (
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-graphite-2">
                {t('partnersLede')}
              </p>
            </Reveal>
          )}
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {PLATFORMS.map((platform, i) => (
            <PlatformPanel key={platform.name} platform={platform} index={i} />
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-graphite-3">
            AttackMetricX, Cloudflare and Acronis are trademarks of their respective owners.
            As an independent MSSP, Meraki-IT partners with these industry leaders to operate their 
            platforms on behalf of our clients.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <Link
            href="/security"
            className="group mt-9 inline-flex items-center gap-3 rounded-full border border-graphite/15 px-6 py-3.5 text-[15px] font-medium text-graphite transition-colors duration-500 hover:border-graphite/40"
          >
            The managed security service in full
            <ArrowUpRight className="size-4 text-violet transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
