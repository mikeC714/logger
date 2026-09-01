import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";	
import fastifyRedis from "@fastify/redis";

const redisPluginOpts = {
	namespace:process.env.REDIS_NAME!,
	closeClient:true,
	url: process.env.REDIS_URL!,
	connectTimeout: 20000,
	keepAlive: 20000,
	connectionName: "tlog_redis",
	enableOfflineQueue:true,
	maxRetriesPerRequest: 4,
	retryStrategy(times:number){
		const delay = Math.min(times * 10, 2000);
		return delay;
	},
}

async function redisPlugin(fastify:FastifyInstance, opts:any){
	await fastify.register(fastifyRedis, redisPluginOpts);	
};

export const REDIS_PLUGIN = fp(redisPlugin, { name: "redis" });
