export const REDIS_PLUGIN = {
	namespace:process.env.REDIS_NAME,
	closeClient:true,
	url: process.env.REDIS_URL,
	connectTimeout: 10000,
	keepAlive: 20000,
	connectionName: "tlog_redis",
	enableOfflineQueue:true,
	maxRetryPerRequest: 4,
	retryStrategy(times:number){
		const delay = Math.min(times * 10, 2000);
		return delay;
	},
}
