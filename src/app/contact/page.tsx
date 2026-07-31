import type { Metadata } from 'next'
import { SiteShell, PageHeader } from '@/components/site/shell'
import { ContactSection } from '@/components/site/contact'

export const metadata: Metadata = {
  title: 'Contact — Meraki-IT',
  description:
    'Tell us which layer hurts — an ageing data centre, a network that keeps you up at night, an audit you have to pass. Call (888) 499-9880 or send us the detail.',
}

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHeader titleKey="contactTitle" ledeKey="contactLede" eyebrow="Contact" />
      <ContactSection />
    </SiteShell>
  )
}
