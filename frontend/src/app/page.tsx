'use client';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { useDashboard } from '../hooks/useDashboard';
import { useRepositories } from '../hooks/useRepositories';

export default function Dashboard() {
  const { stats, activities, isLoading: dashboardLoading, error: dashboardError } = useDashboard();
  const { repos, isLoading: reposLoading, error: reposError } = useRepositories();

  if (dashboardLoading || reposLoading) {
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

  if (dashboardError || reposError) {
    return (
      <div className="app-shell">
        <Sidebar />
        <TopNav />
        <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="text-headline-md color-critical">Error loading dashboard</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <TopNav />
      <main className="main-content">
        <div className="dashboard-layout">
          <div className="dashboard-main">
            <h2 className="text-headline-md" style={{ marginBottom: '24px' }}>Overview</h2>
            
            <div className="metric-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label text-label-sm uppercase">Total Repos</span>
                  <span className="material-symbols-outlined">source</span>
                </div>
                <div className="text-headline-lg">{stats?.totalRepos ?? '-'}</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label text-label-sm uppercase">Open Findings</span>
                  <span className="material-symbols-outlined">bug_report</span>
                </div>
                <div className="text-headline-lg color-warning">{stats?.openFindings ?? '-'}</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label text-label-sm uppercase">PRs Analyzed</span>
                  <span className="material-symbols-outlined">merge</span>
                </div>
                <div className="text-headline-lg">{stats?.prsAnalyzed ?? '-'}</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label text-label-sm uppercase">Avg Debt Score</span>
                  <span className="material-symbols-outlined">monitoring</span>
                </div>
                <div className="text-headline-lg">{stats?.avgDebtScore ?? '-'}</div>
              </div>
            </div>

            <h2 className="text-headline-md" style={{ marginBottom: '24px' }}>Monitored Repositories</h2>
            <div className="repo-grid">
              {repos.map(repo => (
                <div key={repo.name} className="repo-card">
                  <div className="repo-card-header">
                    <h3 className="text-label-md">{repo.name}</h3>
                    <span className="lang-badge">{repo.language}</span>
                  </div>
                  <div className="text-body-sm color-info" style={{ marginBottom: '16px' }}>{repo.fullName}</div>
                  
                  <div className="repo-card-body">
                    <div className="repo-scan-info">
                      <span className="text-label-sm color-info uppercase">Last Scan</span>
                      <span className="text-body-sm fw-semi">{repo.lastScan}</span>
                    </div>
                    
                    <div className="score-ring">
                      <svg viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="var(--surface-container-high)"
                          strokeWidth="4"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={repo.score > 80 ? 'var(--secondary)' : repo.score > 50 ? 'var(--warning)' : 'var(--critical)'}
                          strokeWidth="4"
                          strokeDasharray={`${repo.score}, 100`}
                        />
                      </svg>
                      <span className="score-value" style={{ color: repo.score > 80 ? 'var(--secondary)' : repo.score > 50 ? 'var(--warning)' : 'var(--critical)'}}>
                        {repo.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="activity-sidebar">
            <h3 className="text-label-md uppercase tracking-wide color-info" style={{ marginBottom: '8px' }}>Recent Activity</h3>
            <div className="timeline">
              {activities.map(activity => (
                <div key={activity.id} className="timeline-item">
                  <div className={`timeline-dot ${activity.type}`}>
                    <span className="material-symbols-outlined color-on-surface">{activity.icon}</span>
                  </div>
                  <div className="text-body-sm fw-semi">{activity.title}</div>
                  {activity.detail && <div className="cve-badge text-code-sm fw-bold">{activity.detail}</div>}
                  <div className="text-body-sm color-info" style={{ marginTop: '4px' }}>{activity.time}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
