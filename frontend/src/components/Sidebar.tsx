'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { triggerAnalysis } from '../lib/api';

export default function Sidebar() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleNewAnalysis = async () => {
    setShowModal(true);
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await triggerAnalysis();
      setAnalysisResult(result);
    } catch {
      setAnalysisResult({ success: false, error: 'Analysis failed' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>ArchGuard</h1>
          <p>STAFF ENGINEER AI</p>
        </div>

        <button 
          className="sidebar-cta" 
          onClick={handleNewAnalysis}
        >
          <span className="material-symbols-outlined">add</span>
          New Analysis
        </button>

        <nav className="sidebar-nav">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            <span className="material-symbols-outlined">dashboard</span>
            Architecture
          </Link>
          <Link href="/repository" className={pathname === '/repository' ? 'active' : ''}>
            <span className="material-symbols-outlined">source</span>
            Repositories
          </Link>
          <Link href="/pr" className={pathname === '/pr' ? 'active' : ''}>
            <span className="material-symbols-outlined">security</span>
            Security
          </Link>
          <Link href="/policy" className={pathname === '/policy' ? 'active' : ''}>
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link href="#">
            <span className="material-symbols-outlined">description</span>
            Documentation
          </Link>
          <Link href="#">
            <span className="material-symbols-outlined">support</span>
            Support
          </Link>
        </div>
      </aside>

      {/* Analysis Modal */}
      {showModal && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => { if (!analyzing) setShowModal(false); }}
        >
          <div 
            style={{
              background: 'var(--surface-1)', borderRadius: '12px',
              padding: '32px', width: '480px', maxWidth: '90vw',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--primary)' }}>
                {analyzing ? 'sync' : analysisResult?.success ? 'check_circle' : 'error'}
              </span>
              <h2 className="text-headline-md" style={{ margin: 0 }}>
                {analyzing ? 'Running Analysis...' : analysisResult?.success ? 'Analysis Complete' : 'Analysis Failed'}
              </h2>
            </div>

            {analyzing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="text-body-sm color-info">Running multi-agent analysis pipeline...</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="text-label-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)', animation: 'spin 1s linear infinite' }}>sync</span>
                    Security Agent — analyzing for vulnerabilities
                  </div>
                  <div className="text-label-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)', animation: 'spin 1s linear infinite' }}>sync</span>
                    Debt Agent — computing complexity deltas
                  </div>
                  <div className="text-label-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)', animation: 'spin 1s linear infinite' }}>sync</span>
                    Reliability Agent — checking for regressions
                  </div>
                </div>
              </div>
            )}

            {!analyzing && analysisResult?.success && analysisResult.result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: '8px', padding: '12px', borderLeft: '3px solid var(--primary)' }}>
                    <div className="text-label-sm color-info uppercase" style={{ marginBottom: '4px' }}>Status</div>
                    <div className="text-label-md" style={{ 
                      color: analysisResult.result.status === 'BLOCK' ? 'var(--critical)' : 
                             analysisResult.result.status === 'WARN' ? 'var(--warning)' : 'var(--secondary)' 
                    }}>
                      {analysisResult.result.status}
                    </div>
                  </div>
                  <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: '8px', padding: '12px', borderLeft: '3px solid var(--secondary)' }}>
                    <div className="text-label-sm color-info uppercase" style={{ marginBottom: '4px' }}>Security</div>
                    <div className="text-label-md">{analysisResult.result.deltas?.security?.value || '0'}</div>
                  </div>
                  <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: '8px', padding: '12px', borderLeft: '3px solid var(--warning)' }}>
                    <div className="text-label-sm color-info uppercase" style={{ marginBottom: '4px' }}>Debt</div>
                    <div className="text-label-md">{analysisResult.result.deltas?.debt?.value || '0%'}</div>
                  </div>
                </div>

                {analysisResult.result.findings && analysisResult.result.findings.length > 0 && (
                  <div>
                    <div className="text-label-sm color-info uppercase" style={{ marginBottom: '8px' }}>Findings</div>
                    {analysisResult.result.findings.map((f: any, i: number) => (
                      <div key={i} style={{ 
                        padding: '8px 12px', marginBottom: '4px', borderRadius: '4px',
                        background: f.severity === 'critical' ? 'var(--error-container)' : 'var(--surface-2)',
                        borderLeft: `3px solid ${f.severity === 'critical' ? 'var(--critical)' : f.severity === 'warning' ? 'var(--warning)' : 'var(--secondary)'}`,
                      }}>
                        <div className="text-label-sm fw-bold">{f.title}</div>
                        <div className="text-body-sm color-info">{f.description}</div>
                      </div>
                    ))}
                  </div>
                )}

                <Link 
                  href="/pr" 
                  className="btn-primary" 
                  style={{ textAlign: 'center', display: 'block' }}
                  onClick={() => setShowModal(false)}
                >
                  View Full Analysis →
                </Link>
              </div>
            )}

            {!analyzing && (
              <button 
                className="btn-secondary" 
                onClick={() => setShowModal(false)}
                style={{ marginTop: '16px', width: '100%' }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
