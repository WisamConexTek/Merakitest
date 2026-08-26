import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/shell'
import { LegalPage } from '@/components/site/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service — Meraki-IT',
  description:
    'Terms and conditions governing the use of the Meraki-IT website and managed IT infrastructure and security services.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service — Meraki-IT',
    description:
      'Terms and conditions governing the use of the Meraki-IT website and managed IT infrastructure and security services.',
    url: '/terms',
  },
}

const LAST_UPDATED = 'August 26, 2026'

const SECTIONS = [
  {
    heading: 'Acceptance of Terms',
    content: `By accessing or using the Meraki-IT website ("Site") or engaging our managed IT and security services ("Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Site or Services.

These terms apply to all visitors, users and clients of Meraki-IT.`,
  },
  {
    heading: 'Description of Services',
    content: `Meraki-IT provides managed IT infrastructure and cybersecurity services, including but not limited to:

- IT infrastructure consolidation and data centre transformation
- Network design, segmentation and edge security
- Managed security services (MSSP) — detection, triage and incident response
- Backup, disaster recovery and cyber protection
- Helpdesk and ongoing technical support

The specific scope, deliverables and service levels for any engagement are defined in a separate Statement of Work (SOW) or Service Agreement between Meraki-IT and the client.`,
  },
  {
    heading: 'Use of the Website',
    content: `You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use of this site by, any third party. Prohibited behaviour includes but is not limited to:

- Attempting to gain unauthorised access to the Site, its servers or any connected systems
- Introducing malicious code, viruses or other harmful material
- Using the Site to collect personal information about other users
- Engaging in any activity that could damage, disable or impair the Site`,
  },
  {
    heading: 'Intellectual Property',
    content: `All content on this website — including text, graphics, logos, design elements and software — is the property of Meraki-IT or its licensors and is protected by applicable copyright, trademark and intellectual property laws.

You may not reproduce, distribute, modify or create derivative works from any content on this Site without prior written consent from Meraki-IT.

**Third-party trademarks:** AttackMetricX, Cloudflare and Acronis are trademarks of their respective owners. Their mention on this Site does not imply endorsement or affiliation beyond the stated partnership.`,
  },
  {
    heading: 'Client Responsibilities',
    content: `When engaging Meraki-IT for Services, clients agree to:

- Provide accurate and complete information necessary for the delivery of Services
- Maintain the confidentiality of any account credentials or access provided
- Cooperate with reasonable requests for access, information or approvals
- Comply with all applicable laws and regulations relevant to their use of the Services
- Notify Meraki-IT promptly of any security incidents or suspected breaches`,
  },
  {
    heading: 'Service Availability and Limitations',
    content: `While Meraki-IT strives to provide reliable and uninterrupted Services:

- We do not guarantee that the Site or Services will be available at all times or free from errors
- Scheduled maintenance windows may temporarily affect service availability
- Specific uptime commitments, if any, are defined in individual Service Agreements
- Detection and monitoring services reduce exposure but do not guarantee prevention of all security incidents`,
  },
  {
    heading: 'Limitation of Liability',
    content: `To the fullest extent permitted by law, Meraki-IT shall not be liable for:

- Any indirect, incidental, special, consequential or punitive damages
- Loss of profits, data, business opportunities or goodwill
- Damages arising from the use or inability to use the Site or Services
- Damages caused by third-party actions, including cyberattacks, despite reasonable security measures

Our total liability for any claim arising from or related to the Services shall not exceed the fees paid by the client for the specific Service giving rise to the claim during the twelve (12) months preceding the event.`,
  },
  {
    heading: 'Indemnification',
    content: `You agree to indemnify and hold harmless Meraki-IT, its officers, employees and partners from any claims, losses, damages, liabilities and expenses (including legal fees) arising out of your use of the Site or Services, your violation of these Terms, or your violation of any rights of a third party.`,
  },
  {
    heading: 'Confidentiality',
    content: `Both parties agree to maintain the confidentiality of any proprietary or sensitive information disclosed during the course of an engagement. This obligation survives the termination of any Service Agreement unless the information:

- Becomes publicly available through no fault of the receiving party
- Was already known to the receiving party before disclosure
- Is independently developed without reference to the confidential information
- Is required to be disclosed by law or court order`,
  },
  {
    heading: 'Termination',
    content: `Meraki-IT reserves the right to suspend or terminate access to the Site or Services at any time, with or without cause, upon reasonable notice. Termination of ongoing Services is governed by the applicable Service Agreement or SOW.

Upon termination, all provisions that by their nature should survive will remain in effect, including intellectual property, limitation of liability, indemnification and confidentiality.`,
  },
  {
    heading: 'Governing Law',
    content: `These Terms of Service are governed by and construed in accordance with the laws of the State of North Carolina, United States, without regard to conflict of law principles. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in Guilford County, North Carolina.`,
  },
  {
    heading: 'Changes to These Terms',
    content: `We may update these Terms of Service from time to time. When we do, we will revise the "Last updated" date at the top of this page. Continued use of the Site or Services after changes are posted constitutes acceptance of the revised terms.`,
  },
  {
    heading: 'Contact Us',
    content: `If you have questions about these Terms of Service, please contact us:

**Meraki-IT**
1919 Boulevard Street, Unit A
Greensboro, NC 27407

**Email:** info@meraki-it.com
**Phone:** (888) 499-9880`,
  },
]

export default function TermsPage() {
  return (
    <SiteShell>
      <LegalPage
        title="Terms of Service"
        eyebrow="Legal"
        lastUpdated={LAST_UPDATED}
        sections={SECTIONS}
      />
    </SiteShell>
  )
}
