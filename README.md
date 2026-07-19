# ArchGuard (Staff Engineer AI)

ArchGuard is an AI-powered Architecture Reviewer and CI/CD Guardian designed to act as an automated "Staff Engineer" for your codebase. It monitors repositories, reviews Pull Requests, maps architectural dependencies, and enforces organizational policies before code gets merged.

---

## 🎯 Project Aims

Modern development teams move fast, but architectural drift, technical debt, and security vulnerabilities often slip through the cracks during standard code reviews. 

ArchGuard aims to solve this by:
1. **Automating Architectural Review**: Catching structural issues, deprecated patterns, and bad practices automatically.
2. **Measuring Impact**: Providing concrete metrics on how a PR impacts Security, Technical Debt, and Infrastructure Cost.
3. **Graphing Dependencies**: Understanding the "blast radius" of a change by traversing a dependency graph of your codebase.
4. **Enforcing Policies**: Blocking PRs automatically if they violate strict rules (e.g., introducing a critical CVE, hardcoding secrets, or exceeding a debt threshold).

---

## 🏗️ Technology Stack

- **Frontend**: Next.js, React, TypeScript, standard CSS.
- **Backend**: Node.js, Express, TypeScript.
- **Relational Database**: PostgreSQL (Stores users, repositories, policies, findings).
- **Graph Database**: Neo4j (Stores the dependency graph to query affected subgraphs in milliseconds).
- **Queue/Workers**: BullMQ & Redis (For handling asynchronous repository scans and webhook events).
- **AI Integration**: Designed to use Gemini API for multi-agent LLM analysis (Security Agent, Debt Agent, Reliability Agent).

---

## 🚀 Current Stage

The project is currently in the **MVP / Demo Stage**. 

It works entirely end-to-end as a local application. We have built robust fallbacks so that the application can be showcased even if the underlying databases (PostgreSQL, Neo4j, Redis) or the AI API keys are missing. 

**Working Features:**
- **Dashboard**: Real-time stats on monitored repositories, open findings, and recent activity.
- **Repository View**: Deep dive into specific repositories showing Security Scores, Tech Debt metrics, and a conceptual UI for the architecture graph.
- **PR Analysis Modal/Page**: Triggering a "New Analysis" simulates a multi-agent AI pipeline. It outputs structured JSON deltas and findings (Security, Debt, Cost) for a given code diff.
- **Policy Engine**: A settings page to configure hard caps (e.g., Block on Critical CVE, Monthly Cost Limits) that save directly to the database.

---

## 🛠️ Recent Improvements

The repository recently underwent a major stabilization phase to ensure the frontend and backend are perfectly synced:
- **Resilient Backend**: The Express server now starts gracefully even if Redis or Neo4j are offline, allowing the HTTP API to function independently of the background workers.
- **Database Auto-Seeding**: The PostgreSQL database automatically seeds itself with realistic mock data on the first run, instantly populating the dashboard.
- **API Realignment**: The Next.js API hooks were completely rewritten to point to the correct backend endpoints (port `3001`), with robust fallback data injected if the network fails.
- **Interactive UI**: Previously static buttons ("Run Scan", "New Analysis", "Sync Metadata") were wired up to trigger real backend routes, complete with loading states, animations, and result modals.
- **TypeScript Fixes**: Realigned the module resolution between CommonJS and ESM so the backend builds and runs flawlessly out of the box.

---

## 🔮 Future Improvements

To take ArchGuard from a functioning MVP to a production-ready enterprise tool, the following improvements are planned:

### 1. Live AI Agent Integration
- Connect the mock agent responses to the real **Gemini 1.5 Pro API**.
- Implement LangChain to orchestrate the "Security", "Debt", and "Reliability" sub-agents to actually parse real ASTs and code diffs.

### 2. Live GitHub App Integration
- Wire up the `/api/webhooks/github` endpoint to a real GitHub App.
- Automatically listen for `pull_request` and `push` events to trigger real BullMQ jobs.
- Post the AI agent's findings directly back to the GitHub PR as Comments and Checks.

### 3. Dynamic Graph Traversal
- Expand the `madge`-based `GraphParser` to dynamically ingest the repository files and save the AST nodes into Neo4j in real-time.
- Render the Neo4j data directly onto the frontend canvas using D3.js or React Flow instead of a conceptual SVG.

### 4. Infrastructure & Deployment
- Dockerize the Next.js frontend and Express backend.
- Create a complete `docker-compose.yml` for 1-click deployments (including Postgres, Redis, and Neo4j).
- Deploy the system to AWS or GCP and set up a CI/CD pipeline for the ArchGuard repo itself.

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18+)
- PostgreSQL, Redis, Neo4j (Optional, app falls back to mock data if unavailable)

### Backend
\`\`\`bash
cd backend
npm install
npm run dev # Runs on http://localhost:3001
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev # Runs on http://localhost:3000
\`\`\`
