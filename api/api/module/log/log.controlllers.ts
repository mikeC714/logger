import type { FastifyRequest, FastifyReply } from "fastify"
import { Stream } from "../../../stream/stream.ts";
import { Archive } from "../../../stream/archive.ts";
import { SocketService } from "../../../stream/ws/ws.service.ts";


export class Log{
	stream:Stream;
	archive:Archive;
	socketService:SocketService;
	constructor(stream:Stream, archive:Archive, socketService:SocketService){
		this.stream = stream;
		this.socketService = socketService;
		this.archive = archive;
	}

	log = async(req:FastifyRequest, rep:FastifyReply) => {
		

		rep.code(200).send({ ok:true })
	}

}
