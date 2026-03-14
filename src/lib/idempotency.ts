// In-memory idempotency cache
// For production multi-instance, replace with Redis or DB table
const idempotencyCache = new Map<string, { result: unknown; timestamp: number }>();

// TTL: 1 hour
const TTL_MS = 60 * 60 * 1000;

// Clean up expired entries periodically
function cleanup() {
    const now = Date.now();
    for (const [key, value] of idempotencyCache.entries()) {
        if (now - value.timestamp > TTL_MS) {
            idempotencyCache.delete(key);
        }
    }
}

// Run cleanup every 10 minutes
if (typeof setInterval !== "undefined") {
    setInterval(cleanup, 10 * 60 * 1000);
}

export function checkIdempotency(key: string | null): { isDuplicate: boolean; cachedResult?: unknown } {
    if (!key) return { isDuplicate: false };
    
    const cached = idempotencyCache.get(key);
    if (cached && Date.now() - cached.timestamp < TTL_MS) {
        return { isDuplicate: true, cachedResult: cached.result };
    }
    return { isDuplicate: false };
}

export function storeIdempotency(key: string | null, result: unknown) {
    if (!key) return;
    idempotencyCache.set(key, { result, timestamp: Date.now() });
}
