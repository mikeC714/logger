import EventEmitter from "node:events";	
import { Redis } from "ioredis";
import { Stream } from "../../../stream/stream.ts";
const stream = new Stream();


export class LogService{
	private logger;
	private batch_limit:number = 20;
	private redis:Redis = new Redis({

	});
	private log_limit:number = 8_000;

	private checkStreamLength = async(projectKey:string) =>{
		try{
			const info:any = await this.redis.xinfo("STREAM",projectKey);
			const len:number = info[info.indexOf("length") +1];
			const lastEntry:number = info[info.indexOf("last-entry") +1];
			const lastId:string = info[info.indexOf("last-generated-id") +1];

			if(len >= this.log_limit){
				await this.redis.xtrim(
					projectKey,
					"MINID",
					"~", 
					lastId,
					'LIMIT',
					"8000"
				)
			}
		}catch(err){
			throw err;
		}
	};	
	writeToStream = async(projectKey:string, batch:Array<object>) => {
		if(batch.length < this.batch_limit) return "Limit has not been reached.";// TEST.. DONT CRASH ON PRODUCTION JUST LOG TO LOGGER TO NOTFY ON ERROR HICCUP MAY BE OCCURING CAUSING A DATA LOSS
		try{
			await this.checkStreamLength(projectKey);
			const chunkArr = batch.map(async chunk => {
			const payload = typeof chunk === "object" ? JSON.stringify(chunk) : chunk;
				return await this.redis.xadd(
					projectKey,
					"MAXLEN","~", this.log_limit,
					"*",
					payload
				);	
			});
			return await Promise.all(chunkArr);
		}catch(err){
			throw err;
		}
	}	
	readFromStream = async(projectKey:string) => {
		let results:boolean = false;
		try{
			const info:any = await this.redis.xinfo("STREAM",projectKey);
			const len:number = info[info.indexOf("length") +1];
			const lastId:string = info[info.indexOf("last-generated-id") +1];

			if(len >= this.log_limit){
				const data = await this.redis.xrange(
					projectKey,
					"-",
					lastId,
					"COUNT",
					8000
				)
				results = await stream.saveToDisk(projectKey, data);
			};
			return results;
		}catch(err){
			throw err;
		}
	}
}
