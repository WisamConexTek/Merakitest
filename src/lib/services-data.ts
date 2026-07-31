/* ═══════════════════════════════════════════════════════════
   SERVICES — one source of truth.

   The nav dropdown, /services, every /services/[slug] page and the
   homepage grid all read this file, so a service can never exist in
   one place and not another.

   `layer` ties each service back to the four layers named in the
   homepage hero (L1 Identity & Access → L4 Security Operations).
   That is the site's main cohesion device: a visitor who watched the
   stack come apart should be able to point at any service and say
   which slab it belongs to.

   ── On the figures in `stats` ──
   These are commitments and descriptions of how the service is run,
   NOT a claimed track record. Nothing here asserts a measured
   outcome that has not been supplied by the business. Anything that
   would need Meraki-IT to verify it before launch carries a
   TODO(confirm) comment rather than a plausible-looking number.
   ═══════════════════════════════════════════════════════════ */

export interface ServiceDetail {
  slug: string
  title: string
  subtitle: string
  badge: string
  iconName: string
  /* Which hero layer this service operates on */
  layer: 'L1' | 'L2' | 'L3' | 'L4'
  summary: string
  heroDescription: string
  stats: { value: string; label: string }[]
  features: {
    title: string
    description: string
    chip: string
  }[]
  benefits: {
    title: string
    description: string
  }[]
  process: {
    step: string
    title: string
    description: string
  }[]
  scenario: {
    problem: string
    solution: string
    result: string
  }
  faqs: {
    question: string
    answer: string
  }[]
}

/* build = we design and stand it up · secure = we defend it · run = we operate it */
export type ServiceCategory = 'build' | 'secure' | 'run'

export const SERVICE_CATEGORY_MAP: Record<string, ServiceCategory> = {
  'it-infrastructure-consolidation': 'build',
  'data-center-transformation': 'build',
  'network-services': 'build',
  'cyber-security': 'secure',
  'managed-security': 'secure',
  'backup-and-disaster-recovery': 'secure',
  'service-integration-management': 'run',
  'helpdesk-support': 'run',
}

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  build: 'Design & Build',
  secure: 'Secure & Defend',
  run: 'Operate & Support',
}

export const SERVICES_DATA: ServiceDetail[] = [
  /* ─────────────────────────────────────────── */
  {
    slug: 'it-infrastructure-consolidation',
    title: 'IT Infrastructure Consolidation',
    subtitle: 'Fewer moving parts, and every one of them accounted for',
    badge: 'Design & Build',
    iconName: 'Layers',
    layer: 'L2',
    summary:
      'Estates grow by accident. We map what you actually own, retire what is only costing you money, and consolidate the rest into something one team can hold in their head.',
    heroDescription:
      'Most environments were never designed — they accumulated. A server bought for one project, a licence renewed because nobody could prove it was unused, three tools doing the same job for three different departments. Meraki-IT starts by inventorying the estate honestly, then consolidates it into a smaller, documented platform that costs less to run and far less to defend.',
    stats: [
      { value: 'Full estate', label: 'Discovery before any change' },
      { value: 'Zero-surprise', label: 'Migrations run in maintenance windows' },
      { value: 'Documented', label: 'You keep the diagrams and the runbooks' },
      { value: '2008', label: 'Consolidating estates since' },
    ],
    features: [
      {
        title: 'Discovery & dependency mapping',
        description:
          'Every host, service, licence and integration found and drawn, including the ones nobody remembered were load-bearing.',
        chip: 'Inventory',
      },
      {
        title: 'Rationalisation plan',
        description:
          'What to keep, what to merge, what to retire — with the cost and the risk of each decision stated in writing before you approve it.',
        chip: 'Plan',
      },
      {
        title: 'Virtualisation & right-sizing',
        description:
          'Physical hosts collapsed onto a properly sized virtual platform, so you stop paying to cool machines running at four percent.',
        chip: 'Consolidate',
      },
      {
        title: 'Licence and contract review',
        description:
          'Overlapping tooling and forgotten renewals surfaced as line items you can actually cancel.',
        chip: 'Cost',
      },
    ],
    benefits: [
      {
        title: 'A smaller attack surface',
        description:
          'Every retired host is one fewer thing to patch, monitor and explain to an auditor. Consolidation is a security project wearing a cost-saving hat.',
      },
      {
        title: 'Costs you can predict',
        description:
          'Hardware, power, licensing and support collapse into a smaller, forecastable number instead of a series of surprises.',
      },
      {
        title: 'An estate a new hire can learn',
        description:
          'Documented, consistent infrastructure means you are no longer one resignation away from losing the only person who understands it.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'Automated and manual discovery across the estate, ending in a dependency map you can read.',
      },
      {
        step: '02',
        title: 'Rationalise',
        description:
          'Every asset gets a decision — keep, merge, retire — with cost and risk attached to each.',
      },
      {
        step: '03',
        title: 'Migrate',
        description:
          'Staged moves in agreed windows, each with a tested rollback before it starts.',
      },
      {
        step: '04',
        title: 'Hand over',
        description:
          'Diagrams, runbooks and licence positions handed to you, not held hostage.',
      },
    ],
    scenario: {
      problem:
        'A firm was running eleven physical servers across two closets, four of which nobody could confidently identify. Renewals were being paid on tools that had been replaced years earlier.',
      solution:
        'Full discovery and dependency mapping, followed by a staged consolidation onto a virtual platform sized to the real workload, with three genuinely dead services decommissioned.',
      result:
        'A documented environment on far less hardware, a shorter patching list, and a licence review that paid for a meaningful share of the project.',
    },
    faqs: [
      {
        question: 'Will this take our systems offline?',
        answer:
          'Migrations run in windows you agree in advance, and every stage has a tested rollback before it begins. Where a service genuinely cannot take downtime, we build alongside it and cut over rather than migrating in place.',
      },
      {
        question: 'What if you find something you cannot identify?',
        answer:
          'That is normal, and it goes on the report rather than quietly into a decommission list. Nothing is switched off until we can tell you what it does and who depends on it.',
      },
      {
        question: 'Do we have to use you to run it afterwards?',
        answer:
          'No. You keep the documentation, the diagrams and the runbooks whether or not you retain us. Consolidation that leaves you dependent on the consultant is not consolidation.',
      },
    ],
  },

  /* ─────────────────────────────────────────── */
  {
    slug: 'data-center-transformation',
    title: 'Data Center Transformation',
    subtitle: 'Move it, modernise it, or rebuild it — deliberately',
    badge: 'Design & Build',
    iconName: 'Server',
    layer: 'L2',
    summary:
      'Ageing data centres get replaced one emergency at a time. We plan the whole transition — on-premises, cloud or hybrid — and execute it in stages you can stop.',
    heroDescription:
      'A data centre reaches a point where every month of delay costs more than the move would. Meraki-IT plans that transition properly: what moves to cloud, what stays on the floor, what gets rebuilt rather than lifted, and in what order — so the migration is a sequence of reversible steps instead of one weekend everybody dreads.',
    stats: [
      { value: 'Hybrid', label: 'On-prem, cloud, or both' },
      { value: 'Staged', label: 'Every step independently reversible' },
      { value: 'Tested', label: 'Rollback proven before cutover' },
      { value: 'Wave-based', label: 'Migration in dependency order' },
    ],
    features: [
      {
        title: 'Workload placement analysis',
        description:
          'Each workload assessed on cost, latency, data residency and licensing — so cloud is a decision, not a default.',
        chip: 'Assess',
      },
      {
        title: 'Migration wave planning',
        description:
          'Applications grouped by their real dependencies, so nothing moves before the thing it talks to.',
        chip: 'Sequence',
      },
      {
        title: 'Virtualisation & storage modernisation',
        description:
          'Hypervisor, storage tiering and backup targets rebuilt to a current standard rather than carried forward.',
        chip: 'Modernise',
      },
      {
        title: 'Cutover & rollback rehearsal',
        description:
          'Every cutover is rehearsed against the rollback path before the real one is scheduled.',
        chip: 'Rehearse',
      },
    ],
    benefits: [
      {
        title: 'A move you can stop halfway',
        description:
          'Waves are independent. If wave three uncovers something ugly, waves one and two are still delivered and stable.',
      },
      {
        title: 'Spend that matches the workload',
        description:
          'Placing workloads on the right platform for their actual profile stops you paying cloud rates for something that never scales.',
      },
      {
        title: 'A platform built to be defended',
        description:
          'Segmentation, identity and backup are designed in during the rebuild, which is the only time they are cheap to add.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Assess',
        description:
          'Current state, workload profiles, dependencies, licensing and the real constraints — including the political ones.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'Target architecture and placement decisions, each with the reasoning written down so it survives staff changes.',
      },
      {
        step: '03',
        title: 'Migrate in waves',
        description:
          'Dependency-ordered waves, rehearsed, executed in agreed windows, verified before the next begins.',
      },
      {
        step: '04',
        title: 'Optimise',
        description:
          'Post-move right-sizing and cost review once real usage data exists, rather than guessing up front.',
      },
    ],
    scenario: {
      problem:
        'Hardware was out of support, the lease on the room was ending, and the only migration plan was "move everything one weekend in March".',
      solution:
        'Workload placement analysis split the estate: latency-bound systems rebuilt on new on-premises hardware, the rest moved to cloud across four dependency-ordered waves, each rehearsed.',
      result:
        'The deadline was met without a single all-hands weekend, and two applications were retired during assessment when nobody could name a user.',
    },
    faqs: [
      {
        question: 'Cloud, on-premises, or hybrid?',
        answer:
          'Whichever the workloads argue for. We assess each on cost, latency, data residency and licensing and show you the working. A vendor who answers this question before looking at your estate is selling, not advising.',
      },
      {
        question: 'How long does a transformation take?',
        answer:
          'It depends entirely on the size of the estate and how many dependencies are undocumented. The assessment gives you a wave plan with dates before you commit to the delivery phase.',
      },
      {
        question: 'What happens to our existing hardware?',
        answer:
          'Anything with useful life left is redeployed or kept as a rollback target until the wave it supports is signed off. Decommissioning includes certified data destruction.',
      },
    ],
  },

  /* ─────────────────────────────────────────── */
  {
    slug: 'network-services',
    title: 'Network Services',
    subtitle: 'The layer everything else blames when it breaks',
    badge: 'Design & Build',
    iconName: 'Network',
    layer: 'L3',
    summary:
      'Design, build and management of the network — LAN, WAN, wireless, segmentation and edge — built so that a fault is diagnosable rather than mysterious.',
    heroDescription:
      'When something is slow, the network gets blamed first and proven innocent last. Meraki-IT designs networks that answer questions: segmented so a compromise cannot walk sideways, monitored so a degradation is visible before a user reports it, and documented so the next engineer does not start from scratch.',
    stats: [
      { value: 'Segmented', label: 'By default, not on request' },
      { value: 'Monitored', label: 'Continuous path and device health' },
      { value: 'Zero Trust', label: 'Access by identity, not by location' },
      { value: 'Documented', label: 'Topology you can hand to an auditor' },
    ],
    features: [
      {
        title: 'LAN, WAN & wireless design',
        description:
          'Campus, branch and remote connectivity designed around how the business actually moves, including the sites everyone forgets.',
        chip: 'Design',
      },
      {
        title: 'Segmentation & micro-segmentation',
        description:
          'Networks divided so that a foothold in one zone does not become a tour of the estate.',
        chip: 'Contain',
      },
      {
        title: 'Edge protection & Zero Trust access',
        description:
          'Public-facing services behind a managed edge, and remote access granted per identity and device rather than per VPN tunnel.',
        chip: 'Edge',
      },
      {
        title: 'Performance monitoring',
        description:
          'Path, latency and device health tracked continuously, so "the network is slow" becomes a graph instead of an argument.',
        chip: 'Observe',
      },
    ],
    benefits: [
      {
        title: 'Faults that can be located',
        description:
          'A documented, monitored network turns an outage from a hunt into a lookup. Most of the cost of downtime is time spent finding the cause.',
      },
      {
        title: 'Blast radius, contained',
        description:
          'Segmentation is the single highest-leverage control against ransomware spread, and it is far cheaper to design in than to retrofit.',
      },
      {
        title: 'Remote access without the VPN sprawl',
        description:
          'Identity-based access replaces a growing pile of tunnels and shared credentials nobody has audited since they were created.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Survey',
        description:
          'Topology, traffic patterns, device inventory and wireless coverage measured rather than assumed.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'Target topology with segmentation and access model, sized for growth you can actually name.',
      },
      {
        step: '03',
        title: 'Implement',
        description: 'Staged rollout, site by site, with each site verified before the next starts.',
      },
      {
        step: '04',
        title: 'Monitor',
        description:
          'Handover into continuous monitoring, with alerting thresholds tuned to your traffic rather than to a default.',
      },
    ],
    scenario: {
      problem:
        'A flat network meant every device could reach every other device, remote access was a shared VPN credential, and wireless coverage had been extended by adding access points until it stopped being complained about.',
      solution:
        'A surveyed redesign: segmentation by function, identity-based remote access replacing the shared tunnel, and a properly planned wireless layout with monitoring.',
      result:
        'Lateral movement contained by design, remote access attributable to individuals, and wireless problems that now show up on a dashboard before they show up in a ticket.',
    },
    faqs: [
      {
        question: 'Do we have to replace all our hardware?',
        answer:
          'Rarely. The survey establishes what is still fit for purpose. Replacement is recommended where a device is out of support or genuinely cannot do the job — and we will tell you which of those two it is.',
      },
      {
        question: 'Can you work with our existing vendor equipment?',
        answer:
          'Yes. We design around what you own where it makes sense, and say so plainly when carrying something forward would cost more than replacing it.',
      },
      {
        question: 'Is segmentation disruptive to roll out?',
        answer:
          'It is done in stages, monitored in a permissive mode first so that legitimate traffic is discovered rather than blocked. The disruptive version is the one done in a hurry after an incident.',
      },
    ],
  },

  /* ─────────────────────────────────────────── */
  {
    slug: 'cyber-security',
    title: 'Cyber Security',
    subtitle: 'Find out where you actually stand, then fix it in priority order',
    badge: 'Secure & Defend',
    iconName: 'ShieldCheck',
    layer: 'L1',
    summary:
      'Assessment, hardening and security architecture — the project work that closes the gaps, as distinct from the ongoing monitoring that catches what gets through.',
    heroDescription:
      'Security work splits cleanly into two halves: closing the gaps, and watching for what comes through anyway. This is the first half. Meraki-IT assesses the environment against a real framework, ranks what we find by exploitability rather than by scanner severity, and works through the list with you — starting with the things an attacker would reach for first.',
    stats: [
      { value: 'Prioritised', label: 'By exploitability, not scanner score' },
      { value: 'Identity-first', label: 'Where most incidents actually begin' },
      { value: 'Evidence', label: 'Findings you can hand to an auditor' },
      { value: 'Re-tested', label: 'Fixes verified, not assumed' },
    ],
    features: [
      {
        title: 'Security posture assessment',
        description:
          'Configuration, identity, exposure and process reviewed against a recognised framework, with findings ranked by real-world reachability.',
        chip: 'Assess',
      },
      {
        title: 'Identity & access hardening',
        description:
          'Privileged accounts, MFA coverage, stale accounts and standing permissions — the ground most incidents are actually won or lost on.',
        chip: 'Identity',
      },
      {
        title: 'External attack surface review',
        description:
          'What of yours is reachable from the internet, including the assets that were stood up for a project and never taken down.',
        chip: 'Exposure',
      },
      {
        title: 'Compliance readiness support',
        description:
          'Evidence, control mapping and remediation planning for the framework your customers or insurers are asking about.',
        chip: 'Compliance',
      },
    ],
    benefits: [
      {
        title: 'A list in the right order',
        description:
          'A raw scanner report is a thousand findings and no plan. Prioritising by what is actually reachable turns it into a quarter of work you can schedule.',
      },
      {
        title: 'Fewer ways in',
        description:
          'Most breaches use a path that was known and open. Closing the reachable ones removes the cheap options before anyone has to detect anything.',
      },
      {
        title: 'Answers ready when someone asks',
        description:
          'Insurers, enterprise customers and auditors increasingly want evidence. Producing it as a by-product of the work beats assembling it under deadline.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Assess',
        description:
          'Configuration, identity, exposure and process reviewed; findings ranked by exploitability.',
      },
      {
        step: '02',
        title: 'Prioritise',
        description:
          'A remediation plan sequenced by risk reduction per unit of effort, agreed with you rather than handed down.',
      },
      {
        step: '03',
        title: 'Remediate',
        description:
          'We do the work, or support your team doing it — whichever suits how you are staffed.',
      },
      {
        step: '04',
        title: 'Verify',
        description: 'Fixes re-tested and evidenced. A closed finding is one that has been proven closed.',
      },
    ],
    scenario: {
      problem:
        'An enterprise customer sent a security questionnaire with a deadline, and nobody internally could answer half of it with confidence.',
      solution:
        'A posture assessment mapped to the framework in question, findings prioritised by exploitability, and a remediation plan with the identity gaps taken first.',
      result:
        'The questionnaire was answered with evidence rather than optimism, and the highest-risk findings — standing admin rights and incomplete MFA — were closed inside the first phase.',
    },
    faqs: [
      {
        question: 'Is this a penetration test?',
        answer:
          'No. An assessment reviews configuration, identity and exposure to find what is wrong; a penetration test proves a specific path can be walked. They answer different questions, and an assessment is usually the better first spend.',
      },
      {
        question: 'What framework do you assess against?',
        answer:
          'Whichever one your obligations point at — typically the CIS Controls as a baseline, mapped across to whatever your customers, regulator or insurer are asking for.',
      },
      {
        question: 'What if we cannot fix everything you find?',
        answer:
          'Nobody fixes everything. The plan is ordered so that stopping after the first phase still removes the majority of the practical risk, and the remainder is documented as an accepted position rather than an unknown one.',
      },
    ],
  },

  /* ─────────────────────────────────────────── */
  {
    slug: 'managed-security',
    title: 'Managed Security (MSSP)',
    subtitle: 'Someone watching at three in the morning',
    badge: 'Secure & Defend',
    iconName: 'Radar',
    layer: 'L4',
    summary:
      'Meraki-IT operates security for our clients as a managed service — continuous monitoring, triage and response on three platforms we run day to day rather than resell.',
    heroDescription:
      'Detection tooling without anybody watching it is an expensive way to generate an audit trail of an incident you missed. Meraki-IT is the managed security service provider for AttackMetricX, Cloudflare and Acronis — we license, tune, monitor and respond on all three, so you get one contract, one escalation path, and engineers who already know your environment because they built it.',
    stats: [
      { value: '24/7/365', label: 'Monitoring coverage' },
      { value: '3', label: 'Platforms operated, not resold' },
      { value: 'Single', label: 'Escalation path across all layers' },
      /* TODO(confirm): replace with Meraki-IT's contracted P1 response target
         once the business confirms the number it wants to commit to. */
      { value: 'Defined', label: 'Response targets set per contract' },
    ],
    features: [
      {
        title: 'Continuous monitoring & triage',
        description:
          'Alerts across edge, endpoint and backup reviewed by people, so what reaches you is an incident rather than a notification.',
        chip: 'Watch',
      },
      {
        title: 'Attack surface management',
        description:
          'Your internet-facing estate discovered and tracked continuously through AttackMetricX — including the assets you did not know were exposed.',
        chip: 'AttackMetricX',
      },
      {
        title: 'Edge, WAF & Zero Trust operations',
        description:
          'Cloudflare policy, rules and access managed as a live configuration that gets tuned, not a wizard that was run once.',
        chip: 'Cloudflare',
      },
      {
        title: 'Backup integrity & recovery response',
        description:
          'Acronis protection monitored for backup health and restore-readiness, because an untested backup is a hope, not a control.',
        chip: 'Acronis',
      },
    ],
    benefits: [
      {
        title: 'One number, whatever broke',
        description:
          'Edge, endpoint, backup and infrastructure under one provider means no triage meeting spent deciding whose problem it is.',
      },
      {
        title: 'Responders who know the environment',
        description:
          'The team monitoring your estate is usually the team that designed it. That context is the difference between a fast containment and a long call.',
      },
      {
        title: 'Enterprise tooling without enterprise headcount',
        description:
          'Three platforms, licensed and operated as a service, for organisations that could never justify staffing a round-the-clock security team of their own.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Onboard',
        description:
          'Estate documented, platforms deployed and tuned to your traffic, escalation contacts and thresholds agreed.',
      },
      {
        step: '02',
        title: 'Baseline',
        description:
          'A quiet period to learn what normal looks like for you, so the alerting is not fighting your own business.',
      },
      {
        step: '03',
        title: 'Operate',
        description: 'Continuous monitoring and triage, with tuning as your environment changes.',
      },
      {
        step: '04',
        title: 'Respond & report',
        description:
          'Containment per the agreed playbook, followed by a written account of what happened and what changed as a result.',
      },
    ],
    scenario: {
      problem:
        'A business had bought security tooling but nobody was watching the consoles outside office hours, and three separate vendors each pointed at the others when something looked wrong.',
      solution:
        'Meraki-IT took over as MSSP across all three platforms — attack surface, edge and backup — with one escalation path and alert thresholds tuned to the actual traffic.',
      result:
        'Alert volume dropped to something a human could act on, out-of-hours coverage became real rather than nominal, and vendor finger-pointing stopped being a stage of incident response.',
    },
    faqs: [
      {
        question: 'What exactly does "MSSP" mean here?',
        answer:
          'We hold and operate the platform relationships on your behalf: licensing, deployment, tuning, monitoring and response. You contract with us, not with three vendors, and we are accountable for the outcome rather than for passing on a licence.',
      },
      {
        question: 'Do we have to use all three platforms?',
        answer:
          'No. They cover different layers and are commonly taken together, but each can be run on its own. What we will not do is monitor a layer we have no visibility into and imply otherwise.',
      },
      {
        question: 'What happens when you find something at 3am?',
        answer:
          'We work the agreed playbook — containment actions we are pre-authorised to take happen immediately, and your named escalation contacts are called for anything requiring a business decision. Both are set during onboarding, not invented during the incident.',
      },
      {
        question: 'Do we need to already be a Meraki-IT infrastructure client?',
        answer:
          'No, though it helps. Where we did not build the environment, onboarding includes the discovery work needed to monitor it honestly.',
      },
    ],
  },

  /* ─────────────────────────────────────────── */
  {
    slug: 'backup-and-disaster-recovery',
    title: 'Backup & Disaster Recovery',
    subtitle: 'The control that decides how bad the worst day gets',
    badge: 'Secure & Defend',
    iconName: 'HardDrive',
    layer: 'L2',
    summary:
      'Protected, monitored, regularly tested backup with a recovery plan that has actually been rehearsed — because the first real test should not be the real one.',
    heroDescription:
      'Every organisation has backups. Far fewer have restores. Meraki-IT builds protection around recovery objectives you have agreed rather than defaults nobody chose, monitors backup health continuously, and rehearses the restore on a schedule — so that on the bad day the question is how long, not whether.',
    stats: [
      { value: 'RPO / RTO', label: 'Agreed per system, not assumed' },
      { value: 'Immutable', label: 'Copies ransomware cannot rewrite' },
      { value: 'Tested', label: 'Restores rehearsed on a schedule' },
      { value: 'Monitored', label: 'Backup health watched daily' },
    ],
    features: [
      {
        title: 'Recovery objectives per system',
        description:
          'How much data each system can afford to lose, and how long it can afford to be down, decided by the business and written down.',
        chip: 'RPO / RTO',
      },
      {
        title: 'Immutable & off-site copies',
        description:
          'Retention that ransomware cannot delete or encrypt, held separately from the environment it protects.',
        chip: 'Immutable',
      },
      {
        title: 'Continuous backup health monitoring',
        description:
          'Failed and silently-partial jobs surfaced daily, because the common failure is not a missing backup but an unnoticed broken one.',
        chip: 'Monitor',
      },
      {
        title: 'Rehearsed recovery runbooks',
        description:
          'A written order of restoration, tested, so recovery is executed rather than improvised under pressure.',
        chip: 'Rehearse',
      },
    ],
    benefits: [
      {
        title: 'Ransomware stops being existential',
        description:
          'An immutable, off-site, tested copy converts the worst category of incident into a scheduled, unpleasant restore.',
      },
      {
        title: 'A recovery time you can quote',
        description:
          'Rehearsed restores produce a real number. Insurers, boards and enterprise customers increasingly ask for it.',
      },
      {
        title: 'No silent failures',
        description:
          'Backups that stopped working months ago are discovered by monitoring, not by needing them.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Classify',
        description:
          'Systems ranked by what the business actually needs back first, which is rarely the order IT would guess.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'Protection, retention and immutability designed to hit the agreed objectives at a defensible cost.',
      },
      {
        step: '03',
        title: 'Deploy & monitor',
        description: 'Protection rolled out, with daily health monitoring from day one.',
      },
      {
        step: '04',
        title: 'Rehearse',
        description:
          'Scheduled restore tests against the runbook, with the measured recovery time reported back to you.',
      },
    ],
    scenario: {
      problem:
        'Backups were running nightly and reporting success. A routine restore request revealed that one critical database had been backing up an empty mount point for several months.',
      solution:
        'Protection rebuilt around agreed recovery objectives, with immutable off-site retention, daily health monitoring, and quarterly restore rehearsals against a written runbook.',
      result:
        'Silent failures now surface within a day, and the business has a measured recovery time it can state to its insurer instead of an assumption.',
    },
    faqs: [
      {
        question: 'How often should restores be tested?',
        answer:
          'Quarterly is a reasonable baseline for most systems, more often for anything with a short recovery objective. The point is that the schedule exists and is kept, not the specific interval.',
      },
      {
        question: 'What does "immutable" actually mean?',
        answer:
          'Backup copies that cannot be altered or deleted for a set retention period, by anyone, including an administrator account. It is the specific control that stops ransomware from encrypting your recovery path along with your production data.',
      },
      {
        question: 'Is cloud backup enough on its own?',
        answer:
          'Usually not. A single copy in one place is a single point of failure regardless of whose place it is. The design normally keeps a fast local copy for routine restores and an immutable off-site copy for the bad day.',
      },
    ],
  },

  /* ─────────────────────────────────────────── */
  {
    slug: 'service-integration-management',
    title: 'Service Integration & Management',
    subtitle: 'One accountable party across all your suppliers',
    badge: 'Operate & Support',
    iconName: 'Workflow',
    layer: 'L4',
    summary:
      'When four vendors each own a piece of the service, nobody owns the outcome. SIAM puts one team in charge of the joins, the escalations and the reporting.',
    heroDescription:
      'Multi-vendor estates fail at the seams. Each supplier meets its own contract while the service the business actually uses degrades in the gaps between them. Meraki-IT acts as the integration layer: one incident process across suppliers, one set of reporting the business can read, and one party who cannot answer "that is the other vendor" — because holding that boundary is the job.',
    stats: [
      { value: 'Single', label: 'Point of accountability' },
      { value: 'End-to-end', label: 'Service view across all suppliers' },
      { value: 'One process', label: 'Incident and change, not four' },
      { value: 'Reported', label: 'In business terms, not vendor SLAs' },
    ],
    features: [
      {
        title: 'Vendor coordination & escalation',
        description:
          'We hold the escalations across suppliers, including the ones that require somebody to keep pushing.',
        chip: 'Coordinate',
      },
      {
        title: 'Unified incident & change process',
        description:
          'One way to raise, track and close work, regardless of which supplier ends up doing it.',
        chip: 'Process',
      },
      {
        title: 'End-to-end service monitoring',
        description:
          'The service watched as the user experiences it, not as four separate green dashboards that are each individually correct.',
        chip: 'Observe',
      },
      {
        title: 'Service reporting & review',
        description:
          'Regular reporting in business language, with the supplier performance conversation held by us on your behalf.',
        chip: 'Report',
      },
    ],
    benefits: [
      {
        title: 'The finger-pointing stops',
        description:
          'One accountable party removes the most expensive part of a multi-vendor outage, which is the hour spent establishing whose outage it is.',
      },
      {
        title: 'Your team stops being the integration layer',
        description:
          'Internal IT goes back to work that matters instead of relaying tickets between suppliers.',
      },
      {
        title: 'Suppliers held to the actual outcome',
        description:
          'Individually met SLAs that add up to a poor service is a well-known failure mode. Someone measuring end-to-end is how it gets caught.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Map the supply chain',
        description:
          'Every supplier, contract, boundary and escalation path documented — including the informal ones.',
      },
      {
        step: '02',
        title: 'Define the model',
        description:
          'One incident, request and change process across suppliers, with the boundaries agreed in writing.',
      },
      {
        step: '03',
        title: 'Operate',
        description: 'We run the process, hold escalations, and chase what needs chasing.',
      },
      {
        step: '04',
        title: 'Review',
        description:
          'Regular service review with supplier performance and trend analysis, and recommendations you can act on.',
      },
    ],
    scenario: {
      problem:
        'Connectivity, hosting, an application vendor and an internal team each owned part of one business service. Every incident began with a call to establish ownership, and every supplier reported green.',
      solution:
        'A SIAM engagement: supply chain mapped, one incident process defined across all four, and end-to-end monitoring of the service as users experience it.',
      result:
        'Incidents route to the right supplier immediately, and the monthly review discusses the service the business uses rather than four separate contracts.',
    },
    faqs: [
      {
        question: 'Do we have to change suppliers?',
        answer:
          'No. SIAM works with the suppliers you have. Where the review shows a supplier is consistently the constraint, you get the evidence to make that decision — but it is your decision.',
      },
      {
        question: 'How is this different from just outsourcing IT?',
        answer:
          'Outsourcing replaces your suppliers with one supplier. SIAM leaves your suppliers in place and adds an accountable integration layer above them, which is usually cheaper and far less disruptive.',
      },
      {
        question: 'Can you manage suppliers you have no relationship with?',
        answer:
          'Yes — that is the normal case. It requires you to formally designate us as the coordinating party with each supplier, which is part of the setup.',
      },
    ],
  },

  /* ─────────────────────────────────────────── */
  {
    slug: 'helpdesk-support',
    title: 'Helpdesk Support',
    subtitle: 'The part of IT your staff actually experience',
    badge: 'Operate & Support',
    iconName: 'LifeBuoy',
    layer: 'L4',
    summary:
      'Responsive first- and second-line support for the people using the systems — with the underlying causes fed back into the infrastructure rather than logged and forgotten.',
    heroDescription:
      'For most of your staff, the helpdesk is IT. Meraki-IT provides first- and second-line support with engineers who can see the whole environment, so a recurring problem gets traced to the platform that causes it instead of being resolved identically forty times. Support and infrastructure being the same team is the entire point.',
    stats: [
      { value: 'Tier 1 & 2', label: 'Escalating into our engineers' },
      { value: 'Root cause', label: 'Recurring issues traced, not repeated' },
      { value: 'Multi-channel', label: 'Phone, email and portal' },
      /* TODO(confirm): agreed helpdesk hours — the site currently advertises
         24/7 technical support; confirm whether that applies to the helpdesk
         or only to managed security monitoring. */
      { value: '24/7', label: 'Technical support availability' },
    ],
    features: [
      {
        title: 'First & second line support',
        description:
          'Day-to-day issues handled quickly, with escalation into the engineers who designed the platform rather than into a queue.',
        chip: 'Support',
      },
      {
        title: 'Endpoint & user lifecycle',
        description:
          'Joiners, movers and leavers handled properly — including the leaver access removal that is usually the weakest link.',
        chip: 'Lifecycle',
      },
      {
        title: 'Patch & update management',
        description:
          'Endpoints and servers kept current on a managed schedule, with exceptions tracked rather than tolerated.',
        chip: 'Patching',
      },
      {
        title: 'Problem management',
        description:
          'Recurring tickets analysed for a common cause and fixed at the platform, which is the only thing that reduces volume.',
        chip: 'Root cause',
      },
    ],
    benefits: [
      {
        title: 'Ticket volume that falls',
        description:
          'Feeding recurring issues back into infrastructure changes is the difference between a helpdesk that scales and one that just grows.',
      },
      {
        title: 'Leaver access that actually gets removed',
        description:
          'Lifecycle handled as process rather than as somebody remembering is a support benefit and a security control at the same time.',
      },
      {
        title: 'Escalation that goes somewhere',
        description:
          'Second line is the team that built the environment, so a hard ticket meets someone with context instead of another script.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Onboard',
        description:
          'Environment documented, contacts and priorities agreed, channels and asset inventory set up.',
      },
      {
        step: '02',
        title: 'Support',
        description: 'Day-to-day tickets handled across phone, email and portal.',
      },
      {
        step: '03',
        title: 'Analyse',
        description: 'Ticket trends reviewed for recurring causes worth fixing at the source.',
      },
      {
        step: '04',
        title: 'Improve',
        description:
          'Platform changes proposed and made, with the effect on ticket volume reported back.',
      },
    ],
    scenario: {
      problem:
        'The same authentication issue was being resolved several times a week by walking each user through the same workaround, and had been for months.',
      solution:
        'Problem management traced the recurring ticket to a misconfigured trust relationship, which was fixed at the platform rather than at the desk.',
      result:
        'That ticket category disappeared, and the pattern review became a standing part of the monthly service report.',
    },
    faqs: [
      {
        question: 'Do you replace our internal IT team?',
        answer:
          'Usually we work alongside them — taking first line so the internal team can do project work, or taking second line where they have the user relationship but not the depth. Either arrangement is common.',
      },
      {
        question: 'How do users contact you?',
        answer:
          'Phone, email or the portal, whichever suits the person and the urgency. Everything lands in the same queue regardless of channel.',
      },
      {
        question: 'What are your support hours?',
        answer:
          'Coverage is agreed per contract. Managed security monitoring runs continuously; helpdesk hours are set to match how your business actually operates.',
      },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICES_DATA.find((service) => service.slug === slug)
}

export function getServicesByCategory(category: ServiceCategory | 'all'): ServiceDetail[] {
  if (category === 'all') return SERVICES_DATA
  return SERVICES_DATA.filter((s) => SERVICE_CATEGORY_MAP[s.slug] === category)
}
