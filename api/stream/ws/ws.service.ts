import { Server } from "socket.io";


export class SocketService{
	socket:Server;
	constructor(socket:Server){
		this.socket = socket;
	}
	public writeToSocket = async(projectKey:string, log:{id:string, chunks:{}}) => {
			this.socket.emit("msg", (fn:(msg:boolean) => boolean) => fn(true));
			this.socket.emit("msgAck", JSON.stringify({ projectKey, log }));
	}
}
