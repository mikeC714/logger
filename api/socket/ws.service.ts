import { Server } from "socket.io";
import { date } from "../utils/date.ts";
import type { MSG_DATA } from "../types/msgData.d.ts";
import type { FastifyBaseLogger } from "fastify";

export class SocketService{
	socket:Server | any;
	log:FastifyBaseLogger;
	constructor(socket:Server, log:FastifyBaseLogger){
		this.socket = socket;
		this.log = log;
	}

	public writeToClient = async(key:string, body:{projectKey:string, logs:Array<MSG_DATA>}):Promise<void> => {
		if(!key|| key === undefined){
			console.error("Failed to provide projectKey. Cannot send to room without projectKey");
			return;
		}; 
		try{
			this.socket.to(key).emit("msg", body);
		}catch(e:any){
			console.error("Failed to emit to room", key, e);
			this.log.error(`Failed to write to socket:${key}, time:${date}, error:${e.message}`);
		};
	}
};



