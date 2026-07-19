# Tech Stack: Architecture Reviewer + CI/CD Guardian

This document defines the technology stack for the MVP and future iterations of the Architecture Reviewer system. The stack is chosen for speed of development, strong ecosystem support for graph traversal, and ease of GitHub integration.

## 1. Backend & Orchestration
- **Primary Language**: **TypeScript (Node.js)**.
- **Web Framework**: **Express**.
- **AI/LLM Agent Framework**: **LangChain.js** or custom LLM integrations with Claude API (for structured outputs).
- **GitHub Integration**: **Octokit** for verifying webhooks, querying PR diffs, and updating the Checks API.

## 2. Databases & Storage
- **Relational Database**: **PostgreSQL**.
  - *Usage*: Stores user accounts, GitHub App installation tokens, repository metadata, policy configurations (e.g., threshold limits), and historical finding records.
- **Graph Database**: **Neo4j**.
  - *Usage*: Stores the dependency graph. This is the core differentiator of the product. It allows the system to run cypher queries to find the "affected subgraph" of a PR diff in milliseconds.
- **Queue/Cache**: **Redis**.
  - *Usage*: Job queue management (with **Celery** or **RQ** in Python, or **BullMQ** in Node.js). Handles asynchronous processing of baseline scans and diff-scoped analyses off the critical web request path.

## 3. Frontend (Dashboard)
- **Framework**: **Next.js** (App Router) + **TypeScript**.
- **Styling**: **Tailwind CSS** or Vanilla CSS (depending on aesthetic goals), ensuring a modern, premium dark-mode look.
- **Graph Visualization**: **React Flow** (or D3.js).
  - *Usage*: To render the interactive dependency graph. Users can click on nodes (files/modules) and see their historical technical debt score and security status.

## 4. Static Analysis Tools (The "Scanners")
These tools are orchestrated by the backend and run against the cloned repositories:
- **Security & Vulnerabilities**:
  - **Semgrep**: For fast, pattern-based SAST (Static Application Security Testing).
  - **Gitleaks**: For detecting hardcoded secrets and API keys.
  - **OSV.dev API**: For looking up CVEs against parsed dependency manifests (`package.json`, `requirements.txt`).
- **Code Quality & Debt**:
  - **Radon** or **Lizard**: For cyclomatic complexity calculation.
  - **Madge**: For generating JS/TS dependency trees (if parsing JS/TS).
  - **Git CLI**: For calculating "code churn" (`git log` frequency on specific files).

## 5. Deployment & Infrastructure (MVP)
- **Hosting**: Render, Railway, or Heroku (PaaS) to avoid managing Kubernetes early on.
- **Ephemeral Storage**: AWS S3 or Cloudflare R2 for storing temporary repository clones if local disk space is a constraint during parallel baseline scans.

## 6. Development Tools
- **Webhook Testing**: `smee.io` or `ngrok` for forwarding GitHub webhook payloads to the local development environment.
- **Local Env**: `docker-compose` to spin up Postgres, Neo4j, and Redis locally with one command.
