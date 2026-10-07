import { callHealthCheck } from "../../lib/healthInterval.ts";
import type { FastifyInstance } from "fastify";

export async function CHECK_HEALTH_INTERVAL(fastify:FastifyInstance, opts:any = {}){
	let ALIVE = true;
	const SECRET = process.env.MACHINE_SECRET;
	let machines = process.env.MACHINES;
	machines = JSON.parse(machines!);

	while(ALIVE){
		for(const [key, value] of Object.entries(machines!)){
			callHealthCheck(key, value, SECRET!, fastify);
		};
	}

	fastify.addHook("onClose", async() => {
		ALIVE = false;
	})
};

