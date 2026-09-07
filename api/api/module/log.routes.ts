import type { FastifyInstance } from "fastify";
import { LOG_SCHEMA } from "./log.schema.ts";
import { Log } from "./log.controlllers.ts";
import { SocketService } from "../../socket/ws.service.ts";

export async function logRoutes(fastify:FastifyInstance){
	const socketService = new SocketService(fastify.io);
	const logController = new Log(socketService);

	fastify.post("/log", { schema:LOG_SCHEMA } ,logController.log);
}
