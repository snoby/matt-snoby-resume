import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const outPath = resolve(root, 'public', 'Matthew-Snoby-Resume-ATS.html')

const sections = {
  summary:
    'Hands-on technical leader with 25+ years spanning cloud platforms, secure developer infrastructure, observability, AI-assisted operations, and embedded Linux. Known for modernizing production systems with minimal disruption, building secure delivery foundations for regulated environments, and staying close to implementation details from architecture through day-two operations.',
  coreSkills:
    'AWS, OpenStack, Kubernetes, Docker, Helm, Terraform, Ansible, GitHub Actions, Drone CI, HashiCorp Vault, Splunk, Prometheus, Grafana, Loki, Claude, Codex, Local LLMs, Hermes, Qwen, llama.cpp, RAG, MCP, C, C++, Golang, Rust, JavaScript, Vue, Python, Java, PostgreSQL, MongoDB, Oracle, Linux, Embedded Linux, CI/CD, DevSecOps, FedRAMP, Observability, DRM, Conditional Access',
  skills: [
    'Cloud Platforms: AWS, OpenStack, SaaS and PaaS platforms, cloud-native architecture, Multi-AZ design',
    'Infrastructure and Delivery: Kubernetes, KOPS, Docker, Helm, Terraform, Ansible, Drone CI, GitHub Actions, Jenkins, CircleCI, Spinnaker, ArgoCD, HashiCorp Vault',
    'Observability and Operations: Splunk, Grafana, Prometheus, Loki, Vector, OTEL, PagerDuty, secure build systems, hardened Linux images',
    'Programming and Data: C, C++, Golang, Rust, JavaScript, Vue, Python, Java, PostgreSQL, MongoDB, Oracle, Qdrant, SQLite FTS5',
    'AI and Agentic Tooling: Claude, Codex, local models, Hermes, Qwen, llama.cpp, AI-assisted operations, agentic workflows, RAG, MCP',
    'Domain Experience: FedRAMP, embedded Linux, DRM, conditional access, Linux drivers',
  ],
  highlights: [
    'Reduced a FedRAMP-secure Kubernetes image workflow from a 20+ step GitOps, JIRA, and MFA process to a single confirmation step.',
    'Designed and sustained Drone CI/CD, Terraform Enterprise, and Vault-backed delivery patterns in production for more than five years without major redesign.',
    'Led Ubuntu 20.04-to-24.04 hardening, DUO SSH adoption, and hardened image rollouts across AWS and OpenStack/3AZ environments while maintaining compliance and platform stability.',
    'Closed more than 70 deliverables across tasks, epics, and bugs in a single year, supporting modernization, security compliance, and platform readiness workstreams.',
    'Owned production observability and Linux platform work for Webex teams, including Splunk operations, hardened image rollouts, and migrations across AWS and OpenStack environments.',
    'Built and operate independent production systems spanning HA PostgreSQL, Prometheus and Loki observability, blockchain infrastructure, and private AI retrieval platforms.',
  ],
  experience: [
    {
      role: 'Cloud Engineering Technical Leader',
      company: 'Cisco / Webex',
      location: 'Roswell, GA (Remote)',
      dates: 'Sep 2010 - Present',
      lines: [
        'Lead platform engineering work across AI-assisted infrastructure, secure build systems, observability, developer platforms, DRM, and Linux-based production services.',
        'Built automations for a FedRAMP-secure Kubernetes image update workflow, compressing a 20+ step GitOps, JIRA, and MFA-heavy process into a single confirmation step and reusing the same pattern for runbook-guided on-call triage.',
        'Designed and deployed Drone CI/CD and Terraform Enterprise for Webex Logging Metrics, integrated build and deployment secrets with HashiCorp Vault, and kept the architecture stable in production for more than five years.',
        'Designed Vault hierarchies, roles, and policies for CI, development, staging, and production environments; advised teams on GitHub Actions secrets management, image hardening, deployment flows, and day-two operations.',
        'Partnered with a GitHub Actions implementation team that had not previously operated a CI/CD platform, bringing practical production experience from Drone, Terraform Enterprise, Vault integration, build image hardening, and Webex deployment workflows to shape a more realistic rollout path.',
        'Built AI-assisted workflows for on-call diagnosis and auto-remediation experiments, combining runbooks and operational context to reduce manual troubleshooting effort.',
        'Owned a production Splunk platform serving approximately 300 Webex users; led Ubuntu 20.04-to-24.04 hardening, Duo SSH enablement, secure build evidence, and image migrations across AWS and OpenStack/3AZ environments.',
        'Automated in-place platform upgrades and validation steps for complex logging environments, including handling reboots, OpenSearch node loss scenarios, and dependency verification across telegraf, AWS CLI, Python, and Ansible.',
        'Moved internal workloads to Kubernetes on AWS before EKS was available, automated multi-region clusters with Ansible and KOPS, and designed a dedicated platform for Webex bot workloads using Kube2IAM and Vault isolation.',
        'Created custom Linux distribution foundations for Cisco set-top box platforms, wrote Linux kernel and platform drivers for embedded video devices, and led Cisco work spanning RDK, Android set-top architecture, GStreamer DRM pipelines, Intertrust DRM, Nagravision conditional access, and Linaro collaboration.',
      ],
    },
    {
      role: 'Principal Engineer',
      company: 'Vtilt',
      location: '',
      dates: 'Sep 2009 - Sep 2010',
      lines: [
        "Engaged as Cisco's third-wave DRM expert and Linux distribution architect for embedded set-top platforms.",
      ],
    },
    {
      role: 'Associate Staff Engineer',
      company: 'Scientific Atlanta / Cisco Systems',
      location: '',
      dates: 'Aug 2003 - Sep 2009',
      lines: [
        'Led hardware bring-up and board support package development for dual-processor SPARC ASIC set-top box platforms, including memory map layout, makery design and implementation, and porting existing code to dual-processor compatibility.',
        'Served as team lead for new dual-processor driver designs and code reviews, and carried driver platform responsibility for dual-processor set-top box software delivered to Cablevision in New York.',
        'Designed and implemented DMA engine support across multiple CPUs and wrote Linux kernel character, network, and proprietary next-generation Scientific Atlanta drivers.',
        'Acted as DOCSIS team associate architect and mentor for new hires, including bring-up of a new DOCSIS co-processor and design of the ST40 and ST20 co-processor bootloader.',
        'Built proof-of-concept systems including DOCSIS over USB Ethernet dongle support, dual-processor to single-processor DOCSIS platform conversions, USB dongle bridging, and 802.11b Wi-Fi access point enablement on legacy deployed products.',
      ],
    },
    {
      role: 'Digital Television Electrical Engineer',
      company: 'Livewire',
      location: '',
      dates: 'Jan 2001 - Aug 2003',
      lines: [
        'Designed embedded set-top box drivers and resident applications, integrated Nagravision conditional access, and parsed MPEG and DVB service information across TCP/IP, MIPS, ARM, DSP, and ST5518 platforms.',
      ],
    },
    {
      role: 'Software Engineer',
      company: 'Barco',
      location: '',
      dates: 'May 2000 - Jan 2001',
      lines: [
        'Developed 8051 embedded C software for broadcast systems that digitized and transported audio and video over fiber, and redesigned LCD interface requirements.',
      ],
    },
  ],
  projects: [
    {
      name: 'Vipor Mining Pool',
      lines: [
        'Built and operate production mining-pool infrastructure spanning blockchain nodes, stratum services, HAProxy and Nginx routing, Cloudflare and DNS, centralized Vector-to-Loki logging, Prometheus and Grafana monitoring, Alertmanager, and PagerDuty.',
        'Operate PostgreSQL 18 with Patroni primary and replica high availability; executed a no-downtime migration from RDS to EC2 to colocation using logical replication while supporting revenue-critical operations.',
      ],
    },
    {
      name: 'Cuckoo Cycle Algorithm R&D',
      lines: [
        'Wrote the world-fastest CPU miner for the Cuckoo mining algorithm by combining CPU affinity and NUMA optimization, compiler tuning, low-level profiling, and benchmark-driven improvements on Ryzen 7950X3D and EPYC systems.',
      ],
    },
    {
      name: 'Local AI Systems Lab',
      lines: [
        'Run private Qwen 3.x models with llama.cpp, GGUF quantization, speculative decoding, long-context tuning, and KV-cache optimization for coding and operations workflows.',
        'Designed, built, deployed, and operate DIP, a personal document ingestion and retrieval platform that converts mixed office documents into searchable, cited engineering knowledge through FastAPI.',
        'Authored the DIP architecture covering parallel conversion, SHA256 deduplication, sentence-aware chunking, batched embeddings, Qdrant vector storage, and SQLite FTS5 document state and keyword indexing.',
        'Implemented hybrid retrieval by combining Qdrant vector search and SQLite FTS5 results with reciprocal-rank fusion, chunk deduplication, optional cross-encoder reranking, and OpenAI-compatible cited answer generation.',
        'Operationalized DIP with persistent storage, health and metrics endpoints, request telemetry, failure retry workflows, and systemd-driven incremental ingestion every 30 minutes.',
      ],
    },
  ],
}

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const bulletLines = (items) =>
  items.map((item) => `<p class="bullet">- ${escapeHtml(item)}</p>`).join('\n')

const jobBlocks = sections.experience
  .map(
    (job) => `
      <section class="job">
        <p class="job-header"><span class="job-title">${escapeHtml(job.role)}</span> | ${escapeHtml(job.company)}${job.location ? ` | ${escapeHtml(job.location)}` : ''}</p>
        <p class="job-dates">${escapeHtml(job.dates)}</p>
        ${bulletLines(job.lines)}
      </section>`,
  )
  .join('\n')

const projectBlocks = sections.projects
  .map(
    (project) => `
      <section class="project">
        <p class="project-name">${escapeHtml(project.name)}</p>
        ${bulletLines(project.lines)}
      </section>`,
  )
  .join('\n')

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Matthew Snoby Resume ATS</title>
    <style>
      @page {
        margin: 0.55in 0.65in;
        size: letter;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10.5pt;
        line-height: 1.28;
        color: #111111;
        background: #ffffff;
        font-variant-ligatures: none;
        font-feature-settings: "liga" 0, "clig" 0;
        -webkit-font-smoothing: antialiased;
      }

      main {
        max-width: 100%;
      }

      h1 {
        margin: 0 0 4px;
        font-size: 21pt;
        letter-spacing: 0.02em;
      }

      .subtitle {
        margin: 0 0 6px;
        font-size: 12pt;
        font-weight: 700;
      }

      .contact {
        margin: 0 0 10px;
      }

      h2 {
        margin: 12px 0 5px;
        padding-bottom: 2px;
        font-size: 11pt;
        border-bottom: 1px solid #444444;
      }

      p {
        margin: 0 0 4px;
      }

      .job,
      .project {
        margin-bottom: 8px;
        break-inside: avoid;
      }

      .job-header,
      .project-name {
        font-weight: 700;
      }

      .job-dates {
        font-style: italic;
      }

      .bullet {
        padding-left: 10px;
        text-indent: -10px;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Matthew Snoby</h1>
      <p class="subtitle">Technical Leader - Cloud Platforms, Secure Delivery, and AI-Enabled Operations</p>
      <p class="contact">Roswell, GA | matt.snoby@icloud.com | github.com/snoby | linkedin.com/in/mattsnoby | resume.mattsnoby.com</p>

      <h2>Summary</h2>
      <p>${escapeHtml(sections.summary)}</p>

      <h2>Core Skills</h2>
      <p>${escapeHtml(sections.coreSkills)}</p>

      <h2>Skills</h2>
      ${bulletLines(sections.skills)}

      <h2>Highlights</h2>
      ${bulletLines(sections.highlights)}

      <h2>Professional Experience</h2>
      ${jobBlocks}

      <h2>Independent Projects</h2>
      ${projectBlocks}

      <h2>Education</h2>
      <p><strong>Bachelor of Science, Computer Engineering</strong></p>
      <p>Southern Polytechnic State University - Marietta, Georgia</p>
    </main>
  </body>
</html>
`

writeFileSync(outPath, html)
console.log(outPath)
