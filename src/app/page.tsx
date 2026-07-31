import { SiteShell } from '@/components/site/shell'
import { HeroOrigin } from '@/components/site/hero-origin'
import { ServicesSection } from '@/components/site/services-section'
import { Perimeter } from '@/components/site/perimeter'
import { Partners } from '@/components/site/partners'
import { Differentiators, ContactCta } from '@/components/site/differentiators'

export default function Home() {
  /* The page is a numbered sequence and the sections say so: 01 the stack,
     02 what you can buy, 03 who watches it, 04 how we can, 05 why us,
     06 how to start.

     Grounds alternate paper → paper → INK → paper → paper-3 → INK. The two
     dark blocks are the only ones on the page, which is what lets them carry
     weight; if a third arrives, one of these should go. */
  return (
    <SiteShell>
      <HeroOrigin />
      <ServicesSection />
      <Perimeter />
      <Partners />
      <Differentiators />
      <ContactCta />
    </SiteShell>
  )
}
