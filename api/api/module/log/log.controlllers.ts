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

	log = async(req:FastifyRequest<{Body: [projectKey:string, object[]]}>, rep:FastifyReply) => {
		//recieve log
		const data = req.body; 
		{
			//check length;
			await this.archive.checkStreamLength(data[0])
		};
		//once check is done write and process the msg
		await this.stream.writeToStream(data[0], data[1]);
		await this.stream.processMsg(data[0]);

		return rep.code(201).send({ ok:true })
	};
}
