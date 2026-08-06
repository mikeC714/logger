import { io } from "socket.io-client";
import { Database } from "bun:sqlite";
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

   iter = async function*(msgData:SOCKET_DATA):any{
		for(const chunk of Object.entries(msgData.log)){
			yield chunk + "\n"
		}
   };

	processMsg = async(msgData:SOCKET_DATA):Promise<any>=>{
		try{
			const pack = tar.pack();
			const file = pack.entry({ name: msgData.projectKey}, (err:any) => {
				if(err) throw err;
				pack.finalize();
			});
			
			for await(const chunk of this.iter(msgData)){
				file.write(chunk);
			};
			file.end();
			pack.finalize;

			

			// create dir this dir will be the main point of entry for all archives
			// each file will start with the timestamp and contain meta data that point them to their desired logs
			// iterate over object using Object.entries(msgData)
			// push each chunk into the writeStream 
			// create pipeline 
			// save to disk
		}catch(err){
			throw err;
		}
	};
}
