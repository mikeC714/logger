import { Redis } from "ioredis";
import { AppError } from "../api/errors/app.err.ts";

type VALUES = Record<string, { }>;
type MSG_DATA = Record<string, { }>;

export class Stream{
	private batch_limit:number = 20;
	private log_limit:number = 100_000;
	socketMethods?:any = null;
	socket?:any;
	redis?:Redis | any;
	archive?:any;
	constructor(redis?:Redis, socket?:any, socketMethods?:any, archive?:any){
		this.redis = redis;
		this.socket = socket;
		this.socketMethods = socketMethods;
		this.archive = archive
	}

	public createGroup = async(projectKey:string):Promise<boolean | string | unknown> => {
		try{
			const grp:unknown = await this.redis.xgroup(
				"CREATE",
				projectKey,
				`${projectKey}-grp`,
				"$",
				"MKSTREAM"
			);
			return grp; 
		}catch(err:any){
			if(!err.message.includes("BUSYGROUP")) throw err;
			throw err;
		}
	};

	public writeToStream = async(projectKey:string, batch:Array<object>) => {
		if(batch.length < this.batch_limit) return "Limit has not been reached.";// TEST.. DONT CRASH ON PRODUCTION JUST LOG TO LOGGER TO NOTFY ON ERROR HICCUP MAY BE OCCURING CAUSING A DATA LOSS
		try{
			await this.archive.checkStreamLength(projectKey);

			// chunk = {lvl:string, msg:string, meta:{}} 
			const chunkArr = batch.map(async chunk => {
			const payload = typeof chunk === "object" ? JSON.stringify(chunk) : chunk;
				return await this.redis.xadd(
					projectKey,
					"MAXLEN","~", this.log_limit,
					"*",
					"data", payload
				);	
			});
			return await Promise.all(chunkArr);
		}catch(err){
			throw err;
		}
	};	

	public processMsg = async(projectKey:string):Promise<any> => {
		let values:VALUES = {};
		let msgData:MSG_DATA = {};
		try{
			const msgs = await this.redis.xreadgroup(
				"GROUP", `${projectKey}-grp`, `${projectKey}-rd`,
				"COUNT", 20,
				"BLOCK", 8000,
				"STREAMS", projectKey, ">"
			).catch((err:any) => {
				throw new AppError(`Process Msg failure. ERROR:${err}`, err.statusCode || 500); 
			}); 

			while(true){
				if(!msgs) break;
				for(const [_, data] of msgs){
					for(const [msgId, fields] of data){
						for(let i = 0; i < fields.length; i += 2){
							values[fields[i]] = fields[i+1];
							await this.redis.xack(projectKey, `${projectKey}-rd`, msgId);
						}	
						/*
						 *{
						 * "msgId": {lvl:string, msg:string, meta:{}},
						 * "msgId": {lvl:string, msg:string, meta:{}}
						 *}
						* */
						msgData[msgId] = values; 
						return await this.socketMethods.writeToSocket(projectKey, msgData, "live"); 
					};
				};
			};
		}catch(err:any){
			throw err;
		};	
	};
}
