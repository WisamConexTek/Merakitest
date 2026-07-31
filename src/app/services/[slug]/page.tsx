import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SERVICES_DATA, getServiceBySlug } from '@/lib/services-data'
import { ServiceDetailView } from '@/components/site/service-detail'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return SERVICES_DATA.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return { title: 'Service not found — Meraki-IT' }
  }

  return {
    title: `${service.title} — Meraki-IT`,
    description: service.summary,
    openGraph: {
      title: `${service.title} — Meraki-IT`,
      description: service.summary,
    },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  /* ServiceDetailView renders its own SiteShell — it needs the shell inside
     its own tree so the masthead can sit under the fixed nav. */
  return <ServiceDetailView service={service} />
}
