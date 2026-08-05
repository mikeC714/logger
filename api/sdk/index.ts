import { Stream } from "../stream/stream.ts";

interface LOGGER{
	[index:string]: (meta:object, msg:string) => Promise<any>;
}
type NOTI = {
	send:boolean;
	recipient:string;
	logType:object | string;
}
 const metaBody = {
	userId:"",
	username:"",
	role:"",
	enviroment:"",
	version:"",
	errorCode:"",
	errorStatus:0,
	timeStamp:""
};

let LEVELS:any = ["info","warn","error","fatal","debug",];

const CONFIG = {
	projectKey:"",
	notifications:{
		send:false,
		logTypes:{
			...LEVELS
		} = "all",
	}
}

export class CreateLogger{
	private server:string = process.env.SERVER as string;
	private batch_limit:number = 20;
	private stream:Stream = new Stream();
	private batch:object[] = []; 
	config:any

	constructor(config:any){
		this.config = {
			...config,
			...CONFIG,
			notifications:{
				...CONFIG.notifications,
				...config.notifications
			}
		}
		this.init();
	}

	public log = async(lvl:string, msg:string, meta:object = metaBody) => {
		this.batch.push({ lvl, msg, meta });
		if(this.batch.length >= this.batch_limit) this.flush();	
	};

	private init = async() => {
		await this.stream.createGroup(this.config.projectKey);	
	};

	private notify = async(lvl:string, msg:string, meta:object = metaBody) => {
		if(this.config.notitifications.send === true && this.config.notitifications.recipient !== "" || this.config.notitifications.recipient !== null){
			try{
			// use notifcations library 
			}catch(err){
				//logger err to alerts
			}
		}
	};
	private flush = async() => {
		if(this.batch.length < this.batch_limit) return;
		try{
			await fetch(this.server,{
				method:"POST",
				headers:{
					"Content-Type": "application/json"
				},
				body: JSON.stringify(this.batch)
			})	
		}catch{ }
	};
}
//
// export async function createLogger(
// 	projectKey:string,
// 	server:string = process.env.SERVER as string,
// 	notitifications:NOTI = {
// 		send:false,
// 		logType:{
// 			...LEVELS
// 		} = "all",
// 		recipient:""
// 	},
// 	batch_limit:number = 20
// ){
// 	let batch:Array<object> = [];
// 	if(projectKey === "" || projectKey === undefined) throw new Error(`Project key is needed in order to proceed with logging. Read documentation if help is needed ${process.env.DOCUMENTATION}.`);
//
// 	await stream.createGroup(projectKey);
//
// 	async function notify(lvl:string, msg:string, meta:object = metaBody){
// 		if(notitifications.send === true && notitifications.recipient !== "" || notitifications.recipient !== null){
// 			try{
// 			// use notifcations library 
// 			}catch(err){
// 				//logger err to alerts
// 			}
// 		}
// 	}
//
// 	async function log(lvl:string, msg:string, meta:object = metaBody){
// 		batch.push({lvl, msg, meta});	
// 		if(batch.length >= batch_limit) flush();
// 	}
//
// 	 async function flush(){
// 		if(batch.length < batch_limit || batch.length === 0) return;
// 		try{
// 			await fetch(server, {
// 				method: "POST",
// 				headers:{
// 					"Content-Type": "application/json"
// 				},
// 				body: JSON.stringify(batch)
// 			})
// 			batch = [];
// 		}catch{}
// 	}
//
// 	const logger:LOGGER = {};
// 	for(const lvl of LEVELS){
// 		logger[lvl] = (meta:object, msg:string) => log(lvl, msg, meta); 
// 	}
//
// 	return logger;
// }

