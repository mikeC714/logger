import { RedisClient } from "bun";

export const redis = new RedisClient(`redis://${process.env.REDIS_SERVER}`,{
	autoReconnect:true,
	enableOfflineQueue:true,
	// TODO
		// LOOK MORE INTO TLS
});
await redis.connect(); 

