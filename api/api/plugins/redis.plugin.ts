import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";	
import fastifyRedis from "@fastify/redis";

const redisPluginOpts = {
	closeClient:true,
	url: process.env.REDIS_URL!,
	connectTimeout: 500,
	keepAlive: 20000,
	connectionName: "tlog_redis",
	enableOfflineQueue:true,
	maxRetriesPerRequest: 4,
	retryStrategy(times:number){
		const delay = Math.min(times * 10, 2000);
		return delay;
	},
}


async function redisPlugin(fastify:FastifyInstance, opts:any):Promise<any>{
		return await fastify.register(fastifyRedis, {
			...redisPluginOpts,
		});	
};

export const REDIS_PLUGIN = fp(redisPlugin, { name: "redis" });
