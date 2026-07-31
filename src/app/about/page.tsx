import type { Metadata } from 'next'
import { SiteShell, PageHeader } from '@/components/site/shell'
import { About, VisionMission } from '@/components/site/about'
import { Differentiators, ContactCta } from '@/components/site/differentiators'

export const metadata: Metadata = {
  title: 'About — Meraki-IT',
  description:
    'Founded in 2008, Meraki-IT brings over 50 years of combined expertise to designing innovative, economical technology solutions — built around data that stays reliable, recoverable and secure.',
}

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHeader titleKey="aboutTitle" ledeKey="aboutLede" eyebrow="About" />
      <About />
      <VisionMission />
      <Differentiators />
      <ContactCta />
    </SiteShell>
  )
}
