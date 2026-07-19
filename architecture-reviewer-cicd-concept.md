# Architecture Reviewer + CI/CD Guardian — Concept Doc

## One-liner
An architecture reviewer that doesn't just report findings — it enforces them. Every PR gets diffed against a live dependency graph; security regressions, reliability regressions, and cost/debt spikes become merge-blocking or merge-warning checks, not a report nobody reads after the fact.

## Problem
A standalone architecture reviewer produces a report once, on demand. A standalone CI/CD tool runs tests but has no model of the system's structure — it can't tell you that your PR just added a synchronous call inside the hot path it flagged three weeks ago. Bolting the two together as separate tools means the CI/CD side never sees the reviewer's findings, and the reviewer never sees what's about to ship. Merging them means the reviewer's output *is* the policy the pipeline enforces — findings expire the moment they'd otherwise become stale, because every PR re-checks them.

The NeuraShield README's framing ("self-learning," "reinforcement learning," "quantum shield," GNN attack detection) describes a research program, not a shippable MVP. This doc keeps the integration idea — findings gating pipeline behavior — and drops the parts that aren't buildable solo in a few weeks. Where NeuraShield's claim doesn't survive contact with "what's the actual mechanism," it's rewritten below or moved to Honest Risks.

## Unified Pipeline / User Flow
1. **Connect**: GitHub App install on a repo (not just OAuth — App gives webhook + Checks API access needed for gating)
2. **Baseline scan**: full clone, full-depth analysis (dependency graph, security scan, debt score, cost estimate) — this becomes the "known good" state
3. **PR opened/updated**: webhook fires → diff-scoped analysis runs only on changed files + their direct dependents in the graph
4. **Policy gate**: rule engine compares diff findings against baseline and configured thresholds → posts a GitHub Check (pass / warn / block)
5. **Optional auto-remediation**: for a narrow class of well-known fixable findings, a second PR is opened with a proposed fix — human merges it, nothing auto-merges
6. **Merge → deploy**: standard build/deploy triggers; baseline graph and scores refresh to reflect the new main branch state, closing the loop for the next PR

## Feature Breakdown by Pipeline Stage

### Stage: Connect & Baseline Scan
**Dependency graph** — *what*: nodes = files/modules/services, edges = imports/API calls. *how*: language AST parsing (Python `ast`, TS Compiler API, `go/packages`); service boundaries inferred from `docker-compose.yml`/k8s manifests for multi-service repos. Stored in Neo4j — this is a genuine graph-query use case (traversing "affected subgraph" on every diff needs real graph queries, not a justification for using Neo4j because it sounds impressive). *owns*: Architecture Reviewer.

**Baseline security scan** — *what*: full-repo SAST + secret + CVE scan. *how*: Semgrep, gitleaks, OSV.dev/GitHub Advisory lookups against the manifest. *owns*: Architecture Reviewer.

**Baseline debt score** — *what*: per-module composite score. *how*: churn (`git log` frequency) × cyclomatic complexity (`radon`/`lizard`) × inverse test coverage. Explicitly a score, not a forecast. *owns*: Architecture Reviewer.

**Baseline cost estimate** — *what*: monthly AWS estimate. *how*: parse IaC if present (Terraform/CDK/CloudFormation) and map to pricing data; without IaC, infer stack from dependencies and give a banded estimate with a visible confidence flag. *owns*: Architecture Reviewer.

### Stage: PR Opened (diff-scoped)
**Affected-subgraph analysis** — *what*: re-scope analysis to only what the PR could plausibly affect. *how*: from changed files, walk the Neo4j graph outward N hops to find dependents; re-run the relevant checks only on that subset. This is the mechanism that makes per-PR analysis fast enough to be a CI check instead of a 20-minute batch job. *owns*: Architecture Reviewer, invoked by CI/CD orchestrator.

**Security delta** — *what*: does this diff introduce a new CVE, a hardcoded secret, or an unguarded route/missing role check? *how*: same Semgrep/gitleaks/OSV tools scoped to changed files + any new dependencies, diffed against baseline. Auth-pattern checks (missing role decorators, unguarded endpoints) reuse your RBAC background directly. *owns*: Architecture Reviewer.

**Reliability/bottleneck regression** — *what*: does this diff add a sync call in a loop, remove a caching layer, or introduce a new single point of failure near an already-flagged hot node? *how*: pattern match against the baseline bottleneck list plus the same static heuristics used in the baseline scan, applied only to touched code. Labeled a pattern check, not a simulation. *owns*: Architecture Reviewer.

**Debt delta** — *what*: recomputed churn × complexity score for touched files, diffed against baseline. *owns*: Architecture Reviewer.

**Cost delta** (stretch, see below) — *what*: recomputed estimate for touched IaC/service definitions only. *owns*: Architecture Reviewer.

**Structured PR review comment** — *what*: a scoped code review comment, not open-ended "understands your code like a developer." *how*: feed the diff + relevant baseline context to the Claude API with a fixed schema constrained to specific checks — null-safety, error handling, auth-path changes touched by this diff. Output is a structured comment, not free text. *owns*: CI/CD system's review agent.

**Build-failure heuristic** (grounded rewrite of "predicts build failures") — *what*: a warning, not a prediction. *how*: frequency table from historical CI logs — "changes to these files/configs have failed the pipeline X% of the time historically." Plain conditional-probability lookup, not ML, not RL. Surfaced as a non-blocking warning. *owns*: CI/CD Automation.

### Stage: Policy Gate
**Rule engine** — *what*: evaluates diff findings against configurable thresholds (block on new Critical CVE, block on new unguarded auth route, warn on debt-score increase past X%, warn on cost delta past Y%). *how*: rules stored per-repo, evaluated server-side, result posted via the GitHub Checks API as an actual required status check — this is the concrete mechanism that makes "gating" real instead of a dashboard nobody opens. *owns*: CI/CD Automation, consuming Architecture Reviewer output.

### Stage: Auto-Remediation (opt-in, narrow scope)
**Fix-PR generation** — *what*: for a small, well-defined class of findings (dependency has a known patched version; a new route matches the exact shape of an existing guarded route and is missing the decorator), open a second PR with the fix. *how*: same Claude API agent used for refactor suggestions, constrained to templated fixes, not open-ended patching. *owns*: CI/CD Automation, using the Architecture Reviewer's refactor-suggestion agent as generator. **No auto-merge in v1** — a human merges every remediation PR.

### Stage: Merge → Deploy
**Baseline refresh** — *what*: dependency graph, debt scores, and security state update to reflect the merged code, so the next PR diffs against current reality instead of a stale baseline. *owns*: Architecture Reviewer, triggered by CI/CD Automation's post-merge hook.

### Cross-cutting: Interactive Architecture View
**Dashboard** — *what*: the dependency graph (React Flow/D3), with PR history overlaid — click a past PR, see exactly which nodes it touched and what it changed about their scores. *how*: same graph render as the baseline, with a diff-highlight mode. *owns*: shared frontend, reads from both systems' output tables.

## Tech Stack (single system)
- **Backend/orchestration**: FastAPI, multi-agent pattern via Google ADK/A2A (one agent per check type — security, debt, reliability, review-comment — run in parallel, SSE-streamed as they complete)
- **GitHub integration**: GitHub App (not plain OAuth) for webhooks (push/PR events) + Checks API (status) + PR-write (remediation PRs); PyGithub or Octokit
- **Graph storage**: Neo4j — stores the dependency graph, used for real affected-subgraph traversal queries on every PR
- **Relational**: PostgreSQL — findings, policy config, run history, PR-to-finding mapping
- **Queue/cache**: Redis — job queue for analysis tasks (webhooks enqueue, workers process off the critical path), cache for repeated AST parses
- **Frontend**: Next.js/TypeScript, React Flow for the graph, dashboard for policy config + PR history
- **Static analysis**: Semgrep, gitleaks, `radon`/`lizard`, `madge` (JS dep graphs), OSV API
- **LLM**: Claude API — structured outputs only (review comments, refactor/remediation suggestions), fixed schemas, no open-ended generation
- **Storage for clones**: R2/S3 for ephemeral repo artifacts if deploying on Render (same constraint you hit on WANDR — don't rely on local disk)
- **Dropped from the original READMEs, with reasons**: Pinecone (no MVP use case — could justify later for semantic search over past findings, listed as stretch); CodeBERT/Llama 3-Code self-hosted models (too heavy for a solo MVP, Claude API covers the same surface with less infra); reinforcement learning for pipeline optimization (no training signal or infra to support this at MVP scale — replaced with the frequency-heuristic above)

## MVP Scope (4–5 weeks)
Larger than a standalone reviewer because webhook handling, GitHub App auth, and Checks API integration are real added surface area — budget for that honestly.
- One language (pick JS/TS or Python)
- GitHub App install + webhook handling for PR open/sync
- Baseline full scan on connect: dependency graph in Neo4j, security scan, debt score (skip cost estimate for MVP — it's already the most approximate feature)
- Diff-scoped PR analysis: security delta + debt delta only (skip reliability-regression and cost-delta checks for MVP, they need the most tuning to avoid false positives)
- Fixed policy (not yet configurable): block on new Critical CVE, warn on debt-score increase — posted via GitHub Checks API
- Dashboard: baseline graph + PR history list with pass/warn/block status
- No auto-remediation PRs in MVP

## Stretch
- Cost-delta and reliability-regression checks on diffs
- Configurable per-repo policy (YAML)
- Auto-remediation PRs for CVE fixes and missing auth guards
- Build-failure frequency heuristic
- Runtime feedback loop: optional APM/Prometheus integration feeding real latency/error data back into the reliability checks (the one honest path to something resembling "self-learning" — real metrics closing the loop, not an autonomous RL agent)
- Multi-language support
- Semantic search over past findings (justifies Pinecone, if added)

## Honest Risks / Oversell Checks
- "Self-learning," "reinforcement learning," and "Quantum Security Shield" from the original README don't have a concrete v1 mechanism — say so directly if asked in an interview; the real security value here is Semgrep + CVE lookup + RBAC pattern checks, not a novel model
- Auto-remediation without human merge is a real trust boundary — v1 keeps a human in the loop on every fix PR, full stop
- Affected-subgraph scoping is the riskiest new mechanism: under-scope it and you miss regressions, over-scope it and PR checks get slow enough that people disable them — needs testing against real repos, not just the demo repo
- A GitHub App with repo-write + Checks permissions is a meaningful trust ask if this is ever used on someone else's repo — needs a clear data-retention story (don't keep cloned code longer than the scan needs)
- Full baseline scans can't run synchronously inside a PR check without blowing CI time budgets on large repos — only the fast diff-scoped checks should be a blocking status; baseline refresh runs async post-merge

## Positioning
- The pitch that survives a system-design interview: "architecture review that enforces itself," not "AI reviews your code." The interesting engineering is the affected-subgraph diffing and the policy-gate mechanism, not the LLM calls.
- Touches distributed-systems topics you're already prepping (graph queries at scale, event-driven webhook processing, async job queues) plus your actual security background (RBAC, SAST) — stronger interview material than either project alone.
- Realistic users: small teams without a dedicated platform/security engineer, open-source maintainers wanting automated PR gatekeeping without hiring a reviewer.
