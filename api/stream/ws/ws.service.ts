import { Server } from "socket.io";


export class SocketService{
	socket:Server;
	constructor(socket:Server){
		this.socket = socket;
	}
	
	public writeToSocket = async(projectKey:string, log:{id:string, chunks:{}}, type:string) => {
		switch(type){
			case "archive":
				this.socket.emit("archive", JSON.stringify({ projectKey, log }));
			break;
	
			/**
			 * {
			 *  projectKey:string,
			 *  log: {
			 *		id: {lvl, msg, meta}
			 *  }
			 * }
			* */

			case "live":
				this.socket.emit("live", JSON.stringify({ projectKey, log }));
			break;
		}
	}
}
