const rateLimit = new Map();

/**
 * Validates the rate limit for a given key (e.g. IP address or Email).
 * @param {string} key - Unique key to limit.
 * @param {number} limit - Max requests allowed.
 * @param {number} windowMs - Time window in milliseconds.
 * @returns {boolean} - true if request is allowed, false if blocked.
 */
export function checkRateLimit(key, limit, windowMs) {
    const now = Date.now();
    const record = rateLimit.get(key);

    if (!record) {
        rateLimit.set(key, { count: 1, startTime: now });
        return true;
    }

    if (now - record.startTime > windowMs) {
        // Reset window
        rateLimit.set(key, { count: 1, startTime: now });
        return true;
    }

    record.count += 1;

    if (record.count > limit) {
        return false;
    }

    return true;
}

// Optional: Cleanup old records periodically to prevent memory leak
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimit.entries()) {
        if (now - record.startTime > 3600000) { // Clean up after 1 hour
            rateLimit.delete(key);
        }
    }
}, 3600000); // Run every hour
