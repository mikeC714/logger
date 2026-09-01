import type { FastifyInstance } from "fastify";
import { HealthController } from "./health.controllers.ts";
import { HealthService } from "./health.service.ts";

export async function healthRoutes(fastify:FastifyInstance){
	const health = new HealthService(fastify.db, fastify.redis);
	const healthController = new HealthController(health);
	fastify.get("/health", healthController.healthCheck);
}


