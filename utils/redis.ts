import Redis from "ioredis";

// Create a Redis instance.
// By default, it will connect to localhost:6379.
// We are going to cover how to specify connection options soon.
const redisUri = process.env.REDIS_URI || "redis://localhost:6379";

const redis = new Redis(redisUri);
export default redis;
