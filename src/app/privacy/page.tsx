import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/shell'
import { LegalPage } from '@/components/site/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy — Meraki-IT',
  description:
    'How Meraki-IT collects, uses and protects your personal information when you visit our website or use our managed IT and security services.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy — Meraki-IT',
    description:
      'How Meraki-IT collects, uses and protects your personal information when you visit our website or use our managed IT and security services.',
    url: '/privacy',
  },
}

const LAST_UPDATED = 'August 26, 2026'

const SECTIONS = [
  {
    heading: 'Information We Collect',
    content: `When you interact with our website or services, we may collect the following types of information:

**Information you provide directly:**
- Contact details (name, email address, phone number) submitted through our contact form
- Company name and job title when requesting a consultation
- Service-related information you share during project scoping

**Information collected automatically:**
- IP address and approximate geographic location
- Browser type, operating system and device information
- Pages visited, time spent on pages and referring URLs
- Cookies and similar tracking technologies (see "Cookies" section below)`,
  },
  {
    heading: 'How We Use Your Information',
    content: `We use the information we collect to:

- Respond to inquiries submitted through our contact form
- Provide, maintain and improve our managed IT and security services
- Communicate with you about your projects and service agreements
- Send service-related notices (outage alerts, security advisories, maintenance windows)
- Analyse website usage to improve user experience and performance
- Comply with legal obligations and enforce our terms of service

We do **not** sell, rent or share your personal information with third parties for their marketing purposes.`,
  },
  {
    heading: 'Data Retention',
    content: `We retain your personal information only for as long as necessary to fulfil the purposes described in this policy, or as required by law. Specifically:

- **Contact form submissions** are retained for the duration of the business relationship and for up to 12 months after the last interaction
- **Website analytics data** is retained in aggregate form and is not linked to identifiable individuals after 26 months
- **Client engagement records** are retained as required by applicable regulatory and contractual obligations`,
  },
  {
    heading: 'Data Security',
    content: `Meraki-IT implements industry-standard security measures to protect your personal information, including:

- Encryption in transit (TLS/SSL) and at rest
- Least-privilege access controls for all internal systems
- Regular security assessments and monitoring
- Employee access limited to personnel who require it for their role

While no method of transmission or storage is 100% secure, we take commercially reasonable steps to protect your data.`,
  },
  {
    heading: 'Cookies',
    content: `Our website uses cookies and similar technologies for:

- **Essential cookies** that enable core website functionality (session management, security)
- **Analytics cookies** that help us understand how visitors interact with our website

You can control cookie preferences through your browser settings. Disabling cookies may affect certain website features.`,
  },
  {
    heading: 'Third-Party Services',
    content: `We may use third-party service providers that process personal information on our behalf, including:

- **Cloudflare** — for content delivery, DDoS protection and web application firewall services
- **Analytics providers** — for aggregated website usage statistics

These providers are bound by their own privacy policies and process data only as directed by us.`,
  },
  {
    heading: 'Your Rights',
    content: `Depending on your jurisdiction, you may have the right to:

- Access the personal information we hold about you
- Request correction of inaccurate information
- Request deletion of your personal information
- Opt out of marketing communications
- File a complaint with a relevant data protection authority

To exercise any of these rights, contact us at **info@meraki-it.com** or call **(888) 499-9880**.`,
  },
  {
    heading: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. We encourage you to review this policy periodically.`,
  },
  {
    heading: 'Contact Us',
    content: `If you have questions about this Privacy Policy or our data practices, please contact us:

**Meraki-IT**
1919 Boulevard Street, Unit A
Greensboro, NC 27407

**Email:** info@meraki-it.com
**Phone:** (888) 499-9880`,
  },
]

export default function PrivacyPage() {
  return (
    <SiteShell>
      <LegalPage
        title="Privacy Policy"
        eyebrow="Legal"
        lastUpdated={LAST_UPDATED}
        sections={SECTIONS}
      />
    </SiteShell>
  )
}
