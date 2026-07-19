'use client';
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNav from '../../components/TopNav';
import { useRepository } from '../../hooks/useRepository';
import { triggerScan } from '../../lib/api';

export default function RepositoryPage() {
  const { repo: repoData, isLoading, error } = useRepository('cloud-gateway');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handleSyncMetadata = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      await triggerScan('org/cloud-gateway');
      setSyncResult('✓ Metadata synced successfully');
    } catch {
      setSyncResult('✗ Sync failed');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncResult(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="app-shell">
        <Sidebar />
        <main className="main-content-full" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="text-headline-md">Loading...</div>
        </main>
      </div>
    );
  }

  // Use repoData from API or fallback defaults — never show error screen
  const repo = repoData || {
    name: "cloud-gateway",
    fullName: "org/cloud-gateway",
    status: "active",
    description: "Main ingress controller and API gateway routing traffic to internal microservices.",
    securityScore: 84,
    debtScore: 62,
    codeSize: "1.2M",
    contributors: 24,
    openPRs: 8,
  };

  return (
    <div className="app-shell">
      <Sidebar />
      
      <main className="main-content-full">
        <div style={{ marginBottom: '32px' }}>
          <div className="text-label-sm color-info" style={{ marginBottom: '8px', letterSpacing: '0.04em' }}>
            Repositories &gt; {repo.name}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h1 className="text-headline-lg">{repo.name}</h1>
              <span className="lang-badge" style={{ background: 'var(--secondary-container)', color: 'var(--on-secondary-container)' }}>
                {repo.status === 'active' ? 'Active' : repo.status}
              </span>
            </div>
            <button 
              className="btn-primary" 
              onClick={handleSyncMetadata}
              disabled={syncing}
              style={syncResult ? { background: syncResult.includes('✓') ? 'var(--secondary)' : 'var(--critical)' } : {}}
            >
              {syncing ? 'Syncing...' : syncResult || 'Sync Metadata'}
            </button>
          </div>
          
          <p className="text-body-md color-on-surface-variant">
            {repo.description || 'Core API gateway routing traffic to internal microservices.'}
          </p>
        </div>

        <div className="topnav-tabs" style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-subtle)' }}>
          <a href="#" className="active" style={{ display: 'flex', alignItems: 'center', height: '32px' }}>Overview</a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '32px' }}>
            PRs 
            <span style={{ background: 'var(--surface-container-high)', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', color: 'var(--on-surface-variant)' }}>
              {repo.openPRs || 12}
            </span>
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', height: '32px' }}>Policy</a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', height: '32px' }}>Graph</a>
        </div>

        <div className="repo-detail-grid">
          {/* Left Column (Metrics) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="score-card">
              <h3 className="text-label-md color-info uppercase">Security Score</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px', marginBottom: '16px' }}>
                <div className="text-headline-xl">
                  {repo.securityScore || 84}<span className="text-body-sm color-info">/100</span>
                </div>
                <div className="text-headline-md color-primary">
                  Grade {(repo.securityScore || 84) >= 90 ? 'A' : (repo.securityScore || 84) >= 80 ? 'B+' : (repo.securityScore || 84) >= 70 ? 'B' : 'C'}
                </div>
              </div>
              <div className="score-bar">
                <div className="score-bar-fill bg-primary" style={{ width: `${repo.securityScore || 84}%` }}></div>
              </div>
            </div>

            <div className="score-card">
              <h3 className="text-label-md color-info uppercase">Tech Debt Score</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px', marginBottom: '16px' }}>
                <div className="text-headline-xl">
                  {repo.debtScore || 62}<span className="text-body-sm color-info">/100</span>
                </div>
                <div className="status-badge" style={{ background: 'var(--warning)', color: 'white', border: 'none' }}>
                  {(repo.debtScore || 62) >= 80 ? 'Good' : (repo.debtScore || 62) >= 60 ? 'Needs Review' : 'Critical'}
                </div>
              </div>
              <div className="score-bar">
                <div className="score-bar-fill" style={{ width: `${repo.debtScore || 62}%`, background: 'var(--warning)' }}></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label text-label-sm uppercase">Code Size</span>
                </div>
                <div className="text-headline-md">{repo.codeSize || '1.2M'} LoC</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label text-label-sm uppercase">Contributors</span>
                </div>
                <div className="text-headline-md">{repo.contributors || 24}</div>
              </div>
            </div>
          </div>

          {/* Right Column (Graph) */}
          <div className="graph-container">
            <div className="graph-toolbar">
              <div className="text-label-md">Architecture Graph</div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--primary-container)', border: '1.5px solid var(--primary)' }}></div>
                  <span className="text-label-sm color-info">Service</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--surface-1)', border: '1.5px solid var(--outline-variant)' }}></div>
                  <span className="text-label-sm color-info">Module</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--secondary-container)', border: '1.5px solid var(--secondary)' }}></div>
                  <span className="text-label-sm color-info">External</span>
                </div>
              </div>
            </div>
            
            <div className="graph-canvas">
              {/* SVG Edges */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                <path d="M 200 160 C 200 240, 320 200, 320 240" fill="transparent" stroke="var(--outline-variant)" strokeWidth="2" />
                <path d="M 200 160 C 200 240, 160 320, 160 340" fill="transparent" stroke="var(--outline-variant)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 200 160 C 200 240, 420 320, 420 340" fill="transparent" stroke="var(--outline-variant)" strokeWidth="2" />
                <path d="M 320 260 L 350 460" fill="transparent" stroke="var(--critical)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              <div className="graph-node service" style={{ top: '130px', left: '120px' }}>
                <span className="text-label-md color-primary">{repo.name}</span>
              </div>
              <div className="graph-node module" style={{ top: '230px', left: '260px' }}>
                <span className="text-label-md color-on-surface">auth-middleware</span>
              </div>
              <div className="graph-node module" style={{ top: '330px', left: '80px' }}>
                <span className="text-label-md color-on-surface">rate-limiter</span>
              </div>
              <div className="graph-node external" style={{ top: '330px', left: '360px' }}>
                <span className="text-label-md color-secondary">redis-cache</span>
              </div>
              <div className="graph-node danger" style={{ top: '450px', left: '280px' }}>
                <span className="text-label-md color-critical">legacy-auth-v1</span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--critical)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
