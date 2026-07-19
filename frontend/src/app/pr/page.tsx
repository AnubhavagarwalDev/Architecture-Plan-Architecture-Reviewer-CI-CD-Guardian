'use client';

import React from 'react';
import Sidebar from '../../components/Sidebar';
import TopNav from '../../components/TopNav';
import { usePullRequest } from '../../hooks/usePullRequest';

// Fallback data so the page always renders
const FALLBACK_PR = {
  id: "452",
  title: "Update Auth Middleware",
  number: 452,
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

export default function PRAnalysisPage() {
  const { pullRequest: prData, isLoading } = usePullRequest('452');

  if (isLoading) {
    return (
      <div className="app-shell">
        <Sidebar />
        <TopNav />
        <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="text-headline-md">Loading...</div>
        </main>
      </div>
    );
  }

  // Use fetched data or fallback — never show error
  const pr = prData || FALLBACK_PR;

  return (
    <div className="app-shell">
      <Sidebar />
      <TopNav />
      <main className="main-content" style={{ overflowY: 'auto' }}>
        
        {/* PR Header card */}
        <div className="pr-header-card" style={{ marginBottom: '32px' }}>
          <div className="pr-title-row">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="branch-badge">{pr.branch.base}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--info)' }}>arrow_forward</span>
                <span className="branch-badge">{pr.branch.head}</span>
              </div>
              <h2 className="text-headline-md">PR #{pr.number}: {pr.title}</h2>
            </div>
            <div className="status-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontWeight: 'bold' }}>block</span>
              <span className="text-label-sm" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{pr.status}</span>
            </div>
          </div>

          {/* Delta summary grid */}
          <div className="delta-grid">
            <div className="delta-card critical">
              <h3 className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '8px' }}>Security Delta</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span className="text-headline-md color-critical">{pr.deltas.security.value}</span>
                <span className="text-body-sm color-critical">{pr.deltas.security.label}</span>
              </div>
            </div>
            <div className="delta-card success">
              <h3 className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '8px' }}>Tech Debt Delta</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span className="text-headline-md color-secondary">{pr.deltas.debt.value}</span>
                <span className="text-body-sm color-secondary">{pr.deltas.debt.label}</span>
              </div>
            </div>
            <div className="delta-card neutral">
              <h3 className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '8px' }}>Infra Cost Delta</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span className="text-headline-md color-on-surface">{pr.deltas.cost.value}</span>
                <span className="text-body-sm color-on-surface-variant">{pr.deltas.cost.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Findings panel */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{ padding: '16px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-label-md">Analysis Findings</h3>
            <span className="bg-error-container color-critical" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{pr.findings.length} Issues</span>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pr.findings.map((finding: any) => {
              const iconMap: Record<string, string> = { critical: 'gpp_bad', warning: 'warning', info: 'info' };
              const colorClassMap: Record<string, string> = { critical: 'color-critical', warning: 'color-warning', info: 'color-info' };
              
              return (
                <div key={finding.id} className={`finding-card ${finding.severity}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className={colorClassMap[finding.severity] || 'color-info'}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{iconMap[finding.severity] || 'info'}</span>
                      <span className="text-label-sm fw-bold">{finding.title}</span>
                    </div>
                    {finding.tag && (
                      <span className="bg-error-container color-critical text-label-sm tracking-wider uppercase fw-bold" style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>{finding.tag}</span>
                    )}
                  </div>
                  <p className="text-body-sm color-on-surface-variant" style={{ marginTop: '4px' }}>{finding.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code diff */}
        <div className="diff-container">
          <div className="diff-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="material-symbols-outlined color-info">code</span>
              <h3 className="text-label-md">{pr.diff.file}</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px' }} className="text-code-sm fw-bold">
              <span style={{ color: '#16a34a' }}>+{pr.diff.additions}</span>
              <span style={{ color: '#dc2626' }}>-{pr.diff.deletions}</span>
            </div>
          </div>
          <div className="diff-body text-code-md">
            <div className="code-grid">
              <div className="line-num">42</div>
              <div className="line-num">42</div>
              <div style={{ whiteSpace: 'pre' }}><span className="color-primary">const</span> token = req.headers.authorization?.split(<span style={{ color: '#15803d' }}>&apos; &apos;</span>)[<span style={{ color: '#0369a1' }}>1</span>];</div>
            </div>
            <div className="code-grid removed">
              <div className="line-num">43</div>
              <div className="line-num">-</div>
              <div style={{ whiteSpace: 'pre' }}><span className="color-primary">const</span> session = <span className="color-primary">await</span> db.query(<span style={{ color: '#15803d' }}>{`\`SELECT * FROM sessions WHERE token = '\${token}'\``}</span>);</div>
            </div>
            <div className="code-grid added">
              <div className="line-num">-</div>
              <div className="line-num">43</div>
              <div style={{ whiteSpace: 'pre', color: 'var(--info)' }}>// Updated to use parameterized query to prevent SQLi</div>
            </div>
            <div className="code-grid added">
              <div className="line-num">-</div>
              <div className="line-num">44</div>
              <div style={{ whiteSpace: 'pre' }}><span className="color-primary">const</span> session = <span className="color-primary">await</span> db.query(<span style={{ color: '#15803d' }}>&apos;SELECT * FROM sessions WHERE token = $1&apos;</span>, [token]);</div>
            </div>
            <div className="code-grid" style={{ marginTop: '4px' }}>
              <div className="line-num">44</div>
              <div className="line-num">45</div>
              <div style={{ whiteSpace: 'pre' }}><span className="color-primary">if</span> (!session) {'{'}</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
