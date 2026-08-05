import type { FastifyInstance } from "fastify";
import { LOG_SCHEMA } from "./log.schema.ts";
import { Log } from "./log.controlllers.ts";
import { Stream } from "../../../stream/stream.ts";
import { Archive } from "../../../stream/archive.ts";
import { SocketService } from "../../../stream/ws/ws.service.ts";

export async function logRoutes(fastify:FastifyInstance){
	const socketService = new SocketService(fastify.io);
	const archive = new Archive(fastify.log, fastify.redis, fastify.io);
	const stream = new Stream(fastify.redis, fastify.io, socketService, archive);
	const logController = new Log(stream, archive, socketService);

	fastify.post("/log", { schema:LOG_SCHEMA }, logController.log);
}
