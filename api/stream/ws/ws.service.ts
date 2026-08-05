export class SocketService{
	socket:any = null;
	constructor(socket:any){
		this.socket = socket;
	}
	
	public writeToSocket = async(projectKey:string, data:{id:string, chunks:{}}, type:string = "log") => {
		this.socket.emit("msg", JSON.stringify({type, projectKey, data}));
	}
}
