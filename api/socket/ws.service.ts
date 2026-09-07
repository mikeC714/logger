import { Server } from "socket.io";
import type { MSG_DATA } from "./types/msgData.d.ts";
import type { JSON } from "../api/types/json.d.ts";


export class SocketService{
	socket:Server;
	constructor(socket:Server){
		this.socket = socket;
	}
	public writeToClient = async(body:JSON<[projectKey:string, logs:Array<MSG_DATA>]>):Promise<void> => {
		console.log("SENDING TO ROOM:",body[0], body[1])
		const [projectKey] = body;
		console.log(this.socket)
		this.socket.to(projectKey as string).emit("msg", body)	
	}
}
