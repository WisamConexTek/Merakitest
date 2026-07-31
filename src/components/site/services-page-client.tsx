'use client'

import { useState } from 'react'
import { SiteShell, PageHeader } from '@/components/site/shell'
import { ContactCta } from '@/components/site/differentiators'
import { Reveal } from '@/components/site/primitives'
import { ServiceTile } from '@/components/site/services-section'
import {
  SERVICES_DATA,
  SERVICE_CATEGORY_MAP,
  CATEGORY_LABELS,
  type ServiceCategory,
} from '@/lib/services-data'
import { cn } from '@/lib/utils'

const FILTERS: { id: ServiceCategory | 'all'; label: string }[] = [
  { id: 'all', label: `All ${SERVICES_DATA.length}` },
  { id: 'build', label: CATEGORY_LABELS.build },
  { id: 'secure', label: CATEGORY_LABELS.secure },
  { id: 'run', label: CATEGORY_LABELS.run },
]

export function ServicesPageClient() {
  const [active, setActive] = useState<ServiceCategory | 'all'>('all')

  const shown =
    active === 'all'
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => SERVICE_CATEGORY_MAP[s.slug] === active)

  return (
    <SiteShell>
      <PageHeader titleKey="servicesTitle" ledeKey="servicesLede" eyebrow="Services" index="01" />

      <section className="relative bg-paper pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
          {/* Real buttons in a labelled group, so the whole set is reachable by
              keyboard and the current choice is announced rather than being
              conveyed by colour alone. */}
          <Reveal>
            <div role="group" aria-label="Filter services by discipline" className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => {
                const on = active === filter.id
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActive(filter.id)}
                    aria-pressed={on}
                    className={cn(
                      'rounded-full px-5 py-3 text-[14px] font-medium transition-colors duration-500',
                      on
                        ? 'bg-graphite text-white'
                        : 'border border-graphite/15 text-graphite-2 hover:border-graphite/40 hover:text-graphite',
                    )}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>
          </Reveal>

          <p aria-live="polite" className="font-mono-ui mt-6 text-[12px] text-graphite-3">
            Showing {shown.length} of {SERVICES_DATA.length} services
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((service, i) => (
              /* Keyed by filter as well as slug: a card that survives a filter
                 change should replay its reveal rather than sit half-animated
                 beside freshly mounted ones. */
              <ServiceTile key={`${active}-${service.slug}`} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </SiteShell>
  )
}
