import { Queue, Worker, Job } from 'bullmq';
import { redis, isRedisAvailable } from '../db/redis';
import { OrchestratorService } from '../services/orchestrator';

let scanQueue: Queue | null = null;
let scanWorker: Worker | null = null;

function initQueue() {
  if (!redis || !isRedisAvailable) {
    console.warn('[Queue] Redis not available. Job queue disabled.');
    return;
  }

  try {
    scanQueue = new Queue('scan-jobs', {
      connection: redis,
    });

    scanWorker = new Worker(
      'scan-jobs',
      async (job: Job) => {
        console.log(`Processing job ${job.id} of type ${job.name}`);
        
        if (job.name === 'baseline-scan') {
          console.log('Running baseline scan...', job.data);
          await OrchestratorService.runBaselineScan(job.data.repoFullName, job.data.cloneUrl, job.data.installationId);
        } else if (job.name === 'diff-scan') {
          console.log('Running diff-scoped scan...', job.data);
          const cloneUrl = `https://github.com/${job.data.repoFullName}.git`;
          await OrchestratorService.runDiffScopedScan(job.data.repoFullName, job.data.prNumber, job.data.installationId, job.data.baseSha, job.data.headSha, cloneUrl);
        }
        
        return { success: true };
      },
      { connection: redis }
    );

    scanWorker.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    scanWorker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed:`, err);
    });

    console.log('[Queue] BullMQ queue and worker initialized.');
  } catch (err: any) {
    console.warn(`[Queue] Failed to initialize: ${err.message}`);
  }
}

// Try to initialize after a short delay (let Redis connect first)
setTimeout(() => {
  initQueue();
}, 2000);

export { scanQueue };
