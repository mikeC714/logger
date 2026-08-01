import EventEmitter from "node:events";	
import { Redis } from "ioredis";
import { createWriteStream } from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { mkdir } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";	
import { AppError } from "../../errors/app.err.ts";
import type { LOG } from "../../types/log.d.ts"


type REFACTOR = {
	id:string;
	name:string;
	msg:string;
};

export class STREAM{
	private MAX_LENGTH:number = 5_000;
	private serverRedis:Redis;
	constructor(serverRedis:Redis){
		this.serverRedis = serverRedis;
	}

		
	//create new stream
	//@param logId{string}
	//@param username{string}
	//this function will create a new redis stream 
	public async init(username:string, logName:string){
		try{
			await this.serverRedis.xadd(
				`LOG:user:${username}:${logName}`,
				"*", 
				"log_name", logName, 
				"action", "INIT"
			);
		}catch(err){
			throw err;
		}	
	}

	private refactorData = async(data:[string, any[]]):Promise<{val:REFACTOR[], lastId:string}> => {
		let val:Array<REFACTOR | any> = [];
		let lastId:string = "";

			for(const [key, value] of data){
				if(!Array.isArray(val)) throw new AppError("Data refactoring needs an array.", 400);

				for(let i = 0; i < value.length; i += 2){
					if(val[i] !== undefined){
						val.push({ id:key, name:value[i], msg:value[i+1] });				
						lastId = val[val.length - 1].id;
					}
				}
			};
		return {
			val,
			lastId
		};
	}

	//CHECK_MAX_LENGTH
	//reads the length of the stream's batch using it's id
	//if length is === 0 stream is pushed null stopping the stream
	//else the reasults are iterated and pushed to the read stream
	private CHECK_MAX_LENGTH = async(username:string, logName:string):Promise< null | string | {startId:string, maxed:boolean}> => {
		let startId:string = "";
		let maxed:boolean = false;
		let results:[string, string[]] | null | any;

		try{
			const LOG_LENGTH = await this.serverRedis.xlen(`LOG:user:${username}:${logName}`)

			if(LOG_LENGTH >= this.MAX_LENGTH){
				results = await this.serverRedis.xrange(
					`LOG:user:${username}:${logName}`,
					"-",
					"+",
					"COUNT",
					this.MAX_LENGTH
				);
				if(!results){
					return null;	
				}
				
				const refactored = await this.refactorData(results);
				await this.serverRedis.xtrim(`LOG:user:${username}:${logName}`, 'MINID', refactored.lastId);

				return await this.saveToDisk(refactored.val, logName)
			}
			return{ 
				startId,
				maxed
			}; 
		}catch(err){
			throw err;
		}	
	}
	 private async *iterate(data:[string, string[]] | any): AsyncGenerator<string>{
		for(const log of data){
			yield JSON.stringify(log) + '\n';
		}
	} 

	private saveToDisk = async(data:[string, string[]] | any, logName:string):Promise<any> => {
		if(data === null) throw new AppError("Save to disk will not accept null data.", 400);
		if(!Array.isArray(data)) throw new AppError("Save to disk requires the data to be an array", 400);

		const date = new Date(Date.now()).toLocaleString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric'
		});
		try{
			const __dirname = import.meta.dirname;
			const dir:any = await mkdir(path.join(__dirname, logName), { recursive:true })
			if(dir === undefined) throw new AppError("Save to disk failed. Failed to create dir.", 400); 

			const read = Readable.from(this.iterate(data));
			const write = createWriteStream(path.join(dir, `${date}.txt.gz`), { encoding: "utf-8" });
			const gzip = zlib.createGzip();

			await pipeline(read, gzip, write);
			return `${logName} has reached it's limit, and was successfully saved to disk.` 
		}catch(err){
			throw err;
		}
	} 

	public async write(data:LOG, username:string){
		try{
			await this.CHECK_MAX_LENGTH(username, data.logName);
			await this.serverRedis.xadd(
				`LOG:user:${username}:${data.logName}`,
				"*",
				"log_name",data.logName,
				"action","LOG"
			);
		}catch(err){
			throw err;
		}	
	 }
}

const CONNECTION = {
	connected: "connected",
	disconnected: "disconnected",
} as const

export class LoggerService extends EventEmitter{
	private stream:Map<string, STREAM> = new Map();
	private clientRedis:Redis;
	logName:string;
	logId:string;
	username:string;
	private connectionStatus:string = CONNECTION.disconnected;

	constructor({ username, logId, logName }:LOG, clientRedis:Redis){
		super();
		this.logId = logId;
		this.logName = logName
		this.username = username;
		this.clientRedis = clientRedis;
		this.registerEvents();
	}


	private registerEvents(){
		this.on("error", (err) => {
			throw new Error(err);
		});
		this.on("connect", () => "CONNECTED");
		this.on("status", (e:string) => e);
	}


	public async status(){
		if(this.connectionStatus !== CONNECTION.connected) this.emit("error", "Currently disconnected. Please connect before checking status.");
		const ping = await this.clientRedis.ping();
		const status = this.clientRedis.status;
		if(ping === "PONG" && status === "ready" && this.connectionStatus === CONNECTION.connected){
			this.emit("status", this.connectionStatus || CONNECTION.connected);
			return "Look Good!"
		};
		this.emit("status", this.connectionStatus || CONNECTION.disconnected);
		return "Uh-oh something went wrong";
	}

	public async connect(){
		const ping = await this.clientRedis.ping();
		const status = this.clientRedis.status;

		if(ping === "PONG" && status === "ready"){
			this.emit("connect");
			return "Okie Dokie";
		};
		return "Failed to connect"
	}

	public async createLog():Promise<void>{
		if(!this.logId) this.emit("ID wasn't provided failed to make request.");
		if(!this.logName) this.emit("ID wasn't provided failed to make request.");

		try{
			const stream = new STREAM();
			this.stream.set(this.logId, stream);
			await stream.init(this.username, this.logName);		
		}catch(err:any){
			this.emit(err);
			throw err;
		}
	}

	public async log(data:LOG):Promise<string>{
		try{
			const res = this.stream.has(this.logId);
			if(!res) await this.createLog();	

			const stream:any = this.stream.get(this.logId)
			await stream.write(data)
			return `Successfully logged message for ${this.logId}` 
		}catch(err:any){
			this.emit(err);
			throw err 
		}			
	};
	// async log(body:)
}














