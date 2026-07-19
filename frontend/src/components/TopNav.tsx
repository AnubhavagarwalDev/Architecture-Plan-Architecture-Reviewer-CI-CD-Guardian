'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { triggerScan } from '../lib/api';

export default function TopNav() {
  const pathname = usePathname();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleRunScan = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const result = await triggerScan();
      setScanResult(result.success ? '✓ Scan Complete' : '✗ Scan Failed');
    } catch {
      setScanResult('✗ Scan Failed');
    } finally {
      setScanning(false);
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  return (
    <header className="topnav">
      <div className="topnav-left">
        <div className="topnav-search">
          <span className="material-symbols-outlined search-icon">search</span>
          <input type="text" placeholder="Search repositories, issues..." />
        </div>
        <div className="topnav-tabs">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>Dashboard</Link>
          <Link href="/pr" className={pathname === '/pr' ? 'active' : ''}>Pull Requests</Link>
          <Link href="/repository" className={pathname === '/repository' ? 'active' : ''}>Repositories</Link>
        </div>
      </div>
      
      <div className="topnav-right">
        <button 
          className="topnav-btn" 
          onClick={handleRunScan}
          disabled={scanning}
          style={scanResult ? { background: scanResult.includes('✓') ? 'var(--secondary)' : 'var(--critical)' } : {}}
        >
          {scanning ? (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', animation: 'spin 1s linear infinite' }}>sync</span>
              Scanning...
            </>
          ) : scanResult ? (
            scanResult
          ) : (
            'Run Scan'
          )}
        </button>
        <button className="icon-btn">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="icon-btn">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
