import Redis from "ioredis";

export const redis:Redis = new Redis({
	port:process.env.REDIS_PORT as any,
	host:process.env.REDIS_HOST,
	password:process.env.REDIS_PASSWORD,
	retryStrategy: (times:number) => {
		const delay = Math.min(times * 10, 2000);
		return delay;
	}
});

redis.on("connect", () => process.stdout.write("Redis is currently running"));
