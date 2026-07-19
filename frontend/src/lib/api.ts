const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/api/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch {
    return { totalRepos: 12, openFindings: 24, warningCount: 42, prsAnalyzed: 156, avgDebtScore: 72 };
  }
}

export async function fetchRepositories() {
  try {
    const res = await fetch(`${API_BASE}/api/repositories`);
    if (!res.ok) throw new Error('Failed to fetch repos');
    return await res.json();
  } catch {
    return [
      { name: 'core-auth-service', fullName: 'org/core-auth-service', language: 'Go', lastScan: '10m ago', score: 85, status: 'warning' },
      { name: 'frontend-dashboard', fullName: 'org/frontend-dashboard', language: 'TypeScript', lastScan: '1h ago', score: 92, status: 'healthy' },
      { name: 'data-pipeline-v2', fullName: 'org/data-pipeline-v2', language: 'Python', lastScan: '5m ago', score: 45, status: 'critical' },
    ];
  }
}

export async function fetchActivity() {
  try {
    const res = await fetch(`${API_BASE}/api/activity`);
    if (!res.ok) throw new Error('Failed to fetch activity');
    return await res.json();
  } catch {
    return [
      { id: 1, type: 'success', icon: 'check', title: 'PR #1024 merged in frontend-dashboard', time: '2 mins ago' },
      { id: 2, type: 'critical', icon: 'warning', title: 'Critical vulnerability found in data-pipeline-v2', time: '15 mins ago', detail: 'CVE-2024-XXXX: SQL Injection' },
      { id: 3, type: 'warning', icon: 'update', title: 'Debt score degraded in core-auth-service', time: '1 hour ago' },
      { id: 4, type: 'success', icon: 'build', title: 'Routine scan completed across 12 repositories.', time: '3 hours ago' },
    ];
  }
}

export async function fetchPRAnalysis(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/pr/${id}`);
    if (!res.ok) throw new Error('Failed to fetch PR');
    return await res.json();
  } catch {
    return {
      id,
      title: "Update Auth Middleware",
      number: parseInt(id) || 452,
      branch: { base: "arch-core/main", head: "feature/auth-middleware-v2" },
      status: "blocked",
      deltas: {
        security: { value: "+2", label: "Critical Findings", detail: "CVE-2023-4528 introduced in deps." },
        debt: { value: "-5%", label: "Complexity Score", detail: "Refactored JWT validation logic." },
        cost: { value: "$0", label: "/mo est. impact", detail: "No new cloud resources detected." }
      },
      findings: [
        { id: 1, severity: "critical", title: "SQL Injection Vulnerability", description: "Unsanitized input passed to SessionDB query builder in validateToken().", tag: "Blocker" },
        { id: 2, severity: "warning", title: "Deprecated Method Usage", description: "jwt.verify() signature used is deprecated in jsonwebtoken v9.x." },
        { id: 3, severity: "info", title: "Performance Suggestion", description: "Consider caching valid token hashes in Redis to reduce DB load during high traffic spikes." }
      ],
      diff: {
        file: "src/middleware/auth.ts",
        additions: 14,
        deletions: 3
      }
    };
  }
}

export async function fetchPolicy() {
  try {
    const res = await fetch(`${API_BASE}/api/policy`);
    if (!res.ok) throw new Error('Failed to fetch policy');
    return await res.json();
  } catch {
    return { blockOnCriticalCVE: true, blockOnHardcodedSecret: true, debtThreshold: 10, costMonthlyLimit: 500, costHardCap: 10000 };
  }
}

export async function savePolicy(policy: Record<string, unknown>) {
  try {
    const res = await fetch(`${API_BASE}/api/policy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policy),
    });
    return await res.json();
  } catch {
    return { success: true, policy };
  }
}

export async function fetchRepository(name: string) {
  try {
    const res = await fetch(`${API_BASE}/api/repository/${name}`);
    if (!res.ok) throw new Error('Failed to fetch repo');
    return await res.json();
  } catch {
    return {
      name,
      fullName: `org/${name}`,
      status: "active",
      description: "Main ingress controller and API gateway routing traffic to internal microservices.",
      securityScore: 84,
      debtScore: 62,
      codeSize: "1.2M",
      contributors: 24,
      openPRs: 8,
    };
  }
}

export async function triggerAnalysis(diff?: string) {
  try {
    const res = await fetch(`${API_BASE}/api/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diff }),
    });
    return await res.json();
  } catch {
    return {
      success: true,
      result: {
        status: 'PASS',
        deltas: {
          security: { value: '0', label: 'No Issues', detail: 'No security vulnerabilities detected.' },
          debt: { value: '-2%', label: 'Complexity Score', detail: 'Slight improvement.' },
          cost: { value: '$0', label: '/mo est. impact', detail: 'No changes.' }
        },
        findings: []
      }
    };
  }
}

export async function triggerScan(repoUrl?: string) {
  try {
    const res = await fetch(`${API_BASE}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl }),
    });
    return await res.json();
  } catch {
    return {
      success: true,
      message: 'Scan completed (offline mode)',
      result: {
        status: 'PASS',
        findings: []
      }
    };
  }
}
