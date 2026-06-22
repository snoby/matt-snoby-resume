export const suggestedQuestions = [
  'Would Matt be a strong fit for a Staff or Principal platform engineering role?',
  'What is his strongest production experience?',
  'How is he actually using AI in engineering work?',
  'Where is he weaker or not the right fit?',
]

const cannedResponses = {
  fit: `For a Staff or Principal platform engineering role, the fit is strong if the team needs someone who has already owned CI/CD, Kubernetes, secrets, observability, production databases, and operational reliability under real pressure.

The clearest evidence is the combination of long-running Drone and Terraform Enterprise systems at Webex, HashiCorp Vault design for CI and environment isolation, hardened-image and Ubuntu migration work, Splunk ownership for roughly 300 users, and newer AI-assisted operational automation. He looks strongest in roles where the mandate is "make this critical system reliable, secure, and maintainable" rather than "invent a consumer product from scratch."`,

  strongest: `The strongest production signal is durable infrastructure ownership. A few standout examples:

- Designed and ran the Drone CI/CD and Terraform Enterprise foundation used for mission-critical builds and deploys.
- Built and maintained Vault structures, roles, and policies that protected CI/CD and environment-scoped secrets.
- Operated production Splunk for roughly 300 Webex users.
- Runs a colocated PostgreSQL 18 Patroni primary/replica environment for the mining pool with no-downtime migrations from RDS to EC2 to colocation.

The pattern is consistent: systems with uptime expectations, operational consequences, and lots of ways to get hurt if the implementation is sloppy.`,

  ai: `The AI work here is practical rather than performative. The best examples are:

- Codex automation for a FedRAMP Kubernetes image workflow that previously required 20+ manual steps and repeated MFA friction.
- Codex-assisted on-call triage where runbooks, docs, and cluster state are gathered before presenting likely resolution steps.
- Local LLM infrastructure using llama.cpp, GGUF, long context, and speculative decoding for private engineering workflows.
- DIP, which turns mixed documents into searchable and cited engineering context through ingestion, chunking, embeddings, hybrid retrieval, and FastAPI endpoints.

This reads less like "AI enthusiast" and more like "platform engineer applying AI where toil and context retrieval are expensive."`,

  rust: `The honest answer is that Rust is not one of the strongest documented signals in this profile.

The strongest language evidence on the page is around C/C++, Python, JavaScript, Golang, Linux/kernel-adjacent work, and infrastructure automation. So if the question is "is Matt primarily a Rust engineer?" the answer is no, at least not based on the current proof presented here.

What does transfer well is the systems background: low-level debugging, performance work, operational reliability, embedded/Linux experience, and comfort with infrastructure code. If a role uses Rust for systems or platform work, he likely brings the right engineering instincts. But if you need someone already proven through substantial production Rust codebases, this page does not currently make that case.`,

  languages: `The language story here is uneven in a truthful way.

The clearest evidence is strongest around C/C++, Python, JavaScript, Golang, and shell/infrastructure automation. That matches the overall profile: platform engineering, embedded systems, Linux internals, operational tooling, and reliability work.

For languages that are not explicitly shown in the proof, the safer read is that the underlying systems judgment is likely transferable, but the page is not claiming deep specialist experience without evidence.`,

  gaps: `The main caution is that the profile is much stronger in infrastructure, reliability, platform engineering, and technical operations than in classic product application development.

If a role is centered on polished consumer UX, product growth experimentation, front-end heavy application work, or managing a large org chart, that is not where the evidence is strongest. The strongest signal is still back-end systems, platform durability, observability, secure automation, and hands-on technical ownership.`,

  leadership: `The leadership style here looks like senior IC / technical leader rather than people-manager branding.

The evidence is coordinating mission-critical systems, advising teams that lacked CI/CD operating experience, building durable internal platforms others depended on, mentoring through architecture and delivery decisions, and taking ownership for systems that "run in the corner." The leadership is best described as operational credibility plus technical direction, not presentation-driven management theater.`,

  interview: `Useful interview questions would be:

- Ask how the Drone and Terraform Enterprise systems were designed to stay low-maintenance over multiple years.
- Ask what changed technically and organizationally in the FedRAMP Kubernetes automation workflow.
- Ask how Vault paths, roles, and policies were structured across CI, development, staging, and production.
- Ask how the PostgreSQL no-downtime migration was executed and what could have gone wrong.
- Ask where AI-assisted ops should stop and human review should begin.

Those questions get past keyword matching and into actual engineering judgment.`,

  default: `The short version: Matt looks strongest as a senior platform/infrastructure engineer who can own hard operational systems end to end.

The recurring themes are secure CI/CD, Kubernetes and AWS automation, Vault, observability, database reliability, production incident pressure, and more recent AI-assisted internal tooling. If the role needs reliability, migration work, toil reduction, or systems that have to keep working without constant babysitting, that is where the evidence is strongest.`,
}

export function getChatResponse(question) {
  const q = question.toLowerCase()

  if (q.includes('rust')) {
    return cannedResponses.rust
  }

  if (
    q.includes('golang') ||
    q.includes('go ') ||
    q.endsWith(' go') ||
    q.includes('python') ||
    q.includes('javascript') ||
    q.includes('typescript') ||
    q.includes('c++') ||
    q.includes('c ') ||
    q.includes('language')
  ) {
    return cannedResponses.languages
  }

  if (q.includes('fit') || q.includes('staff') || q.includes('principal') || q.includes('role') || q.includes('hire')) {
    return cannedResponses.fit
  }

  if (
    q.includes('strongest') ||
    q.includes('best') ||
    q.includes('impact') ||
    q.includes('production') ||
    q.includes('experience')
  ) {
    return cannedResponses.strongest
  }

  if (q.includes('ai') || q.includes('codex') || q.includes('llm') || q.includes('rag') || q.includes('dip')) {
    return cannedResponses.ai
  }

  if (q.includes('weaker') || q.includes('gap') || q.includes('not fit') || q.includes('weakness') || q.includes('consumer')) {
    return cannedResponses.gaps
  }

  if (q.includes('leadership') || q.includes('lead') || q.includes('mentor') || q.includes('manager')) {
    return cannedResponses.leadership
  }

  if (q.includes('interview') || q.includes('ask') || q.includes('question')) {
    return cannedResponses.interview
  }

  return cannedResponses.default
}
