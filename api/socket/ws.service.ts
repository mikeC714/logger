import { Server } from "socket.io";
import { date } from "../utils/date.ts";
import type { MSG_DATA } from "../types/msgData.d.ts";
import type { JSON } from "../api/types/json.d.ts";
import type { FastifyBaseLogger } from "fastify";


export class SocketService{
	socket:Server;
	log:FastifyBaseLogger;
	constructor(socket:Server, log:FastifyBaseLogger){
		this.socket = socket;
		this.log = log;
	}

	public writeToClient = async(body:JSON<[projectKey:string, logs:Array<MSG_DATA>]>):Promise<void> => {
		const [projectKey, _] = body;
		if(!projectKey){
			console.error("Failed to provide projectKey. Cannot send to room without projectKey");
		}; 
		try{
			this.socket.to(projectKey as string).emit("msg", body);
		}catch(e:any){
			console.error("Failed to emit to room", projectKey, e);
			this.log.error(`Failed to write to socket:${projectKey}, time:${date}, error:${e.message}`);
		};
	}
}



