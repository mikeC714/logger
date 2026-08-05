export class SocketService{
	protected socket:any = null;
	constructor(socket:any){
		this.socket = socket;
	}
	
	public writeToSocket = async(projectKey:string, data:{ id:string, chunks:{}}, type:string = "log") => {
		this.socket.emit(projectKey, data, type);
	}
}
