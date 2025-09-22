import Redis from "ioredis";

let client: Redis | null = null;

declare global {
    // Avoid using any on global; provide a typed __redis property
    var __redis: Redis | undefined;
}

export function getRedisClient(): Redis {
    if (client) return client;

    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        throw new Error("REDIS_URL is not set");
    }

    if ((global as unknown as { __redis?: Redis }).__redis) {
        client = (global as unknown as { __redis?: Redis }).__redis!;
    } else {
        client = new Redis(redisUrl);
        (global as unknown as { __redis?: Redis }).__redis = client;
    }

    return client;
}

export async function safeSetRateLimit(sessionId: string, ttlSeconds = 60): Promise<boolean> {
    try {
        const redis = getRedisClient();
        const key = `contact_rl:${sessionId}`;
        // Use SET with NX and EX to atomically set value if not exists
        // @ts-ignore: ioredis type overloads for 'set' with NX/EX are sometimes difficult to infer
        const result = await redis.set(key, "1", "NX", "EX", ttlSeconds);
        return result === "OK"; // OK if set, null if already exists
    } catch {
        // On error, fail open (allow) to not block users due to infra issues
        return true;
    }
}
