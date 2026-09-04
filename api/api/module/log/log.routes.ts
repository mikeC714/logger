import type { FastifyInstance } from "fastify";
import { LOG_SCHEMA } from "./log.schema.ts";
import { Log } from "./log.controlllers.ts";
import { Stream } from "../../../stream/stream.ts";
import { SocketService } from "../../../stream/ws/ws.service.ts";

export async function logRoutes(fastify:FastifyInstance){
	const socketService = new SocketService(fastify.io);

	const stream = new Stream({
		redis:fastify.redis,
		socket:fastify.io,
		socketMethods: socketService, 
	});
	const logController = new Log(stream, socketService);
	fastify.post("/log", { schema:LOG_SCHEMA } ,logController.log);
}
