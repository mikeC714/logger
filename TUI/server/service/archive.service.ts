import { io } from "socket.io-client";
import { Database } from "bun:sqlite";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { ReadableStream } from "node:stream/web";
import { createWriteStream } from "node:fs";
import tar from "tar-stream";

 const META_BODY = {
	userId:"",
	username:"",
	role:"",
	enviroment:"",
	version:"",
	errorCode:"",
	errorStatus:0,
	timeStamp: Date
}as const;

type MSG_DATA = Record<string, {
	lvl:string;
	msg:string;
	meta:typeof META_BODY;
}>;
	
interface SOCKET_DATA{
	projectKey:string;
	log:MSG_DATA
};


export class ArchiveService {
	private dir = __dirname;
	socket:typeof io;
	db:Database;
	constructor(socket:any, db:any){
		this.socket = socket;
		this.db = db;
	}
	
	/*
	 * {
	 *   "projectKey",
	 *   {
	 *      "msgId": {lvl:string, msg:string, meta:{}},
	 *      "msgId": {lvl:string, msg:string, meta:{}}
	 *   }
	 * }
	 *
	* */
   
   //ITERATE OVER 100_000 ENTRIES
   iter = async function*(msgData:SOCKET_DATA):any{
	   let batch = [];
	   let batchLimit = 1_000;
		for(const chunk of Object.entries(msgData)){
			batch.push(Buffer.from(JSON.stringify(chunk) + "\n"));
			if(batch.length >= batchLimit){
				yield batch;	
				batch = [];
			};
		};
		if(batch.length > 0) yield batch;
	};

	processMsg = async(msgData:SOCKET_DATA):Promise<any>=>{
		try{
			const target = path.join(this.dir, `${msgData.projectKey}.gz`);

			// iterate over to obtain the chunks
			const iter = await this.iter(msgData);
			const source = new ReadableStream({
				pull: async(controller) => {
					const { value, done } = await iter.next();
					if(done){
						controller.close();
						return;
					}
					controller.enqueue(value);
				}
			});
		
		const compressed = source.pipeThrough(new CompressionStream("gzip"));
		
		await Bun.write(target, new Response(compressed));
		}catch(err){
			throw err;
		}
	};
}
