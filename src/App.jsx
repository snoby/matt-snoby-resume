import { useEffect, useRef, useState } from 'react'
import GpuBackground from './GpuBackground.jsx'
import ResumeChat from './ResumeChat.jsx'

const signalCards = [
  {
    label: 'AI On-Call',
    value: 'Diagnosis Workflows',
    note: 'Runbook-guided triage with Codex in real operational contexts.',
    detail:
      'This is AI applied to real SRE work: using runbooks, documentation, and live cluster context to make on-call diagnosis faster and better grounded.',
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
      'This work includes real incident response under production pressure, not just greenfield infrastructure build-out.',
    points: [
      'Diagnosed PostgreSQL production issues including autovacuum storms, replication failures, and failover-sensitive Patroni behavior.',
      'Built the surrounding observability needed to narrow failures quickly rather than debugging blind.',
      'Operated revenue-critical systems where downtime and data-loss mistakes had real consequences.',
    ],
    evidence: ['Autovacuum incident work', 'Replication troubleshooting', 'Patroni HA operations'],
  },
  {
    label: 'Platform Reliability',
    value: 'Drone + TFE',
    note: 'Production CI/CD and delivery systems that stayed stable for years.',
    detail:
      'Built and operated durable delivery infrastructure for Webex Logging Metrics, combining CI/CD, infrastructure automation, secrets integration, and day-two reliability.',
    points: [
      'Designed, implemented, and deployed the Drone CI/CD build system and Terraform Enterprise service for mission-critical builds and deploys.',
      'Integrated build and deploy workflows with HashiCorp Vault so secrets stayed secured.',
      'Kept the same architecture in production use for more than five years without major redesign.',
    ],
    evidence: ['Drone CI/CD', 'Terraform Enterprise', 'Vault-backed delivery'],
  },
  {
    label: 'Observability',
    value: 'Logging + Metrics',
    note: 'Cisco/Webex production observability across Splunk, Grafana, logs, and platform signals.',
    detail:
      'Owned and improved production observability across logging and metrics systems used by Webex teams for investigation, visibility, and day-two operations.',
    points: [
      'Owned a production Splunk platform serving approximately 300 Webex users for operational search and investigation.',
      'Built and supported logging, metrics, and dashboard workflows used to diagnose production behavior and platform issues.',
      'Worked across Grafana, Loki, Prometheus, and related platform signals in both enterprise and independent environments.',
    ],
    evidence: ['Production Splunk', 'Grafana dashboards', 'Logging + metrics operations'],
  },
  {
    label: 'Secure Delivery',
    value: 'FedRAMP Toil Reduction',
    note: 'Compressed a 20+ step workflow into a tightly controlled automation.',
    detail:
      'This work focused on reducing error-prone operational toil in a secure environment without weakening control or auditability.',
    points: [
      'Automated a FedRAMP-secure Kubernetes image update path across transfer, pull, update, deploy, GitOps, JIRA, commit, and merge steps.',
      'Reduced a 20+ step MFA-heavy workflow to enabling the automation and confirming the phone prompt.',
      'Applied the same mindset to runbook-driven operational work where consistency matters as much as speed.',
    ],
    evidence: ['FedRAMP K8s image path', '20+ steps removed', 'GitOps + JIRA + MFA workflow'],
  },
  {
    label: 'Secure Platforms',
    value: 'Vault + Hardening',
    note: 'Secrets, hardened images, and regulated-environment operational discipline.',
    detail:
      'Built secure platform foundations around secrets management, hardened images, and operational controls needed for reliable delivery in sensitive environments.',
    points: [
      'Designed Vault hierarchies, roles, and policies for CI, development, staging, and production workflows.',
      'Led Ubuntu 20.04-to-24.04 hardening, Duo SSH enablement, and hardened-image migrations across AWS and OpenStack/3AZ environments.',
      'Kept secure delivery and platform changes operable under real compliance and production constraints.',
    ],
    evidence: ['Vault roles and policies', 'Ubuntu hardening', 'AWS and OpenStack/3AZ'],
  },
  {
    label: 'LLM Systems',
    value: 'Private Ops Context',
    note: 'Local inference for sensitive engineering and operations workflows.',
    detail:
      'The local-model work keeps sensitive infrastructure context private while still enabling faster analysis and operational support.',
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
  '22 years at Cisco spanning embedded systems, platform engineering, observability, and secure delivery.',
  'Hands-on site reliability and platform engineering experience.',
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
    title: 'Cisco / Webex Observability and Logging',
    summary:
      'Owned and improved production logging, metrics, dashboards, and investigation workflows used by Webex teams to understand platform health and diagnose production issues.',
    stack: 'Splunk, Grafana, Loki, Prometheus, logging pipelines, metrics workflows, production operations',
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
    title: 'Vipor Mining Pool / Reliability Platform',
    summary:
      'Operates revenue-critical infrastructure spanning blockchain nodes, routing, PostgreSQL HA, centralized logging, metrics, alerting, and incident response.',
    stack: 'PostgreSQL 18, Patroni, HAProxy, Nginx, Vector.dev, Loki, Prometheus, Grafana, PagerDuty',
  },
]

const experience = [
  {
    period: 'September 2010 - Present',
    role: 'Cisco / Webex - Cloud Engineering Technical Leader',
    detail:
      '22 years at Cisco / Webex across embedded systems, cloud platforms, observability, secure delivery, and senior hands-on reliability work under real production constraints.',
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
      'Algorithm and systems work that complements the broader operations and infrastructure background.',
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

const linkedinArticles = [
  {
    title: 'How AI Enabled a Computer Engineer to Install a Home Solar System',
    summary:
      'A practical writeup showing how AI can be used as an engineering copilot in a real-world physical systems project instead of a toy demo.',
    href: 'https://www.linkedin.com/pulse/how-ai-enabled-computer-engineer-install-home-solar-system-matt-snoby-jgzoe/?trackingId=cpydaxv%2FJ%2BXDHCbtt4vqxQ%3D%3D',
    label: 'Read on LinkedIn',
  },
  {
    title: "How I Built the World's Fastest CPU Cuckoo Cycle Miner",
    summary:
      'A performance-engineering article covering affinity, NUMA tuning, compiler work, profiling, and benchmark-driven optimization.',
    href: 'https://www.linkedin.com/pulse/how-i-built-worlds-fastest-cpu-cuckoo-cycle-miner-what-matt-snoby-zeabc/',
    label: 'Read on LinkedIn',
  },
]

const contactLinks = [
  {
    label: 'Download Resume PDF',
    href: '/Matthew-Snoby-Resume-SRE.pdf',
    className:
      'rounded-lg border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-300/25',
  },
  {
    label: 'View Resume HTML',
    href: '/Matthew-Snoby-Resume-SRE.html',
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
            Hands-on infrastructure engineer with 22 years at Cisco / Webex, focused on site reliability, observability,
            incident response, secure delivery, and AI-assisted operations. The through-line is practical ownership:
            understand the failure mode, instrument the system, reduce the toil, and keep the result operable.
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
              Senior SRE and platform roles that value production judgment, strong observability habits, careful automation,
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
            Organized around the core areas most relevant to site reliability and platform engineering work.
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

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">LinkedIn Articles</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
            A few longer-form writeups that show how I explain technical work, think through systems problems, and document hands-on projects.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {linkedinArticles.map((article) => (
              <article key={article.href} className="glass-subcard p-4">
                <h3 className="text-base font-semibold text-white">{article.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{article.summary}</p>
                <a
                  href={article.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-md border border-cyan-300/30 bg-cyan-300/15 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-300/25"
                >
                  {article.label}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="resume" className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Resume & Contact</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
            Download the current resume package and reach out directly for site reliability, platform engineering, and
            infrastructure roles.
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
