import type { Metadata } from 'next'
import { SiteShell, PageHeader } from '@/components/site/shell'
import { SecurityPage } from '@/components/site/security-page'
import { Partners } from '@/components/site/partners'
import { ContactCta } from '@/components/site/differentiators'

export const metadata: Metadata = {
  title: 'Managed Security — Meraki-IT',
  description:
    'Meraki-IT is the managed security service provider for AttackMetricX, Cloudflare and Acronis — continuous monitoring, triage and response across the whole stack, with one contract and one escalation path.',
}

export default function SecurityRoute() {
  return (
    <SiteShell>
      <PageHeader
        titleKey="partnersTitle"
        ledeKey="partnersLede"
        eyebrow="Managed security"
        layer="L4"
      />
      {/* Coverage and response first — what the service does — then the
          platforms it runs on. A visitor who arrives here has already been
          told we are an MSSP; what they want next is the mechanics. */}
      <SecurityPage />
      <Partners showHeading={false} />
      <ContactCta />
    </SiteShell>
  )
}
