import { io } from "socket.io-client";

type JSON<T> = string & { readonly __brand:T };

 const META_BODY = {
	userId:"",
	username:"",
	role:"",
	enviroment:"",
	version:"",
	errorCode:"",
	errorStatus:0,
	timeStamp:""
} as const;

const LEVELS = {
	info:"info",
	warn:"warn",
	error:"error",
	fatal:"fatal",
	debug:"debug"
} as const;

type MSG_DATA = Record<string, {
	type:typeof LEVELS;
	msg:string;
	meta:typeof META_BODY;
}>;


export class Stream{
	socket:typeof io | null = null;
	constructor(socket:typeof io){
		this.socket = socket;
	}
	
	public parseMsg = async(msgData:JSON<MSG_DATA>) => {
		try{
			const data = await JSON.parse(msgData);
			for(const [key, vals] of Object.entries(data)){
				if(vals.type === "archive"){
					await this.processArchiveMsgs(vals);
				};	
				await this.processMsgs(data);
			};
		}catch(err){
			throw err;
		}	
	};
	
	private processMsgs = async(msgs:MSG_DATA) => {
		let data;  
		
		//iterate over msgs
		for await(const [key, vals] of Object.entries(msgs)){
		//push data		
		}
	};

	private processArchiveMsgs = async(msgs:MSG_DATA) => {

	};
}
