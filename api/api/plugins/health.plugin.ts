import { callHealthCheck } from "../../lib/healthInterval.ts";
import type { FastifyInstance } from "fastify";

export async function CHECK_HEALTH_INTERVAL(fastify:FastifyInstance, opts:any = {}){
	let ALIVE = true;
	const appKey = process.env.APP_KEY;
	// encrypt appKey
	let machine = process.env.LOG_MACHINE;

	while(ALIVE){
		callHealthCheck(machine! value, appKey!, fastify);
	}

	fastify.addHook("onClose", async() => {
		ALIVE = false;
	})
};

