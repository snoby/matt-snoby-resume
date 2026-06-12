import { useEffect, useRef, useState } from 'react'
import GpuBackground from './GpuBackground.jsx'

const ciscoImpactStats = [
  {
    label: 'AI Work',
    value: 'Codex Automation',
    note: 'FedRAMP K8s automation + on-call triage',
    detail: 'Applied Codex to repetitive secure operations where the work was known, sensitive, and expensive to perform by hand.',
    points: [
      'Automated the FedRAMP Kubernetes image update path across transfer, pull, update, deploy, GitOps, JIRA, commit, and merge steps.',
      'Reduced a 20+ step workflow with repeated SSO/MFA prompts to enabling the automation and confirming MFA on the phone.',
      'Used Codex for on-call paging triage: when a page came in, Codex reviewed the runbook, searched the docs, logged into the paging cluster, attempted to find the exact error and solution, then presented the steps to resolve the page.',
    ],
    evidence: ['FedRAMP K8s image pipeline', '20+ manual steps reduced', 'Codex-assisted on-call triage'],
  },
  {
    label: 'CI Work',
    value: 'Drone + TFE',
    note: 'Mission-critical builds and deploys',
    detail:
      'Built the durable CI/CD and infrastructure automation foundation used by the Webex Logging Metrics team for production work.',
    points: [
      'Designed, implemented, and deployed the drone.io CI/CD build system and Terraform Enterprise service for mission-critical builds and deploys.',
      'Kept the same architecture in production use for more than five years with no major redesign.',
      'Integrated with HashiCorp Vault so build and deploy secrets stayed secured.',
      'Manager quote: "If we need something that never needs to be touched and just runs in the corner we give it to Matt".',
    ],
    evidence: ['Drone CI/CD', 'Terraform Enterprise', 'HashiCorp Vault secrets'],
  },
  {
    label: 'HashiCorp Vault',
    value: 'Secrets Platform',
    note: 'CI, dev, staging, prod secret hierarchy',
    detail:
      'Designed and implemented the HashiCorp Vault structure used to separate secrets by environment and workflow. Before AI-assisted policy generation, Vault roles and policies were written by hand, so the structure needed to be understandable, repeatable, and safe for CI/CD and application teams.',
    points: [
      'Designed the hierarchical secret structure for CI, development, staging, and production environments.',
      'Implemented Vault roles and policy patterns that controlled which systems and workflows could access each secret path.',
      'Established a structure that could be maintained manually before AI-assisted role and policy generation existed.',
    ],
    evidence: ['Vault roles and policies', 'Environment-scoped secrets', 'CI/CD secret access'],
  },
  {
    label: 'Security Hardening',
    value: '20.04 -> 24.04',
    note: 'Hardened images and secure build validation',
    detail:
      'Review-backed hardening work included Ubuntu 20.04 to 24.04 migrations, hardened image adoption, DUO SSH integration on build systems, secure build evidence collection, and validation across AWS and OpenStack/3AZ environments.',
    points: [
      'Moved build and logging systems onto hardened images while preserving service compatibility.',
      'Integrated DUO SSH access and produced compliance evidence showing that build hosts, access controls, and test results met secure build requirements.',
      'Validated migrations across AWS and OpenStack/3AZ environments.',
    ],
    evidence: ['Ubuntu 20.04 to 24.04', 'Secure build validation', 'AWS and OpenStack/3AZ hardened images'],
  },
  {
    label: 'Splunk Platform',
    value: '300 Users',
    note: 'Production logging platform for Webex',
    detail:
      'Owned and operated a production Splunk environment serving roughly 300 users across the Webex division. The work combined platform ownership, production reliability, access management, logging workflows, and user support for teams depending on centralized operational search.',
    points: [
      'Ran and managed the production Splunk platform used by approximately 300 Webex users.',
      'Owned day-to-day platform reliability, user access, operational support, and logging workflows.',
      'Supported engineering teams that depended on Splunk for production investigation and operational visibility.',
    ],
    evidence: ['Production Splunk', '300 Webex users', 'Operational logging platform'],
  },
  {
    label: 'GitHub Actions',
    value: 'CI/CD Advisor',
    note: 'Brought real CI/CD experience to a new implementation team',
    detail:
      'Partnered with a team tasked with implementing GitHub Actions even though they had not previously operated a CI/CD platform. Brought practical production CI/CD experience from Drone, Terraform Enterprise, Vault integration, build image hardening, and Webex deployment workflows to help shape a more realistic implementation path.',
    points: [
      'Advised a GitHub Actions implementation team that was new to CI/CD platform operations.',
      'Translated lessons from running production Drone CI/CD into GitHub Actions design and rollout discussions.',
      'Helped the team account for secrets, build images, deployment workflow, reliability, and day-two operations.',
    ],
    evidence: ['GitHub Actions', 'CI/CD platform experience', 'Drone production lessons'],
  },
]

const technicalFocusStats = [
  {
    label: 'Local LLM Systems',
    value: 'Qwen3.6 35B',
    note: 'Local llama.cpp serving with MTP, GGUF, and turboquant',
    detail:
      'Run local LLM serving stacks for private engineering workflows, with attention to long context, speculative decoding, quantization tradeoffs, and reproducible model launch configuration.',
    points: [
      'Serve Qwen3.6 35B locally through llama.cpp using GGUF model artifacts and a coding-focused model alias.',
      'Use MTP speculative decoding with draft token controls to improve local serving behavior while preserving reasoning output.',
      'Tune turboquant KV cache types, long context, FlashAttention, GPU layer placement, and reasoning budget for coding-assistant workflows.',
      'Experimented with parallel inference across three RTX 4090s, then moved to a single RTX 5090 after PCIe bandwidth limits made the single-card setup faster for token generation.',
    ],
    evidence: ['llama.cpp server', 'MTP speculative decoding', 'GGUF + turboquant', '4090 cluster vs 5090 tradeoff'],
    code: `#!/bin/bash

/data/qwen3.6/llama.cpp-mtp-turboquant/build/bin/llama-server \\
  -m /data/qwen3.6/models/Qwen3.6-35B-A3B-MTP-GGUF/Qwen3.6-35B-A3B-UD-Q3_K_XL.gguf \\
  --alias qwen3.6-35b-mtp-coding \\
  --ctx-size 262144 \\
  --parallel 1 \\
  -np 1 \\
  --threads 8 \\
  --threads-batch 16 \\
  --n-gpu-layers 999 \\
  --flash-attn on \\
  --cache-type-k turbo3 \\
  --cache-type-v turbo4 \\
  --spec-type mtp \\
  --spec-draft-n-max 5 \\
  --spec-draft-p-min 0.70 \\
  --spec-draft-ngl 999 \\
  --temp 0.6 \\
  --top-p 0.95 \\
  --top-k 20 \\
  --min-p 0.00 \\
  --cache-ram 0 \\
  --presence-penalty 0.0 \\
  --repeat-penalty 1.0 \\
  --chat-template-kwargs '{"preserve_thinking":true}' \\
  --reasoning-budget 32768 \\
  --n-predict 8192 \\
  --host 0.0.0.0 \\
  --port 8002 \\
  --metrics \\
  --jinja \\
  --log-timestamps`,
  },
  {
    label: 'Vipor Mining Pool',
    value: 'Observability',
    note: 'Grafana dashboards, Loki logs, Prometheus metrics, PagerDuty',
    detail:
      'Built production-style observability for the Vipor mining pool and home lab. Grafana acts as the operational surface, with extensive dashboards that combine mining-pool metrics, Loki log streams, Prometheus host and service metrics, and PostgreSQL behavior. Every stratum host runs Vector.dev to ship logs back to Loki, while every stratum and node is monitored with Prometheus. Alerts flow through Alertmanager and then to PagerDuty for operational response.',
    points: [
      'Built extensive Grafana dashboards for mining-pool health, stratum behavior, Loki logs, and PostgreSQL metrics.',
      'Runs Vector.dev on every stratum host to forward service logs into Loki in the home lab.',
      'Monitors every stratum and node with Prometheus for health, resource, and service-level signals.',
      'Routes alerts through Alertmanager and into PagerDuty so mining-pool failures become actionable pages.',
    ],
    evidence: ['Grafana dashboards', 'Loki logs', 'PostgreSQL metrics', 'Prometheus -> Alertmanager -> PagerDuty'],
    links: [{ label: 'vipor.net', href: 'https://vipor.net' }],
  },
  {
    label: 'PostgreSQL Reliability',
    value: 'Patroni HA',
    note: 'Colocated PostgreSQL 18 primary/replica for the mining pool',
    detail:
      'Run the mining pool database platform on colocated PostgreSQL 18 with a Patroni-managed primary/replica architecture and monitoring. The database backs revenue-critical mining-pool operations where downtime is not acceptable. Over the past four years, millions of dollars of revenue have moved through the pool while the database platform remained continuously available.',
    points: [
      'Operate a colocated PostgreSQL 18 primary/replica cluster managed with Patroni for high availability.',
      'Monitor database health, replication, and production behavior as part of the mining-pool reliability stack.',
      'Migrated from AWS RDS to AWS EC2 instances and then to colocation with no downtime.',
      'Used logical replication and careful cutover management to move the database platform without interrupting pool operations.',
    ],
    evidence: ['PostgreSQL 18', 'Patroni primary/replica', 'RDS -> EC2 -> colocation', 'No-downtime migration'],
  },
  {
    label: 'DIP',
    value: 'Document Ingestion',
    note: 'Production-style ingestion, hybrid retrieval, cited answers, and operational servicing.',
    detail:
      'Designed, built, deployed, and service the DIP document ingestion platform: a resilient pipeline that converts mixed office documents into searchable content, maintains vector and keyword indexes, and exposes retrieval and cited-answer workflows through a FastAPI service.',
    points: [
      'Built parallel document conversion with native readers, MarkItDown, LibreOffice fallback, SHA256 deduplication, hard per-file timeouts, and sentence-aware chunking.',
      'Implemented batched sentence-transformer embeddings with Qdrant vector storage and a SQLite WAL registry containing document state, chunks, FTS5 indexes, and ingestion runs.',
      'Served vector, keyword, and hybrid retrieval through FastAPI, combining Qdrant and SQLite FTS5 results with reciprocal-rank fusion and optional cross-encoder reranking.',
      'Deployed and operate the service with persistent storage, health and metrics endpoints, request telemetry, and systemd-driven incremental ingestion every 30 minutes.',
    ],
    evidence: ['MarkItDown + LibreOffice', 'Qdrant + SQLite FTS5', 'FastAPI /search + /ask', 'systemd operations'],
    links: [{ label: 'Architecture', href: '/dip-architecture.html' }],
  },
]

const projects = [
  {
    title: 'Cisco / Webex Platform Engineering',
    summary:
      'Led critical platform engineering work across internal Kubernetes, AWS automation, CI/CD, secrets management, secure build infrastructure, and modernization of engineering systems used by Webex teams.',
    stack: 'Kubernetes, AWS, KOPS, Ansible, Vault, CI/CD, GitOps, secure build systems',
  },
  {
    title: 'AI Infrastructure & Local LLM Systems Lab',
    summary:
      'Built private AI-assisted engineering workflows around local inference, retrieval experiments, model comparison, and failure analysis instead of sending sensitive engineering context to public tools.',
    stack: 'RTX 3090, GGUF, Qwen 3.x, llama.cpp-style runtimes, RAG pipeline components, eval prompts',
  },
  {
    title: 'Observability Platform: Vector.dev -> Loki + Prometheus/Grafana',
    summary:
      'Runs Vector.dev on every stratum host to send logs into Loki, monitors stratums and nodes with Prometheus, and uses extensive Grafana dashboards for pool metrics, Loki logs, and PostgreSQL metrics before routing alerts through Alertmanager to PagerDuty.',
    stack: 'Vector.dev, Loki, Prometheus, Grafana dashboards, PostgreSQL metrics, Alertmanager, PagerDuty, node_exporter, cAdvisor',
  },
  {
    title: 'PostgreSQL Reliability & Ingestion Tuning',
    summary:
      'Runs a colocated PostgreSQL 18 Patroni primary/replica database for the mining pool, with monitoring and no-downtime migrations from AWS RDS to EC2 and then to colocation using logical replication.',
    stack: 'PostgreSQL 18, Patroni, logical replication, colocation, monitoring, backup/restore, ingestion pipelines',
  },
  {
    title: 'Vipor Mining Pool / Independent Infrastructure Platform',
    summary:
      'Built and operated production mining pool infrastructure spanning blockchain nodes, stratum services, HAProxy/Nginx routing, PostgreSQL ingestion pipelines, and incident response workflows.',
    stack: 'Linux, Docker, Ansible, PostgreSQL, HAProxy, Nginx, DNS, Cloudflare',
  },
  {
    title: 'Home Lab / Production-Like Infrastructure R&D Platform',
    summary:
      'Built segmented infrastructure networks with high-speed lab interconnects for staged deployments, failure-mode testing, and automation validation before production rollout.',
    stack: 'Proxmox, Incus/LXC, Docker, Linux, Mellanox 40Gb, observability tooling',
  },
]

const skills = {
  'Cloud / Platform': ['AWS', 'OpenStack', 'Kubernetes (KOPS)', 'Terraform', 'Ansible', 'Vault', 'Hardened Linux images'],
  'CI/CD / Developer Platforms': ['Drone CI', 'GitHub Actions', 'Jenkins', 'CircleCI', 'GitOps workflows', 'Secure build infrastructure'],
  Observability: ['Prometheus', 'Grafana', 'Loki', 'Vector.dev', 'Alertmanager', 'Custom metrics and logging pipelines'],
  Databases: ['PostgreSQL', 'Partitioned tables', 'Replication', 'Query optimization', 'Backup/restore workflows'],
  'Networking / Infrastructure': ['HAProxy', 'Nginx', 'Cloudflare', 'DNS', 'VLAN segmentation', 'Mellanox 40Gb Ethernet'],
  'Systems / Embedded': ['C/C++', 'Linux kernel drivers', 'DOCSIS', 'DRM / Conditional Access', 'BSP bring-up', 'DMA'],
  'AI / Compute': [
    'Local LLM inference',
    'GGUF quantization',
    'Qwen 3.x models',
    'Prompt and context design',
    'RAG pipeline experiments',
    'Model behavior evaluation',
  ],
}

const experiencePrimary = [
  {
    period: 'September 2010 - Present',
    role: 'Cisco / Webex - Cloud Engineering Technical Leader',
    detail:
      'Technical leader spanning embedded platform architecture, DRM/security systems, cloud platform engineering, and current AI-assisted infrastructure work across Kubernetes, AWS, CI/CD, secrets management, document retrieval, and internal developer platforms.',
    bullets: [
      'Designed, built, deployed, and service DIP, a document ingestion and retrieval platform that converts mixed office documents into searchable, cited engineering knowledge through FastAPI.',
      'Authored the DIP architecture covering parallel conversion, SHA256 deduplication, sentence-aware chunking, batched embeddings, Qdrant vector storage, and SQLite FTS5 document state and keyword indexing.',
      'Implemented hybrid retrieval by combining Qdrant vector search and SQLite FTS5 results with reciprocal-rank fusion, chunk deduplication, optional cross-encoder reranking, and OpenAI-compatible cited answer generation.',
      'Operationalized DIP with persistent storage, health and metrics endpoints, request telemetry, failure retry workflows, and systemd-driven incremental ingestion every 30 minutes.',
      'Built Codex automations for FedRAMP-secure Kubernetes image update workflows, reducing a 20+ step GitOps/JIRA/MFA-heavy process to enabling the automation and confirming MFA.',
      'Used Codex for on-call paging triage: when a page came in, Codex reviewed the runbook, searched docs, logged into the paging cluster, attempted to find the exact error and solution, then presented resolution steps.',
      'Designed, implemented, and deployed the drone.io CI/CD build system and Terraform Enterprise service used by Webex Logging Metrics for mission-critical builds and production deploys.',
      'Integrated CI/CD and infrastructure automation with HashiCorp Vault so build and deploy secrets stayed secured.',
      'Designed and implemented a HashiCorp Vault hierarchy for CI, development, staging, and production secrets, including hand-written roles and policies before AI-assisted generation.',
      'Owned and operated a production Splunk platform for approximately 300 Webex users, supporting operational logging, access management, and production investigation workflows.',
      'Advised a GitHub Actions implementation team that had not operated CI/CD before, bringing production Drone CI/CD experience into design, secrets, build image, deployment, and day-two operations discussions.',
      'Closed 70+ tasks, epics, and bugs in the FY26 review cycle across platform hardening, compliance, feature rollout, and readiness workstreams.',
      'Drove Ubuntu 20.04 to 24.04 hardening, Terraform and Ansible image updates, DUO SSH integration, and hardened-image migrations across AWS and OpenStack/3AZ environments.',
      'Maintained critical LMA internal services including Drone and Terraform Enterprise with a zero-downtime operating expectation.',
      'Established AWS inventory collection into Loki and implemented AWS MSK workflows for commercial and FedRAMP users.',
      'Moved internal workloads to Kubernetes in AWS before EKS, including automated multi-region cluster deployments with Ansible and KOPS.',
      'Designed and deployed a dedicated Kubernetes platform for internal Webex bot workloads where uptime was business-critical.',
      'Implemented Kube2IAM, AWS policy design, and Vault-based secrets infrastructure for stricter workload isolation.',
      'Built CI/CD and GitOps pipelines for containerized deployments, then expanded into secure build, observability, and platform modernization work.',
      'Led Cisco technical initiatives across RDK, Android-based STB platforms, DRM pipelines, and open source collaboration with Linaro LHG.',
      {
        text: 'Presented Chromium and CDM integration work publicly as Cisco engineering representative.',
        href: 'https://youtu.be/dJqCbTfKrMk?si=m_4kYiEDNneQxOyq',
      },
    ],
  },
  {
    period: 'September 2009 - September 2010',
    role: 'Vtilt - Principal Engineer',
    detail:
      'Served as Cisco third-wave DRM expert and Linux distribution architect during a focused consulting and platform architecture period.',
  },
  {
    period: 'August 2003 - September 2009',
    role: 'Scientific Atlanta / Cisco Systems - Associate Staff Engineer',
    detail:
      'Led low-level platform work across dual-processor set-top box systems, Linux kernel drivers, DOCSIS, co-processors, DMA design, and hardware bring-up.',
    bullets: [
      'Owned board support package bring-up for dual-processor SPARC ASIC set-top box platforms.',
      'Led new dual-processor driver design and code reviews, including platform delivery responsibilities for Cablevision deployments.',
      'Implemented DOCSIS-over-USB Ethernet dongle proof of concept and other skunkworks hardware/software integration projects.',
      'Designed DMA engine functionality across multiple CPUs and developed kernel character, network, and proprietary drivers.',
      'Mentored new hires as DOCSIS team associate architect and designed co-processor bootloader workflows.',
    ],
  },
  {
    period: 'January 2001 - August 2003',
    role: 'Livewire - Digital Television Electrical Engineer',
    detail:
      'Designed and developed embedded software for digital set-top box hardware, spanning driver work, resident application software, DVB/SI parsing, and conditional access integration.',
    bullets: [
      'Integrated manufacturer driver software with Nagravision conditional access kernels.',
      'Worked across TCP/IP socket programming, Win32 API development, and embedded platform debugging.',
      'Supported hardware based on ST5518, Broadcom MIPS, Conexant ARM, and TI DSP platforms.',
    ],
  },
  {
    period: 'May 2000 - 2001',
    role: 'Barco - Software Engineer',
    detail:
      'Built embedded broadcast software for systems that digitized audio and video and transported that data over fiber, including LCD menu redesign and 8051 microcontroller control code.',
  },
]

const education = {
  degree: 'B.S. Computer Engineering',
  school: 'Southern Polytechnic State University',
  location: 'Marietta, Georgia',
  year: '2000',
}

const coreStrengths = [
  'Own critical infrastructure end-to-end and operate reliably under production pressure.',
  'Modernize legacy platforms without disrupting live engineering workflows.',
  'Design automation that reduces toil and improves deployment consistency.',
  'Build observability systems that make distributed infrastructure diagnosable.',
  'Use AI as an engineering accelerator with private context, verification loops, and clear boundaries.',
  'Bridge enterprise platform engineering with deep embedded Linux and hardware integration experience.',
]

const aiOperatingModel = [
  {
    title: 'Private Engineering Assistant',
    detail:
      'Use local LLM inference to review logs, configs, runbooks, and code-adjacent notes without exposing proprietary or operational context to external chat tools.',
  },
  {
    title: 'RAG and Context Experiments',
    detail:
      'Prototype retrieval flows for infrastructure documentation and incident notes, then test whether retrieved context improves answers or introduces failure modes.',
  },
  {
    title: 'Model and Prompt Evaluation',
    detail:
      'Compare model behavior across quantization levels, context length, latency, and answer quality; keep useful prompts only when they survive real engineering tasks.',
  },
  {
    title: 'Human-in-the-Loop Automation',
    detail:
      'Apply AI to summarize, classify, and draft operational material while keeping judgment, verification, and final changes with the engineer.',
  },
]

const earlyCareerHighlights = [
  'More than two decades spanning embedded software, kernel drivers, DRM/security, DOCSIS, CI/CD, Kubernetes, and cloud platform engineering.',
  'Open source contributor with long-running Linux and reproducibility instincts across build, deployment, and systems integration work.',
  'Hands-on background across C/C++, Python, JavaScript, Golang, GNU make/autotools, and infrastructure automation tooling.',
]

const heroProofPoints = [
  'Built production infrastructure that teams depended on for years without major redesign.',
  'Turned high-friction secure operations into automation, including a 20+ step FedRAMP workflow.',
  'Bridge deep embedded systems experience with modern platform engineering, observability, and practical AI.',
]

const independentProjects = [
  {
    period: 'Independent Technical Projects',
    role: 'Mining Infrastructure, Observability, and Reliability',
    detail:
      'Full-stack ownership of production mining infrastructure with centralized log aggregation, telemetry-driven incident triage, and high-volume PostgreSQL-backed workloads.',
  },
  {
    period: 'Infrastructure R&D',
    role: 'World-Fastest Cuckoo CPU Miner',
    detail:
      "Wrote the world's fastest CPU miner for the Cuckoo mining algorithm, pushing Ryzen and EPYC systems through affinity and NUMA optimization, compiler tuning, low-level profiling, and benchmark-driven algorithm improvements.",
    links: [
      {
        label: 'Read the LinkedIn article',
        href: 'https://www.linkedin.com/posts/activity-7447046008766656512-iTnI?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAIDC_MB0o2CMCkZMqKomzZaBT4C1oRztvo',
      },
    ],
  },
  {
    period: 'AI Infrastructure R&D',
    role: 'Local LLM Systems Lab',
    detail:
      'Built local AI inference environments on RTX 3090 hardware to evaluate GGUF models, long-context behavior, retrieval quality, and private engineering-assistant workflows.',
  },
]

function App() {
  const [pressedCard, setPressedCard] = useState(null)
  const [selectedCard, setSelectedCard] = useState(ciscoImpactStats[0])
  const pressTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (pressTimeoutRef.current) {
        window.clearTimeout(pressTimeoutRef.current)
      }
    }
  }, [])

  const handleStatCardPress = (label) => {
    if (pressTimeoutRef.current) {
      window.clearTimeout(pressTimeoutRef.current)
    }

    setPressedCard(label)
    setSelectedCard([...ciscoImpactStats, ...technicalFocusStats].find((item) => item.label === label))
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
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300/90">Infrastructure Command Profile</p>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">Matt Snoby</h1>
          <p className="mt-2 text-lg font-semibold text-sky-200 sm:text-xl">
            I build critical infrastructure that quietly keeps working.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-100 sm:text-lg">
            Platform engineering technical leader with 20+ years spanning Cisco/Webex, secure CI/CD, Kubernetes, Vault,
            observability, production databases, and AI-assisted automation. The through-line is durable systems: the kind that
            reduce toil, survive production pressure, and do not need constant babysitting.
          </p>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {heroProofPoints.map((item) => (
              <p key={item} className="glass-subcard p-3 text-sm leading-relaxed text-slate-200">
                {item}
              </p>
            ))}
          </div>
          <div className="mt-5 max-w-3xl rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-200/90">Why Teams Remember Me</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-100 sm:text-base">
              I am usually handed the systems that need to be reliable, secure, and low-maintenance. My best work is building
              the infrastructure that runs in the corner and just keeps doing its job.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#resume"
              className="rounded-lg border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-300/25"
            >
              View Resume
            </a>
            <a
              href="#contact"
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-100 transition hover:bg-white/20"
            >
              Contact
            </a>
          </div>
        </section>

        <section className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Cisco Recent History</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {ciscoImpactStats.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`glass-card stat-card top-stat-card p-4 text-left ${pressedCard === item.label ? 'is-pressed' : ''} ${
                  selectedCard?.label === item.label ? 'is-selected' : ''
                }`}
                onClick={() => handleStatCardPress(item.label)}
                aria-expanded={selectedCard?.label === item.label}
                aria-pressed={selectedCard?.label === item.label}
              >
                <p className="font-mono text-[11px] uppercase tracking-wider text-slate-300">{item.label}</p>
                <p className="mt-3 text-xl font-bold leading-tight text-white">{item.value}</p>
                <p className="mt-3 text-xs leading-snug text-slate-300/90">{item.note}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Personal Projects</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {technicalFocusStats.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`glass-card stat-card p-3 text-left ${pressedCard === item.label ? 'is-pressed' : ''} ${
                  selectedCard?.label === item.label ? 'is-selected' : ''
                }`}
                onClick={() => handleStatCardPress(item.label)}
                aria-expanded={selectedCard?.label === item.label}
                aria-pressed={selectedCard?.label === item.label}
              >
                <p className="font-mono text-[11px] uppercase tracking-wider text-slate-300">{item.label}</p>
                <p className="mt-2 text-base font-bold text-white">{item.value}</p>
                <p className="mt-2 text-xs text-slate-300/90">{item.note}</p>
              </button>
            ))}
          </div>
        </section>

        {selectedCard ? (
          <section className="glass-card p-6 sm:p-8" aria-live="polite">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Selected Detail</p>
            <div className="mt-3 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-300">{selectedCard.label}</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{selectedCard.value}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{selectedCard.note}</p>
              </div>
              <div className="glass-subcard min-w-0 p-4">
                <p className="text-sm leading-relaxed text-slate-200">{selectedCard.detail}</p>
                {'points' in selectedCard && selectedCard.points ? (
                  <ul className="mt-4 space-y-2">
                    {selectedCard.points.map((point) => (
                      <li key={point} className="flex gap-2 text-sm leading-relaxed text-slate-300">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/80" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {'code' in selectedCard && selectedCard.code ? (
                  <pre className="mt-4 max-h-80 w-full max-w-full overflow-auto rounded-lg border border-white/10 bg-black/35 p-3 text-[11px] leading-relaxed text-cyan-50">
                    <code>{selectedCard.code}</code>
                  </pre>
                ) : null}
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
            {coreStrengths.map((item) => (
              <p key={item} className="glass-subcard p-3 text-sm text-slate-200">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Applied AI Operating Model</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
            I treat AI as production-adjacent infrastructure, not a buzzword: define the task, name the tools, test the failure
            modes, and keep a human accountable for the result.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {aiOperatingModel.map((item) => (
              <article key={item.title} className="glass-subcard p-4">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Featured Projects</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.title} className="glass-subcard p-4">
                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{project.summary}</p>
                <p className="mt-3 font-mono text-xs text-cyan-200/90">{project.stack}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Skills Matrix</h2>
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

        <section className="glass-card p-6 sm:p-8" id="experience">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Experience Timeline</h2>
          <div className="mt-5 space-y-4">
            {experiencePrimary.map((entry) => (
              <article key={entry.period} className="glass-subcard p-4 sm:p-5">
                <p className="font-mono text-xs uppercase tracking-wider text-cyan-200">{entry.period}</p>
                <h3 className="mt-1 text-base font-semibold text-white">{entry.role}</h3>
                <p className="mt-2 text-sm text-slate-300">{entry.detail}</p>
                {'bullets' in entry && entry.bullets ? (
                  <ul className="mt-3 space-y-2">
                    {entry.bullets.map((bullet) => (
                      <li
                        key={typeof bullet === 'string' ? bullet : bullet.text}
                        className="text-sm text-slate-300"
                      >
                        {typeof bullet === 'string' ? (
                          bullet
                        ) : (
                          <a
                            href={bullet.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-200 underline decoration-cyan-400/60 underline-offset-4 transition hover:text-cyan-100"
                          >
                            {bullet.text}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">
            Independent Technical Projects & Infrastructure R&D
          </h2>
          <div className="mt-5 space-y-4">
            {independentProjects.map((entry) => (
              <article key={entry.role} className="glass-subcard p-4 sm:p-5">
                <p className="font-mono text-xs uppercase tracking-wider text-cyan-200">{entry.period}</p>
                <h3 className="mt-1 text-base font-semibold text-white">{entry.role}</h3>
                <p className="mt-2 text-sm text-slate-300">{entry.detail}</p>
                {'links' in entry && entry.links ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.links.map((link) => (
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
              </article>
            ))}
          </div>
        </section>

        <section id="resume" className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Resume & Contact</h2>
          <p className="mt-3 text-sm text-slate-300">
            Download the latest resume or reach out directly for infrastructure architecture, reliability, and systems engineering work.
          </p>
          <div id="contact" className="mt-5 flex flex-wrap gap-3">
            <a
              href="/Matthew-Snoby-Resume.pdf"
              download="Matthew-Snoby-Resume.pdf"
              className="rounded-lg border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-300/25"
            >
              Download Resume (PDF)
            </a>
            <a
              href="/Matthew-Snoby-Resume.docx"
              download="Matthew-Snoby-Resume.docx"
              className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-300/20"
            >
              Download Resume (Word)
            </a>
            <a
              href="mailto:matt.snoby@gmail.com"
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-100 transition hover:bg-white/20"
            >
              matt.snoby@gmail.com
            </a>
            <a
              href="https://github.com/snoby"
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-100 transition hover:bg-white/20"
            >
              github.com/snoby
            </a>
            <a
              href="https://linkedin.com"
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-100 transition hover:bg-white/20"
            >
              LinkedIn
            </a>
            <span className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-200">
              Roswell / Atlanta, GA
            </span>
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Education</h2>
          <p className="mt-3 text-sm text-slate-300">Formal education from the 2018 resume, preserved here as a verified baseline.</p>
          <div className="glass-subcard mt-3 space-y-2 p-4 text-sm text-slate-300">
            <p className="text-base font-semibold text-white">{education.degree}</p>
            <p>{education.school}</p>
            <p>{education.location}</p>
            <p>Graduation Year: {education.year}</p>
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">Career Snapshot</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {earlyCareerHighlights.map((item) => (
              <p key={item} className="glass-subcard p-3 text-sm text-slate-200">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="pb-4 text-center text-xs text-slate-400">
          <p>
            Senior platform engineering profile focused on secure build infrastructure, observability stack design, platform
            reliability, and local AI infrastructure.
          </p>
        </section>
      </div>
    </main>
  )
}

export default App
