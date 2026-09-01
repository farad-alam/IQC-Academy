import { Redis } from '@upstash/redis';

// Only instantiate if credentials are provided
let redis;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const SITE_LIVE_KEY = 'iqc:site_is_live';
const SITE_LIVE_TTL = 120; // 2 minutes TTL in Redis

/**
 * Get site-live status from Redis cache.
 * Returns true (live) if Redis is unavailable (fail-open).
 * @returns {Promise<boolean>}
 */
export async function getSiteLiveFromCache() {
  if (!redis) return true; // fail-open if Redis not configured
  try {
    const cached = await redis.get(SITE_LIVE_KEY);
    if (cached === null) return true; // key missing → default to live
    return cached === 'true' || cached === true;
  } catch {
    return true; // fail-open on Redis error
  }
}

/**
 * Write the site-live status to Redis cache.
 * Called whenever the admin updates the setting.
 * @param {boolean} isLive
 */
export async function setSiteLiveCache(isLive) {
  if (!redis) return;
  try {
    await redis.set(SITE_LIVE_KEY, String(isLive), { ex: SITE_LIVE_TTL });
  } catch {
    // Non-critical — DB is the source of truth
    console.error('[REDIS] Failed to set site-live cache');
  }
}
