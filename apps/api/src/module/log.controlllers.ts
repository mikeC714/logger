import type { FastifyRequest, FastifyReply } from "fastify"
import type { MSG_DATA } from "../../types/msgData.d.ts";
import { SocketService } from "../../socket/ws.service.ts";


type REQ_BODY = { key:string, projectKey:string, logs:Array<MSG_DATA> }

export class Log{
	socketService:SocketService;
	constructor(socketService:SocketService){
		this.socketService = socketService;
	}

	log = async(req:FastifyRequest<{Body:REQ_BODY}>, rep:FastifyReply) => {
		const { key, projectKey, logs } = req.body;
		const body = {
			projectKey,
			logs
		};
		await this.socketService.writeToClient(key, body);
		return rep.code(201).send({ ok:true })
	};
}
