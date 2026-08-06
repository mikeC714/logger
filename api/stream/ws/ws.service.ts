export class SocketService{
	socket:any = null;
	constructor(socket:any){
		this.socket = socket;
	}
	
	public writeToSocket = async(projectKey:string, log:{id:string, chunks:{}}, type:string) => {
		/*
		 * {
		 *  "projectKey",
		 *  {
		 *  	"msgId": {lvl:string, msg:string, meta:{}},
				 *"msgId": {lvl:string, msg:string, meta:{}}
		 *  }
		 * }
		* */
		switch(type){
			case "archive":
				this.socket.emit("archive", JSON.stringify({ projectKey, log }));
			break;
			case "live":
				this.socket.emit("live", JSON.stringify({ projectKey, log }));
			break;
		}
	}
}
