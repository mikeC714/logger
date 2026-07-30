import { AppError } from "../../errors/app.err.ts";
import { LogError } from "../../errors/log.err.ts";
import EventEmitter from "node:events";	
import { createWriteStream } from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";	
import type { LOG } from "../../types/log.d.ts"
import crypto from "node:crypto";




export class STREAM{
	private MAX_LENGTH:number = 5_000;
	private redis:any;
	constructor(redis:any){
		this.redis = redis
	}

		
	//create new stream
	//@param logId{string}
	//@param username{string}
	//this function will create a new redis stream 
	public async init(username:string, logName:string){
		try{
			await this.redis.xadd(
				`LOG:user:${username}:${logName}`,
				"*", 
				"log_name", logName, 
				"action", "INIT"
			);
		}catch(err){
			throw err;
		}	
	}

	//CHECK_MAX_LENGTH
	//reads the length of the stream's batch using it's id
	//if length is === 0 stream is pushed null stopping the stream
	//else the reasults are iterated and pushed to the read stream
	private CHECK_MAX_LENGTH = async(username:string, logName:string):Promise< null | {startId:string, maxed:boolean} | string> => {
		let lastId:string = ""; 
		let startId:string = "";
		let maxed:boolean = false;
		let results:[string, string[]] | null;
		try{
			const LOG_LENGTH = await this.redis.xlen(`LOG:user:${username}:${logName}`)
			if(LOG_LENGTH >= this.MAX_LENGTH){
				results = await this.redis.xrange(
					`LOG:user:${username}:${logName}`,
					"-",
					"+",
					"COUNT",
					this.MAX_LENGTH
				);
				if(!results){
					return null;	
				}
				startId = lastId;
				await this.redis.xtrim(`LOG:user:${username}:${logName}`, 'MINID', lastId);

				return await this.saveToDisk(results, logName)
			}
			return{ 
				startId,
				maxed
			}; 
		}catch(err){
			throw err;
		}	
	}
	 private async *iterate(data:[string, string[]]): AsyncGenerator<string>{
		for(const log of data){
			yield JSON.stringify(log) + '\n';
		}
	} 

	private saveToDisk = async(data:[string, string[]], logName:string):Promise<any> => {
		const date = new Date(Date.now()).toLocaleString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric'
		});
		const __dirname = import.meta.dirname;
		const target = path.join(__dirname, logName, `${date}.txt`)
		const read = Readable.from(this.iterate(data));
		const write = createWriteStream(target, { encoding: "utf-8" })
		const gzip = zlib.createGzip();
		try{
			await pipeline(read, gzip, write);
		}catch(err){
			throw err;
		}
	} 


	 async write(data:LOG,username:string){
		try{
			await this.CHECK_MAX_LENGTH(username, data.logName);
			await this.redis.xadd(
				`LOG:user:${username}:${data.logName}`,
				"*",
				"log_name",data.logName,
				"action","LOG"
			)
		}catch(err){
			throw err;
		}	
	 }
}

export class LoggerService extends EventEmitter{
	private stream:Map<string, STREAM> = new Map();
	private redis:any;
	logName:string;
	logId:string;
	username:string;

	constructor({ username, logId, logName }:LOG, redis:any){
		super();
		this.logId = logId;
		this.logName = logName
		this.username = username;
		this.redis = redis;
		this.registerEvents();
	}


	private async registerEvents(){
		this.on("error", () => {});
		this.on("connect", async() => {
			//connect to redis
			//check redis health
			//then return connected
			return "connected";
		});
	}

	public async createLog():Promise<void>{
		if(!this.logId) this.emit("ID wasn't provided failed to make request.");
		if(!this.logName) this.emit("ID wasn't provided failed to make request.");

		if(!this.logId) throw new AppError("ID wasn't provided failed to make request.", 400);
		if(!this.logName) throw new AppError("Failed to provide all needed feilds. Please choose a LOG NAME, and the status of the log.",400);

		try{
			const stream = new STREAM(this.redis);
			this.stream.set(this.logId, stream);
			await stream.init(this.username, this.logName);		
		}catch(err:any){
			this.emit(err);
			throw err;
		}
	}

	public async log(data:{}, logId:string):Promise<void>{
		try{
			const stream:any = this.stream.get(logId)
			await stream.write(data)
		}catch(err:any){
			this.emit(err);
			throw err 
		}			
	};
	// async log(body:)
}














