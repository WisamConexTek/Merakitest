'use client'

import { createContext, useContext } from 'react'

/* Copy for the Meraki-IT site.
   Facts (founding year, expertise figure, service list, contact details)
   are taken from meraki-it.com. Anything not sourced from there is marked
   with a TODO in the constants below rather than invented. */
export const dict = {
  /* ─── Brand ─── */
  brandName: 'Meraki-IT',
  brandSub: 'Information Technology Simplified',

  /* ─── Nav ─── */
  navHome: 'Home',
  navServices: 'Services',
  navSecurity: 'Security',
  navAbout: 'About',
  navContact: 'Contact',
  navCta: 'Talk to an engineer',

  /* ─── Hero ─── */
  heroBadge: 'Infrastructure & Managed Security',
  heroTitleTop: 'Your whole stack.',
  heroTitleBottom: 'Built, run, defended.',
  heroLede:
    'Meraki-IT designs the infrastructure your business runs on, then watches every layer of it around the clock. Four layers, one team, one number to call.',
  heroScroll: 'Scroll to separate the layers',

  /* ─── The Perimeter (SOC) ─── */
  perimeterKicker: 'Managed security',
  perimeterTitle: 'A perimeter is only as good as the people watching it.',
  perimeterLede:
    'We run security operations for our clients as an MSSP — detection, triage and response on infrastructure we already know inside out, because we built it.',

  /* ─── Services ─── */
  servicesKicker: 'What we do',
  /* Deliberately not a count — the service list lives in services-data.ts and
     will grow, and a headline that says "six" goes stale the moment it does. */
  servicesTitle: 'Every discipline. One stack.',
  servicesLede:
    'Every engagement starts with the same question: which layer is costing you the most, right now?',

  /* ─── Partners ─── */
  partnersKicker: 'The platforms we run on',
  partnersTitle: 'We do not resell tools. We operate them.',
  partnersLede:
    'Meraki-IT is the managed security service provider for three platforms, each covering a different layer of the stack. Licensing, tuning, monitoring and response are ours — you get one contract and one escalation path.',

  /* ─── Why Meraki ─── */
  whyKicker: 'Why Meraki-IT',
  whyTitle: 'Since 2008, and still answering the phone ourselves.',

  /* ─── About ─── */
  aboutKicker: 'About the company',
  aboutTitle: 'Trusted partner for all technology needs',
  aboutLede:
    'Founded in 2008, Meraki-IT brings over 50 years of combined expertise to designing innovative, economical technology solutions — built around data that stays reliable, recoverable and secure.',
  visionHeading: 'Our Vision',
  visionBody:
    'To be the technology partner our clients never have to think about — infrastructure that simply works, secured well enough that its owners can spend their attention on their business instead of on us.',
  missionHeading: 'Our Mission',
  missionBody:
    'To simplify information technology. We consolidate what has sprawled, modernise what has aged, and defend what matters — with engineers who know the environment because they designed it.',

  /* ─── Contact ─── */
  contactKicker: 'Get in touch',
  contactTitle: 'Tell us which layer hurts.',
  contactLede:
    'Send us the shape of the problem — an ageing data centre, a network that keeps you up at night, an audit you have to pass. We will tell you honestly whether we are the right team for it.',
  contactCta: 'Send message',

  /* ─── Footer ─── */
  footerDesc:
    'Meraki-IT designs, builds and defends the IT infrastructure businesses run on — from consolidation and data centre transformation to 24/7 managed security.',
  footerServices: 'Services',
  footerCompany: 'Company',
  footerConnect: 'Contact',
  footerSecurityLabel: 'Security posture:',
  footerSecurity:
    'Client data is handled under least-privilege access, encrypted in transit and at rest, and retained only as long as an engagement requires it.',
  footerPrivacy: 'Privacy Policy',
  footerTerms: 'Terms of Service',
  footerRights: 'All Rights Reserved.',
} satisfies Record<string, string>

export type TKey = keyof typeof dict

/* ─── Real company details (from meraki-it.com) ─── */
export const COMPANY = {
  phoneDisplay: '(888) 499-9880',
  phoneHref: 'tel:+18884999880',
  email: 'info@meraki-it.com',
  emailHref: 'mailto:info@meraki-it.com',
  address: '1919 Boulevard Street, Unit A. Greensboro, NC. 27407',
  mapUrl: 'https://maps.google.com/?q=1919+Boulevard+Street+Unit+A+Greensboro+NC+27407',
  founded: 2008,
  expertiseYears: '50+',
}

export const LINKS = {
  linkedin: 'https://www.linkedin.com/company/mrkitusa/',
}

const LangContext = createContext<{ t: (key: TKey) => string }>({
  t: (key) => dict[key],
})

/* Single-language today. The provider stays because swapping `dict` for a
   locale lookup is then a one-file change — every component already reads
   its copy through `t()` rather than holding literals. */
export function LangProvider({ children }: { children: React.ReactNode }) {
  return (
    <LangContext.Provider value={{ t: (key: TKey) => dict[key] ?? String(key) }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
