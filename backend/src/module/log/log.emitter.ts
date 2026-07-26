import EventEmitter from "node:events";

export class LOG_EMIT extends EventEmitter{
	private redis:any;
	private app:any;
	constructor(){
		super();
	}	

	public async log(data:{}){
		if(typeof data !== "object") throw new Error("Method log expects an OBJECT. Please provide an object.");
		return this.emit("data", data);
	};
	public async close(){
		return this.emit("close", async() => {
			await this.redis.close();	
			await this.app.close();
		})
	} 
	public async connect(status:boolean | string = false){
		//TODO
		//HANDLE CONNECTION LOGIC
		if(status === false){
			status = "Failed to connect."
		}
		return this.emit("connection", status);
	};	

}
