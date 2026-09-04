import type { FastifyRequest, FastifyReply } from "fastify"
import { Stream } from "../../../stream/stream.ts";
import { SocketService } from "../../../stream/ws/ws.service.ts";


export class Log{
	stream:Stream;
	socketService:SocketService;
	constructor(stream:Stream, socketService:SocketService){
		this.stream = stream;
		this.socketService = socketService;
	}

	log = async(req:FastifyRequest<{Body: [projectKey:string, object[]]}>, rep:FastifyReply) => {
		const data = req.body; 
		
		try{
			await this.stream.createGroup(data[0]);
		}catch(e:any){
			if(!e.message.includes("BUSYGROUP")) throw e;	
		}

		const write = await this.stream.writeToStream(data[0], data[1]);
		console.log("WROTE TO STREAM", write);
		const msg = await this.stream.processMsg(data[0]);
		console.log("PROCESSING MSG", msg);
		return rep.code(201).send({ ok:true })
	};
}
