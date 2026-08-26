import type { Metadata } from 'next'
import { ServicesPageClient } from '@/components/site/services-page-client'

export const metadata: Metadata = {
  title: 'Services — Meraki-IT',
  description:
    'Infrastructure consolidation, data centre transformation, network services, cyber security, managed security, backup and disaster recovery, service integration and helpdesk support.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Services — Meraki-IT',
    description:
      'Infrastructure consolidation, data centre transformation, network services, cyber security, managed security, backup and disaster recovery, service integration and helpdesk support.',
    url: '/services',
  },
}

export default function ServicesPage() {
  return <ServicesPageClient />
}
