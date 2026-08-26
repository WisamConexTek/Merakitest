'use client'

import Link from 'next/link'
import { Linkedin, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react'
import { useLang, LINKS, COMPANY, type TKey } from '@/lib/i18n'
import { SERVICES_DATA } from '@/lib/services-data'
import { MerakiLogo } from './logo'

/* ═══════════════════════════════════════════════════════════
   FOOTER — light register

   Deliberately NOT another dark slab. The closing CTA above it is
   already ink, and stacking a second dark block underneath turns
   the bottom third of every page into one undifferentiated mass.
   A quiet grey footer lets the CTA stay the last strong thing on
   the page, which is where the attention belongs.
   ═══════════════════════════════════════════════════════════ */

const COMPANY_LINKS: { key: TKey; href: string }[] = [
  { key: 'navServices', href: '/services' },
  { key: 'navSecurity', href: '/security' },
  { key: 'navAbout', href: '/about' },
  { key: 'navContact', href: '/contact' },
]

const CONTACT = [
  { Icon: Phone, label: COMPANY.phoneDisplay, href: COMPANY.phoneHref, mono: true },
  { Icon: Mail, label: COMPANY.email, href: COMPANY.emailHref, mono: false },
  { Icon: MapPin, label: COMPANY.address, href: COMPANY.mapUrl, mono: false, external: true },
]

export function Footer() {
  const { t } = useLang()

  return (
    <footer className="relative bg-paper-3 pt-16 sm:pt-24">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block" aria-label="Meraki-IT home">
              <MerakiLogo className="h-9" tone="light" showTagline />
            </Link>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-graphite-2">
              {t('footerDesc')}
            </p>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="mt-7 flex size-11 items-center justify-center rounded-full bg-white text-graphite-2 shadow-[0_1px_2px_rgba(10,12,31,.05),0_4px_12px_rgba(10,12,31,.04)] transition-colors duration-500 hover:text-violet"
            >
              <Linkedin className="size-4" />
            </a>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-graphite-3">
              {t('footerServices')}
            </h3>
            <ul className="mt-6 flex flex-col gap-3">
              {SERVICES_DATA.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-[15px] text-graphite-2 transition-colors duration-400 hover:text-violet"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-graphite-3">
              {t('footerCompany')}
            </h3>
            <ul className="mt-6 flex flex-col gap-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-graphite-2 transition-colors duration-400 hover:text-violet"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-graphite-3">
              {t('footerConnect')}
            </h3>
            <ul className="mt-6 flex flex-col gap-5">
              {CONTACT.map((row) => (
                <li key={row.label}>
                  <a
                    href={row.href}
                    {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-start gap-3 text-[15px] leading-relaxed text-graphite-2 transition-colors duration-400 hover:text-violet"
                  >
                    <row.Icon className="mt-1 size-4 shrink-0 text-violet" />
                    <span className={row.mono ? 'font-mono-ui' : undefined}>{row.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Security posture — the equivalent of a risk note for a company
            whose product is other people's trust */}
        <div className="mt-16 rounded-[18px] bg-white p-6 shadow-[0_1px_2px_rgba(10,12,31,.05),0_4px_12px_rgba(10,12,31,.04)] sm:p-7">
          <p className="max-w-4xl text-[14px] leading-relaxed text-graphite-2">
            <span className="font-semibold text-graphite">{t('footerSecurityLabel')}</span>{' '}
            {t('footerSecurity')}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-graphite/8 py-8 sm:flex-row sm:items-center">
          <p className="font-mono-ui text-[12px] text-graphite-3">
            © {new Date().getFullYear()} {t('brandName')}. {t('footerRights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
