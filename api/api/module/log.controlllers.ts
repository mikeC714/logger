import type { FastifyRequest, FastifyReply } from "fastify"
import type { MSG_DATA } from "../../socket/types/msgData.d.ts";
import type { JSON } from "../types/json.d.ts";
import { SocketService } from "../../socket/ws.service.ts";


type REQ_BODY = JSON<[projectKey:string, logs:Array<MSG_DATA>]>

export class Log{
	socketService:SocketService;
	constructor(socketService:SocketService){
		this.socketService = socketService;
	}

	log = async(req:FastifyRequest<{Body:REQ_BODY}>, rep:FastifyReply) => {
		await this.socketService.writeToClient(req.body as REQ_BODY);
		return rep.code(201).send({ ok:true })
	};
}
