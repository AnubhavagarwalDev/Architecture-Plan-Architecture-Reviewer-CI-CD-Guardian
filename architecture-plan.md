# Architecture Plan: Architecture Reviewer + CI/CD Guardian

## 1. System Overview
The Architecture Reviewer + CI/CD Guardian is designed to act as an automated, enforcing mechanism for architectural and security standards during the pull request (PR) process. Unlike traditional standalone scanners that produce after-the-fact reports, this system integrates deeply into the CI/CD pipeline, gating PR merges based on code quality, security regressions, and architectural changes.

## 2. High-Level Architecture
The system follows an event-driven architecture, triggered by GitHub webhooks.

### Core Components
1. **GitHub App Listener**: The ingress point of the system. Listens for webhooks (e.g., `pull_request.opened`, `pull_request.synchronize`, `push` to main).
2. **Orchestrator Service**: A central backend service that manages the workflow of scans. It coordinates baseline scans and diff-scoped analysis depending on the webhook payload.
3. **Analysis Engine Workers**: Asynchronous workers that execute the actual analysis. These are parallelized for speed.
   - **Graph Parser**: Generates ASTs (Abstract Syntax Trees) and builds dependency graphs.
   - **Security Scanner**: Runs tools like Semgrep, Gitleaks, and OSV API for CVEs.
   - **Code Quality/Debt Scanner**: Calculates cyclomatic complexity and code churn.
4. **Policy Engine**: Evaluates the output of the Analysis Engine against predefined thresholds (e.g., "block on Critical CVE", "warn on 10% debt increase").
5. **Reporting Service**: Communicates the results of the Policy Engine back to GitHub via the Checks API (Pass/Warn/Block) and optionally generates structured PR comments.
6. **Dashboard UI**: A frontend visualization tool for the repository's dependency graph and a historical log of PR checks.

## 3. Data Architecture
- **Relational Storage (PostgreSQL)**: Stores configuration, repo metadata, policies, scan history, findings, and GitHub App installation tokens.
- **Graph Storage (Neo4j)**: Stores the live dependency graph of the codebase. Nodes represent files/modules/services; edges represent imports/calls. Crucial for "affected-subgraph" queries.
- **Cache & Message Broker (Redis)**: Manages the job queues for asynchronous workers (e.g., Celery or RQ) and caches frequent AST parses to speed up the analysis.

## 4. User Flow & Data Flow

### Phase A: Onboarding & Baseline Scan
1. **Connect**: User installs the GitHub App on their repository.
2. **Clone & Ingest**: The Orchestrator queues a "Baseline Scan" job. The repository is cloned entirely.
3. **Graph Construction**: The Graph Parser maps all dependencies and writes the initial structure to Neo4j.
4. **Deep Scan**: Security and Debt scanners evaluate the entire repo. Results are stored in Postgres as the "Known Good" baseline.

### Phase B: Pull Request Workflow (Diff-Scoped Analysis)
1. **Trigger**: A developer opens a PR. The GitHub App Listener receives the webhook.
2. **Graph Traversal**: The Orchestrator identifies the changed files from the PR diff. It queries Neo4j to perform an N-hop traversal, identifying all files/modules that depend on the changed files (the "affected subgraph").
3. **Targeted Scan**: The Analysis Engine workers run SAST, secret, and debt checks **only** on the affected subgraph.
4. **Delta Calculation**: The system compares the new findings against the baseline to calculate the "delta" (e.g., new CVEs introduced, new sync calls in hot paths).
5. **Policy Gate**: The Policy Engine evaluates the delta. If a new critical vulnerability is found, it triggers a "Block" action.
6. **Feedback Loop**: The Reporting Service posts a GitHub Check to the PR. If necessary, a structured comment is posted using the LLM agent to explain the architectural violation.

### Phase C: Merge & Refresh
1. **Merge Trigger**: When the PR is merged into the main branch, a `push` webhook is received.
2. **Baseline Update**: The Orchestrator triggers a lightweight refresh of the dependency graph and baseline metrics in Neo4j and Postgres to reflect the new state of the main branch.

## 5. Security and Trust Boundaries
- **Ephemeral Storage**: Cloned repository data is kept only for the duration of the scan and purged immediately afterward.
- **Human-in-the-Loop**: While auto-remediation PRs are a stretch goal, they will NEVER auto-merge. A human must always review and approve architectural fixes.
- **Scoped Permissions**: The GitHub app strictly limits its permissions to reading code, reading webhooks, and writing Checks/PR comments.
