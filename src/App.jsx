import { useEffect, useRef, useState } from 'react'
import GpuBackground from './GpuBackground.jsx'
import ResumeChat from './ResumeChat.jsx'

const signalCards = [
  {
    label: 'AI On-Call',
    value: 'Diagnosis Workflows',
    note: 'Runbook-guided triage with Codex in real operational contexts.',
    detail:
      'The strongest through-line in the retargeted resume is AI applied to real SRE work: taking paging noise, runbooks, docs, and live cluster context and turning them into faster, more grounded diagnosis.',
    points: [
      'Used Codex for on-call triage by reviewing runbooks, searching documentation, logging into the paging cluster, and surfacing likely fixes before human action.',
      'Built AI-assisted workflows for operational diagnosis and auto-remediation experiments instead of treating GenAI as slideware.',
      'Kept a human in the loop for verification, execution, and final operational judgment.',
    ],
    evidence: ['Codex-assisted triage', 'Runbooks + docs + live cluster context', 'Human-verified operational use'],
  },
  {
    label: 'Incident Response',
    value: 'PostgreSQL Failures',
    note: 'Autovacuum storms, replication breakage, and Patroni failover pressure.',
    detail:
      'The website now needs to make the minimum SRE requirement visible: real incident response. The independent database platform gives strong proof here because the work involved diagnosis under production pressure, not just greenfield setup.',
    points: [
      'Diagnosed PostgreSQL production issues including autovacuum storms, replication failures, and failover-sensitive Patroni behavior.',
      'Built the surrounding observability needed to narrow failures quickly rather than debugging blind.',
      'Operated revenue-critical systems where downtime and data-loss mistakes had real consequences.',
    ],
    evidence: ['Autovacuum incident work', 'Replication troubleshooting', 'Patroni HA operations'],
  },
  {
    label: 'Independent Stack',
    value: 'Vipor Reliability',
    note: 'Full ownership across routing, databases, telemetry, and paging.',
    detail:
      'Independent infrastructure is one of the clearest differentiators in the updated resume because it shows full-stack ownership without relying on enterprise brand names alone.',
    points: [
      'Built and operate production mining-pool infrastructure across blockchain nodes, stratum services, HAProxy, Nginx, DNS, and Cloudflare.',
      'Run PostgreSQL 18 with Patroni-managed high availability and no-downtime migrations from RDS to EC2 and then to colocation.',
      'Own the complete operational loop: metrics, logs, dashboards, alerting, and incident response.',
    ],
    evidence: ['Vipor mining pool', 'PostgreSQL 18 + Patroni', 'RDS -> EC2 -> colocation'],
    links: [{ label: 'vipor.net', href: 'https://vipor.net' }],
  },
  {
    label: 'Observability',
    value: 'Prometheus + Loki',
    note: 'Metrics, logs, dashboards, alerting, and operational context.',
    detail:
      'Observability should read like a first-class SRE competency, not a side skill. The site now leans on the fact that the stack spans collection, storage, dashboards, and alert routing.',
    points: [
      'Built Grafana dashboards for pool health, stratum behavior, Loki log streams, and PostgreSQL metrics.',
      'Run Vector.dev on every stratum host to centralize logs in Loki.',
      'Monitor hosts and services with Prometheus, then route alerts through Alertmanager to PagerDuty.',
    ],
    evidence: ['Grafana dashboards', 'Vector.dev -> Loki', 'Prometheus -> Alertmanager -> PagerDuty'],
  },
  {
    label: 'Secure Delivery',
    value: 'FedRAMP Toil Reduction',
    note: 'Compressed a 20+ step workflow into a tightly controlled automation.',
    detail:
      'The delivery story still matters, but the framing is now reliability-oriented: reducing error-prone operational toil in a secure environment rather than presenting as pure leadership or platform ownership.',
    points: [
      'Automated a FedRAMP-secure Kubernetes image update path across transfer, pull, update, deploy, GitOps, JIRA, commit, and merge steps.',
      'Reduced a 20+ step MFA-heavy workflow to enabling the automation and confirming the phone prompt.',
      'Applied the same mindset to runbook-driven operational work where consistency matters as much as speed.',
    ],
    evidence: ['FedRAMP K8s image path', '20+ steps removed', 'GitOps + JIRA + MFA workflow'],
  },
  {
    label: 'Algorithms',
    value: 'Cuckoo Cycle BFS/BFJ',
    note: 'Independent graph-traversal design, not just infrastructure assembly.',
    detail:
      'The retargeted resume adds an important missing proof point: sound algorithm and data-structure work. The Cuckoo Cycle project shows independent design thinking beyond operations tooling.',
    points: [
      'Designed and tuned graph-traversal approaches for Cuckoo Cycle mining, including BFS/BFJ-oriented search behavior under real performance constraints.',
      'Improved throughput through benchmark-driven algorithm changes, CPU affinity, NUMA placement, compiler tuning, and low-level profiling.',
      'Used the project to demonstrate hands-on reasoning about data flow, search strategy, and systems performance.',
    ],
    evidence: ['Graph traversal design', 'Ryzen + EPYC optimization', 'Benchmark-driven algorithm work'],
  },
  {
    label: 'LLM Systems',
    value: 'Private Ops Context',
    note: 'Local inference for sensitive engineering and operations workflows.',
    detail:
      'AI on the site should stay grounded in operating reality. The local-model work supports the SRE story because it keeps sensitive infrastructure context private while enabling faster analysis.',
    points: [
      'Run Qwen local inference stacks with llama.cpp, GGUF quantization, speculative decoding, long context, and tuned KV-cache behavior.',
      'Evaluate models against coding and operations workflows rather than generic chatbot tasks.',
      'Use private inference to analyze logs, notes, configs, and incident material without sending operational context to public tools.',
    ],
    evidence: ['Qwen local serving', 'llama.cpp + GGUF', 'Private ops context'],
  },
  {
    label: 'DIP',
    value: 'Retrieval Platform',
    note: 'Operational document ingestion with cited-answer workflows.',
    detail:
      'DIP reinforces the engineering style behind the broader SRE profile: resilient ingestion, hybrid search, careful operationalization, and pragmatic AI integration.',
    points: [
      'Built parallel document conversion, SHA256 deduplication, sentence-aware chunking, and failure-bounded ingestion.',
      'Implemented hybrid retrieval using Qdrant vector search, SQLite FTS5, reciprocal-rank fusion, and optional reranking.',
      'Operate the service with health endpoints, metrics, persistent storage, and timed incremental ingestion.',
    ],
    evidence: ['Qdrant + SQLite FTS5', 'Hybrid retrieval', 'Operational FastAPI service'],
    links: [{ label: 'Architecture', href: '/dip-architecture.html' }],
  },
]

const heroProofPoints = [
  'Hands-on SRE framing instead of a leadership-title-first pitch.',
  'Real on-call and incident-management evidence, not just platform build-out.',
  'Independent production systems that prove ownership across the whole reliability loop.',
]

const strengths = [
  'Build systems that stay understandable and operable after the project handoff energy is gone.',
  'Use observability as a diagnostic toolchain, not a dashboard collection exercise.',
  'Reduce high-friction operational toil without weakening auditability or control.',
  'Apply AI to reliability work where it can accelerate diagnosis, summarization, and runbook execution support.',
]

const skills = {
  'Site Reliability & Observability': [
    'Incident response',
    'On-call operations',
    'Prometheus',
    'Grafana',
    'Loki',
    'Vector.dev',
    'Alertmanager',
    'PagerDuty',
    'Splunk',
    'PostgreSQL monitoring',
  ],
  Languages: ['Python', 'Go', 'JavaScript', 'C', 'C++', 'Rust', 'SQL', 'Bash'],
  'IaC & Cloud': [
    'AWS',
    'OpenStack',
    'Kubernetes',
    'KOPS',
    'Terraform',
    'Ansible',
    'Docker',
    'Helm',
    'Vault',
    'Hardened Linux images',
  ],
  'CI/CD & Delivery': [
    'Drone CI',
    'GitHub Actions',
    'Jenkins',
    'CircleCI',
    'GitOps workflows',
    'Secure build systems',
    'FedRAMP delivery constraints',
  ],
  'AI / Agentic Tooling for Operations': [
    'Codex',
    'Claude',
    'Local LLMs',
    'Qwen',
    'llama.cpp',
    'RAG',
    'MCP',
    'Runbook-guided triage',
    'Private inference workflows',
  ],
}

const featuredProjects = [
  {
    title: 'Vipor Mining Pool / Reliability Platform',
    summary:
      'Operates revenue-critical infrastructure spanning blockchain nodes, routing, PostgreSQL HA, centralized logging, metrics, alerting, and incident response.',
    stack: 'PostgreSQL 18, Patroni, HAProxy, Nginx, Vector.dev, Loki, Prometheus, Grafana, PagerDuty',
  },
  {
    title: 'AI-Assisted SRE Workflows',
    summary:
      'Built practical agentic workflows for on-call diagnosis and secure operations where runbooks, documentation, and live system context all matter.',
    stack: 'Codex, runbooks, operational docs, private context, human verification loops',
  },
  {
    title: 'FedRAMP Delivery Automation',
    summary:
      'Compressed a cumbersome secure Kubernetes image-update workflow into a controlled automation path that preserved auditability while reducing toil.',
    stack: 'Kubernetes, GitOps, JIRA, MFA, secure delivery, operational automation',
  },
  {
    title: 'Cuckoo Cycle Algorithm R&D',
    summary:
      'Independent performance work combining BFS/BFJ graph traversal design, low-level profiling, CPU affinity, NUMA tuning, and benchmark-driven optimization.',
    stack: 'Algorithms, graph traversal, NUMA, CPU affinity, profiling, systems optimization',
  },
]

const experience = [
  {
    period: 'September 2010 - Present',
    role: 'Cisco / Webex - Cloud Engineering Technical Leader',
    detail:
      'Official title aside, the relevant story here is senior IC reliability and platform work: secure delivery, observability, operational automation, and production support under real constraints.',
    bullets: [
      'Built AI-assisted workflows for on-call diagnosis and auto-remediation experiments, combining runbooks, documentation, and operational context to reduce manual troubleshooting effort.',
      'Built automations for a FedRAMP-secure Kubernetes image update workflow, compressing a 20+ step GitOps, JIRA, and MFA-heavy process into a single confirmation step.',
      'Designed and deployed Drone CI/CD and Terraform Enterprise for Webex Logging Metrics, integrated build and deployment secrets with HashiCorp Vault, and kept the architecture stable in production for more than five years.',
      'Owned a production Splunk platform serving approximately 300 Webex users while supporting observability, access management, and production investigation workflows.',
      'Led Ubuntu 20.04-to-24.04 hardening, Duo SSH enablement, secure build evidence, and image migrations across AWS and OpenStack/3AZ environments.',
      'Partnered with a GitHub Actions implementation team that lacked prior CI/CD operations experience, bringing practical production guidance around secrets, images, deployments, and day-two support.',
      'Moved internal workloads to Kubernetes on AWS before EKS existed, automated multi-region clusters with Ansible and KOPS, and designed dedicated platforms with Kube2IAM and Vault isolation.',
      'Closed 70+ tasks, epics, and bugs in the FY26 review cycle across hardening, compliance, feature rollout, and readiness workstreams.',
    ],
  },
  {
    period: 'Independent Infrastructure Work',
    role: 'Vipor Mining Pool / PostgreSQL / Observability',
    detail:
      'Independent work that demonstrates end-to-end SRE ownership: build the system, instrument it, carry the pager, diagnose failures, and keep it alive.',
    bullets: [
      'Built and operate production mining-pool infrastructure across blockchain nodes, stratum services, HAProxy, Nginx, DNS, and Cloudflare.',
      'Operate PostgreSQL 18 with Patroni primary/replica high availability and executed no-downtime migrations from RDS to EC2 and then to colocation using logical replication.',
      'Diagnosed incidents including autovacuum storms, replication failures, and Patroni failover-sensitive database behavior in a revenue-critical environment.',
      'Built the full observability stack with Vector.dev, Loki, Prometheus, Grafana, Alertmanager, and PagerDuty.',
    ],
  },
  {
    period: 'Infrastructure R&D',
    role: 'Cuckoo Cycle Performance Engineering',
    detail:
      'Algorithm and systems work that makes data-structure fluency visible instead of leaving the resume looking purely operational.',
    bullets: [
      'Built the world-fastest CPU miner for the Cuckoo algorithm through benchmark-driven systems optimization.',
      'Designed and tuned BFS/BFJ-style graph-traversal behavior under performance constraints, then improved execution with profiling, compiler tuning, CPU affinity, and NUMA placement.',
    ],
  },
  {
    period: 'Earlier Career',
    role: 'Embedded Linux, DRM, and Platform Bring-Up',
    detail:
      'More than two decades of prior work across kernel drivers, BSP bring-up, conditional access, DOCSIS, and embedded platform architecture still informs how I reason about systems behavior today.',
  },
]

const operatingModel = [
  {
    title: 'Diagnose From Signals',
    detail:
      'Start with logs, metrics, replication state, service behavior, and runbook context before guessing. Reliability work gets faster when the signal chain is intentional.',
  },
  {
    title: 'Automate the Painful Parts',
    detail:
      'Target repetitive secure operations and manual incident triage steps where consistency matters. Automation should remove toil while preserving checkpoints.',
  },
  {
    title: 'Keep AI Grounded',
    detail:
      'Use agentic tooling where it can accelerate real SRE tasks, but keep private context private and keep a human accountable for the final action.',
  },
  {
    title: 'Stay Close to the System',
    detail:
      'The strongest work comes from staying close to implementation details: storage behavior, routing, build pipelines, policy boundaries, and failure modes.',
  },
]

const contactLinks = [
  {
    label: 'Download ATS Resume',
    href: '/Matthew-Snoby-Resume-ATS.pdf',
    className:
      'rounded-lg border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-300/25',
  },
  {
    label: 'View ATS HTML',
    href: '/Matthew-Snoby-Resume-ATS.html',
    className:
      'rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-300/20',
  },
  {
    label: 'matt.snoby@icloud.com',
    href: 'mailto:matt.snoby@icloud.com',
    className:
      'rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-100 transition hover:bg-white/20',
  },
  {
    label: 'github.com/snoby',
    href: 'https://github.com/snoby',
    className:
      'rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-100 transition hover:bg-white/20',
  },
  {
    label: 'linkedin.com/in/mattsnoby',
    href: 'https://linkedin.com/in/mattsnoby',
    className:
      'rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-100 transition hover:bg-white/20',
  },
]

function App() {
  const [pressedCard, setPressedCard] = useState(null)
  const [selectedCard, setSelectedCard] = useState(signalCards[0])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [runnerToneIndex, setRunnerToneIndex] = useState(0)
  const pressTimeoutRef = useRef(null)
  const runnerTones = ['runner-tone-blue', 'runner-tone-green', 'runner-tone-yellow']

  useEffect(() => {
    return () => {
      if (pressTimeoutRef.current) {
        window.clearTimeout(pressTimeoutRef.current)
      }
    }
  }, [])

  const handleCardPress = (label) => {
    if (pressTimeoutRef.current) {
      window.clearTimeout(pressTimeoutRef.current)
    }

    setPressedCard(label)
    setSelectedCard(signalCards.find((item) => item.label === label))
    setRunnerToneIndex((current) => (current + 1) % runnerTones.length)
    pressTimeoutRef.current = window.setTimeout(() => {
      setPressedCard(null)
      pressTimeoutRef.current = null
    }, 180)
  }

  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
      <GpuBackground />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />

      <div className="relative mx-auto max-w-6xl space-y-6">
        <section className="glass-card p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300/90">Senior Site Reliability Engineer</p>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">Matt Snoby</h1>
          <p className="mt-2 text-lg font-semibold text-sky-200 sm:text-xl">
            I build and operate systems that stay calm when production does not.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-100 sm:text-lg">
            Hands-on infrastructure engineer focused on site reliability, observability, incident response, secure delivery, and
            AI-assisted operations. The through-line is practical ownership: understand the failure mode, instrument the system,
            reduce the toil, and keep the result operable.
          </p>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {heroProofPoints.map((item) => (
              <p key={item} className="glass-subcard p-3 text-sm leading-relaxed text-slate-200">
                {item}
              </p>
            ))}
          </div>
          <div className="mt-5 max-w-3xl rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-200/90">Best Fit</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-100 sm:text-base">
              Senior IC SRE and platform roles that value production judgment, strong observability habits, careful automation,
              and grounded use of AI in operations.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#signals"
              className="rounded-lg border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-300/25"
            >
              View Proof
            </a>
            <a
              href="#resume"
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-100 transition hover:bg-white/20"
            >
              Resume & Contact
            </a>
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="ask-ai-hero-button rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider transition"
            >
              Ask AI About Matt
            </button>
          </div>
        </section>

        <section id="signals" className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Signals That Match The Retargeted Resume</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {signalCards.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`glass-card stat-card p-4 text-left ${pressedCard === item.label ? 'is-pressed' : ''} ${
                  selectedCard?.label === item.label ? 'is-selected' : ''
                }`}
                onClick={() => handleCardPress(item.label)}
                aria-expanded={selectedCard?.label === item.label}
                aria-pressed={selectedCard?.label === item.label}
              >
                <p className="font-mono text-[11px] uppercase tracking-wider text-slate-300">{item.label}</p>
                <p className="mt-3 text-lg font-bold leading-tight text-white">{item.value}</p>
                <p className="mt-3 text-xs leading-snug text-slate-300/90">{item.note}</p>
              </button>
            ))}
          </div>
        </section>

        {selectedCard ? (
          <section className={`glass-card selected-detail-panel ${runnerTones[runnerToneIndex]} p-6 sm:p-8`} aria-live="polite">
            <span className="selected-detail-panel__runner selected-detail-panel__runner--one" aria-hidden="true" />
            <span className="selected-detail-panel__runner selected-detail-panel__runner--two" aria-hidden="true" />
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Selected Detail</p>
            <div className="mt-3 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-300">{selectedCard.label}</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{selectedCard.value}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{selectedCard.note}</p>
              </div>
              <div className="glass-subcard min-w-0 p-4">
                <p className="text-sm leading-relaxed text-slate-200">{selectedCard.detail}</p>
                <ul className="mt-4 space-y-2">
                  {selectedCard.points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm leading-relaxed text-slate-300">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/80" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {'links' in selectedCard && selectedCard.links ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedCard.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-cyan-300/30 bg-cyan-300/15 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-300/25"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedCard.evidence.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-cyan-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Core Strengths</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {strengths.map((item) => (
              <p key={item} className="glass-subcard p-3 text-sm text-slate-200">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Skills Matrix</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
            Reorganized to mirror the targeted SRE resume instead of the earlier general-purpose profile.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skills).map(([group, items]) => (
              <article key={group} className="glass-subcard p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{group}</h3>
                <ul className="mt-3 space-y-2">
                  {items.map((skill) => (
                    <li key={skill} className="text-sm text-slate-300">
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Operating Style</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {operatingModel.map((item) => (
              <article key={item.title} className="glass-subcard p-4">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Featured Proof</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <article key={project.title} className="glass-subcard p-4">
                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{project.summary}</p>
                <p className="mt-3 font-mono text-xs text-cyan-200/90">{project.stack}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Experience Narrative</h2>
          <div className="mt-5 space-y-4">
            {experience.map((entry) => (
              <article key={entry.period} className="glass-subcard p-4 sm:p-5">
                <p className="font-mono text-xs uppercase tracking-wider text-cyan-200">{entry.period}</p>
                <h3 className="mt-1 text-base font-semibold text-white">{entry.role}</h3>
                <p className="mt-2 text-sm text-slate-300">{entry.detail}</p>
                {'bullets' in entry && entry.bullets ? (
                  <ul className="mt-3 space-y-2">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet} className="text-sm text-slate-300">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section id="resume" className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Resume & Contact</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
            This site now tracks the retargeted Senior Site Reliability Engineer version of the resume rather than the broader
            technical-leader framing.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className={link.className}
              >
                {link.label}
              </a>
            ))}
            <span className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-200">
              Roswell / Atlanta, GA
            </span>
          </div>
        </section>

        <section className="pb-4 text-center text-xs text-slate-400">
          <p>Senior site reliability engineering profile centered on operations, observability, incident response, and durable automation.</p>
        </section>
      </div>

      <ResumeChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  )
}

export default App
