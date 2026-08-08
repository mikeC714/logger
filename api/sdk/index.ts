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
	timeStamp:null
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

export class Logger{
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

	private init = async() => {
		await this.stream.createGroup(this.config.projectKey);	
	};

	public log = async(lvl:string, msg:string, meta:object = metaBody) => {
		this.batch.push({ lvl, msg, meta });
		try{
			if(this.batch.length >= this.batch_limit) await this.flush();	
		}catch{}
		finally{
			if(this.batch.length !== this.batch_limit && this.batch.length !== 0){
				await this.flush();	
			}
			return;
		}
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
				body: JSON.stringify([this.config.projectKey, this.batch])
			})	
		}catch{ }
	};
}
