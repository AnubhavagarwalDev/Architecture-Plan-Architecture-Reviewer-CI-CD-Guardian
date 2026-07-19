import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], credentials: true }));
app.use(express.json());

import { webhookRouter } from './routes/webhooks';
import { apiRouter } from './routes/api';
import { pool } from './db/postgres';

// Routes
app.use('/api/webhooks', webhookRouter);
app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'architecture-reviewer-backend' });
});

const initDb = async () => {
  // Create all required tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS baselines (
      repo VARCHAR(255) PRIMARY KEY,
      findings JSONB NOT NULL DEFAULT '[]',
      scanned_at TIMESTAMP NOT NULL DEFAULT NOW(),
      score INTEGER DEFAULT 100,
      language VARCHAR(50) DEFAULT 'TypeScript'
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS activity (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50),
      icon VARCHAR(50),
      title VARCHAR(500),
      detail TEXT,
      repo VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS policy (
      id INTEGER PRIMARY KEY,
      config JSONB
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS prs (
      id VARCHAR(50) PRIMARY KEY,
      data JSONB
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS repositories (
      name VARCHAR(255) PRIMARY KEY,
      data JSONB
    );
  `);

  // Auto-seed if empty
  const { rows: baselineRows } = await pool.query('SELECT COUNT(*) as count FROM baselines');
  if (parseInt(baselineRows[0]?.count) === 0) {
    console.log('[DB] Seeding default data...');
    
    await pool.query(`
      INSERT INTO baselines (repo, findings, scanned_at, score, language) VALUES 
      ('org/core-auth-service', '[]', NOW() - INTERVAL '10 minutes', 85, 'Go'),
      ('org/frontend-dashboard', '[]', NOW() - INTERVAL '1 hour', 92, 'TypeScript'),
      ('org/data-pipeline-v2', '[]', NOW() - INTERVAL '5 minutes', 45, 'Python')
      ON CONFLICT (repo) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO activity (type, icon, title, detail, repo, created_at) VALUES 
      ('success', 'check', 'PR #1024 merged in frontend-dashboard', NULL, 'frontend-dashboard', NOW() - INTERVAL '2 minutes'),
      ('critical', 'warning', 'Critical vulnerability found in data-pipeline-v2', 'CVE-2024-XXXX: SQL Injection', 'data-pipeline-v2', NOW() - INTERVAL '15 minutes'),
      ('warning', 'update', 'Debt score degraded in core-auth-service', NULL, 'core-auth-service', NOW() - INTERVAL '1 hour'),
      ('success', 'build', 'Routine scan completed across 12 repositories.', NULL, NULL, NOW() - INTERVAL '3 hours')
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO policy (id, config) VALUES (1, '{"blockOnCriticalCVE": true, "blockOnHardcodedSecret": true, "debtThreshold": 10, "costMonthlyLimit": 500, "costHardCap": 10000}')
      ON CONFLICT (id) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO prs (id, data) VALUES ('452', '${JSON.stringify({
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
      }).replace(/'/g, "''")}')
      ON CONFLICT (id) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO repositories (name, data) VALUES ('cloud-gateway', '${JSON.stringify({
        name: "cloud-gateway",
        fullName: "org/cloud-gateway",
        status: "active",
        description: "Main ingress controller and API gateway routing traffic to internal microservices.",
        securityScore: 84,
        debtScore: 62,
        codeSize: "1.2M",
        contributors: 24,
        openPRs: 8
      }).replace(/'/g, "''")}')
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log('[DB] Default data seeded successfully.');
  }
};

initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  // Still start server even if DB init fails
  app.listen(port, () => {
    console.log(`Server started on port ${port} (DB init failed, using fallbacks)`);
  });
});
