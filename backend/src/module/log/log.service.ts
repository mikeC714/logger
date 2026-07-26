import { EventEmitter } from "node:stream";
import { AppError } from "../../errors/app.err.ts";
import { LogError } from "../../errors/log.err.ts";
import fs from "node:fs";
import zlib from "node:zlib";
import { pipeline } from "node:stream/promises";
import crypto from "node:crypto";

enum STATUS{
	"public",
	"private"
}
interface LOG {
	id:string;
	logName: string;
	status: STATUS;
	// log:Buffer[];	
}

class STREAM extends EventEmitter{
	private redis:any;
	private write:any = fs.createWriteStream();
	private read:any = new ReadableStream;
	private MAX_LENGTH:number = 5_000;
	constructor(){
		super();
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
				"action", "write"
			);
			await this.listen(username, logName);
		}catch(err){
			throw err;
		}	
	}

	//CHECK_MAX_LENGTH
	//reads the length of the stream's batch using it's id
	//if length is === 0 stream is pushed null stopping the stream
	//else the reasults are iterated and pushed to the read stream

	private CHECK_MAX_LENGTH = async(username:string, logName:string):Promise<{maxed:boolean, startId:string}> => {
		let lastId:any;  
		let maxed:boolean = false;
		let startId:any;
		const gzip = zlib.createGzip();
		try{
			const LOG_LENGTH = await this.redis.xlen(`LOG:user:${username}:${logName}`)
			if(LOG_LENGTH.length >= this.MAX_LENGTH){
				const results = await this.redis.xrange(
					`LOG:user:${username}:${logName}`,
					"-",
					"+",
					"COUNT",
					this.MAX_LENGTH
				);
				if(!results || results.length === 0){
					this.read.push(null);	
				}

				for(const [id, fields] of results){
					this.read.push({ id, fields });
					lastId = id;
				}

				await pipeline(this.read, gzip, this.write);

				startId = `${lastId}-0`;
				maxed = true;
			} 
			return{
				maxed,
				startId
			}
		}catch(err){
			throw err;
		}	
	}

	//listen for any incoming events
	//once an event comes in write to stream using the given username and logname
	 private listen = async(username:string, logName:string) => {
		 const res = await this.CHECK_MAX_LENGTH(username, logName);
		 if(res.maxed === true) logName = `${logName}+1`;
		 this.on("event", async(data) => {
			 await this.redis.xadd(
				`LOG:user:${username}`,
				"*",
				"log_name",logName,
				"timestamp", Date.now(),
				"message", data.message,
				"service", data.service
			 ) 
		 })
	 }
	
}

const stream = new STREAM();

export class LoggerService{
	private db:any;
	private redis:any;

	constructor(){
		this.init();
	}

	private async init(){
	}

	private async connect(logName:string, logId:string){
		return async function gen_tui(){
			//TODO
				//GEN TUI WITH LOGS FOUND USING log_id WITH log_name PROBABLY GOING TO USE REDIS TO STORE LOGS NOT TOO SURE

		}
	}

	private async organize(err:any):Promise<Array<Error>>{
		let list:any = [];
		const categories = ["4","3","5","2"];
		const errStatus = String(err?.status_code);
		categories.forEach((num) =>{ 
			if(errStatus[0] == num) list.push(err); 
		})
		return list;
	}

	public async createLog(logDetails:LOG, userId:string):Promise<LOG>{
		const { id, logName, status } = logDetails; 
		if(!id) throw new AppError("ID wasn't provided failed to make request.", 400);
		if(!logName || !status) throw new AppError("Failed to provide all needed feilds. Please choose a LOG NAME, and the status of the log.",400);
		try{
			await stream.process();		
		}catch(err){
			throw err;
		}
		return logDetails;
	}

	async logErr(err:any, logId:string):Promise<void>{
		try{
			await this.db.query(
				`INSERT INTO logs(error)
					VALUES($1)
					WHERE log_id = $2
				`,[err, logId]
			);	
		}catch(error:any){
			throw {
				status: error.status || error.statusCode,
				message: error.message,
				trace: error.stack   
			}; 
		}			
	};
	// async log(body:)
}














