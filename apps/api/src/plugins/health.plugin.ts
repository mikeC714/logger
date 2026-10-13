import { callHealthCheck } from "../../lib/healthCheck.ts";
import { fastifyNodeCron } from "@node-cron/fastify";
import type { FastifyInstance } from "fastify";

export async function CHECK_HEALTH_INTERVAL(fastify:FastifyInstance, opts:any = {}){
	const appKey = process.env.APP_KEY;
	let machine = process.env.LOG_MACHINE;
	
	await fastify.register(fastifyNodeCron, {
		tasks:[
			{
				name:"health-check",
				cron:"*/5 * * * *",
				run: async () => callHealthCheck(machine!, appKey!, fastify)
			}
		]
	});
};


