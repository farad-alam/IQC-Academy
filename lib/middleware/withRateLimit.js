import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only instantiate if credentials are provided (prevents build errors if empty in dev)
let redis;
let ratelimit;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
    analytics: true,
  });
}

export const checkRateLimit = async (identifier) => {
  if (!ratelimit) return { success: true }; // Bypass if not configured
  
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
  return { success, limit, reset, remaining };
};
