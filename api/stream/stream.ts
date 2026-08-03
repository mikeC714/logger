import { Redis } from "ioredis";
import { AppError } from "../api/errors/app.err.ts";
import { Ws } from "./ws.ts";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import zlib from "node:zlib"; 
import path from "node:path";


export class Stream{
	private redis:Redis = new Redis({});	

	createGroup = async(projectKey:string):Promise<boolean | string | unknown> => {
		try{
			const grp:unknown = await this.redis.xgroup(
				"CREATE",
				projectKey,
			    `${projectKey}-grp`,
				"$",
				"MKSTREAM"
			)
			return grp === "OK" ? true : false;
		}catch(err:any){
			if(!err.message.includes("BUSYGROUP")) throw err;
		}
	}

	readMessages = async(projectKey:string, consumer:string):Promise<[string, string[]] | unknown> => {
		try{
			const results = await this.redis.xreadgroup(
				"GROUP", `${projectKey}-grp`, consumer,
				"COUNT", 20,
				"BLOCK", 8000,
				"STREAMS", projectKey, ">"

			)
			return results;
		}catch(err){
			throw err;
		}
	}

	processMsg = async(projectKey:string, consumer:string) => {
		let msgData:any = {};
		try{
			while(true){
				const msgs:any = await this.readMessages(projectKey, consumer);
				if(!msgs) continue;

				for(const [_, data] of msgs){
					for(const [msgId, fields] of data){
						for(let i = 0; i < fields.length; i += 2){
							msgData[fields[i]] = fields[i+1];

							// WRITE TO WEBSOCKET
							// :ARCHIVE
							// :MAIN
			
							await this.redis.xack(projectKey, consumer, msgId);
						}	
					}
				}
				
			}
		}catch(err:any){
			throw new AppError("Stream Failure", err.statusCode);
		}	
	}

	// saveToDisk = async(projectKey:string, data:Array<[string, string[]]>):Promise<boolean> => {
	// 	const data = await this.redis.xrange(
	// 		projectKey,
	// 		"-",
	// 		lastId,
	// 		"COUNT",
	// 		8000
	// 	)
	// 	return true; 
	// }
}
