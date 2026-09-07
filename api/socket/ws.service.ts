import { Server } from "socket.io";
import type { MSG_DATA } from "./types/msgData.d.ts";
import type { JSON } from "../api/types/json.d.ts";


export class SocketService{
	socket:Server;
	constructor(socket:Server){
		this.socket = socket;
	}

	public writeToClient = async(body:JSON<[projectKey:string, logs:Array<MSG_DATA>]>):Promise<any> => {
		const [projectKey, logs] = body;
		if(!projectKey){
			console.error("Failed to provide projectKey. Cannot send to room without projectKey");
		}; 
		try{
			this.socket.to(projectKey as string).emit("msg", body);
		}catch(e){
			console.error("Failed to emit to room", projectKey, e)
		};
	}
}



