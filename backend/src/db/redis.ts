import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let redis: Redis | null = null;
let isRedisAvailable = false;

try {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    retryStrategy(times) {
      if (times > 3) {
        console.warn('[Redis] Max retries reached. Redis features will be disabled.');
        return null; // Stop retrying
      }
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  redis.on('error', (err) => {
    if (isRedisAvailable) {
      console.error('Redis connection error:', err.message);
    }
    isRedisAvailable = false;
  });

  redis.on('connect', () => {
    isRedisAvailable = true;
    console.log('Connected to Redis');
  });

  // Try connecting but don't crash if it fails
  redis.connect().catch((err) => {
    console.warn(`[Redis] Could not connect: ${err.message}. Queue features disabled.`);
    isRedisAvailable = false;
  });
} catch (err: any) {
  console.warn(`[Redis] Failed to initialize: ${err.message}`);
}

export { redis, isRedisAvailable };
