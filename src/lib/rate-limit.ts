/**
 * Simple in-memory rate limiter for development
 * In production, consider using Upstash Redis or similar
 */

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(identifier: string): Promise<boolean> {
    const now = Date.now();
    const limit = 20; // requests
    const window = 10000; // 10 seconds in ms

    const record = requestCounts.get(identifier);

    if (!record || now > record.resetTime) {
        // New window
        requestCounts.set(identifier, {
            count: 1,
            resetTime: now + window,
        });
        return true;
    }

    if (record.count >= limit) {
        return false; // Rate limit exceeded
    }

    // Increment count
    record.count++;
    return true;
}
